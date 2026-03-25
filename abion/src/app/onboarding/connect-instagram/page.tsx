"use client";

import { useState } from "react";
import Link from "next/link";

export default function ConnectInstagramPage() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/onboarding/connect-instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save token");
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-extrabold text-[#0A1F44]">Abion</Link>
          <p className="mt-2 text-slate-500 text-sm">Last step — connect your Instagram</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {["Create account", "Business profile", "Connect Instagram"].map((step, i) => (
            <div key={step} className="flex-1 flex flex-col items-center gap-1">
              <div className="h-1.5 w-full rounded-full bg-[#0A1F44]" />
              <span className={`text-xs ${i === 2 ? "text-[#0A1F44] font-semibold" : "text-slate-400"}`}>{step}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {success ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-xl font-bold text-[#0A1F44]">You&apos;re all set!</h2>
              <p className="mt-2 text-slate-600 text-sm">Abion is now connected. Taking you to your dashboard...</p>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-[#0A1F44] mb-2">Connect Instagram</h1>
              <p className="text-sm text-slate-500 mb-6">
                Paste your Instagram Page Access Token below. Abion needs this to send replies to your customers.
              </p>

              {/* How to get token */}
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 mb-6">
                <p className="text-sm font-semibold text-[#0A1F44] mb-2">📋 How to get your token</p>
                <ol className="text-sm text-slate-700 space-y-1 list-decimal list-inside">
                  <li>Go to <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">developers.facebook.com</a></li>
                  <li>Create or open your app → Add Instagram product</li>
                  <li>Go to Instagram &rarr; Basic Display &rarr; Generate Token</li>
                  <li>Copy and paste the token here</li>
                </ol>
                <a
                  href="/docs/instagram-setup.md"
                  className="mt-3 inline-block text-xs text-blue-600 underline"
                >
                  Read the full setup guide →
                </a>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Instagram Page Access Token <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    rows={3}
                    placeholder="EAABwzLixnjYBO..."
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-mono outline-none focus:border-[#0A1F44] focus:ring-1 focus:ring-[#0A1F44] resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || !token.trim()}
                  className="w-full rounded-full bg-[#0A1F44] py-3 text-sm font-bold text-white transition hover:bg-blue-900 disabled:opacity-60"
                >
                  {loading ? "Connecting..." : "Connect & go to dashboard →"}
                </button>

                <button
                  type="button"
                  onClick={() => window.location.href = "/dashboard"}
                  className="w-full rounded-full border border-slate-300 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Skip for now
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
