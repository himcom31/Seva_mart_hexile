import { useState, useEffect, useRef } from "react";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=Inter:wght@400;500;600;700&display=swap";

function useFont() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_HREF}"]`)) return;
    const el = document.createElement("link");
    el.rel = "stylesheet";
    el.href = FONT_HREF;
    document.head.appendChild(el);
  }, []);
}

function useInView(threshold = 0.12) {
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
  { icon: "ti-shield-check",   value: "100%",    label: "Trusted services",   iconBg: "#EEEDFE", iconColor: "#534AB7", valueBg: "#534AB7" },
  { icon: "ti-currency-rupee", value: "Best",    label: "Affordable prices",  iconBg: "#FBEAF0", iconColor: "#993556", valueBg: "#993556" },
  { icon: "ti-clock",          value: "On-Time", label: "Service delivery",   iconBg: "#E6F1FB", iconColor: "#185FA5", valueBg: "#185FA5" },
  { icon: "ti-headset",        value: "24/7",    label: "Available support",  iconBg: "#E1F5EE", iconColor: "#0F6E56", valueBg: "#0F6E56" },
];

const REASONS = [
  {
    icon: "ti-phone-call",
    iconBg: "#EEEDFE", iconColor: "#534AB7", barColor: "#534AB7", accentBg: "#f5f4ff",
    title: "One Call, All Solutions",
    sub: "50+ services, one number",
    desc: "Home, office, events, and construction — every service you need, available with a single call on 7360050505.",
  },
  {
    icon: "ti-users",
    iconBg: "#FBEAF0", iconColor: "#993556", barColor: "#993556", accentBg: "#fdf5f8",
    title: "Skilled & Experienced Team",
    sub: "Trained professionals",
    desc: "Every service is handled by trained, experienced professionals who deliver the right result, every time.",
  },
  {
    icon: "ti-receipt",
    iconBg: "#E6F1FB", iconColor: "#185FA5", barColor: "#185FA5", accentBg: "#f0f6fd",
    title: "Affordable Prices",
    sub: "No hidden charges",
    desc: "Premium-quality services at the most competitive rates. What you see is what you pay — no surprises.",
  },
  {
    icon: "ti-mood-smile",
    iconBg: "#E1F5EE", iconColor: "#0F6E56", barColor: "#0F6E56", accentBg: "#f0faf6",
    title: "100% Satisfaction Guarantee",
    sub: "Your happiness first",
    desc: "We don't stop until you're completely satisfied. Your happiness is our highest priority, every single time.",
  },
  {
    icon: "ti-building",
    iconBg: "#FAEEDA", iconColor: "#854F0B", barColor: "#854F0B", accentBg: "#fdf7ee",
    title: "All Services Under One Roof",
    sub: "From repairs to events",
    desc: "Electrician, plumber, catering, photography, tuition, property — everything on a single platform.",
  },
  {
    icon: "ti-map-pin",
    iconBg: "#FAECE7", iconColor: "#993C1D", barColor: "#993C1D", accentBg: "#fdf3ef",
    title: "Serving Patna & All Bihar",
    sub: "Always nearby, always ready",
    desc: "Starting from Patna, our network covers every district of Bihar — close to you, whenever you need us.",
  },
];

