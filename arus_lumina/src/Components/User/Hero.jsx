// src/Components/Home/HeroSection.jsx
import React, { useEffect, useState } from "react";

/* ── Typed words cycling through the headline ── */
const TYPED_WORDS = ["Carpenter", "Electrician", "Plumber", "Tutor", "Cleaner", "Painter"];

const injectStyles = () => {
  if (document.getElementById("hero-styles")) return;
  const s = document.createElement("style");
  s.id = "hero-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

    * { box-sizing: border-box; }

    .hero-root {
      font-family: 'Outfit', sans-serif;
    }

    /* Soft lavender gradient background */
    .hero-bg {
      background: linear-gradient(135deg, #f0eeff 0%, #f7f0ff 40%, #eef2ff 100%);
    }

    /* Purple blob behind images — hidden on mobile */
    .hero-blob {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 52%;
      height: 100%;
      background: radial-gradient(ellipse at 70% 60%, rgba(147,112,219,0.22) 0%, rgba(99,102,241,0.10) 50%, transparent 75%);
      border-radius: 50% 0 0 50%;
      pointer-events: none;
    }

    /* Typing cursor blink */
    .hero-cursor {
      display: inline-block;
      width: 3px;
      height: 1em;
      background: #e91e8c;
      margin-left: 2px;
      vertical-align: text-bottom;
      animation: blink 0.75s step-end infinite;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }

    /* Underline on typed word */
    .hero-typed {
      color: #111;
      text-decoration: underline;
      text-decoration-color: #e91e8c;
      text-underline-offset: 4px;
    }

    /* Stat icon circles */
    .hero-stat-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1.5px solid #d1d5db;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: #fff;
    }

    /* Rating badge */
    .hero-rating-badge {
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.10);
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      position: absolute;
      top: 18%;
      left: 4%;
      z-index: 10;
      min-width: 160px;
    }

    /* Booking badge */
    .hero-booking-badge {
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.09);
      padding: 8px 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      position: absolute;
      top: 6%;
      right: 2%;
      z-index: 10;
    }

    /* Popular tag pill */
    .hero-pill {
      display: inline-block;
      padding: 5px 14px;
      border-radius: 999px;
      border: 1.5px solid #e5e7eb;
      background: #fff;
      font-size: 0.82rem;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s, color 0.15s;
      white-space: nowrap;
    }
    .hero-pill:hover {
      border-color: #e91e8c;
      color: #e91e8c;
      background: #fff0f6;
    }

    /* Image fade-in */
    .hero-img-wrap img {
      animation: imgIn 0.6s ease both;
    }
    @keyframes imgIn {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── Mobile image strip (shown on mobile only) ── */
    .hero-mobile-img {
      display: none;
    }

    /* ── Stats grid on mobile ── */
    .hero-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .hero-stat-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .hero-divider {
      display: none;
    }

    /* ── Mobile badges row (shown on mobile only) ── */
    .hero-mobile-badges {
      display: none;
    }

    /* ─────────────────────────────────────────
       RESPONSIVE BREAKPOINTS
    ───────────────────────────────────────── */

    /* Large screens: show desktop image panel */
    @media (min-width: 1024px) {
      .hero-blob { display: block; }
      .hero-rating-badge { display: flex; }
      .hero-booking-badge { display: flex; }
      .hero-desktop-img { display: flex; }
      .hero-mobile-img { display: none; }
      .hero-mobile-badges { display: none; }
      .hero-divider { display: block; }
    }

    /* Below 1024px: hide desktop image panel, show mobile image */
    @media (max-width: 1023px) {
      .hero-blob { display: none; }
      .hero-rating-badge { display: none !important; }
      .hero-booking-badge { display: none !important; }
      .hero-desktop-img { display: none !important; }
      .hero-mobile-img { display: flex; }
      .hero-mobile-badges { display: flex; }
    }

    /* Tablet (640–1023px) */
    @media (min-width: 640px) and (max-width: 1023px) {
      .hero-mobile-img img {
        max-height: 320px;
      }
      .hero-stats {
        gap: 20px;
      }
    }

    /* Phone (< 640px) */
    @media (max-width: 639px) {
      .hero-mobile-img img {
        max-height: 240px;
      }
      .hero-stats {
        gap: 12px;
      }
      .hero-stat-icon {
        width: 36px;
        height: 36px;
      }
      .hero-pill {
        font-size: 0.75rem;
        padding: 4px 11px;
      }
    }

    /* Very small phones */
    @media (max-width: 380px) {
      .hero-mobile-img img {
        max-height: 200px;
      }
      .hero-stats {
        flex-direction: column;
        gap: 10px;
      }
    }
  `;
  document.head.appendChild(s);
};

export default function Hero() {
  injectStyles();

  /* ── Typing effect ── */
  const [wordIdx,   setWordIdx]   = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting,  setDeleting]  = useState(false);

  useEffect(() => {
    const target = TYPED_WORDS[wordIdx];
    let timeout;

    if (!deleting && displayed.length < target.length) {
      timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 90);
    } else if (!deleting && displayed.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 1600);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 50);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % TYPED_WORDS.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIdx]);

  return (
    <section className="hero-root hero-bg relative overflow-hidden">

      {/* Purple blob (desktop only) */}
      <div className="hero-blob" />

      {/* ── Main wrapper ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">

        {/* ── MOBILE / TABLET layout: stacked column ── */}
        {/* ── DESKTOP layout: side-by-side row (handled via lg: classes) ── */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:min-h-[520px]">

          {/* ─── LEFT: Text content ─── */}
          <div className="w-full lg:w-[52%] pt-8 sm:pt-10 lg:py-0 pb-6 lg:pb-0">

            {/* Headline */}
            <h1
              style={{ lineHeight: 1.15 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4"
            >
              Get your{" "}
              <span className="hero-typed">{displayed}</span>
              <span className="hero-cursor" aria-hidden="true" />
            </h1>

            {/* Subtitle */}
            <p className="text-gray-500 text-sm sm:text-base lg:text-lg mb-5 sm:mb-7 max-w-md leading-relaxed">
              We can connect you to the right Service,
              first time and everytime.
            </p>

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center gap-2 mb-6 sm:mb-8">
              <span className="text-gray-800 font-semibold text-sm mr-1 whitespace-nowrap">
                Popular Searches
              </span>
              {["Electrical", "Catering Services", "Removal"].map((tag) => (
                <span key={tag} className="hero-pill">{tag}</span>
              ))}
            </div>

            {/* ── Mobile floating badges row ── */}
            <div
              className="hero-mobile-badges flex-wrap gap-3 mb-6"
              style={{ alignItems: "center" }}
            >
              {/* Rating */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 3px 12px rgba(0,0,0,0.09)",
                  padding: "8px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>⭐</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111", lineHeight: 1.2 }}>4 / 5</p>
                  <p style={{ fontSize: "0.7rem", color: "#9ca3af" }}>(300 reviews)</p>
                </div>
              </div>

              {/* Booking */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                  padding: "8px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: "#22c55e",
                    flexShrink: 0,
                    display: "inline-block",
                  }}
                />
                <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "#374151", whiteSpace: "nowrap" }}>
                  300 Bookings Done
                </span>
              </div>
            </div>

            {/* Stats row */}
            <div className="hero-stats mb-8 lg:mb-0">

              {/* Verified Providers */}
              <div className="hero-stat-item">
                <div className="hero-stat-icon">
                  <svg width="20" height="20" fill="none" stroke="#374151" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path d="M17 20H7a4 4 0 0 1-4-4v-1a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v1a4 4 0 0 1-4 4Z"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 leading-none">215+</p>
                  <p className="text-xs text-gray-500 mt-0.5">Verified Providers</p>
                </div>
              </div>

              {/* Divider */}
              <div className="hero-divider w-px bg-gray-200 self-stretch" />

              {/* Services Completed */}
              <div className="hero-stat-item">
                <div className="hero-stat-icon">
                  <svg width="20" height="20" fill="none" stroke="#374151" strokeWidth="1.6" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                    <polyline points="8 12 11 15 16 9"/>
                  </svg>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 leading-none">500+</p>
                  <p className="text-xs text-gray-500 mt-0.5">Services Completed</p>
                </div>
              </div>

              {/* Divider */}
              <div className="hero-divider w-px bg-gray-200 self-stretch" />

              {/* Reviews */}
              <div className="hero-stat-item">
                <div className="hero-stat-icon">
                  <svg width="20" height="20" fill="none" stroke="#374151" strokeWidth="1.6" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 leading-none">2000</p>
                  <p className="text-xs text-gray-500 mt-0.5">Reviews Globally</p>
                </div>
              </div>

            </div>
          </div>

          {/* ─── MOBILE / TABLET: centered image strip ─── */}
          <div
            className="hero-mobile-img w-full justify-center items-end pb-0"
            style={{ minHeight: 200 }}
          >
            <img
              src="/banner.webp"
              alt="Service provider"
              style={{
                maxHeight: "100%",
                width: "auto",
                objectFit: "contain",
                objectPosition: "bottom",
                animationDelay: "0.3s",
                maxWidth: "100%",
                display: "block",
              }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>

          {/* ─── DESKTOP: floating image panel ─── */}
          <div
            className="hero-desktop-img flex-1 relative items-end justify-end"
            style={{ height: 520 }}
          >
            {/* Rating badge */}
            <div className="hero-rating-badge">
              <span style={{ fontSize: "1.2rem" }}>⭐</span>
              <div>
                <p style={{ fontWeight: 700, color: "#111", fontSize: "1rem", lineHeight: 1.2 }}>4 / 5</p>
                <p style={{ color: "#9ca3af", fontSize: "0.72rem" }}>(300 reviews)</p>
              </div>
            </div>

            {/* Booking badge */}
            <div className="hero-booking-badge">
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#22c55e",
                  flexShrink: 0,
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
                300 Booking Completed
              </span>
            </div>

            {/* Worker images */}
            <div
              className="hero-img-wrap relative flex items-end justify-end gap-0 h-full w-full"
            >
              <img
                src="/banner.webp"
                alt="Male service provider"
                className="relative z-10 h-[90%] w-auto object-contain object-bottom drop-shadow-xl"
                style={{ animationDelay: "0.3s", maxWidth: 520 }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <img
                src="/images/hero-worker-female.png"
                alt="Female service provider"
                className="relative z-10 h-[80%] w-auto object-contain object-bottom drop-shadow-xl -ml-8"
                style={{ animationDelay: "0.25s", maxWidth: 220 }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}