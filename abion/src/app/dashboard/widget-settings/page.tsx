"use client";

import { useState } from "react";
import Link from "next/link";

export default function WidgetSettingsPage() {
  const [config, setConfig] = useState({
    businessName: "My Business",
    greeting: "Hi! 👋 How can I help you today?",
    color: "#0A1F44",
  });
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://your-domain.com";

  const embedCode = `<!-- Abion AI Widget -->
<script>
  window.AbionConfig = {
    businessName: "${config.businessName}",
    greeting: "${config.greeting}",
    color: "${config.color}"
  };
</script>
<script src="${origin}/widget.js" async></script>`;

  function handleCopy() {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-800">← Dashboard</Link>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-semibold text-slate-800">Widget Settings</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-extrabold text-[#0A1F44] mb-2">Chat Widget</h1>
        <p className="text-slate-500 mb-8 text-sm">Customize your widget and embed it on any website.</p>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Config panel */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-800 mb-5">Customize</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Business name</label>
                <input
                  type="text"
                  value={config.businessName}
                  onChange={e => setConfig(p => ({ ...p, businessName: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#0A1F44] focus:ring-1 focus:ring-[#0A1F44]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Greeting message</label>
                <input
                  type="text"
                  value={config.greeting}
                  onChange={e => setConfig(p => ({ ...p, greeting: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#0A1F44] focus:ring-1 focus:ring-[#0A1F44]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Brand color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={config.color}
                    onChange={e => setConfig(p => ({ ...p, color: e.target.value }))}
                    className="h-10 w-16 cursor-pointer rounded-lg border border-slate-300 p-1"
                  />
                  <input
                    type="text"
                    value={config.color}
                    onChange={e => setConfig(p => ({ ...p, color: e.target.value }))}
                    className="w-32 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-mono outline-none focus:border-[#0A1F44]"
                  />
                </div>
              </div>
            </div>

            {/* Preview bubble */}
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Preview</p>
              <div className="relative h-32 rounded-xl bg-slate-100 border border-slate-200">
                <div
                  className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full shadow-lg"
                  style={{ backgroundColor: config.color }}
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
                    <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Embed code panel */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-800 mb-2">Embed code</h2>
            <p className="text-sm text-slate-500 mb-4">Paste this before the closing <code className="bg-slate-100 px-1 rounded">&lt;/body&gt;</code> tag on your website.</p>

            <pre className="rounded-xl bg-slate-900 p-4 text-xs text-green-300 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
              {embedCode}
            </pre>

            <button
              onClick={handleCopy}
              className="mt-4 w-full rounded-full bg-[#0A1F44] py-3 text-sm font-bold text-white transition hover:bg-blue-900"
            >
              {copied ? "✅ Copied!" : "Copy embed code"}
            </button>

            <div className="mt-6 rounded-xl bg-blue-50 border border-blue-100 p-4">
              <p className="text-sm font-semibold text-[#0A1F44] mb-1">🧪 Test it first</p>
              <p className="text-sm text-slate-600 mb-3">See the widget in action on a demo page before embedding.</p>
              <Link
                href="/widget-demo"
                target="_blank"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
              >
                Open demo page →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
