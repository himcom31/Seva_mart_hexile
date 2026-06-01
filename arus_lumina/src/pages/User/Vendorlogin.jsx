// src/Components/Vendor/VendorLogin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE1 = import.meta.env.VITE_API_URL;
const API_BASE  = `${API_BASE1}/api`;
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
  if (document.getElementById("vl-styles")) return;
  const s = document.createElement("style");
  s.id = "vl-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

    .vl-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      z-index: 9999;
      display: flex;
      align-items: flex-end;        /* always bottom-sheet on all sizes */
      justify-content: center;
      animation: vl-fade 0.18s ease;
    }
    @keyframes vl-fade { from { opacity:0 } to { opacity:1 } }

    .vl-card {
      background: #fff;
      width: 100%;
      max-width: 480px;
      border-radius: 24px 24px 0 0;
      display: flex;
      flex-direction: column;
      max-height: 92dvh;
      overflow: hidden;
      animation: vl-up 0.3s cubic-bezier(0.32,0.72,0,1);
      padding-bottom: env(safe-area-inset-bottom, 0px);
    }
    @keyframes vl-up {
      from { transform: translateY(100%); opacity: 0.7; }
      to   { transform: translateY(0);    opacity: 1; }
    }

    /* drag handle */
    .vl-handle {
      width: 36px; height: 4px;
      background: #e0e0e0; border-radius: 2px;
      margin: 10px auto 0;
      flex-shrink: 0;
    }

    .vl-header {
      padding: 14px 20px 0;
      display: flex; align-items: center; justify-content: space-between;
      flex-shrink: 0;
    }
    .vl-header-text h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.15rem; font-weight: 700; color: #111; line-height: 1.2;
    }
    .vl-header-text p {
      font-family: 'Outfit', sans-serif;
      font-size: 0.78rem; color: #888; margin-top: 2px;
    }
    .vl-close {
      width: 32px; height: 32px; border-radius: 50%;
      border: none; background: #f2f2f2; color: #666;
      font-size: 0.85rem; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: background 0.15s;
    }
    .vl-close:hover { background: #e5e5e5; }

    .vl-divider { height: 1px; background: #f0f0f0; margin: 14px 0 0; flex-shrink: 0; }

    /* scrollable area */
    .vl-scroll { overflow-y: auto; -webkit-overflow-scrolling: touch; flex: 1; }

    .vl-body { padding: 16px 20px 4px; display: flex; flex-direction: column; gap: 12px; }

    /* toggle tabs */
    .vl-tabs {
      display: grid; grid-template-columns: 1fr 1fr;
      background: #f5f5f5; border-radius: 10px;
      padding: 3px; gap: 3px;
    }
    .vl-tab {
      padding: 9px 8px;
      font-family: 'Outfit', sans-serif; font-size: 0.82rem; font-weight: 500;
      border: none; background: transparent; color: #888;
      border-radius: 8px; cursor: pointer;
      transition: background 0.18s, color 0.18s, box-shadow 0.18s;
      display: flex; align-items: center; justify-content: center; gap: 5px;
    }
    .vl-tab.active {
      background: #fff; color: #c2185b; font-weight: 600;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    }

    .vl-field { display: flex; flex-direction: column; gap: 5px; }
    .vl-label {
      font-family: 'Outfit', sans-serif; font-size: 0.78rem;
      font-weight: 600; color: #444; letter-spacing: 0.01em;
    }

    /* phone row */
    .vl-phone-row {
      display: flex; align-items: stretch;
      border: 1.5px solid #e8e8e8; border-radius: 12px;
      overflow: hidden; background: #fff;
      transition: border-color 0.18s, box-shadow 0.18s;
    }
    .vl-phone-row:focus-within {
      border-color: #c2185b;
      box-shadow: 0 0 0 3px rgba(194,24,91,0.09);
    }
    .vl-cc {
      display: flex; align-items: center; gap: 4px;
      padding: 0 10px; background: #fafafa;
      border-right: 1.5px solid #e8e8e8;
      cursor: pointer; flex-shrink: 0; position: relative;
    }
    .vl-cc-flag { font-size: 1.1rem; line-height: 1; }
    .vl-cc-code {
      font-family: 'Outfit', sans-serif; font-size: 0.82rem;
      color: #555; font-weight: 500;
    }
    .vl-cc-arrow { font-size: 0.55rem; color: #aaa; }
    .vl-cc select {
      position: absolute; inset: 0; opacity: 0;
      cursor: pointer; width: 100%; height: 100%;
    }
    .vl-phone-num {
      flex: 1; border: none; outline: none;
      padding: 12px 12px;
      font-family: 'Outfit', sans-serif; font-size: 15px;
      color: #111; background: transparent; min-width: 0;
    }
    .vl-phone-num::placeholder { color: #c0c0c0; }

    /* standard input */
    .vl-input {
      width: 100%; padding: 12px 14px;
      border: 1.5px solid #e8e8e8; border-radius: 12px;
      font-family: 'Outfit', sans-serif; font-size: 15px; color: #111;
      background: #fff; outline: none;
      transition: border-color 0.18s, box-shadow 0.18s;
      appearance: none; -webkit-appearance: none;
    }
    .vl-input::placeholder { color: #c0c0c0; }
    .vl-input:focus {
      border-color: #c2185b;
      box-shadow: 0 0 0 3px rgba(194,24,91,0.09);
    }

    /* password */
    .vl-pass-wrap { position: relative; }
    .vl-pass-wrap .vl-input { padding-right: 48px; }
    .vl-eye {
      position: absolute; right: 0; top: 0; bottom: 0; width: 46px;
      background: none; border: none; cursor: pointer; color: #bbb;
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem; -webkit-tap-highlight-color: transparent;
      transition: color 0.15s;
    }
    .vl-eye:hover { color: #666; }

    /* alerts */
    .vl-error {
      background: #fff5f5; border: 1px solid #fecaca; border-radius: 10px;
      padding: 9px 12px; font-family: 'Outfit', sans-serif;
      font-size: 0.78rem; color: #dc2626; word-break: break-word;
      display: flex; align-items: flex-start; gap: 6px;
    }
    .vl-success {
      background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px;
      padding: 9px 12px; font-family: 'Outfit', sans-serif;
      font-size: 0.78rem; color: #16a34a; word-break: break-word;
      display: flex; align-items: center; gap: 6px;
    }

    /* footer */
    .vl-footer {
      padding: 12px 20px 14px;
      display: flex; flex-direction: column; gap: 8px;
      flex-shrink: 0;
    }
    .vl-btn-submit {
      width: 100%; padding: 14px;
      border-radius: 12px; border: none;
      background: linear-gradient(135deg, #e91e8c 0%, #c2185b 100%);
      color: #fff; font-family: 'Outfit', sans-serif;
      font-size: 0.95rem; font-weight: 700;
      cursor: pointer; letter-spacing: 0.01em;
      box-shadow: 0 4px 16px rgba(194,24,91,0.28);
      transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .vl-btn-submit:active:not(:disabled) { transform: scale(0.98); }
    .vl-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

    .vl-btn-cancel {
      width: 100%; padding: 13px;
      border-radius: 12px; border: 1.5px solid #e8e8e8;
      background: #fff; color: #666;
      font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 500;
      cursor: pointer; transition: background 0.15s;
    }
    .vl-btn-cancel:hover { background: #f9f9f9; }

    .vl-register {
      text-align: center; padding: 0 20px 16px;
      font-family: 'Outfit', sans-serif; font-size: 0.78rem; color: #888;
      flex-shrink: 0;
    }
    .vl-register a { color: #c2185b; font-weight: 600; text-decoration: none; }

    .vl-spinner {
      width: 16px; height: 16px; flex-shrink: 0;
      border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
      border-radius: 50%; animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* On larger screens — center it as a modal instead */
    @media (min-width: 540px) {
      .vl-overlay { align-items: center; padding: 16px; }
      .vl-card {
        border-radius: 20px;
        max-height: calc(100dvh - 32px);
        animation: vl-pop 0.25s cubic-bezier(0.34,1.4,0.64,1);
      }
      @keyframes vl-pop {
        from { transform: scale(0.95) translateY(12px); opacity: 0; }
        to   { transform: scale(1) translateY(0);       opacity: 1; }
      }
      .vl-handle { display: none; }
    }

    /* Landscape phone */
    @media (max-height: 500px) and (max-width: 900px) {
      .vl-overlay { align-items: center; padding: 8px; }
      .vl-card { border-radius: 16px; max-height: calc(100dvh - 16px); }
      .vl-handle { display: none; }
      .vl-body { padding: 12px 18px 4px; gap: 10px; }
      .vl-footer { padding: 10px 18px 12px; }
    }
  `;
  document.head.appendChild(s);
};

const DASHBOARD_ROUTE = "/vendor/dashboard";

export default function VendorLogin({ onClose, onSwitchToRegister }) {
  injectStyles();
  const navigate = useNavigate();

  const [loginBy,     setLoginBy]     = useState("mobile");
  const [form,        setForm]        = useState({ identifier: "", password: "", country_code: "+91" });
  const [showPass,    setShowPass]    = useState(false);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState("");
  const [loading,     setLoading]     = useState(false);

  const selectedCC = COUNTRY_CODES.find(c => c.code === form.country_code) || COUNTRY_CODES[0];

  useEffect(() => {
    if (localStorage.getItem(TOKEN_KEY)) navigate(DASHBOARD_ROUTE, { replace: true });
  }, [navigate]);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape" && onClose) onClose(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const switchTab = (mode) => {
    setLoginBy(mode);
    setForm(f => ({ ...f, identifier: "" }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const body = {
        password: form.password,
        ...(loginBy === "mobile"
          ? { mobile: `${form.country_code}${form.identifier.trim()}` }
          : { email: form.identifier.trim() }
        ),
      };

      const res  = await fetch(`${API_BASE}/vendors/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(INFO_KEY,  JSON.stringify(data.vendor));
      setSuccess("Login successful! Redirecting…");
      setTimeout(() => { if (onClose) onClose(); navigate(DASHBOARD_ROUTE, { replace: true }); }, 1000);
    } catch {
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div
      className="vl-overlay"
      onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
      role="dialog" aria-modal="true" aria-label="Vendor Login"
    >
      <div className="vl-card">
        <div className="vl-handle" />

        {/* Header */}
        <div className="vl-header">
          <div className="vl-header-text">
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

              {/* Tab toggle */}
              <div className="vl-tabs">
                <button type="button" className={`vl-tab ${loginBy === "mobile" ? "active" : ""}`} onClick={() => switchTab("mobile")}>
                  📱 Mobile
                </button>
                <button type="button" className={`vl-tab ${loginBy === "email" ? "active" : ""}`} onClick={() => switchTab("email")}>
                  ✉️ Email
                </button>
              </div>

              {/* Identifier */}
              <div className="vl-field">
                <label className="vl-label">
                  {loginBy === "mobile" ? "Mobile Number" : "Email Address"}
                </label>

                {loginBy === "mobile" ? (
                  <div className="vl-phone-row">
                    <div className="vl-cc">
                      <span className="vl-cc-flag">{selectedCC.flag}</span>
                      <span className="vl-cc-code">{selectedCC.code}</span>
                      <span className="vl-cc-arrow">▾</span>
                      <select value={form.country_code} onChange={set("country_code")} aria-label="Country code">
                        {COUNTRY_CODES.map(c => (
                          <option key={c.code} value={c.code}>{c.flag} {c.code} {c.label}</option>
                        ))}
                      </select>
                    </div>
                    <input
                      className="vl-phone-num"
                      type="tel" inputMode="numeric"
                      placeholder="9876543210"
                      maxLength={10}
                      value={form.identifier}
                      onChange={set("identifier")}
                      required autoFocus autoComplete="off"
                    />
                  </div>
                ) : (
                  <input
                    className="vl-input"
                    type="email" inputMode="email"
                    placeholder="you@example.com"
                    value={form.identifier}
                    onChange={set("identifier")}
                    required autoFocus autoComplete="email"
                  />
                )}
              </div>

              {/* Password */}
              <div className="vl-field">
                <label className="vl-label">Password</label>
                <div className="vl-pass-wrap">
                  <input
                    className="vl-input"
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={set("password")}
                    required autoComplete="current-password"
                  />
                  <button type="button" className="vl-eye"
                    onClick={() => setShowPass(p => !p)}
                    aria-label={showPass ? "Hide password" : "Show password"}>
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {/* Alerts */}
              {error   && <div className="vl-error"   role="alert">⚠ {error}</div>}
              {success && <div className="vl-success" role="status">✅ {success}</div>}

            </div>

            {/* Footer */}
            <div className="vl-footer">
              <button className="vl-btn-submit" type="submit" disabled={loading || !!success}>
                {loading ? <><span className="vl-spinner" /> Signing in…</> : <>Sign In →</>}
              </button>
              {onClose && (
                <button type="button" className="vl-btn-cancel" onClick={onClose}>Cancel</button>
              )}
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