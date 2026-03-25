import Script from "next/script";

export default function WidgetDemoPage() {
  return (
    <>
      {/* Simulate a real business website */}
      <div className="min-h-screen bg-white font-sans">

        {/* Fake business nav */}
        <nav className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <span className="text-lg font-bold text-slate-800">Glow Studio Lagos 💅</span>
            <div className="hidden gap-6 text-sm text-slate-600 sm:flex">
              <a href="#" className="hover:text-slate-900">Services</a>
              <a href="#" className="hover:text-slate-900">Gallery</a>
              <a href="#" className="hover:text-slate-900">Contact</a>
            </div>
          </div>
        </nav>

        {/* Fake hero */}
        <section className="bg-pink-50 px-6 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-pink-500">Victoria Island, Lagos</p>
          <h1 className="mt-3 text-4xl font-extrabold text-slate-900 sm:text-5xl">
            Look good. Feel amazing.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Premium hair braiding, wigs, lashes, and makeup. Book your appointment today.
          </p>
          <button className="mt-8 rounded-full bg-pink-500 px-8 py-3 text-sm font-bold text-white transition hover:bg-pink-600">
            Book Now
          </button>
        </section>

        {/* Services */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-slate-800">Our Services</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { name: "Hair Braiding", price: "From ₦15,000", emoji: "💆‍♀️" },
                { name: "Wig Installation", price: "From ₦25,000", emoji: "👸" },
                { name: "Makeup", price: "From ₦30,000", emoji: "💄" },
              ].map(s => (
                <div key={s.name} className="rounded-2xl border border-slate-200 p-6 text-center">
                  <div className="text-4xl">{s.emoji}</div>
                  <h3 className="mt-3 font-semibold text-slate-800">{s.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{s.price}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Abion watermark */}
        <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-2 pointer-events-none z-[99998]">
          <p className="text-xs text-slate-400">
            AI receptionist powered by{" "}
            <a href="/" className="text-[#0A1F44] font-semibold pointer-events-auto hover:underline" target="_blank" rel="noopener noreferrer">
              Abion
            </a>
          </p>
        </div>
      </div>

      {/* Abion widget — config injected via data attribute on a div */}
      <div
        id="abion-widget-root"
        data-business-name="Glow Studio Lagos"
        data-greeting="Hi! 👋 Welcome to Glow Studio. How can I help you today?"
        data-color="#ec4899"
      />
      <Script id="abion-widget" strategy="afterInteractive">{`
        (function() {
          var root = document.getElementById('abion-widget-root');
          window.AbionConfig = {
            businessName: root ? root.dataset.businessName : 'Abion AI',
            greeting: root ? root.dataset.greeting : 'Hi! How can I help?',
            color: root ? root.dataset.color : '#0A1F44',
          };
          var s = document.createElement('script');
          s.src = '/widget.js';
          s.async = true;
          document.body.appendChild(s);
        })();
      `}</Script>
    </>
  );
}
