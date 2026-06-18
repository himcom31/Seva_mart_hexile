// src/pages/User/CustomerLogin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

/* ── Inject styles ── */
const injectStyles = () => {
  if (document.getElementById("cust-login-styles")) return;
  const style = document.createElement("style");
  style.id = "cust-login-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    .cl-root { font-family: 'Plus Jakarta Sans', sans-serif; }

    @keyframes cl-fade-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes cl-spin {
      to { transform: rotate(360deg); }
    }
    .cl-card    { animation: cl-fade-up 0.35s ease both; }
    .cl-spinner { animation: cl-spin 0.8s linear infinite; }

    .cl-input {
      width: 100%; padding: 13px 16px;
      border: 1.5px solid #e5e7eb; border-radius: 10px;
      font-family: inherit; font-size: 1rem; font-weight: 500;
      outline: none; transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
    }
    .cl-input:focus {
      border-color: #e91e8c;
      box-shadow: 0 0 0 3px rgba(233,30,140,0.12);
    }
    .cl-input::placeholder { color: #9ca3af; font-weight: 400; }

    .cl-btn {
      width: 100%; padding: 13px;
      border-radius: 10px; border: none; cursor: pointer;
      font-family: inherit; font-size: 0.95rem; font-weight: 700;
      background: linear-gradient(135deg, #e91e8c, #c2185b);
      color: #fff; transition: opacity 0.2s, transform 0.18s;
      box-shadow: 0 4px 16px rgba(233,30,140,0.3);
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .cl-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .cl-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

    .cl-error {
      background: #fff0f5; border: 1px solid #fca5a5; border-radius: 8px;
      padding: 10px 14px; color: #be123c; font-size: 0.84rem; font-weight: 500;
    }
  `;
  document.head.appendChild(style);
};

const CustomerLogin = () => {
  injectStyles();

  const navigate = useNavigate();
  const [mobile, setMobile]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // Auto-login if session exists
  useEffect(() => {
    const saved = localStorage.getItem("al_customer_mobile");
    if (saved) navigate("/user/customer/dashboard");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const clean = mobile.trim().replace(/\D/g, "");
    if (clean.length < 10) { setError("Enter a valid 10-digit mobile number"); return; }

    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`${API_BASE}/book/customer/${clean}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No bookings found");
      localStorage.setItem("al_customer_mobile", clean);
      navigate("/user/customer/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cl-root" style={{
      minHeight: "100vh", background: "linear-gradient(135deg, #fff0f8 0%, #f8f0ff 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 16px",
    }}>
      <div className="cl-card" style={{
        background: "#fff", borderRadius: 20,
        boxShadow: "0 20px 60px rgba(233,30,140,0.12), 0 4px 16px rgba(0,0,0,0.06)",
        padding: "40px 36px", width: "100%", maxWidth: 420,
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: "linear-gradient(135deg, #e91e8c, #c2185b)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.6rem", margin: "0 auto 16px",
            boxShadow: "0 6px 20px rgba(233,30,140,0.35)",
          }}>📋</div>
          <h1 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#111827", margin: "0 0 6px" }}>
            Track Your Orders
          </h1>
          <p style={{ fontSize: "0.88rem", color: "#6b7280", margin: 0 }}>
            Enter your mobile number to view all your bookings
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              Mobile Number
            </label>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                fontSize: "0.9rem", color: "#9ca3af",
              }}>📱</span>
              <input
                className="cl-input"
                style={{ paddingLeft: 38 }}
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={mobile}
                maxLength={10}
                onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "")); setError(""); }}
                autoFocus
              />
            </div>
          </div>

          {error && <div className="cl-error">⚠️ {error}</div>}

          <button className="cl-btn" type="submit" disabled={loading}>
            {loading
              ? <><span className="cl-spinner" style={{ width:18, height:18, border:"2.5px solid rgba(255,255,255,0.4)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block" }} /> Searching…</>
              : <><span>🔍</span> View My Bookings</>
            }
          </button>
        </form>

        <p style={{ textAlign:"center", fontSize:"0.8rem", color:"#9ca3af", marginTop:20, marginBottom:0 }}>
          No account needed — just your mobile number used during booking
        </p>
      </div>
    </div>
  );
};

export default CustomerLogin;