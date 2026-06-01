import { useState, useEffect, useRef } from "react";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap";

function useFont() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_HREF}"]`)) return;
    const el = document.createElement("link");
    el.rel = "stylesheet";
    el.href = FONT_HREF;
    document.head.appendChild(el);
  }, []);
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── Data ──────────────────────────────────────────────────────────────── */
const STATS = [
  { icon: "ti-shield-check",   value: "100%",    label: "Trusted services",   iconBg: "#EEEDFE", iconColor: "#534AB7" },
  { icon: "ti-currency-rupee", value: "Best",    label: "Affordable prices",  iconBg: "#FBEAF0", iconColor: "#993556" },
  { icon: "ti-clock",          value: "On-Time", label: "Service delivery",   iconBg: "#E6F1FB", iconColor: "#185FA5" },
  { icon: "ti-headset",        value: "24/7",    label: "Available support",  iconBg: "#E1F5EE", iconColor: "#0F6E56" },
];

const REASONS = [
  {
    icon: "ti-phone-call",
    iconBg: "#EEEDFE", iconColor: "#534AB7", barColor: "#534AB7",
    title: "One Call, All Solutions",
    sub: "50+ services, one number",
    desc: "Home, office, events, and construction — every service you need, available with a single call on 7360050505.",
  },
  {
    icon: "ti-users",
    iconBg: "#FBEAF0", iconColor: "#993556", barColor: "#993556",
    title: "Skilled & Experienced Team",
    sub: "Trained professionals",
    desc: "Every service is handled by trained, experienced professionals who deliver the right result, every time.",
  },
  {
    icon: "ti-receipt",
    iconBg: "#E6F1FB", iconColor: "#185FA5", barColor: "#185FA5",
    title: "Affordable Prices",
    sub: "No hidden charges",
    desc: "Premium-quality services at the market's most competitive rates. What you see is what you pay — no surprises.",
  },
  {
    icon: "ti-mood-smile",
    iconBg: "#E1F5EE", iconColor: "#0F6E56", barColor: "#0F6E56",
    title: "100% Satisfaction Guarantee",
    sub: "Your happiness first",
    desc: "We don't stop until you're completely satisfied. Your happiness is our highest priority, every single time.",
  },
  {
    icon: "ti-building",
    iconBg: "#FAEEDA", iconColor: "#854F0B", barColor: "#854F0B",
    title: "All Services Under One Roof",
    sub: "From repairs to events",
    desc: "Electrician, plumber, catering, photography, tuition, property — everything on a single platform.",
  },
  {
    icon: "ti-map-pin",
    iconBg: "#FAECE7", iconColor: "#993C1D", barColor: "#993C1D",
    title: "Serving Patna & All Bihar",
    sub: "Always nearby, always ready",
    desc: "Starting from Patna, our network covers every district of Bihar — close to you, whenever you need us.",
  },
];

const TRUST_PILLS = [
  { icon: "ti-shield-check", label: "Trusted service" },
  { icon: "ti-currency-rupee", label: "Affordable rates" },
  { icon: "ti-clock", label: "On-time delivery" },
  { icon: "ti-users", label: "Expert team" },
  { icon: "ti-mood-smile", label: "100% satisfaction" },
  { icon: "ti-headset", label: "24×7 support" },
];

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function StatCard({ stat, visible, delay }) {
  return (
    <div
      className="bg-gray-50 rounded-xl p-5 text-center transition-all duration-500 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 text-lg"
        style={{ background: stat.iconBg, color: stat.iconColor }}
      >
        <i className={`ti ${stat.icon}`} aria-hidden="true" />
      </div>
      <div
        className="text-2xl font-extrabold leading-none mb-1"
        style={{ fontFamily: "'Syne', sans-serif", color: stat.iconColor }}
      >
        {stat.value}
      </div>
      <div className="text-xs text-gray-400">{stat.label}</div>
    </div>
  );
}

