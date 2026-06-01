// src/Components/Vendor/VendorLogin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE1 = import.meta.env.VITE_API_URL;

const API_BASE = `${API_BASE1}/api`;

const TOKEN_KEY = "vendorToken";
const INFO_KEY  = "vendorInfo";

const COUNTRY_CODES = [
  { code: "+91",  flag: "🇮🇳", label: "IN" },
  { code: "+1",   flag: "🇺🇸", label: "US" },
  { code: "+44",  flag: "🇬🇧", label: "GB" },
  { code: "+61",  flag: "🇦🇺", label: "AU" },
  { code: "+971", flag: "🇦🇪", label: "AE" },
];

const injectStyles = () => {
  if (document.getElementById("vl-modal-styles")) return;
  const s = document.createElement("style");
  s.id = "vl-modal-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .vl-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 9999;
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
      animation: vl-fade 0.2s ease;
    }
    @keyframes vl-fade { from { opacity: 0; } to { opacity: 1; } }

    .vl-card {
      background: #fff;
      border-radius: 18px;
      width: 100%;
      max-width: 420px;
      position: relative;
      animation: vl-up 0.25s cubic-bezier(0.34,1.56,0.64,1);
      overflow: hidden;
      max-height: calc(100dvh - 32px);
      display: flex;
      flex-direction: column;
    }
    @keyframes vl-up {
      from { opacity: 0; transform: translateY(24px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    .vl-scroll {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      flex: 1;
    }

    .vl-header {
      padding: 22px 24px 0;
      display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
      flex-shrink: 0;
    }
    .vl-header h2 {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(1.1rem, 4vw, 1.35rem);
      font-weight: 700; color: #111;
    }
    .vl-header p {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(0.75rem, 3vw, 0.82rem);
      color: #777; margin-top: 4px;
    }
    .vl-close {
      min-width: 44px; min-height: 44px;
      width: 44px; height: 44px;
      border-radius: 50%; border: none;
      background: #f0f0f0; color: #555;
      font-size: 1.1rem; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: background 0.15s; line-height: 1;
    }
    .vl-close:hover { background: #e0e0e0; color: #111; }

    .vl-divider { height: 1px; background: #f0f0f0; margin: 16px 0 0; flex-shrink: 0; }

    .vl-body {
      padding: 20px 24px 20px;
      display: flex; flex-direction: column; gap: 14px;
    }

    .vl-field { display: flex; flex-direction: column; gap: 5px; }
    .vl-label {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(0.78rem, 3vw, 0.82rem);
      font-weight: 500; color: #333;
    }

    .vl-tabs {
      display: flex;
      border: 1.5px solid #e8e8e8; border-radius: 10px; overflow: hidden;
    }
    .vl-tab {
      flex: 1;
      padding: 11px 8px;
      font-family: 'Outfit', sans-serif;
      font-size: clamp(0.78rem, 3vw, 0.82rem);
      font-weight: 500;
      border: none; background: #fff; color: #999;
      cursor: pointer; transition: background 0.15s, color 0.15s;
      white-space: nowrap;
      min-height: 44px;
    }
    .vl-tab.active { background: #c2185b; color: #fff; }

    /* Shared input style */
    .vl-input {
      width: 100%;
      min-height: 44px;
      padding: 11px 14px;
      border: 1.5px solid #e8e8e8; border-radius: 10px;
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      color: #111;
      background: #fff; outline: none;
      transition: border-color 0.18s, box-shadow 0.18s;
      appearance: none; -webkit-appearance: none;
    }
    .vl-input::placeholder { color: #bbb; }
    .vl-input:focus {
      border-color: #c2185b;
      box-shadow: 0 0 0 3px rgba(194,24,91,0.08);
    }

    /* Phone row — country code + number */
    .vl-phone-row {
      display: flex;
      border: 1.5px solid #e8e8e8;
      border-radius: 10px;
      overflow: hidden;
      transition: border-color 0.18s, box-shadow 0.18s;
      min-height: 44px;
    }
    .vl-phone-row:focus-within {
      border-color: #c2185b;
      box-shadow: 0 0 0 3px rgba(194,24,91,0.08);
    }
    .vl-phone-flag {
      display: flex; align-items: center; gap: 5px;
      padding: 0 10px;
      background: #f9f9f9;
      border-right: 1.5px solid #e8e8e8;
      font-family: 'Outfit', sans-serif; font-size: 0.82rem; color: #444;
      white-space: nowrap; cursor: pointer; user-select: none;
      flex-shrink: 0;
    }
    .vl-phone-flag select {
      border: none; background: transparent;
      font-family: 'Outfit', sans-serif; font-size: 0.82rem; color: #444;
      outline: none; cursor: pointer;
      appearance: none; -webkit-appearance: none;
      max-width: 48px;
    }
    .vl-phone-num {
      flex: 1; border: none;
      padding: 11px 12px;
      font-family: 'Outfit', sans-serif; font-size: 16px;
      color: #111; outline: none; background: transparent;
      min-width: 0;
    }
    .vl-phone-num::placeholder { color: #bbb; }

    .vl-pass-wrap { position: relative; }
    .vl-pass-wrap .vl-input { padding-right: 50px; }
    .vl-eye {
      position: absolute; right: 0; top: 0; bottom: 0;
      width: 46px;
      background: none; border: none; cursor: pointer;
      color: #bbb; font-size: 1rem; padding: 0; line-height: 1;
      display: flex; align-items: center; justify-content: center;
      transition: color 0.15s;
      -webkit-tap-highlight-color: transparent;
    }
    .vl-eye:hover { color: #555; }

    .vl-error {
      background: #fff5f5; border: 1px solid #fecaca;
      border-radius: 10px; padding: 10px 13px;
      font-family: 'Outfit', sans-serif;
      font-size: clamp(0.78rem, 3vw, 0.82rem);
      color: #dc2626;
      word-break: break-word;
    }
    .vl-success {
      background: #f0fdf4; border: 1px solid #bbf7d0;
      border-radius: 10px; padding: 10px 13px;
      font-family: 'Outfit', sans-serif;
      font-size: clamp(0.78rem, 3vw, 0.82rem);
      color: #16a34a;
      display: flex; align-items: center; gap: 8px;
      word-break: break-word;
    }

    .vl-footer {
      padding: 14px 24px 16px;
      display: flex; justify-content: flex-end; gap: 10px;
      border-top: 1px solid #f0f0f0;
      flex-shrink: 0;
    }
    .vl-btn-cancel {
      padding: 12px 18px; border-radius: 10px;
      border: 1.5px solid #e0e0e0; background: #fff; color: #555;
      font-family: 'Outfit', sans-serif;
      font-size: clamp(0.85rem, 3.5vw, 0.9rem);
      font-weight: 500;
      cursor: pointer; transition: background 0.15s;
      min-height: 44px;
    }
    .vl-btn-cancel:hover { background: #f5f5f5; }

    .vl-btn-submit {
      padding: 12px 24px; border-radius: 10px; border: none;
      background: linear-gradient(135deg, #e91e8c 0%, #c2185b 100%);
      color: #fff;
      font-family: 'Outfit', sans-serif;
      font-size: clamp(0.85rem, 3.5vw, 0.9rem);
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 3px 14px rgba(194,24,91,0.3);
      transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      min-height: 44px;
      white-space: nowrap;
    }
    .vl-btn-submit:hover:not(:disabled) {
      transform: translateY(-1px); box-shadow: 0 6px 20px rgba(194,24,91,0.38);
    }
    .vl-btn-submit:active:not(:disabled) { transform: translateY(0); }
    .vl-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

    .vl-spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff;
      border-radius: 50%; animation: spin 0.7s linear infinite;
      flex-shrink: 0;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .vl-register {
      text-align: center;
      font-family: 'Outfit', sans-serif;
      font-size: clamp(0.78rem, 3vw, 0.82rem);
      color: #888;
      padding: 0 24px 18px;
      flex-shrink: 0;
    }
    .vl-register a { color: #c2185b; font-weight: 600; text-decoration: none; }
    .vl-register a:hover { text-decoration: underline; }

    /* ── Mobile: slide up from bottom ─────────────────────────────────────── */
    @media (max-width: 480px) {
      .vl-overlay { padding: 0; align-items: flex-end; }
      .vl-card {
        border-radius: 20px 20px 0 0;
        max-width: 100%;
        max-height: 96dvh;
        animation: vl-slide-up 0.28s cubic-bezier(0.34,1.2,0.64,1);
      }
      @keyframes vl-slide-up {
        from { transform: translateY(100%); opacity: 0.6; }
        to   { transform: translateY(0);    opacity: 1; }
      }
      .vl-header { padding: 18px 18px 0; }
      .vl-body   { padding: 16px 18px 16px; gap: 12px; }
      .vl-footer {
        padding: 12px 18px 20px;
        flex-direction: column-reverse;
        gap: 8px;
      }
      .vl-btn-submit,
      .vl-btn-cancel { width: 100%; justify-content: center; }
      .vl-register { padding: 0 18px calc(16px + env(safe-area-inset-bottom, 0px)); }
      .vl-footer   { padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px)); }
    }

    @media (max-width: 360px) {
      .vl-header h2 { font-size: 1rem; }
      .vl-body { gap: 10px; }
      .vl-tab  { font-size: 0.75rem; padding: 10px 4px; }
    }

    @media (max-height: 500px) and (max-width: 900px) {
      .vl-overlay { align-items: center; padding: 8px; }
      .vl-card { border-radius: 14px; max-height: calc(100dvh - 16px); }
      .vl-header { padding: 14px 20px 0; }
      .vl-body   { padding: 12px 20px; gap: 10px; }
      .vl-footer { padding: 10px 20px 12px; }
    }
  `;
  document.head.appendChild(s);
};

const DASHBOARD_ROUTE = "/vendor/dashboard";

export default function VendorLogin({ onClose, onSwitchToRegister }) {
  injectStyles();
  const navigate = useNavigate();

  const [loginBy,      setLoginBy]      = useState("mobile");
  const [form,         setForm]         = useState({ identifier: "", password: "", country_code: "+91" });
  const [showPass,     setShowPass]     = useState(false);
  const [error,        setError]        = useState("");
  const [success,      setSuccess]      = useState("");
  const [loading,      setLoading]      = useState(false);

  useEffect(() => {
    if (localStorage.getItem(TOKEN_KEY)) {
      navigate(DASHBOARD_ROUTE, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape" && onClose) onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const switchLoginBy = (mode) => {
    setLoginBy(mode);
    setForm(f => ({ ...f, identifier: "" }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    try {
      // For mobile: prepend country code to match how it was stored at registration
      const mobileWithCode = `${form.country_code}${form.identifier.trim()}`;

      const body = {
        password: form.password,
        ...(loginBy === "mobile"
          ? { mobile: mobileWithCode }
          : { email: form.identifier.trim() }
        ),
      };
console.log("Sending to API:", body);
      const res  = await fetch(`${API_BASE}/vendors/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(INFO_KEY,  JSON.stringify(data.vendor));

      setSuccess("Login successful! Redirecting to dashboard…");

      setTimeout(() => {
        if (onClose) onClose();
        navigate(DASHBOARD_ROUTE, { replace: true });
      }, 1000);

    } catch {
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && onClose) onClose();
  };

  const selectedCountry = COUNTRY_CODES.find(c => c.code === form.country_code) || COUNTRY_CODES[0];

  return (
    <div className="vl-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="Vendor Login">
      <div className="vl-card">

        {/* Header */}
        <div className="vl-header">
          <div>
            <h2>Vendor Login</h2>
            <p>Sign in to your provider account</p>
          </div>
          {onClose && (
            <button className="vl-close" onClick={onClose} aria-label="Close">✕</button>
          )}
        </div>

        <div className="vl-divider" />

        <div className="vl-scroll">
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="vl-body">

              {/* Login-by toggle */}
              <div className="vl-field">
                <label className="vl-label">Login with</label>
                <div className="vl-tabs">
                  <button
                    type="button"
                    className={`vl-tab ${loginBy === "mobile" ? "active" : ""}`}
                    onClick={() => switchLoginBy("mobile")}
                  >
                    📱 Mobile
                  </button>
                  <button
                    type="button"
                    className={`vl-tab ${loginBy === "email" ? "active" : ""}`}
                    onClick={() => switchLoginBy("email")}
                  >
                    ✉ Email
                  </button>
                </div>
              </div>

              {/* Identifier */}
              <div className="vl-field">
                <label className="vl-label">
                  {loginBy === "mobile" ? "Mobile Number *" : "Email Address *"}
                </label>

                {loginBy === "mobile" ? (
                  <div className="vl-phone-row">
                    <div className="vl-phone-flag">
                      <span>{selectedCountry.flag}</span>
                      <select
                        value={form.country_code}
                        onChange={set("country_code")}
                        aria-label="Country code"
                      >
                        {COUNTRY_CODES.map(c => (
                          <option key={c.code} value={c.code}>{c.code} {c.label}</option>
                        ))}
                      </select>
                      <span style={{ fontSize: "0.7rem", color: "#aaa", pointerEvents: "none" }}>▾</span>
                    </div>
                    <input
                      className="vl-phone-num"
                      type="tel"
                      inputMode="numeric"
                      placeholder="9876543210"
                      maxLength={10}
                      value={form.identifier}
                      onChange={set("identifier")}
                      required
                      autoFocus
                      autoComplete="off"
                    />
                  </div>
                ) : (
                  <input
                    className="vl-input"
                    type="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    value={form.identifier}
                    onChange={set("identifier")}
                    required
                    autoFocus
                    autoComplete="email"
                  />
                )}
              </div>

              {/* Password */}
              <div className="vl-field">
                <label className="vl-label">Password *</label>
                <div className="vl-pass-wrap">
                  <input
                    className="vl-input"
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={set("password")}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="vl-eye"
                    onClick={() => setShowPass(p => !p)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {/* Alerts */}
              {error   && <div className="vl-error" role="alert">⚠ {error}</div>}
              {success && <div className="vl-success" role="status"><span>✅</span> {success}</div>}

            </div>

            {/* Footer */}
            <div className="vl-footer">
              {onClose && (
                <button type="button" className="vl-btn-cancel" onClick={onClose}>
                  Cancel
                </button>
              )}
              <button className="vl-btn-submit" type="submit" disabled={loading || !!success}>
                {loading
                  ? <><span className="vl-spinner" /> Signing in…</>
                  : <>Sign In →</>
                }
              </button>
            </div>
          </form>

          <p className="vl-register">
            New vendor?{" "}
            {onSwitchToRegister
              ? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}>Register here</a>
              : <a href="/user/Vendorregister">Register here</a>
            }
          </p>
        </div>

      </div>
    </div>
  );
}