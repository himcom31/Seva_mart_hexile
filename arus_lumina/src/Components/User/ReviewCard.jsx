import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Google SVG Icon ─── */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" style={{ flexShrink: 0 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

/* ─── Trustpilot Star ─── */
const TpStar = () => (
  <div style={{
    width: 22, height: 22,
    background: "#00B67A",
    display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: 3, color: "#fff", fontSize: 13, fontWeight: 700,
    flexShrink: 0,
  }}>★</div>
);

const REVIEWS = [
  {
    name: "Rajesh Kumar", initials: "RK", color: "#6366F1", time: "1 week ago", stars: 5,
    text: "Called ARUS LUMINA for a complete home wiring job. The electrician arrived on time, was very professional, and finished the work neatly without any mess. MCB installation and fan fittings done perfectly. Highly recommend their electrical services!",
  },
  {
    name: "Sunita Devi", initials: "SD", color: "#10B981", time: "2 weeks ago", stars: 5,
    text: "Booked a plumber through ARUS LUMINA for a serious pipe leakage in my kitchen. The team responded within an hour and fixed the issue completely. Very affordable rates and the plumber was courteous and skilled. Will call again for sure.",
  },
  {
    name: "Amit Sharma", initials: "AS", color: "#F43F5E", time: "3 weeks ago", stars: 5,
    text: "Got my washing machine and refrigerator repaired through their electronic repair service. The technician diagnosed the problem quickly and carried spare parts along. Same-day repair, genuine parts used. Excellent service at a fair price!",
  },
  {
    name: "Pooja Singh", initials: "PS", color: "#F59E0B", time: "1 month ago", stars: 5,
    text: "ARUS LUMINA arranged full decoration and catering for my daughter's wedding. The decoration was stunning and the food was absolutely delicious. Every guest praised the arrangements. The team was professional and handled everything on time. 10/10!",
  },
  {
    name: "Vikram Mishra", initials: "VM", color: "#8B5CF6", time: "5 weeks ago", stars: 5,
    text: "Hired their carpenter service for a modular kitchen and wardrobe work. The carpenter was highly skilled, understood our requirements well, and delivered flawless woodwork. Quality of material and finish was top class. Very satisfied with ARUS LUMINA.",
  },
  {
    name: "Neha Gupta", initials: "NG", color: "#0EA5E9", time: "2 months ago", stars: 5,
    text: "Used their photography & videography service for our anniversary party. The photographer was creative, punctual and captured every moment beautifully. The edited video was delivered within 2 days. Truly professional — exceeded all our expectations!",
  },
  {
    name: "Mohd. Irfan", initials: "MI", color: "#EC4899", time: "6 weeks ago", stars: 5,
    text: "Booked packers & movers through ARUS LUMINA for shifting to a new flat in Patna. Everything was packed carefully, nothing was damaged, and they finished faster than expected. Very trustworthy service at the best price I could find. Highly recommended.",
  },
  {
    name: "Kavita Yadav", initials: "KY", color: "#14B8A6", time: "3 weeks ago", stars: 5,
    text: "Took painter service for my entire 3BHK flat. The painters were neat, used quality paint, and completed on schedule. Interior and exterior both look amazing. ARUS LUMINA's one-call concept is a lifesaver — no need to search multiple vendors anymore!",
  },
  {
    name: "Deepak Pandey", initials: "DP", color: "#F97316", time: "1 month ago", stars: 5,
    text: "Hired a home tutor through ARUS LUMINA for my Class 10 son. The tutor assigned was experienced, patient and results-oriented. My son's grades improved noticeably in just one month. Great platform for finding trusted educational services in Patna.",
  },
  {
    name: "Rina Sinha", initials: "RS", color: "#06B6D4", time: "2 weeks ago", stars: 5,
    text: "Used house cleaning service before a family function. The cleaning team was thorough, professional and used good-quality products. Every corner of the house was spotless. Very reasonable pricing. Will definitely book again through ARUS LUMINA!",
  },
];

