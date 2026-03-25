export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold text-[#0A1F44]">Abion</span>
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="hidden text-sm font-medium text-slate-600 hover:text-[#0A1F44] sm:block">
              How it works
            </a>
            <a href="#pricing" className="hidden text-sm font-medium text-slate-600 hover:text-[#0A1F44] sm:block">
              Pricing
            </a>
            <a
              href="/auth/signup"
              className="inline-flex h-9 items-center rounded-full bg-[#0A1F44] px-5 text-sm font-semibold text-white transition hover:bg-blue-900"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#0A1F44] px-6 py-20 text-center text-white sm:py-28">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-2xl" />

          <div className="relative mx-auto max-w-4xl">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium tracking-wide">
              🤖 AI Receptionist for Instagram
            </p>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-6xl lg:text-7xl">
              Your Instagram DMs,<br />
              <span className="text-blue-300">answered instantly.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100 sm:text-xl">
              Every unanswered DM is a lost customer. Abion replies for you — 24/7 — qualifies leads, follows up, and saves every conversation. You just close the deals.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="/auth/signup"
                className="inline-flex h-13 items-center justify-center rounded-full bg-white px-8 py-3 text-base font-bold text-[#0A1F44] transition hover:bg-blue-50 shadow-lg"
              >
                Start Free Trial →
              </a>
              <a
                href="#how-it-works"
                className="inline-flex h-13 items-center justify-center rounded-full border border-white/30 px-8 py-3 text-base font-medium text-white transition hover:bg-white/10"
              >
                See how it works
              </a>
            </div>

            <p className="mt-5 text-sm text-blue-200">No credit card required · Setup in 5 minutes</p>
          </div>
        </section>

        {/* Pain/Stats Bar */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
              <div>
                <p className="text-4xl font-extrabold text-[#0A1F44]">78%</p>
                <p className="mt-1 text-sm text-slate-600">of customers buy from whoever replies first</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-[#0A1F44]">&lt; 2s</p>
                <p className="mt-1 text-sm text-slate-600">average Abion response time, day or night</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-[#0A1F44]">24/7</p>
                <p className="mt-1 text-sm text-slate-600">coverage — weekends, holidays, 3am DMs</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">How it works</p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#0A1F44] sm:text-4xl">
                Set up once. Works forever.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-600">
                No complicated setup. Connect your Instagram, and Abion handles everything from there.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Connect Instagram",
                  desc: "Link your business Instagram account in minutes. No technical skills needed.",
                  icon: (
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  ),
                },
                {
                  step: "2",
                  title: "Train Your AI",
                  desc: "Tell Abion about your business, services, and prices. It learns your voice.",
                  icon: (
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a10 10 0 1 0 10 10" />
                      <path d="M12 6v6l4 2" />
                      <path d="M20 2v6h-6" />
                    </svg>
                  ),
                },
                {
                  step: "3",
                  title: "Watch Leads Flow In",
                  desc: "Abion replies, qualifies, and follows up. You get notified when it's time to close.",
                  icon: (
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                      <polyline points="16 7 22 7 22 13" />
                    </svg>
                  ),
                },
              ].map(({ step, title, desc, icon }) => (
                <div key={step} className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[#0A1F44]">
                      {icon}
                    </div>
                    <span className="text-4xl font-extrabold text-slate-100">{step}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-[#0A1F44]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-[#0A1F44] px-6 py-20 text-white">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">Features</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Everything you need to turn DMs into deals
              </h2>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Instant AI Replies",
                  desc: "Responds to every DM in under 2 seconds — before your competitor even sees the notification.",
                  emoji: "⚡",
                },
                {
                  title: "Lead Qualification",
                  desc: "Asks the right questions to figure out who's ready to buy, so you focus on hot leads only.",
                  emoji: "🎯",
                },
                {
                  title: "Smart Follow-ups",
                  desc: "Automatically follows up with people who went quiet. No lead slips through the cracks.",
                  emoji: "🔁",
                },
                {
                  title: "Full Conversation History",
                  desc: "Every chat saved to your dashboard. See the full picture before you hop into a conversation.",
                  emoji: "🗂️",
                },
                {
                  title: "Speaks Your Brand",
                  desc: "Trained on your business info — tone, services, pricing. Sounds like you, not a robot.",
                  emoji: "🎙️",
                },
                {
                  title: "Always On",
                  desc: "Weekends, holidays, middle of the night — Abion never sleeps, never calls in sick.",
                  emoji: "🌙",
                },
              ].map(({ title, desc, emoji }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur">
                  <p className="text-3xl">{emoji}</p>
                  <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-blue-200">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="px-6 py-20">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Pricing</p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#0A1F44] sm:text-4xl">
              One plan. No surprises.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-slate-600">
              Everything included. Cancel anytime.
            </p>

            <div className="mx-auto mt-12 max-w-md rounded-3xl border-2 border-[#0A1F44] bg-white p-10 shadow-xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Monthly Plan</p>
              <p className="mt-4 text-6xl font-extrabold text-[#0A1F44]">$50</p>
              <p className="text-slate-500">/month · cancel anytime</p>

              <ul className="mt-8 space-y-3 text-left text-sm">
                {[
                  "Unlimited Instagram DM replies",
                  "AI lead qualification",
                  "Automated follow-ups",
                  "Full conversation dashboard",
                  "Custom AI training for your business",
                  "24/7 uptime & monitoring",
                  "Email support",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-slate-700">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs font-bold">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="/auth/signup"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[#0A1F44] py-4 text-base font-bold text-white transition hover:bg-blue-900"
              >
                Start Free Trial →
              </a>
              <p className="mt-3 text-xs text-slate-400">No credit card required to start</p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-blue-600 px-6 py-20 text-center text-white">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Stop losing customers to slow replies.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
              Your competitors are already using AI. Get Abion running in 5 minutes and never miss a DM again.
            </p>
            <a
              href="/auth/signup"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-base font-bold text-blue-700 transition hover:bg-blue-50 shadow-lg"
            >
              Get Started Free →
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 text-center">
        <p className="text-sm text-slate-500">© 2026 Abion · AI Receptionist for Instagram</p>
      </footer>
    </div>
  );
}
