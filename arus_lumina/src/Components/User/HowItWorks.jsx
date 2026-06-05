import { useEffect, useRef, useState } from "react";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap";

function useFont() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_HREF}"]`)) return;
    const el = document.createElement("link");
    el.rel = "stylesheet";
    el.href = FONT_HREF;
    document.head.appendChild(el);
  }, []);
}

const STEPS = [
  {
    id: "01",
    emoji: "📞",
    label: "Step 01",
    title: "Call / Book Service",
    desc: "Dial 7360050505 or book online anytime — we're available 24×7, every day.",
    accent: "#AFA9EC",
    glow: "rgba(83,74,183,0.35)",
    ring: "rgba(83,74,183,0.25)",
    badge: "rgba(83,74,183,0.20)",
    dot: "#534AB7",
  },
  {
    id: "02",
    emoji: "✅",
    label: "Step 02",
    title: "Service Assigned",
    desc: "We instantly match your request with a verified, skilled professional near you.",
    accent: "#E8879E",
    glow: "rgba(153,53,86,0.35)",
    ring: "rgba(153,53,86,0.25)",
    badge: "rgba(153,53,86,0.20)",
    dot: "#993556",
  },
  {
    id: "03",
    emoji: "🚀",
    label: "Step 03",
    title: "Expert Visits",
    desc: "Your expert arrives on time with all tools and equipment needed for the job.",
    accent: "#F0B97A",
    glow: "rgba(133,79,11,0.35)",
    ring: "rgba(133,79,11,0.25)",
    badge: "rgba(133,79,11,0.20)",
    dot: "#854F0B",
  },
  {
    id: "04",
    emoji: "🎉",
    label: "Step 04",
    title: "Work Completion",
    desc: "Job done to your satisfaction — rate the service and enjoy 100% quality guarantee.",
    accent: "#6EDBB8",
    glow: "rgba(15,110,86,0.35)",
    ring: "rgba(15,110,86,0.25)",
    badge: "rgba(15,110,86,0.20)",
    dot: "#0F6E56",
  },
];

const STATS = [
  { value: "50+",    label: "Services offered",      icon: "🛠️" },
  { value: "24/7",   label: "Always available",       icon: "⏰" },
  { value: "100%",   label: "Satisfaction guarantee", icon: "⭐" },
  { value: "1 Call", label: "All solutions",          icon: "📲" },
];