function ReasonCard({ r, visible, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative bg-white border border-gray-100 rounded-xl p-6 overflow-hidden cursor-default
        transition-all duration-500 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`,
        borderColor: hovered ? "rgba(0,0,0,0.12)" : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Animated top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] transition-transform duration-300 origin-left"
        style={{
          background: r.barColor,
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
        }}
      />
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center text-lg mb-4 transition-transform duration-300"
        style={{
          background: r.iconBg,
          color: r.iconColor,
          transform: hovered ? "translateY(-3px) scale(1.06)" : "none",
        }}
      >
        <i className={`ti ${r.icon}`} aria-hidden="true" />
      </div>
      <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1">{r.title}</h3>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-3">{r.sub}</p>
      <p className="text-sm text-gray-500 leading-relaxed">{r.desc}</p>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function WhyChooseUs() {
  useFont();
  const [ref, visible] = useInView(0.12);

  return (
    <>
      <style>{`
        .wcu-section { font-family: 'DM Sans', sans-serif; }
        .font-syne    { font-family: 'Syne', sans-serif; }
      `}</style>

      <section ref={ref} className="wcu-section w-full bg-white py-16 sm:py-20 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">

          {/* ── Header ── */}
          <div className="mb-11">
            <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 mb-5">
              <i className="ti ti-star text-[#534AB7]" style={{ fontSize: 14 }} aria-hidden="true" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                Why choose us
              </span>
            </div>
            <h2
              className="font-syne font-extrabold text-gray-900 leading-[1.1] mb-3"
              style={{ fontSize: "clamp(26px, 4.5vw, 42px)" }}
            >
              Why Choose <span className="text-[#534AB7]">Arus Lumina?</span>
            </h2>
            <p className="text-gray-500 text-[15px] leading-relaxed max-w-lg">
              One call handles it all — home, office, events, and construction.
              Trusted, affordable, and always on time.{" "}
              <strong className="text-[#534AB7] font-semibold">Your need, our solution.</strong>
            </p>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-11">
            {STATS.map((s, i) => (
              <StatCard key={s.label} stat={s} visible={visible} delay={50 + i * 100} />
            ))}
          </div>

          {/* ── Reasons grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {REASONS.map((r, i) => (
              <ReasonCard key={r.title} r={r} visible={visible} delay={80 + i * 110} />
            ))}
          </div>

          {/* ── CTA strip ── */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl px-7 py-8 flex flex-wrap
            items-center justify-between gap-5 mb-7">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#534AB7] mb-2 flex items-center gap-1.5">
                <i className="ti ti-phone" style={{ fontSize: 13 }} aria-hidden="true" />
                Book now — instant response
              </p>
              <h3 className="font-syne font-extrabold text-gray-900 text-xl mb-1">
                Call now. Get served today.
              </h3>
              <p className="text-sm text-gray-400">
                Aapki Zarurat, Hamara Solution — easy answers for every need
              </p>
            </div>
            <a
              href="tel:7360050505"
              className="inline-flex items-center gap-3 bg-[#534AB7] text-[#EEEDFE] font-semibold
                text-[15px] px-7 py-3.5 rounded-full no-underline transition-all duration-200
                hover:bg-[#3C3489] hover:-translate-y-0.5 whitespace-nowrap"
            >
              <i className="ti ti-phone" style={{ fontSize: 18 }} aria-hidden="true" />
              <span style={{ fontWeight: 700, letterSpacing: ".02em" }}>7360050505</span>
            </a>
          </div>

          {/* ── Trust pills ── */}
          <div className="flex flex-wrap gap-2">
            {TRUST_PILLS.map((p) => (
              <div
                key={p.label}
                className="inline-flex items-center gap-2 border border-gray-100 rounded-full
                  px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50
                  transition-border duration-200 hover:border-gray-300"
              >
                <i className={`ti ${p.icon} text-[#534AB7]`} style={{ fontSize: 14 }} aria-hidden="true" />
                {p.label}
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}