/* ─── ReviewCard ─── */
function ReviewCard({ review, cardWidth, gap }) {
  return (
    <div style={{
      flexShrink: 0,
      width: cardWidth,
      background: "#fff",
      borderRadius: 18,
      border: "1px solid #e5e7eb",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: 14,
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      transition: "transform 0.2s, box-shadow 0.2s",
      boxSizing: "border-box",
    }}>
      {/* Stars */}
      <div style={{ display: "flex", gap: 2 }}>
        {Array.from({ length: review.stars }).map((_, i) => (
          <span key={i} style={{ color: "#FBBF24", fontSize: 18 }}>★</span>
        ))}
      </div>

      {/* Text */}
      <p style={{
        fontSize: "0.85rem",
        color: "#4b5563",
        lineHeight: 1.65,
        flex: 1,
        display: "-webkit-box",
        WebkitLineClamp: 4,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        margin: 0,
      }}>
        {review.text}
      </p>

      {/* Reviewer row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 42, height: 42, borderRadius: "50%",
            background: review.color,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: "0.82rem",
            flexShrink: 0, border: "2px solid #f3f4f6",
          }}>
            {review.initials}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "#111827", margin: 0 }}>{review.name}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
              <GoogleIcon />
              <span style={{ fontSize: "0.72rem", color: "#9ca3af", fontWeight: 500 }}>Google</span>
            </div>
          </div>
        </div>
        <span style={{ fontSize: "0.72rem", color: "#9ca3af", whiteSpace: "nowrap" }}>{review.time}</span>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function CustomerReviews() {
  const [current, setCurrent] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [cardWidth, setCardWidth] = useState(0);
  const trackRef  = useRef(null);
  const wrapperRef = useRef(null);
  const timerRef  = useRef(null);
  const GAP = 20;

  /* ── Responsive: how many cards to show ── */
  const getVisibleCount = useCallback((w) => {
    if (w < 480) return 1;
    if (w < 820) return 2;
    return 3;
  }, []);

  /* ── Measure wrapper and set card width ── */
  const measure = useCallback(() => {
    if (!wrapperRef.current) return;
    const wrapW = wrapperRef.current.offsetWidth;
    // wrapper = prev btn (44) + gap (12) + track + gap (12) + next btn (44)
    const trackW = wrapW - 44 - 44 - 12 - 12;
    const vis = getVisibleCount(window.innerWidth);
    const cw = (trackW - GAP * (vis - 1)) / vis;
    setVisibleCount(vis);
    setCardWidth(Math.max(cw, 0));
  }, [getVisibleCount]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const maxSlide = Math.max(0, REVIEWS.length - visibleCount);
  const totalDots = Math.ceil(REVIEWS.length / visibleCount);

  /* ── Apply translation whenever current or cardWidth changes ── */
  useEffect(() => {
    if (trackRef.current && cardWidth > 0) {
      trackRef.current.style.transform = `translateX(-${current * (cardWidth + GAP)}px)`;
    }
  }, [current, cardWidth]);

  const goTo = useCallback((n) => {
    const next = Math.max(0, Math.min(n, maxSlide));
    setCurrent(next);
  }, [maxSlide]);

  /* ── Auto-play ── */
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev >= maxSlide ? 0 : prev + 1));
    }, 4000);
  }, [maxSlide]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  /* ── Clamp current when visibleCount changes ── */
  useEffect(() => {
    setCurrent((prev) => Math.min(prev, maxSlide));
  }, [maxSlide]);

  /* ── Touch / swipe ── */
  const touchStartX = useRef(null);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
    touchStartX.current = null;
  };

  const activeDotGroup = Math.min(Math.floor(current / visibleCount), totalDots - 1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&display=swap');
        .cr-track { transition: transform 0.5s cubic-bezier(0.4,0,0.2,1); }
        .cr-nav-btn {
          flex-shrink: 0; width: 44px; height: 44px; border-radius: 50%;
          border: 1.5px solid #e5e7eb; background: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem; color: #374151; cursor: pointer;
          box-shadow: 0 1px 6px rgba(0,0,0,0.07);
          transition: background 0.2s, color 0.2s, border-color 0.2s, opacity 0.2s;
        }
        .cr-nav-btn:hover:not(:disabled) { background: #111827; color: #fff; border-color: #111827; }
        .cr-nav-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        @keyframes blobPulse {
          0%,100% { transform: translateX(-50%) scale(1); opacity:.7; }
          50%      { transform: translateX(-50%) scale(1.2); opacity:1; }
        }

        /* Mobile: full-width card strip, no arrow buttons shown */
        @media (max-width: 479px) {
          .cr-nav-btn { display: none !important; }
          .cr-outer-row { gap: 0 !important; }
        }
      `}</style>

      <section style={{ width: "100%", background: "#f8f9fc", padding: "56px 0 48px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 16px", boxSizing: "border-box" }}>

          {/* ── Heading ── */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              fontWeight: 800, color: "#111827",
              margin: "0 0 10px", lineHeight: 1.2,
            }}>
              Genuine reviews from{" "}
              <span style={{
                background: "linear-gradient(135deg,#E879F9,#3B82F6)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Customers
              </span>
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#9ca3af", margin: 0 }}>
              Real experiences shared by people who used our services
            </p>
          </div>

          {/* ── Carousel ── */}
          <div style={{ position: "relative" }}>
            {/* Blob */}
            <div style={{
              position: "absolute", left: "50%", top: -24,
              width: 20, height: 20, borderRadius: "50%",
              background: "linear-gradient(135deg,#F9A8D4,#E879F9)",
              pointerEvents: "none", zIndex: 0,
              animation: "blobPulse 2.5s ease-in-out infinite",
            }} />

            {/* Row: prev | track | next */}
            <div
              ref={wrapperRef}
              className="cr-outer-row"
              style={{ display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 1 }}
              onMouseEnter={() => clearInterval(timerRef.current)}
              onMouseLeave={startTimer}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Prev */}
              <button
                className="cr-nav-btn"
                disabled={current === 0}
                onClick={() => goTo(current - 1)}
                aria-label="Previous"
              >‹</button>

              {/* Track */}
              <div style={{ flex: 1, overflow: "hidden", borderRadius: 18, minWidth: 0 }}>
                <div
                  ref={trackRef}
                  className="cr-track"
                  style={{ display: "flex", gap: GAP }}
                >
                  {REVIEWS.map((r, i) => (
                    <ReviewCard key={i} review={r} cardWidth={cardWidth} gap={GAP} />
                  ))}
                </div>
              </div>

              {/* Next */}
              <button
                className="cr-nav-btn"
                disabled={current >= maxSlide}
                onClick={() => goTo(current + 1)}
                aria-label="Next"
              >›</button>
            </div>
          </div>

          {/* ── Dots ── */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
            {Array.from({ length: totalDots }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(Math.min(i * visibleCount, maxSlide))}
                aria-label={`Slide group ${i + 1}`}
                style={{
                  height: 8, borderRadius: 4, border: "none", cursor: "pointer",
                  background: activeDotGroup === i ? "#111827" : "#d1d5db",
                  width: activeDotGroup === i ? 28 : 8,
                  transition: "all 0.3s ease", padding: 0,
                }}
              />
            ))}
          </div>

          {/* ── Trust bar ── */}
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", margin: 0, textAlign: "center" }}>
              Trusted by thousands of customers across Patna
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827" }}>Excellent</span>
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: 5 }).map((_, i) => <TpStar key={i} />)}
              </div>
              <span style={{ fontSize: "0.82rem", color: "#9ca3af" }}>Based on 8 reviews</span>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}