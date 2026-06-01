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

    .hero-root {
      font-family: 'Outfit', sans-serif;
    }

    /* Soft lavender gradient background */
    .hero-bg {
      background: linear-gradient(135deg, #f0eeff 0%, #f7f0ff 40%, #eef2ff 100%);
    }

    /* Purple blob behind images */
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
      width: 44px;
      height: 44px;
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
      left: 8%;
      z-index: 10;
      min-width: 170px;
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
      transition: border-color 0.15s, background 0.15s;
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

    /* Responsive */
    @media (max-width: 768px) {
      .hero-blob { display: none; }
      .hero-rating-badge { display: none; }
      .hero-booking-badge { display: none; }
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
    <section className="hero-root hero-bg relative overflow-hidden min-h-[420px] md:min-h-[480px] lg:min-h-[520px]">

      {/* Purple blob */}
      <div className="hero-blob" />

      {/* ── Content grid ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-16 flex items-center min-h-[420px] md:min-h-[480px] lg:min-h-[520px]">

        {/* LEFT — text & stats */}
        <div className="w-full lg:w-[52%] pt-10 pb-8 lg:py-0">

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Get your{" "}
            <span className="hero-typed">{displayed}</span>
            <span className="hero-cursor" aria-hidden="true" />
          </h1>

          {/* Subtitle */}
          <p className="text-gray-500 text-base sm:text-lg mb-8 max-w-md leading-relaxed">
            We can connect you to the right Service,<br className="hidden sm:block" />
            first time and everytime.
          </p>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center gap-2 mb-10">
            <span className="text-gray-800 font-semibold text-sm mr-1">Popular Searches</span>
            {["Electrical", "Catering Services", "Removal"].map((tag) => (
              <span key={tag} className="hero-pill">{tag}</span>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 sm:gap-10">

            {/* Verified Providers */}
            <div className="flex items-center gap-3">
              <div className="hero-stat-icon">
                <svg width="22" height="22" fill="none" stroke="#374151" strokeWidth="1.6" viewBox="0 0 24 24">
                  <path d="M17 20H7a4 4 0 0 1-4-4v-1a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v1a4 4 0 0 1-4 4Z"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 leading-none">215+</p>
                <p className="text-xs text-gray-500 mt-0.5">Verified Providers</p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px bg-gray-200 self-stretch" />

            {/* Services Completed */}
            <div className="flex items-center gap-3">
              <div className="hero-stat-icon">
                <svg width="22" height="22" fill="none" stroke="#374151" strokeWidth="1.6" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <polyline points="8 12 11 15 16 9"/>
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 leading-none">500+</p>
                <p className="text-xs text-gray-500 mt-0.5">Services Completed</p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px bg-gray-200 self-stretch" />

            {/* Reviews */}
            <div className="flex items-center gap-3">
              <div className="hero-stat-icon">
                <svg width="22" height="22" fill="none" stroke="#374151" strokeWidth="1.6" viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 leading-none">2000</p>
                <p className="text-xs text-gray-500 mt-0.5">Reviews Globally</p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT — images + floating badges */}
        <div className="hidden lg:flex flex-1 relative items-end justify-end h-[480px] lg:h-[520px]">

          {/* Rating badge — floats top-left of image area */}
          <div className="hero-rating-badge">
            <span className="text-yellow-400 text-xl">⭐</span>
            <div>
              <p className="font-bold text-gray-900 text-base leading-tight">4 / 5</p>
              <p className="text-gray-400 text-xs">(300 reviews)</p>
            </div>
          </div>

          {/* Booking completed badge — top-right */}
          <div className="hero-booking-badge">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
            <span className="text-gray-700 text-sm font-medium">300 Booking Completed</span>
          </div>

          {/* Hero images */}
          <div className="hero-img-wrap relative flex items-end justify-end gap-0 h-full w-full">

            {/* Worker 1 — male with drill */}
            <img
              src="/banner.webp"
              alt="Male service provider"
              className="relative z-10 h-[90%] w-auto object-contain object-bottom drop-shadow-xl"
              style={{ animationDelay: "0.3s", maxWidth: "520px" }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />

            {/* Worker 2 — female */}
            <img
              src="/images/hero-worker-female.png"
              alt="Female service provider"
              className="relative z-10 h-[80%] w-auto object-contain object-bottom drop-shadow-xl -ml-8"
              style={{ animationDelay: "0.25s", maxWidth: "220px" }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />

          </div>
        </div>

      </div>
    </section>
  );
}