const TRUST_PILLS = [
  { icon: "ti-shield-check", label: "Trusted service",    color: "#534AB7", bg: "#EEEDFE" },
  { icon: "ti-currency-rupee", label: "Affordable rates", color: "#993556", bg: "#FBEAF0" },
  { icon: "ti-clock", label: "On-time delivery",          color: "#185FA5", bg: "#E6F1FB" },
  { icon: "ti-users", label: "Expert team",               color: "#0F6E56", bg: "#E1F5EE" },
  { icon: "ti-mood-smile", label: "100% satisfaction",    color: "#854F0B", bg: "#FAEEDA" },
  { icon: "ti-headset", label: "24×7 support",            color: "#993C1D", bg: "#FAECE7" },
];

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function StatCard({ stat, visible, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 text-center transition-all duration-500 ease-out border border-gray-100"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(22px) scale(0.97)",
        transitionDelay: `${delay}ms`,
        background: hovered ? stat.iconBg : "#fafafa",
        boxShadow: hovered ? `0 8px 32px -8px ${stat.iconColor}30` : "none",
        transition: "all 0.4s cubic-bezier(.22,.68,0,1.2)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Decorative circle bg */}
      <div
        className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full opacity-10 transition-all duration-300"
        style={{ background: stat.iconColor, transform: hovered ? "scale(1.5)" : "scale(1)" }}
      />
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl transition-transform duration-300"
        style={{
          background: stat.iconBg,
          color: stat.iconColor,
          transform: hovered ? "translateY(-4px) scale(1.1) rotate(-4deg)" : "none",
        }}
      >
        <i className={`ti ${stat.icon}`} aria-hidden="true" />
      </div>
      <div
        className="text-2xl font-extrabold leading-none mb-1.5 transition-colors duration-300"
        style={{ fontFamily: "'Archivo Black', 'Playfair Display', Georgia, serif", color: hovered ? stat.iconColor : "#1a1a1a" }}
      >
        {stat.value}
      </div>
      <div className="text-xs font-medium text-gray-400 tracking-wide">{stat.label}</div>
    </div>
  );
}