function StepCard({ step, index, visible }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.96)",
        transition: `all 0.6s cubic-bezier(.22,.68,0,1.15)`,
        transitionDelay: `${index * 160}ms`,
        flex: "1 1 0",
        minWidth: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "relative",
          background: hovered
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.03)",
          border: `1px solid ${hovered ? step.ring : "rgba(255,255,255,0.07)"}`,
          borderRadius: 20,
          padding: "32px 20px 28px",
          textAlign: "center",
          cursor: "default",
          transition: "all 0.35s cubic-bezier(.22,.68,0,1.2)",
          boxShadow: hovered ? `0 20px 60px -15px ${step.glow}, 0 0 0 1px ${step.ring}` : "none",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          height: "100%",
        }}
      >
        {/* Top accent line */}
        <div style={{
          position: "absolute",
          top: 0, left: "20%", right: "20%",
          height: 2,
          borderRadius: 2,
          background: `linear-gradient(90deg, transparent, ${step.accent}, transparent)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }} />

        {/* Step badge */}
        <div style={{
          position: "absolute",
          top: 14, right: 14,
          padding: "3px 9px",
          borderRadius: 20,
          background: step.badge,
          border: `1px solid ${step.accent}40`,
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: 10,
          color: step.accent,
          letterSpacing: "0.08em",
        }}>
          {step.label}
        </div>

        {/* Icon */}
        <div style={{
          width: 80, height: 80,
          borderRadius: "50%",
          margin: "0 auto 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 34,
          background: hovered
            ? step.badge
            : "rgba(255,255,255,0.04)",
          border: `1.5px solid ${hovered ? step.accent + "60" : "rgba(255,255,255,0.08)"}`,
          transition: "all 0.35s ease",
          transform: hovered ? "scale(1.1) rotate(-4deg)" : "scale(1) rotate(0deg)",
          boxShadow: hovered ? `0 0 28px 0 ${step.glow}` : "none",
        }}>
          {step.emoji}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: 15,
          color: hovered ? step.accent : "rgba(255,255,255,0.88)",
          margin: "0 0 10px",
          lineHeight: 1.3,
          transition: "color 0.25s ease",
        }}>
          {step.title}
        </h3>

        {/* Desc */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          lineHeight: 1.75,
          color: "rgba(255,255,255,0.38)",
          margin: 0,
        }}>
          {step.desc}
        </p>

        {/* Bottom dot */}
        <div style={{
          width: 6, height: 6,
          borderRadius: "50%",
          background: step.dot,
          margin: "18px auto 0",
          opacity: hovered ? 1 : 0.3,
          transition: "opacity 0.3s ease",
          boxShadow: hovered ? `0 0 8px 2px ${step.glow}` : "none",
        }} />
      </div>
    </div>
  );
}

export default function HowItWorks() {
  useFont();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .hiw-root * { box-sizing: border-box; }
        .hiw-cta-primary:hover { background: #6b62d0 !important; transform: translateY(-2px) !important; }
        .hiw-cta-secondary:hover { background: rgba(255,255,255,0.09) !important; transform: translateY(-2px) !important; border-color: rgba(255,255,255,0.25) !important; }
        .hiw-stat:hover { background: rgba(255,255,255,0.07) !important; border-color: rgba(255,255,255,0.14) !important; transform: translateY(-2px); }
        @keyframes hiw-pulse { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.15)} }
        .hiw-orbdot { animation: hiw-pulse 2.8s ease-in-out infinite; }
        @media (max-width: 768px) {
          .hiw-steps { flex-direction: column !important; }
          .hiw-stats { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      <section
        ref={ref}
        className="hiw-root"
        style={{
          background: "#0b0b0d",
          width: "100%",
          padding: "80px 24px 88px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Ambient blobs */}
        <div style={{
          position: "absolute", top: -100, left: "3%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(83,74,183,0.09) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -80, right: "5%",
          width: 380, height: 380, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(15,110,86,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "40%", left: "50%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(153,53,86,0.06) 0%, transparent 70%)",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1060, margin: "0 auto", position: "relative" }}>

          {/* ── Header ── */}
          <div
            style={{
              textAlign: "center",
              marginBottom: 56,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.7s cubic-bezier(.22,.68,0,1.15)",
            }}
          >
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 40,
              padding: "6px 16px",
              marginBottom: 20,
              background: "rgba(83,74,183,0.14)",
              border: "1px solid rgba(83,74,183,0.28)",
            }}>
              <span className="hiw-orbdot" style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#AFA9EC", display: "inline-block", flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#AFA9EC",
              }}>
                Simple 4-step process
              </span>
            </div>

            <h2 style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: "clamp(28px, 5vw, 50px)",
              color: "rgba(255,255,255,0.92)",
              margin: "0 0 14px",
              lineHeight: 1.08,
              letterSpacing: "-0.01em",
            }}>
              How it{" "}
              <span style={{
                backgroundImage: "linear-gradient(135deg, #AFA9EC 20%, #6EDBB8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
              }}>
                Works
              </span>
            </h2>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.38)",
              maxWidth: 420,
              margin: "0 auto",
            }}>
              From booking to completion — fast, transparent, and built entirely around your convenience.
            </p>
          </div>

          {/* ── Steps ── */}
          <div style={{ position: "relative", marginBottom: 48 }}>
            {/* Connector line */}
            <div style={{
              position: "absolute",
              top: 52,
              left: "10%",
              width: "80%",
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(83,74,183,0.4), rgba(175,169,236,0.5), rgba(110,219,184,0.4), transparent)",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.9s ease 0.6s",
              pointerEvents: "none",
              zIndex: 0,
            }} />
            <div
              className="hiw-steps"
              style={{ display: "flex", gap: 14, position: "relative", zIndex: 1 }}
            >
              {STEPS.map((step, i) => (
                <StepCard key={step.id} step={step} index={i} visible={visible} />
              ))}
            </div>
          </div>

          {/* ── Stats ── */}
          <div
            className="hiw-stats"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
              marginBottom: 44,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "all 0.6s ease 0.5s",
            }}
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                className="hiw-stat"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 14,
                  padding: "18px 12px",
                  textAlign: "center",
                  transition: "all 0.25s ease",
                  cursor: "default",
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                <div style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: 20,
                  color: "#AFA9EC",
                  lineHeight: 1,
                  marginBottom: 6,
                }}>
                  {s.value}
                </div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.32)",
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* ── CTA ── */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "all 0.6s ease 0.6s",
          }}>
            <a
              href="tel:7360050505"
              className="hiw-cta-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#534AB7",
                color: "#EEEDFE",
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: 14,
                padding: "13px 28px",
                borderRadius: 40,
                textDecoration: "none",
                transition: "all 0.2s ease",
                boxShadow: "0 8px 28px -8px rgba(83,74,183,0.65)",
                letterSpacing: "0.01em",
              }}
            >
              📞 Book Now — 7360050505
            </a>
            <a
              href="#services"
              className="hiw-cta-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "transparent",
                color: "rgba(255,255,255,0.5)",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                padding: "12px 24px",
                borderRadius: 40,
                border: "1px solid rgba(255,255,255,0.12)",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              🔍 Explore All Services
            </a>
          </div>

        </div>
      </section>
    </>
  );
}