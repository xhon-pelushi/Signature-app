"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, FileText, Download, PenTool, Type, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { createEmptyPdf } from "@/lib/createEmptyPdf";
import dynamic from "next/dynamic";
const ThumbnailsRail = dynamic(() => import("@/components/pdf/ThumbnailsRail"), { ssr: false });
import { useFields, FieldsByPage } from "@/hooks/useFields";
// types are used within hooks/components; explicit imports not needed here
import { DraggableField } from "@/components/signature/DraggableField";
import { exportWithFields } from "@/lib/exportWithFields";
import { useSignature } from "@/hooks/useSignature";
import { SignatureCanvas } from "@/components/signature/SignatureCanvas";

// Dynamically import PDFViewer to keep SSR clean
const PDFViewer = dynamic(() => import("@/components/pdf/PDFViewer"), { ssr: false });

export default function SignPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { fields, addField, updateField, removeField, setAll, undo, redo, canUndo, canRedo } = useFields();
  const [downloading, setDownloading] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const { signatureDataUrl, setFromDataUrl, clear: clearSignature } = useSignature();
  const [typedName, setTypedName] = useState("");
  const [typedFont, setTypedFont] = useState("cursive");
  const uploadSigInputRef = useRef<HTMLInputElement>(null);
  type Signer = { id: string; name: string; colorClass: string };
  const [signers, setSigners] = useState<Signer[]>([
    { id: "s1", name: "Signer 1", colorClass: "border-emerald-500" },
    { id: "s2", name: "Signer 2", colorClass: "border-amber-500" },
  ]);
  const [newSignerName, setNewSignerName] = useState("");
  const [newSignerColor, setNewSignerColor] = useState("border-sky-500");

  // Keyboard nudging for selected field
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selectedFieldId) return;
      const list = fields[currentPage] || [];
      const f = list.find((x) => x.id === selectedFieldId);
      if (!f) return;
      const step = e.shiftKey ? 0.01 : 0.0025; // fine vs coarse
      let dx = 0;
      let dy = 0;
      if (e.key === "ArrowLeft") dx = -step;
      else if (e.key === "ArrowRight") dx = step;
      else if (e.key === "ArrowUp") dy = -step;
      else if (e.key === "ArrowDown") dy = step;
      else if (e.key === "Escape") { setSelectedFieldId(null); return; }
      else return;
      e.preventDefault();
      const nx = Math.min(1 - f.w, Math.max(0, f.x + dx));
      const ny = Math.min(1 - f.h, Math.max(0, f.y + dy));
      updateField(currentPage, f.id, { ...f, x: Math.round(nx * 1000) / 1000, y: Math.round(ny * 1000) / 1000 });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedFieldId, currentPage, fields, updateField]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
    }
  };

  const handleUseSample = async () => {
    const blob = await createEmptyPdf();
    const sampleFile = new File([blob], "sample.pdf", { type: "application/pdf" });
    setUploadedFile(sampleFile);
  };

  // Create an object URL for react-pdf
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!uploadedFile) {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
      return;
    }
    const url = URL.createObjectURL(uploadedFile);
    setPdfUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [uploadedFile]);

  // Persistence: load/save fields & signature per document name
  useEffect(() => {
    if (!uploadedFile) return;
    const key = `sigapp:${uploadedFile.name}`;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as { fields: FieldsByPage; signatureDataUrl?: string; signers?: Signer[] };
        if (parsed?.fields) setAll(parsed.fields);
        if (parsed?.signatureDataUrl) setFromDataUrl(parsed.signatureDataUrl);
        if (parsed?.signers?.length) setSigners(parsed.signers);
      }
    } catch {}
  }, [uploadedFile]);

  useEffect(() => {
    if (!uploadedFile) return;
    const key = `sigapp:${uploadedFile.name}`;
    try {
      const data = JSON.stringify({ fields, signatureDataUrl, signers });
      localStorage.setItem(key, data);
    } catch {}
  }, [uploadedFile, fields, signatureDataUrl, signers]);

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
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                Save Draft
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Send for Signature
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document Upload/Viewer */}
          <div className="lg:col-span-2">
            {!uploadedFile ? (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Upload PDF Document
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your PDF file here, or click to browse
                </p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Choose File
                </button>
                <button
                  type="button"
                  onClick={handleUseSample}
                  className="ml-3 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Use sample PDF
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">{uploadedFile.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Download className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800 text-sm"
                        onClick={() => setUploadedFile(null)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* PDF Viewer with thumbnails and overlay */}
                <div className="p-4">
                  <div className="flex gap-4">
                    {uploadedFile && (
                      <ThumbnailsRail
                        file={uploadedFile}
                        currentPage={currentPage}
                        onSelect={(p) => setCurrentPage(p)}
                      />
                    )}
                    <div className="flex-1">
                      {uploadedFile ? (
                        <PDFViewer
                          file={uploadedFile}
                          page={currentPage}
                          onPageChange={setCurrentPage}
                          overlay={({ width, height, page }) => {
                            const pageFields = fields[page] || [];
                            const selected = pageFields.find((f) => f.id === selectedFieldId);
                            const eps = 0.006;
                            const hLines: number[] = [];
                            const vLines: number[] = [];
                            const pushUniq = (arr: number[], v: number) => {
                              const rounded = Math.round(v * 1000) / 1000;
                              if (!arr.some((x) => Math.abs(x - rounded) < 0.001)) arr.push(rounded);
                            };
                            if (selected) {
                              const selX = [selected.x, selected.x + selected.w / 2, selected.x + selected.w];
                              const selY = [selected.y, selected.y + selected.h / 2, selected.y + selected.h];
                              // Compare with page bounds and center
                              [0, 0.5, 1].forEach((p) => {
                                if (selX.some((x) => Math.abs(x - p) < eps)) pushUniq(vLines, p * width);
                                if (selY.some((y) => Math.abs(y - p) < eps)) pushUniq(hLines, p * height);
                              });
                              // Compare with other fields
                              for (const ofield of pageFields) {
                                if (ofield.id === selected.id) continue;
                                const oX = [ofield.x, ofield.x + ofield.w / 2, ofield.x + ofield.w];
                                const oY = [ofield.y, ofield.y + ofield.h / 2, ofield.y + ofield.h];
                                for (const sx of selX) for (const ox of oX) if (Math.abs(sx - ox) < eps) pushUniq(vLines, ox * width);
                                for (const sy of selY) for (const oy of oY) if (Math.abs(sy - oy) < eps) pushUniq(hLines, oy * height);
                              }
                            }
                            return (
                              <>
                                {/* Alignment guides */}
                                {hLines.map((y) => (
                                  <div key={`h-${y}`} className="absolute left-0 right-0 h-px bg-pink-500/70 pointer-events-none" style={{ top: y }} />
                                ))}
                                {vLines.map((x) => (
                                  <div key={`v-${x}`} className="absolute top-0 bottom-0 w-px bg-pink-500/70 pointer-events-none" style={{ left: x }} />
                                ))}
                                {pageFields.map((f) => (
                                  <DraggableField
                                    key={f.id}
                                    field={f}
                                    pageWidth={width}
                                    pageHeight={height}
                                    onChange={(nf) => updateField(page, f.id, nf)}
                                    onDelete={(id) => removeField(page, id)}
                                    selected={selectedFieldId === f.id}
                                    onSelect={(id) => setSelectedFieldId(id)}
                                    color={signers.find((s) => s.id === f.signerId)?.colorClass}
                                  />
                                ))}
                              </>
                            );
                          }}
                        />
                      ) : (
                        <div className="h-[600px] bg-gray-100 flex items-center justify-center rounded-lg">
                          <div className="text-center">
                            <FileText className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg">Preparing viewer…</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Signature Tools */}
          <div className="space-y-6">
            {/* Signature Creation */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Signature</h3>
              
              {/* Signature Mode Tabs */}
              <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
                <button
                  className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    signatureMode === 'draw' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setSignatureMode('draw')}
                >
                  <PenTool className="h-4 w-4 mr-1" />
                  Draw
                </button>
                <button
                  className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    signatureMode === 'type' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setSignatureMode('type')}
                >
                  <Type className="h-4 w-4 mr-1" />
                  Type
                </button>
                <button
                  className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    signatureMode === 'upload' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setSignatureMode('upload')}
                >
                  <ImageIcon className="h-4 w-4 mr-1" />
                  Upload
                </button>
              </div>

              {/* Signature Canvas/Input */}
              <div className="border border-gray-300 rounded-lg bg-gray-50 p-3 mb-4">
                {signatureMode === 'draw' && (
                  <SignatureCanvas onChange={(dataUrl) => setFromDataUrl(dataUrl)} />
                )}
                {signatureMode === 'type' && (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Type your name"
                      value={typedName}
                      onChange={(e) => setTypedName(e.target.value)}
                      className="border border-gray-300 bg-white rounded px-3 py-2 flex-1"
                    />
                    <select
                      value={typedFont}
                      onChange={(e) => setTypedFont(e.target.value)}
                      className="border border-gray-300 bg-white rounded px-2 py-2"
                    >
                      <option value='"Dancing Script", cursive'>Cursive (Dancing Script)</option>
                      <option value="cursive">Cursive (system)</option>
                      <option value="serif">Serif</option>
                      <option value="sans-serif">Sans</option>
                    </select>
                  </div>
                )}
                {signatureMode === 'upload' && (
                  <div className="text-center">
                    <input
                      ref={uploadSigInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') setFromDataUrl(reader.result);
                        };
                        reader.readAsDataURL(f);
                      }}
                      className="block mx-auto"
                    />
                    <p className="text-gray-500 text-sm mt-2">Upload signature image</p>
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

              <div className="space-y-2">
                <button
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  onClick={() => {
                    if (signatureMode === 'type') {
                      // Render typed signature to a canvas and save as dataURL
                      const canvas = document.createElement('canvas');
                      const w = 600, h = 200;
                      canvas.width = w;
                      canvas.height = h;
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        ctx.fillStyle = '#fff';
                        ctx.fillRect(0, 0, w, h);
                        ctx.fillStyle = '#000';
                        const fontFamily = typedFont;
                        ctx.font = `64px ${fontFamily}`;
                        ctx.textBaseline = 'middle';
                        const metrics = ctx.measureText(typedName || 'Signature');
                        const x = (w - metrics.width) / 2;
                        const y = h / 2;
                        ctx.fillText(typedName || 'Signature', Math.max(10, x), y);
                        setFromDataUrl(canvas.toDataURL('image/png'));
                      }
                    }
                    // draw and upload modes already set dataUrl via onChange or file input
                  }}
                >
                  Save Signature
                </button>
                <button
                  className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                  onClick={() => {
                    clearSignature();
                    setTypedName("");
                  }}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Field Tools */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Fields</h3>
              <div className="space-y-2">
                <button
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center"
                  onClick={() => addField(currentPage, "signature")}
                  disabled={!uploadedFile}
                >
                  <PenTool className="h-4 w-4 text-blue-600 mr-3" />
                  Signature Field
                </button>
                <button
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center"
                  onClick={() => addField(currentPage, "text")}
                  disabled={!uploadedFile}
                >
                  <Type className="h-4 w-4 text-green-600 mr-3" />
                  Text Field
                </button>
                <button
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center"
                  onClick={() => addField(currentPage, "checkbox")}
                  disabled={!uploadedFile}
                >
                  <div className="h-4 w-4 border border-purple-600 rounded mr-3"></div>
                  Checkbox
                </button>
                <button
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center"
                  onClick={() => addField(currentPage, "date")}
                  disabled={!uploadedFile}
                >
                  <div className="h-4 w-4 bg-orange-600 rounded mr-3"></div>
                  Date Field
                </button>
              </div>
            </div>

            {/* Signers */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Signers</h3>
              <div className="space-y-2">
                {signers.map((s) => (
                  <div key={s.id} className="flex items-center justify-between border rounded px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-3 h-3 rounded-full ${s.colorClass.replace('border-', 'bg-')}`}></span>
                      <span>{s.name}</span>
                    </div>
                    <button
                      className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
                      disabled={!selectedFieldId}
                      onClick={() => {
                        if (!selectedFieldId) return;
                        const list = fields[currentPage] || [];
                        const fld = list.find((f) => f.id === selectedFieldId);
                        if (!fld) return;
                        updateField(currentPage, fld.id, { ...fld, signerId: s.id });
                      }}
                    >Assign selected</button>
                  </div>
                ))}
                <div className="mt-3">
                  <div className="text-sm text-gray-700 mb-1">Add signer</div>
                  <div className="flex items-center gap-2">
                    <input
                      value={newSignerName}
                      onChange={(e) => setNewSignerName(e.target.value)}
                      placeholder="Name"
                      className="border border-gray-300 rounded px-2 py-1 flex-1"
                    />
                    <select
                      value={newSignerColor}
                      onChange={(e) => setNewSignerColor(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="border-sky-500">Blue</option>
                      <option value="border-emerald-500">Green</option>
                      <option value="border-amber-500">Amber</option>
                      <option value="border-rose-500">Rose</option>
                      <option value="border-purple-500">Purple</option>
                    </select>
                    <button
                      className="px-3 py-1.5 rounded border disabled:opacity-50"
                      disabled={!newSignerName.trim()}
                      onClick={() => {
                        const id = `s${Date.now()}`;
                        setSigners((prev) => [...prev, { id, name: newSignerName.trim(), colorClass: newSignerColor }]);
                        setNewSignerName("");
                      }}
                    >Add</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Editing Tools */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Editing</h3>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 rounded border disabled:opacity-50"
                  onClick={undo}
                  disabled={!canUndo}
                >Undo</button>
                <button
                  className="px-3 py-1.5 rounded border disabled:opacity-50"
                  onClick={redo}
                  disabled={!canRedo}
                >Redo</button>
              </div>
            </div>

            {/* Document Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-2">
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                  Preview Document
                </button>
        <button
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={!uploadedFile || downloading}
                  onClick={async () => {
                    if (!uploadedFile) return;
                    try {
                      setDownloading(true);
                      const blob = await exportWithFields(uploadedFile, fields, { signatureDataUrl: signatureDataUrl ?? undefined });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${uploadedFile.name.replace(/\.pdf$/i, "")}__flattened.pdf`;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      URL.revokeObjectURL(url);
                    } finally {
                      setDownloading(false);
                    }
                  }}
                >
                  {downloading ? "Generating…" : "Download Flattened PDF"}
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
                  Save as Template
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
