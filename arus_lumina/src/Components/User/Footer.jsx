import React from "react";
import { Link } from "react-router-dom";

const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.6277111544005!2d85.12047457539562!3d25.617284377442925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed59b86a768c6d%3A0xe5f8f2079ccc5439!2sHexile%20Services!5e0!3m2!1sen!2sin!4v1780300430890!5m2!1sen!2sin";

const PAGE_LINKS = [
  { label: "About us",         path: "user/about" },
  { label: "Terms & Condition", path: "user/terms-and-conditions" },
  { label: "Privacy Policy",   path: "user/privacy" },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] fill-current">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] fill-current">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] fill-current">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.105.549 4.082 1.505 5.798L.057 23.25l5.59-1.465A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.789 9.789 0 0 1-4.988-1.366l-.358-.212-3.717.974.992-3.617-.234-.371A9.787 9.787 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
      </svg>
    ),
  },
];

const handleSocialEnter = (e) => {
  e.currentTarget.style.background = "linear-gradient(135deg, #e91e8c, #6c63ff)";
  e.currentTarget.style.color = "#fff";
  e.currentTarget.style.borderColor = "transparent";
};
const handleSocialLeave = (e) => {
  e.currentTarget.style.background = "#fff";
  e.currentTarget.style.color = "#374151";
  e.currentTarget.style.borderColor = "#e5e7eb";
};

export default function Footer() {
  return (
    <footer
      className="w-full bg-gray-100"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Single centred wrapper — wraps BOTH top grid AND bottom bar ── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-12">

        {/* ── TOP GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pt-10 sm:pt-12 lg:pt-14 pb-10 border-b border-gray-200">

          {/* Useful Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4 tracking-tight">
              Useful Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="user/services"
                  className="text-sm font-medium text-gray-500 hover:text-indigo-500 transition-colors duration-200"
                >
                  Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4 tracking-tight">
              Pages
            </h4>
            <ul className="space-y-3">
              {PAGE_LINKS.map(({ label, path }) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="text-sm font-medium text-gray-500 hover:text-indigo-500 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4 tracking-tight">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="user/contact"
                  className="text-sm font-medium text-gray-500 hover:text-indigo-500 transition-colors duration-200"
                >
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Location — spans 2 cols on tablet, 1 on desktop */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-sm font-bold text-gray-900 mb-4 tracking-tight">
              Location
            </h4>
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md h-48 sm:h-56 lg:h-48 w-full">
              <iframe
                src={MAP_EMBED_SRC}
                width="100%"
                height="100%"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hexile Services, Patna"
              />
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-3 h-3 flex-shrink-0"
                fill="#e91e8c"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              Hexile Services, Kidwaipuri, Patna
            </p>
          </div>
        </div>

        {/* ── BOTTOM BAR ── now INSIDE the same padded wrapper ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-3 py-5 sm:py-6">

          {/* Social icons */}
          <div className="flex gap-3 order-1">
            {SOCIAL_LINKS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                onMouseEnter={handleSocialEnter}
                onMouseLeave={handleSocialLeave}
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs text-gray-400 order-2">
            © 2026 All rights reserved.{" "}
            <strong
              style={{
                background: "linear-gradient(135deg, #e91e8c, #6c63ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 700,
              }}
            >
              Arus Lumina
            </strong>
          </p>

          {/* Legal links */}
          <div className="flex flex-wrap gap-3 sm:gap-4 order-3">
            <Link
              to="user/terms-and-conditions"
              className="text-xs text-gray-400 underline hover:text-indigo-500 transition-colors duration-200"
            >
              Terms and Conditions
            </Link>
            <Link
              to="user/privacy"
              className="text-xs text-gray-400 underline hover:text-indigo-500 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
          </div>
        </div>

      </div>{/* end single centred wrapper */}
    </footer>
  );
}