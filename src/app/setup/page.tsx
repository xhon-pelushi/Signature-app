"use client";
import { useState } from "react";

export default function SetupPage() {
  const [orgName, setOrgName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOk(null);
    setErr(null);
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgName, fromEmail, smtpHost, smtpPort, smtpUser, smtpPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Setup failed");
      setOk("Setup complete. Redirecting…");
      setTimeout(() => (window.location.href = "/"), 800);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Setup failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  async function testSmtp() {
    if (!fromEmail || !smtpHost || !smtpPort) {
      setSmtpTestResult("Please fill in the required fields first");
      return;
    }

    setTestingSmtp(true);
    setSmtpTestResult(null);
    
    try {
      const res = await fetch("/api/test-smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testEmail: fromEmail }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setSmtpTestResult(`✅ ${data.message}`);
      } else {
        setSmtpTestResult(`❌ ${data.message}`);
      }
    } catch (e) {
      setSmtpTestResult(`❌ Test failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setTestingSmtp(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Setup</h1>
      <p className="text-gray-600 mb-6">Provide organization and SMTP settings to get started.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm text-gray-700">Organization Name</span>
          <input className="mt-1 w-full border rounded px-3 py-2" value={orgName} onChange={(e) => setOrgName(e.target.value)} required />
        </label>
        <label className="block">
          <span className="text-sm text-gray-700">From Email</span>
          <input className="mt-1 w-full border rounded px-3 py-2" type="email" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} required />
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-700">SMTP Host</span>
            <input className="mt-1 w-full border rounded px-3 py-2" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} required />
          </label>
          <label className="block">
            <span className="text-sm text-gray-700">SMTP Port</span>
            <input className="mt-1 w-full border rounded px-3 py-2" type="number" value={smtpPort} onChange={(e) => setSmtpPort(parseInt(e.target.value || "587", 10))} required />
          </label>
          <label className="block">
            <span className="text-sm text-gray-700">SMTP User</span>
            <input className="mt-1 w-full border rounded px-3 py-2" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm text-gray-700">SMTP Password</span>
            <input className="mt-1 w-full border rounded px-3 py-2" type="password" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} />
          </label>
        </div>
        
        {/* SMTP Test Section */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-3">Test SMTP Configuration</h3>
          <p className="text-sm text-gray-600 mb-3">
            Test your SMTP settings by sending a test email to verify everything is working.
          </p>
          <button
            type="button"
            onClick={testSmtp}
            disabled={testingSmtp || !fromEmail || !smtpHost || !smtpPort}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 mr-3"
          >
            {testingSmtp ? "Testing..." : "Test SMTP"}
          </button>
          {smtpTestResult && (
            <div className={`text-sm mt-2 ${smtpTestResult.startsWith('✅') ? 'text-green-700' : 'text-red-600'}`}>
              {smtpTestResult}
            </div>
          )}
        </div>

        {err && <div className="text-sm text-red-600">{err}</div>}
        {ok && <div className="text-sm text-green-700">{ok}</div>}
        <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
          {loading ? "Saving…" : "Complete Setup"}
        </button>
      </form>
    </div>
  );
}
