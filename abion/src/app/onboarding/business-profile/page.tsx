"use client";

import { useState } from "react";
import Link from "next/link";

export default function BusinessProfilePage() {
  const [form, setForm] = useState({
    businessName: "",
    businessType: "",
    services: "",
    pricing: "",
    tone: "friendly",
    extraInfo: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/onboarding/business-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save profile");
      }

      window.location.href = "/onboarding/connect-instagram";
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
          <p className="mt-2 text-slate-500 text-sm">Tell us about your business so we can train your AI</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {["Create account", "Business profile", "Connect Instagram"].map((step, i) => (
            <div key={step} className="flex-1 flex flex-col items-center gap-1">
              <div className={`h-1.5 w-full rounded-full ${i <= 1 ? "bg-[#0A1F44]" : "bg-slate-200"}`} />
              <span className={`text-xs ${i === 1 ? "text-[#0A1F44] font-semibold" : i < 1 ? "text-slate-400" : "text-slate-400"}`}>{step}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-xl font-bold text-[#0A1F44] mb-2">Your business profile</h1>
          <p className="text-sm text-slate-500 mb-6">
            This is how Abion learns to sound like you. The more detail, the better your AI replies.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="businessName"
                required
                value={form.businessName}
                onChange={handleChange}
                placeholder="e.g. Glow Studio Lagos"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#0A1F44] focus:ring-1 focus:ring-[#0A1F44]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business type <span className="text-red-500">*</span></label>
              <select
                name="businessType"
                required
                value={form.businessType}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#0A1F44] focus:ring-1 focus:ring-[#0A1F44] bg-white"
              >
                <option value="">Select your industry</option>
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Services you offer <span className="text-red-500">*</span></label>
              <textarea
                name="services"
                required
                value={form.services}
                onChange={handleChange}
                rows={3}
                placeholder="e.g. Hair braiding, wigs, lashes, makeup for events"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#0A1F44] focus:ring-1 focus:ring-[#0A1F44] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pricing (optional)</label>
              <textarea
                name="pricing"
                value={form.pricing}
                onChange={handleChange}
                rows={2}
                placeholder="e.g. Braids from ₦15,000, Makeup from ₦25,000"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#0A1F44] focus:ring-1 focus:ring-[#0A1F44] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">AI reply tone</label>
              <select
                name="tone"
                value={form.tone}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#0A1F44] focus:ring-1 focus:ring-[#0A1F44] bg-white"
              >
                <option value="friendly">Friendly & Warm</option>
                <option value="professional">Professional & Formal</option>
                <option value="casual">Casual & Fun</option>
                <option value="luxury">Luxury & Exclusive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Anything else to tell your AI? (optional)</label>
              <textarea
                name="extraInfo"
                value={form.extraInfo}
                onChange={handleChange}
                rows={2}
                placeholder="e.g. We're based in Victoria Island, Lagos. Bookings only by appointment."
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#0A1F44] focus:ring-1 focus:ring-[#0A1F44] resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#0A1F44] py-3 text-sm font-bold text-white transition hover:bg-blue-900 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save & continue →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
