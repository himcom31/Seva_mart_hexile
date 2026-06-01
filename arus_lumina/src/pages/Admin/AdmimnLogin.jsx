import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;


// ─── SVG Icons ──────────────────────────────────────────────────────────────
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

// ─── Main Login Component ────────────────────────────────────────────────────
export default function AdminLogin() {
    const navigate = useNavigate();
  
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");

    if (!email.trim())                    return setError("Email address is required.");
    if (!/\S+@\S+\.\S+/.test(email))     return setError("Please enter a valid email.");
    if (!password)                        return setError("Password is required.");
    if (password.length < 6)             return setError("Password must be at least 6 characters.");

    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim(), password, role: "admin" }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("al_token", data.token);
        localStorage.setItem("al_user",  JSON.stringify(data.user));
        setSuccess(true);
navigate('/admin/dashboard')
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Cannot reach server. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        body, html {
          margin: 0;
          padding: 0;
          background: #f5f6fa;
        }

        .al-page {
          min-height: 100vh;
          background: #f5f6fa;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.5rem 1rem;
        }

        /* ── Top logo bar ── */
        .al-logo-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
          opacity: 0;
          transform: translateY(-12px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .al-logo-bar.show { opacity: 1; transform: translateY(0); }

        .al-logo-icon {
          width: 42px;
          height: 42px;
        }

        .al-logo-text {
          font-size: 22px;
          font-weight: 700;
          color: #1a1d3b;
          letter-spacing: -0.3px;
        }
        .al-logo-text span { color: #ec4899; }

        /* ── Card ── */
        .al-card {
          background: #fff;
          border-radius: 16px;
          padding: 36px 40px 32px;
          width: 100%;
          max-width: 520px;
          border: 1px solid #e8eaf0;
          box-shadow: 0 2px 20px rgba(0,0,0,0.07);
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.45s ease 0.1s, transform 0.45s cubic-bezier(0.16,1,0.3,1) 0.1s;
        }
        .al-card.show { opacity: 1; transform: translateY(0); }

        .al-card h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1a1d3b;
          margin: 0 0 6px;
        }
        .al-card p.subtitle {
          font-size: 14px;
          color: #8a90a5;
          margin: 0 0 28px;
        }

        /* ── Field group ── */
        .field-group {
          margin-bottom: 20px;
        }
        .field-group label {
          display: block;
          font-size: 13.5px;
          font-weight: 600;
          color: #1a1d3b;
          margin-bottom: 8px;
        }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-wrap input {
          width: 100%;
          padding: 11px 44px 11px 14px;
          font-size: 14px;
          color: #1a1d3b;
          background: #fff;
          border: 1.5px solid #dde1ee;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-wrap input::placeholder { color: #b0b5c8; }
        .input-wrap input:focus {
          border-color: #ec4899;
          box-shadow: 0 0 0 3px rgba(236,72,153,0.1);
        }
        .input-wrap .input-icon {
          position: absolute;
          right: 13px;
          color: #b0b5c8;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: color 0.2s;
          background: none;
          border: none;
          padding: 0;
        }
        .input-wrap .input-icon:hover { color: #ec4899; }

        /* ── Error / Success bars ── */
        .error-bar {
          background: #fff5f5;
          border: 1px solid #fed7d7;
          border-left: 3px solid #fc8181;
          color: #c53030;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 18px;
          animation: slideDown 0.2s ease;
        }
        .success-bar {
          background: #f0fff4;
          border: 1px solid #c6f6d5;
          border-left: 3px solid #68d391;
          color: #276749;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 18px;
          animation: slideDown 0.2s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Submit button ── */
        .btn-signin {
          width: 100%;
          padding: 13px;
          background: #ec4899;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 3px 12px rgba(236,72,153,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn-signin:hover:not(:disabled) {
          background: #db2777;
          box-shadow: 0 5px 18px rgba(236,72,153,0.4);
          transform: translateY(-1px);
        }
        .btn-signin:active:not(:disabled) { transform: scale(0.99); }
        .btn-signin:disabled { opacity: 0.72; cursor: not-allowed; }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 560px) {
          .al-card { padding: 28px 22px 24px; }
          .al-card h1 { font-size: 24px; }
        }
      `}</style>

      <div className="al-page">

        {/* ── Logo ── */}
        <div className={`al-logo-bar ${mounted ? "show" : ""}`}>
          {/* Inline SVG logo matching the screenshot style */}
          <svg className="al-logo-icon" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="21" cy="21" r="20" fill="#1a1d3b" opacity="0.06"/>
            <circle cx="21" cy="21" r="10" stroke="#ec4899" strokeWidth="2.5" fill="none"/>
            <circle cx="21" cy="21" r="3.5" fill="#ec4899"/>
            <line x1="21" y1="4" x2="21" y2="11" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/>
            <line x1="21" y1="31" x2="21" y2="38" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4"  y1="21" x2="11" y2="21" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/>
            <line x1="31" y1="21" x2="38" y2="21" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="al-logo-text">
            ARUS<span className="text-pink-500">LUMINA</span>
          </span>
        </div>

        {/* ── Card ── */}
        <div className={`al-card ${mounted ? "show" : ""}`}>
          <h1>Admin Login</h1>
          <p className="subtitle">Please enter your details to sign in</p>

          <form onSubmit={handleSubmit} noValidate>

            {/* Error / Success */}
            {error && (
              <div className="error-bar">
                <AlertIcon /> {error}
              </div>
            )}
            {success && (
              <div className="success-bar">
                <CheckIcon /> Login successful! Redirecting…
              </div>
            )}

            {/* Email */}
            <div className="field-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrap">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  autoComplete="email"
                  placeholder="admin@example.com"
                />
                <span className="input-icon"><MailIcon /></span>
              </div>
            </div>

            {/* Password */}
            <div className="field-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="input-icon"
                  onClick={() => setShowPass(v => !v)}
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPass ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-signin"
              disabled={loading || success}
            >
              {loading ? (
                <><span className="spinner" /> Login …</>
              ) : success ? (
                <><CheckIcon /> Redirecting…</>
              ) : "Login"}
            </button>

          </form>
        </div>

      </div>
    </>
  );
}