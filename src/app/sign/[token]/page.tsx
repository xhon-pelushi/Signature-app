"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PenTool, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { SignatureCanvas } from "@/components/signature/SignatureCanvas";
import { useSignature } from "@/hooks/useSignature";

const PDFViewer = dynamic(() => import("@/components/pdf/PDFViewer"), { ssr: false });

type SignerLinkData = {
  id: string;
  signerEmail: string;
  signerName: string | null;
  signedAt: string | null;
  request: {
    title: string;
    status: string;
    requester: {
      name: string | null;
      email: string;
    };
    document: {
      name: string;
      filePath: string;
    };
  };
};

export default function SignWithTokenPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signerData, setSignerData] = useState<SignerLinkData | null>(null);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);

  const { signatureDataUrl, setFromDataUrl, clear: clearSignature } = useSignature();
  const [signatureMode, setSignatureMode] = useState<"draw" | "type" | "upload">("draw");
  const [typedName, setTypedName] = useState("");
  const [typedFont, setTypedFont] = useState("cursive");

  // Load signer data
  useEffect(() => {
    async function loadSignerData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/sign/${token}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("This signing link is invalid or has expired.");
          } else if (response.status === 410) {
            setError("This document has already been signed.");
          } else {
            setError("Failed to load document. Please try again.");
          }
          return;
        }

        const data = await response.json();
        setSignerData(data);

        if (data.signedAt) {
          setSigned(true);
        }
      } catch (err) {
        console.error("Error loading signer data:", err);
        setError("Failed to load document. Please check your connection.");
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadSignerData();
    }
  }, [token]);

  const handleSign = async () => {
    if (!signatureDataUrl) {
      alert("Please create your signature first");
      return;
    }

    if (!signerData) return;

    try {
      setSigning(true);

      const response = await fetch(`/api/sign/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signatureDataUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to sign document");
      }

      setSigned(true);
      alert("Document signed successfully!");
    } catch (err) {
      console.error("Error signing document:", err);
      alert("Failed to sign document. Please try again.");
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Document</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (signed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Document Signed!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for signing <strong>{signerData?.request.title}</strong>. All parties will
            be notified when the document is fully executed.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Done
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <PenTool className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SignatureApp</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Document Info Banner */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start">
            <FileText className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {signerData?.request.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Requested by{" "}
                <strong>
                  {signerData?.request.requester.name || signerData?.request.requester.email}
                </strong>
              </p>
              <p className="text-sm text-gray-600">
                Signing as: <strong>{signerData?.signerName || signerData?.signerEmail}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Preview</h3>
              {/* TODO: Display actual PDF - for now show placeholder */}
              <div className="bg-gray-100 rounded-lg h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Document: {signerData?.request.document.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    PDF viewer will display the document here
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Panel */}
          <div className="space-y-6">
            {/* Create Signature */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Your Signature</h3>

              {/* Signature Mode Tabs */}
              <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
                <button
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    signatureMode === "draw"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setSignatureMode("draw")}
                >
                  Draw
                </button>
                <button
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    signatureMode === "type"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setSignatureMode("type")}
                >
                  Type
                </button>
                <button
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    signatureMode === "upload"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setSignatureMode("upload")}
                >
                  Upload
                </button>
              </div>

              {/* Signature Input */}
              <div className="border border-gray-300 rounded-lg bg-gray-50 p-3 mb-4">
                {signatureMode === "draw" && (
                  <SignatureCanvas onChange={(dataUrl) => setFromDataUrl(dataUrl)} />
                )}
                {signatureMode === "type" && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Type your name"
                      value={typedName}
                      onChange={(e) => setTypedName(e.target.value)}
                      className="w-full border border-gray-300 bg-white rounded px-3 py-2"
                    />
                    <select
                      value={typedFont}
                      onChange={(e) => setTypedFont(e.target.value)}
                      className="w-full border border-gray-300 bg-white rounded px-3 py-2"
                    >
                      <option value='"Dancing Script", cursive'>Cursive (Dancing Script)</option>
                      <option value="cursive">Cursive (system)</option>
                      <option value="serif">Serif</option>
                      <option value="sans-serif">Sans</option>
                    </select>
                    <button
                      className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
                      onClick={() => {
                        const canvas = document.createElement("canvas");
                        const w = 600,
                          h = 200;
                        canvas.width = w;
                        canvas.height = h;
                        const ctx = canvas.getContext("2d");
                        if (ctx) {
                          ctx.fillStyle = "#fff";
                          ctx.fillRect(0, 0, w, h);
                          ctx.fillStyle = "#000";
                          ctx.font = `64px ${typedFont}`;
                          ctx.textBaseline = "middle";
                          const metrics = ctx.measureText(typedName || "Signature");
                          const x = (w - metrics.width) / 2;
                          const y = h / 2;
                          ctx.fillText(typedName || "Signature", Math.max(10, x), y);
                          setFromDataUrl(canvas.toDataURL("image/png"));
                        }
                      }}
                    >
                      Generate Signature
                    </button>
                  </div>
                )}
                {signatureMode === "upload" && (
                  <div className="text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === "string") setFromDataUrl(reader.result);
                        };
                        reader.readAsDataURL(f);
                      }}
                      className="block mx-auto text-sm"
                    />
                    <p className="text-gray-500 text-xs mt-2">Upload signature image</p>
                  </div>
                )}
                {signatureDataUrl && (
                  <div className="mt-3">
                    <div className="text-xs text-gray-600 mb-1">Preview:</div>
                    <div className="border rounded bg-white inline-block px-2 py-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={signatureDataUrl} alt="Signature preview" className="max-h-16" />
                    </div>
                  </div>
                )}
              </div>

              <button
                className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 mb-2"
                onClick={() => {
                  clearSignature();
                  setTypedName("");
                }}
              >
                Clear Signature
              </button>
            </div>

            {/* Sign Button */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to Sign?</h3>
              <p className="text-sm text-gray-600 mb-4">
                By clicking "Sign Document", you agree that your electronic signature is legally
                binding.
              </p>
              <button
                onClick={handleSign}
                disabled={!signatureDataUrl || signing}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center"
              >
                {signing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Signing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Sign Document
                  </>
                )}
              </button>
            </div>

            {/* Info */}
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
              <p className="font-semibold mb-2">Need help?</p>
              <p>
                If you have questions about this document, please contact{" "}
                {signerData?.request.requester.email}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


