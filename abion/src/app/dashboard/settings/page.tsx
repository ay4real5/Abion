"use client";

import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [form, setForm] = useState({
    businessName: "",
    businessType: "",
    services: "",
    pricing: "",
    tone: "friendly",
    extraInfo: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/onboarding/business-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-800">← Dashboard</Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-semibold text-slate-800">Settings</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-extrabold text-[#0A1F44] mb-2">Business Profile</h1>
        <p className="text-slate-500 mb-8 text-sm">This is what your AI uses to reply to customers. Keep it updated.</p>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business name <span className="text-red-500">*</span></label>
              <input name="businessName" required value={form.businessName} onChange={handleChange}
                placeholder="e.g. Glow Studio Lagos"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#0A1F44] focus:ring-1 focus:ring-[#0A1F44]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business type <span className="text-red-500">*</span></label>
              <select name="businessType" required value={form.businessType} onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0A1F44]">
                <option value="">Select industry</option>
                <option value="beauty">Beauty & Salon</option>
                <option value="fashion">Fashion & Clothing</option>
                <option value="food">Food & Restaurant</option>
                <option value="fitness">Fitness & Wellness</option>
                <option value="photography">Photography</option>
                <option value="real_estate">Real Estate</option>
                <option value="ecommerce">E-commerce / Products</option>
                <option value="consulting">Consulting / Services</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Services <span className="text-red-500">*</span></label>
              <textarea name="services" required value={form.services} onChange={handleChange} rows={3}
                placeholder="e.g. Hair braiding, wigs, lashes, makeup"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#0A1F44] resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pricing (optional)</label>
              <textarea name="pricing" value={form.pricing} onChange={handleChange} rows={2}
                placeholder="e.g. Braids from ₦15,000, Makeup from ₦25,000"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#0A1F44] resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">AI tone</label>
              <select name="tone" value={form.tone} onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0A1F44]">
                <option value="friendly">Friendly & Warm</option>
                <option value="professional">Professional & Formal</option>
                <option value="casual">Casual & Fun</option>
                <option value="luxury">Luxury & Exclusive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Extra info (optional)</label>
              <textarea name="extraInfo" value={form.extraInfo} onChange={handleChange} rows={2}
                placeholder="e.g. Based in Victoria Island. By appointment only."
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#0A1F44] resize-none" />
            </div>

            {status === "success" && (
              <p className="rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">
                ✅ Profile saved! Your AI will use this for all future replies.
              </p>
            )}
            {status === "error" && (
              <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
                Something went wrong. Try again.
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full rounded-full bg-[#0A1F44] py-3 text-sm font-bold text-white transition hover:bg-blue-900 disabled:opacity-60">
              {loading ? "Saving..." : "Save profile"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