function ReasonCard({ r, visible, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative bg-white border rounded-2xl p-6 overflow-hidden cursor-default transition-all duration-500 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${delay}ms`,
        borderColor: hovered ? r.barColor + "50" : "#f0f0f0",
        background: hovered ? r.accentBg : "#ffffff",
        boxShadow: hovered ? `0 12px 40px -12px ${r.barColor}28` : "0 1px 4px 0 rgba(0,0,0,0.04)",
        transition: "all 0.35s cubic-bezier(.22,.68,0,1.2)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Animated top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] origin-left transition-transform duration-350"
        style={{ background: `linear-gradient(90deg, ${r.barColor}, ${r.barColor}80)`, transform: hovered ? "scaleX(1)" : "scaleX(0)", transitionDuration: "350ms" }}
      />
      {/* Floating decorative dot */}
      <div
        className="absolute top-5 right-5 w-2 h-2 rounded-full transition-all duration-300"
        style={{ background: r.barColor, opacity: hovered ? 0.5 : 0.15, transform: hovered ? "scale(1.6)" : "scale(1)" }}
      />
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5 transition-all duration-300"
        style={{
          background: r.iconBg,
          color: r.iconColor,
          transform: hovered ? "translateY(-4px) scale(1.08) rotate(-5deg)" : "none",
          boxShadow: hovered ? `0 6px 18px -4px ${r.iconColor}40` : "none",
        }}
      >
        <i className={`ti ${r.icon}`} aria-hidden="true" />
      </div>
      <h3
        className="font-bold text-gray-900 text-base leading-snug mb-1"
        style={{ fontFamily: "'Archivo Black', 'Playfair Display', Georgia, serif" }}
      >
        {r.title}
      </h3>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: r.barColor, opacity: 0.75 }}>{r.sub}</p>
      <p className="text-sm text-gray-500 leading-relaxed">{r.desc}</p>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function WhyChooseUs() {
  useFont();
  const [ref, visible] = useInView(0.1);

  return (
    <>
      <style>{`
        .wcu-section { font-family: 'Inter', system-ui, sans-serif; }
        .font-archivo-black { font-family: 'Archivo Black', 'Playfair Display', Georgia, serif; }
        .font-playfair { font-family: 'Playfair Display', Georgia, serif; }
        .wcu-pill-btn:hover { background: #EEEDFE !important; border-color: #534AB7 !important; color: #534AB7 !important; }
        .wcu-pill-btn:hover i { color: #534AB7 !important; }
      `}</style>

      <section ref={ref} className="wcu-section w-full bg-white py-16 sm:py-8 px-4 sm:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto">

          {/* ── Header ── */}
          <div
            className="mb-14 transition-all duration-700 ease-out"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)" }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border border-purple-100 bg-purple-50">
              <i className="ti ti-sparkles text-[#534AB7]" style={{ fontSize: 14 }} aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#534AB7]">
                Why choose us
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h2
                  className="font-extrabold text-gray-900 leading-[1.1] mb-4"
                  style={{ fontFamily: "'Archivo Black', 'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4.5vw, 46px)" }}
                >
                  Why Choose{" "}
                  <span
                    style={{ color: "#534AB7", fontFamily: "'Archivo Black', 'Playfair Display', Georgia, serif" }}
                  >
                    Arus Lumina?
                  </span>
                </h2>
                <p className="text-gray-500 text-[15px] leading-relaxed max-w-lg">
                  One call handles it all — home, office, events, and construction.
                  Trusted, affordable, and always on time.{" "}
                  <strong className="font-semibold" style={{ color: "#534AB7" }}>Your need, our solution.</strong>
                </p>
              </div>
              {/* Decorative pill counter */}
              <div className="flex-shrink-0 hidden sm:flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50">
                <span className="font-extrabold text-3xl leading-none" style={{ fontFamily: "'Archivo Black', Georgia, serif", color: "#534AB7" }}>50+</span>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mt-1">Services</span>
              </div>
            </div>

            {/* Divider line */}
            <div
              className="mt-8 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent transition-all duration-1000"
              style={{ opacity: visible ? 1 : 0, transitionDelay: "400ms" }}
            />
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-14">
            {STATS.map((s, i) => (
              <StatCard key={s.label} stat={s} visible={visible} delay={60 + i * 90} />
            ))}
          </div>

          {/* ── Section label ── */}
          <div
            className="flex items-center gap-3 mb-6 transition-all duration-500"
            style={{ opacity: visible ? 1 : 0, transitionDelay: "300ms" }}
          >
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">What sets us apart</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* ── Reasons grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
            {REASONS.map((r, i) => (
              <ReasonCard key={r.title} r={r} visible={visible} delay={80 + i * 100} />
            ))}
          </div>

          {/* ── CTA strip ── */}
          <div
            className="relative overflow-hidden rounded-3xl px-7 sm:px-10 py-9 flex flex-wrap items-center justify-between gap-6 mb-8 border border-purple-100 transition-all duration-700"
            style={{
              background: "linear-gradient(135deg, #f5f4ff 0%, #fdf5f8 50%, #edf6ff 100%)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transitionDelay: "500ms",
            }}
          >
            {/* Decorative blobs */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10" style={{ background: "#534AB7" }} />
            <div className="absolute -bottom-6 left-1/3 w-20 h-20 rounded-full opacity-8" style={{ background: "#993556" }} />

            <div className="relative z-10">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: "#534AB7" }}>
                <i className="ti ti-bolt" style={{ fontSize: 13 }} aria-hidden="true" />
                Instant response guaranteed
              </p>
              <h3
                className="font-extrabold text-gray-900 mb-1.5"
                style={{ fontFamily: "'Archivo Black', 'Playfair Display', Georgia, serif", fontSize: "clamp(18px, 3vw, 24px)" }}
              >
                Call now. Get served today.
              </h3>
              <p className="text-sm text-gray-500">
                Aapki Zarurat, Hamara Solution — easy answers for every need
              </p>
            </div>
            <a
              href="tel:7360050505"
              className="relative z-10 inline-flex items-center gap-3 text-white font-bold text-[15px] px-8 py-4 rounded-2xl no-underline transition-all duration-200 hover:-translate-y-1 flex-shrink-0"
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                background: "linear-gradient(135deg, #534AB7, #7a43c4)",
                boxShadow: "0 8px 24px -6px #534AB750",
                letterSpacing: ".01em",
              }}
            >
              <i className="ti ti-phone" style={{ fontSize: 20 }} aria-hidden="true" />
              <span>7360050505</span>
            </a>
          </div>

          {/* ── Trust pills ── */}
          <div
            className="flex flex-wrap gap-2 transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transitionDelay: "600ms" }}
          >
            {TRUST_PILLS.map((p) => (
              <div
                key={p.label}
                className="wcu-pill-btn inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 cursor-default select-none"
                style={{ transition: "all 0.2s ease" }}
              >
                <i className={`ti ${p.icon}`} style={{ fontSize: 14, color: p.color }} aria-hidden="true" />
                {p.label}
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}