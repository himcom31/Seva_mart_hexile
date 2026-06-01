import { useState } from "react";

/**
 * ContactUs – ARUS LUMINA Pvt. Ltd.
 *
 * Real message sending via EmailJS (free tier — 200 emails/month).
 *
 * ── SETUP (one-time) ──────────────────────────────────────────
 * 1. Sign up at https://www.emailjs.com
 * 2. Add an Email Service (Gmail / Outlook / etc.) → note SERVICE_ID
 * 3. Create an Email Template with variables:
 *      {{from_name}}  {{from_email}}  {{phone}}  {{message}}
 *    → note TEMPLATE_ID
 * 4. Go to Account → API Keys → note PUBLIC_KEY
 * 5. Replace the three constants below with your real values.
 * ─────────────────────────────────────────────────────────────
 */

const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";   // e.g. "service_abc123"
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";  // e.g. "template_xyz456"
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";   // e.g. "user_AbCdEfGh"

// ── icons ──────────────────────────────────────────────────────
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5
      19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.24 2 2 0 0 1
      3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0
      1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.96-.93a2 2 0 0
      1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2
      2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ── info cards data ────────────────────────────────────────────
const INFO_CARDS = [
  { Icon: PhoneIcon, title: "Phone Number",   value: "7360050505" },
  { Icon: MailIcon,  title: "Email Address",  value: "info@aruslumina.com" },
  { Icon: PinIcon,   title: "Address",        value: "Patna, Bihar (All districts)" },
];

// ── input style helper ─────────────────────────────────────────
const inputStyle = (focused) => ({
  width: "100%",
  padding: "11px 14px",
  fontSize: 14,
  border: `1.5px solid ${focused ? "#e91e8c" : "#e5e7eb"}`,
  borderRadius: 8,
  outline: "none",
  background: "#fff",
  color: "#222",
  transition: "border-color 0.2s",
  fontFamily: "inherit",
  boxSizing: "border-box",
});

// ── main component ─────────────────────────────────────────────
export default function ContactUs() {
  const [form, setForm]       = useState({ name: "", email: "", phone: "", message: "" });
  const [focused, setFocused] = useState({});
  const [status, setStatus]   = useState("idle"); // idle | sending | success | error
  const [errMsg, setErrMsg]   = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus("sending");
    setErrMsg("");

    try {
      // Dynamically load EmailJS SDK (no npm install needed)
      if (!window.emailjs) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      }

      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name:  form.name,
        from_email: form.email,
        phone:      form.phone || "Not provided",
        message:    form.message,
        to_name:    "ARUS LUMINA",
      });

      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      setErrMsg("Failed to send. Please try again or call us directly.");
      setStatus("error");
    }
  };

  return (
    <div style={{
      fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif",
      background: "#f9f9f9",
      minHeight: "100vh",
      fontSize: 15,
      color: "#222",
    }}>

      {/* ── TOP BANNER ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 40px 0" }}>
          <h1 style={{
            fontFamily: "'Merriweather', 'Georgia', serif",
            fontSize: 30, fontWeight: 900, color: "#1a1a2e",
            textAlign: "center", letterSpacing: -0.5, margin: 0,
          }}>
            Contact Us
          </h1>
          <p style={{ textAlign: "center", fontSize: 13, color: "#888", marginTop: 6, paddingBottom: 14 }}>
            <span>Home</span>
            <span style={{ margin: "0 6px", color: "#bbb" }}>›</span>
            <span>Contact Us</span>
          </p>
        </div>
      </div>

      {/* ── PAGE BODY ── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 60px" }}>

        {/* ── INFO CARDS ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
          marginBottom: 48,
        }}>
          {INFO_CARDS.map(({ Icon, title, value }) => (
            <div key={title} style={{
              background: "#fff",
              border: "1px solid #ececec",
              borderRadius: 12,
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "#fce4ec",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Icon />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a2e" }}>{title}</div>
                <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          alignItems: "start",
        }}
          className="contact-grid"
        >

          {/* LEFT — image */}
          <div style={{
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
            background: "#ececec",
            minHeight: 420,
            display: "flex",
            alignItems: "stretch",
          }}>
            <img
              src="/banner1.png"
              alt="ARUS LUMINA Services"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>

          {/* RIGHT — form */}
          <div>
            <h2 style={{
              fontFamily: "'Merriweather', 'Georgia', serif",
              fontSize: 22, fontWeight: 900, color: "#1a1a2e",
              marginBottom: 24,
            }}>
              Get In Touch
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Name */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                  Your Name <span style={{ color: "#e91e8c" }}>*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setFocused(f => ({ ...f, name: true }))}
                  onBlur={() => setFocused(f => ({ ...f, name: false }))}
                  placeholder="Enter your name"
                  style={inputStyle(focused.name)}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                  Your Email Address <span style={{ color: "#e91e8c" }}>*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocused(f => ({ ...f, email: true }))}
                  onBlur={() => setFocused(f => ({ ...f, email: false }))}
                  placeholder="Enter your email address"
                  style={inputStyle(focused.email)}
                />
              </div>

              {/* Phone */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                  Your Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  onFocus={() => setFocused(f => ({ ...f, phone: true }))}
                  onBlur={() => setFocused(f => ({ ...f, phone: false }))}
                  placeholder="Enter your phone number"
                  style={inputStyle(focused.phone)}
                />
              </div>

              {/* Message */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                  Your Message <span style={{ color: "#e91e8c" }}>*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  onFocus={() => setFocused(f => ({ ...f, message: true }))}
                  onBlur={() => setFocused(f => ({ ...f, message: false }))}
                  placeholder="Type your message here"
                  rows={5}
                  style={{ ...inputStyle(focused.message), resize: "vertical", minHeight: 120 }}
                />
              </div>

              {/* Success message */}
              {status === "success" && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "#f0fdf4", border: "1px solid #bbf7d0",
                  borderRadius: 8, padding: "10px 14px",
                  fontSize: 13, color: "#16a34a", fontWeight: 600,
                }}>
                  <CheckIcon /> Message sent successfully! We'll get back to you soon.
                </div>
              )}

              {/* Error message */}
              {status === "error" && (
                <div style={{
                  background: "#fff1f2", border: "1px solid #fecdd3",
                  borderRadius: 8, padding: "10px 14px",
                  fontSize: 13, color: "#dc2626",
                }}>
                  {errMsg}
                </div>
              )}

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={status === "sending"}
                style={{
                  alignSelf: "flex-start",
                  display: "flex", alignItems: "center", gap: 8,
                  background: status === "sending" ? "#555" : "#1a1a2e",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 24px",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: status === "sending" ? "not-allowed" : "pointer",
                  letterSpacing: 0.3,
                  transition: "background 0.2s, transform 0.15s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={e => { if (status !== "sending") e.currentTarget.style.background = "#e91e8c"; }}
                onMouseLeave={e => { if (status !== "sending") e.currentTarget.style.background = "#1a1a2e"; }}
              >
                {status === "sending" ? (
                  <>
                    <span style={{
                      width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "#fff", borderRadius: "50%",
                      display: "inline-block", animation: "spin 0.7s linear infinite",
                    }} />
                    Sending…
                  </>
                ) : (
                  <><SendIcon /> Send Message</>
                )}
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}