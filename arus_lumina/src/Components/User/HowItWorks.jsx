import { useEffect, useRef, useState } from "react";

/* ─── Google Fonts injected once ─────────────────────────────────────────── */
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap";

function useFont() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_HREF}"]`)) return;
    const el = document.createElement("link");
    el.rel = "stylesheet";
    el.href = FONT_HREF;
    document.head.appendChild(el);
  }, []);
}

/* ─── Step data ───────────────────────────────────────────────────────────── */
const STEPS = [
  {
    id: "01",
    icon: "📞",
    label: "Step 01",
    title: "Call / Book Service",
    desc: "Dial 7360050505 or book online anytime — we're available 24×7, every day.",
    accent: "#534AB7",
    bg: "#EEEDFE",
    labelColor: "#534AB7",
  },
  {
    id: "02",
    icon: "✅",
    label: "Step 02",
    title: "Service Assigned",
    desc: "We instantly match your request with a verified, skilled professional near you.",
    accent: "#993556",
    bg: "#FBEAF0",
    labelColor: "#993556",
  },
  {
    id: "03",
    icon: "🚀",
    label: "Step 03",
    title: "Expert Visits",
    desc: "Your expert arrives on time with all tools and equipment needed for the job.",
    accent: "#854F0B",
    bg: "#FAEEDA",
    labelColor: "#854F0B",
  },
  {
    id: "04",
    icon: "🎉",
    label: "Step 04",
    title: "Work Completion",
    desc: "Job done to your satisfaction — rate the service and enjoy 100% quality guarantee.",
    accent: "#0F6E56",
    bg: "#E1F5EE",
    labelColor: "#0F6E56",
  },
];

const STATS = [
  { value: "50+",   label: "Services offered" },
  { value: "24/7",  label: "Always available" },
  { value: "100%",  label: "Satisfaction guarantee" },
  { value: "1 call",label: "All solutions" },
];

/* ─── StepCard ────────────────────────────────────────────────────────────── */
function StepCard({ step, index, visible }) {
  return (
    <div
      className={`flex flex-col sm:flex-row lg:flex-col items-center sm:items-start lg:items-center
        text-center sm:text-left lg:text-center gap-4 transition-all duration-500 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{ transitionDelay: `${index * 140}ms` }}
    >
      {/* Icon ring */}
      <div className="relative flex-shrink-0 group">
        <div className="w-[88px] h-[88px] rounded-full border border-gray-200 bg-gray-50
          flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1.5">
          <div
            className="w-[60px] h-[60px] rounded-full flex items-center justify-center text-2xl"
            style={{ background: step.bg }}
          >
            {step.icon}
          </div>
        </div>
        {/* Number badge */}
        <span
          className="absolute top-0.5 right-0.5 w-[22px] h-[22px] rounded-full text-[10px]
            font-bold flex items-center justify-center border-2 border-white"
          style={{ background: step.bg, color: step.accent }}
        >
          {step.id}
        </span>
      </div>

      {/* Text card */}
      <div
        className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-[18px] w-full
          transition-all duration-300 hover:border-gray-300 hover:-translate-y-0.5
          hover:shadow-sm cursor-default"
      >
        <p
          className="text-[10px] font-semibold uppercase tracking-widest mb-1.5"
          style={{ color: step.labelColor }}
        >
          {step.label}
        </p>
        <h3 className="font-syne font-bold text-[15px] text-gray-900 leading-snug mb-2">
          {step.title}
        </h3>
        <p className="text-[13px] text-gray-500 leading-relaxed">{step.desc}</p>
      </div>
    </div>
  );
}

/* ─── HowItWorks ──────────────────────────────────────────────────────────── */
export default function HowItWorks() {
  useFont();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-dm   { font-family: 'DM Sans', sans-serif; }
        /* gradient track line */
        .hiw-track::before {
          content: '';
          position: absolute;
          top: 44px;
          left: 12.5%;
          width: 75%;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg,#EEEDFE,#AFA9EC,#7F77DD,#534AB7);
        }
      `}</style>

      <section
        ref={ref}
        className="font-dm w-full bg-white py-16 sm:py-20 px-4 sm:px-8"
      >
        <div className="max-w-5xl mx-auto">

          {/* ── Header ── */}
          <div className="mb-12">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full
              px-4 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#7F77DD]" />
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                Simple 4-step process
              </span>
            </div>

            <h2 className="font-syne font-extrabold text-gray-900 text-[clamp(26px,4.5vw,42px)]
              leading-[1.1] mb-3">
              How it{" "}
              <span className="text-[#7F77DD]">Works</span>
            </h2>
            <p className="text-gray-500 text-[15px] leading-[1.7] max-w-md">
              From booking to completion — our process is fast, transparent, and built
              around your convenience.
            </p>
          </div>

          {/* ── Steps ── */}
          <div className="relative hiw-track mb-10">
            {/* desktop connector */}
            <div
              className="hidden lg:block absolute h-[2px] rounded-full top-11 z-0"
              style={{
                left: "12.5%",
                width: "75%",
                background:
                  "linear-gradient(90deg,#EEEDFE,#AFA9EC,#7F77DD,#534AB7)",
              }}
            />
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {STEPS.map((step, i) => (
                <StepCard key={step.id} step={step} index={i} visible={visible} />
              ))}
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center"
              >
                <div className="font-syne font-extrabold text-xl text-[#534AB7] leading-none mb-1">
                  {s.value}
                </div>
                <div className="text-[12px] text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── CTA ── */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:7360050505"
              className="inline-flex items-center gap-2 bg-[#534AB7] text-[#EEEDFE]
                font-semibold text-[14px] px-7 py-3 rounded-full
                transition-all duration-200 hover:bg-[#3C3489] hover:-translate-y-0.5
                no-underline"
            >
              📞 Book now
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 bg-transparent text-gray-500
                border border-gray-200 font-medium text-[14px] px-6 py-3 rounded-full
                transition-all duration-200 hover:border-gray-400 hover:text-gray-800
                no-underline"
            >
              🔍 All services
            </a>
            <div className="inline-flex items-center gap-2 text-[13px] text-gray-400
              px-4 py-2.5 border border-gray-100 rounded-full">
              📱 <strong className="text-gray-700 font-semibold">7360050505</strong>
              &mdash; one call, all solutions
            </div>
          </div>

        </div>
      </section>
    </>
  );
}