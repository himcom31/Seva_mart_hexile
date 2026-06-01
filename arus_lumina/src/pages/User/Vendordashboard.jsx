// src/Components/Vendor/VendorDashboard.jsx
import { useState, useEffect } from "react";

const API_BASE1 = import.meta.env.VITE_API_URL;

const API_BASE    =  `${API_BASE1}/api`;
const SERVER_BASE =  `${API_BASE1}`;

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:   { label: "Pending",   bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
  confirmed: { label: "Confirmed", bg: "#DBEAFE", color: "#1E40AF", dot: "#3B82F6" },
  completed: { label: "Completed", bg: "#D1FAE5", color: "#065F46", dot: "#10B981" },
  cancelled: { label: "Cancelled", bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444" },
};

// ── Shared localStorage keys (must match VendorLogin.jsx) ────────────────────
const TOKEN_KEY = "vendorToken";
const INFO_KEY  = "vendorInfo";

const getToken      = () => localStorage.getItem(TOKEN_KEY);
const getCachedInfo = () => {
  try { return JSON.parse(localStorage.getItem(INFO_KEY) || "null"); }
  catch { return null; }
};

// ── Login route — must match your React Router config ────────────────────────
const LOGIN_ROUTE = "/";

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = {
  calendar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  phone: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.21 9.11 19.79 19.79 0 01.14 1a2 2 0 012-2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  ),
  location: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  clock: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  briefcase: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
    </svg>
  ),
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  tag: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  logout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  note: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, accent, icon }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14,
      padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: accent + "18", color: accent,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: "0.73rem", color: "#6b7280", marginTop: 3, fontWeight: 500, whiteSpace: "nowrap" }}>{label}</div>
      </div>
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: cfg.bg, color: cfg.color,
      fontSize: "0.72rem", fontWeight: 700,
      padding: "4px 10px", borderRadius: 20,
      textTransform: "capitalize", whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

// ── Booking Detail Modal ──────────────────────────────────────────────────────
function BookingDetailModal({ booking, onClose }) {
  if (!booking) return null;
  const subServices = (() => {
    try {
      return typeof booking.selected_sub_services === "string"
        ? JSON.parse(booking.selected_sub_services)
        : (booking.selected_sub_services || []);
    } catch { return []; }
  })();

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(10,10,20,0.6)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      padding: 0, animation: "vdFadeIn 0.18s ease",
    }} onClick={onClose}>
      <div style={{
        background: "#fff",
        borderRadius: "20px 20px 0 0",
        width: "100%",
        maxWidth: 540,
        maxHeight: "92vh",
        overflowY: "auto",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.2)",
        animation: "vdSlideUpModal 0.25s ease",
        paddingBottom: "env(safe-area-inset-bottom, 16px)",
      }} onClick={e => e.stopPropagation()}>

        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "#e5e7eb" }} />
        </div>

        {/* Header */}
        <div style={{
          padding: "12px 20px 14px",
          borderBottom: "1px solid #f3f4f6",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
        }}>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6366f1", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
              Booking Details
            </div>
            <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#111827" }}>
              {booking.booking_number}
            </h3>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <StatusBadge status={booking.status} />
            <button onClick={onClose} style={{
              background: "#f3f4f6", border: "none", borderRadius: "50%",
              width: 30, height: 30, cursor: "pointer", fontSize: "0.9rem",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>
        </div>

        <div style={{ padding: "18px 20px 24px", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Service Info */}
          <Section title="Service">
            <InfoRow icon={Icon.briefcase} label="Service"  value={booking.service_name} />
            {booking.category_name && <InfoRow icon={Icon.tag} label="Category" value={booking.category_name} />}
            {booking.service_code  && <InfoRow icon={Icon.tag} label="Code"     value={`#${booking.service_code}`} />}
          </Section>

          {/* Customer Info */}
          <Section title="Customer">
            <InfoRow icon={Icon.user}     label="Name"    value={booking.full_name} />
            <InfoRow icon={Icon.phone}    label="Mobile"  value={booking.mobile} />
            <InfoRow icon={Icon.location} label="Address" value={[booking.address, booking.landmark, booking.city].filter(Boolean).join(", ")} />
          </Section>

          {/* Schedule */}
          <Section title="Schedule">
            <InfoRow icon={Icon.calendar} label="Date" value={new Date(booking.preferred_date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} />
            <InfoRow icon={Icon.clock}    label="Time" value={booking.preferred_time} />
          </Section>

          {/* Sub-services */}
          {subServices.length > 0 && (
            <Section title="Sub-Services Requested">
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {subServices.map((ss, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 12px", background: "#f0fdf4",
                    border: "1px solid #bbf7d0", borderRadius: 8,
                    fontSize: "0.85rem", color: "#065F46", fontWeight: 600,
                  }}>
                    <span style={{ color: "#10B981" }}>{Icon.check}</span>
                    {ss.name || ss}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Notes */}
          {booking.notes && (
            <Section title="Notes from Customer">
              <div style={{
                padding: "12px 14px", background: "#fffbeb",
                border: "1px solid #fde68a", borderRadius: 10,
                fontSize: "0.875rem", color: "#78350f", lineHeight: 1.6,
                display: "flex", gap: 8,
              }}>
                <span style={{ color: "#F59E0B", flexShrink: 0, marginTop: 1 }}>{Icon.note}</span>
                {booking.notes}
              </div>
            </Section>
          )}

          {/* Booked on */}
          <div style={{ fontSize: "0.75rem", color: "#9ca3af", textAlign: "center" }}>
            Booked on {new Date(booking.created_at).toLocaleString("en-IN")}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div style={{
        fontSize: "0.72rem", fontWeight: 700, color: "#9ca3af",
        textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10,
      }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <span style={{ color: "#9ca3af", flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: "0.72rem", color: "#9ca3af", fontWeight: 600 }}>{label}: </span>
        <span style={{ fontSize: "0.875rem", color: "#111827", fontWeight: 600, wordBreak: "break-word" }}>{value || "—"}</span>
      </div>
    </div>
  );
}

// ── Booking Card ──────────────────────────────────────────────────────────────
function BookingCard({ booking, onViewDetail }) {
  const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
  const subServices = (() => {
    try {
      return typeof booking.selected_sub_services === "string"
        ? JSON.parse(booking.selected_sub_services)
        : (booking.selected_sub_services || []);
    } catch { return []; }
  })();

  return (
    <div style={{
      background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16,
      overflow: "hidden", transition: "box-shadow 0.2s, transform 0.2s",
      boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
      display: "flex", flexDirection: "column",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "none"; }}
    >
      {/* Top accent bar */}
      <div style={{ height: 4, background: cfg.dot, width: "100%" }} />

      <div style={{ padding: "14px 16px", flex: 1 }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#6366f1", letterSpacing: "0.05em", marginBottom: 2 }}>
              {booking.booking_number}
            </div>
            <h4 style={{ margin: 0, fontSize: "0.92rem", fontWeight: 800, color: "#111827", lineHeight: 1.3, wordBreak: "break-word" }}>
              {booking.service_name}
            </h4>
            {booking.category_name && (
              <span style={{
                display: "inline-block", marginTop: 4,
                fontSize: "0.68rem", fontWeight: 600,
                background: "#ede9fe", color: "#6d28d9",
                padding: "2px 8px", borderRadius: 20,
              }}>{booking.category_name}</span>
            )}
          </div>
          <div style={{ flexShrink: 0 }}>
            <StatusBadge status={booking.status} />
          </div>
        </div>

        {/* Customer */}
        <div style={{
          background: "#f8f9fc", borderRadius: 10, padding: "10px 12px",
          marginBottom: 12, display: "flex", flexDirection: "column", gap: 6,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.82rem", color: "#374151" }}>
            <span style={{ color: "#6366f1", flexShrink: 0 }}>{Icon.user}</span>
            <span style={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{booking.full_name}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.8rem", color: "#6b7280" }}>
            <span style={{ flexShrink: 0 }}>{Icon.phone}</span>
            <span>{booking.mobile}</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: "0.78rem", color: "#6b7280" }}>
            <span style={{ marginTop: 1, flexShrink: 0 }}>{Icon.location}</span>
            <span style={{ lineHeight: 1.4, wordBreak: "break-word" }}>
              {[booking.address, booking.landmark, booking.city].filter(Boolean).join(", ")}
            </span>
          </div>
        </div>

        {/* Schedule */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            fontSize: "0.76rem", color: "#374151", fontWeight: 600,
            background: "#f0f4ff", padding: "5px 10px", borderRadius: 8,
          }}>
            <span style={{ color: "#6366f1", flexShrink: 0 }}>{Icon.calendar}</span>
            {new Date(booking.preferred_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            fontSize: "0.76rem", color: "#374151", fontWeight: 600,
            background: "#f0f4ff", padding: "5px 10px", borderRadius: 8,
          }}>
            <span style={{ color: "#6366f1", flexShrink: 0 }}>{Icon.clock}</span>
            {booking.preferred_time}
          </div>
        </div>

        {/* Sub-services preview */}
        {subServices.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
            {subServices.slice(0, 3).map((ss, i) => (
              <span key={i} style={{
                fontSize: "0.7rem", fontWeight: 600,
                background: "#f0fdf4", color: "#065F46",
                border: "1px solid #bbf7d0",
                padding: "2px 8px", borderRadius: 20,
              }}>{ss.name || ss}</span>
            ))}
            {subServices.length > 3 && (
              <span style={{
                fontSize: "0.7rem", fontWeight: 600, color: "#6b7280",
                background: "#f3f4f6", padding: "2px 8px", borderRadius: 20,
              }}>+{subServices.length - 3} more</span>
            )}
          </div>
        )}

        {/* Notes preview */}
        {booking.notes && (
          <div style={{
            fontSize: "0.78rem", color: "#78350f",
            background: "#fffbeb", border: "1px solid #fde68a",
            borderRadius: 8, padding: "7px 10px",
            marginBottom: 12, lineHeight: 1.5,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            📝 {booking.notes}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #f3f4f6" }}>
        <button
          onClick={() => onViewDetail(booking)}
          style={{
            width: "100%", padding: "11px",
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            color: "#fff", border: "none", borderRadius: 10,
            fontSize: "0.82rem", fontWeight: 700, cursor: "pointer",
            fontFamily: "inherit", transition: "opacity 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          View Full Details
        </button>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function VendorDashboard() {
  const [vendor,          setVendor]          = useState(null);
  const [bookings,        setBookings]         = useState([]);
  const [loading,         setLoading]          = useState(true);
  const [error,           setError]            = useState(null);
  const [activeFilter,    setActiveFilter]     = useState("all");
  const [selectedBooking, setSelectedBooking]  = useState(null);

  useEffect(() => {
    const load = async () => {
      const token = getToken();

      if (!token) {
        window.location.href = LOGIN_ROUTE;
        return;
      }

      const cached = getCachedInfo();
      if (cached) setVendor(cached);

      try {
        setLoading(true);

        const meRes = await fetch(`${API_BASE}/vendors/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (meRes.status === 401 || meRes.status === 403) {
          handleLogout();
          return;
        }

        const meData = await meRes.json();
        setVendor(meData.vendor);
        localStorage.setItem(INFO_KEY, JSON.stringify(meData.vendor));

        const bRes = await fetch(`${API_BASE}/book/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (bRes.ok) {
          const bData = await bRes.json();
          const allBookings = bData.bookings || [];
          const myBookings  = allBookings.filter(
            b => String(b.vendor_id) === String(meData.vendor?.id)
          );
          setBookings(myBookings);
        } else {
          setBookings([]);
        }
      } catch {
        setError("Failed to load dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(INFO_KEY);
    window.location.href = LOGIN_ROUTE;
  };

  const filtered = activeFilter === "all"
    ? bookings
    : bookings.filter(b => b.status === activeFilter);

  const stats = {
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    completed: bookings.filter(b => b.status === "completed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
  };

  const profileImg = vendor?.profile_photo
    ? `${SERVER_BASE}/uploads/vendors/${vendor.profile_photo}`
    : null;

  const FILTERS = [
    { key: "all",       label: "All",       count: stats.total },
    { key: "pending",   label: "Pending",   count: stats.pending },
    { key: "confirmed", label: "Confirmed", count: stats.confirmed },
    { key: "completed", label: "Completed", count: stats.completed },
    { key: "cancelled", label: "Cancelled", count: stats.cancelled },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f4f5f7; }

        @keyframes vdFadeIn      { from{opacity:0} to{opacity:1} }
        @keyframes vdSlideUpModal{ from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:none} }
        @keyframes vdSpin        { to{transform:rotate(360deg)} }

        .vd-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #f4f5f7;
          min-height: 100vh;
        }
        .vd-spinner {
          width: 36px; height: 36px;
          border: 3px solid #e5e7eb;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: vdSpin 0.7s linear infinite;
        }

        /* ── Filter tabs row ── */
        .filter-scroll {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-bottom: 2px;
        }
        .filter-scroll::-webkit-scrollbar { display: none; }

        .filter-tab {
          padding: 7px 14px;
          border-radius: 9px;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          font-size: 0.8rem;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .filter-tab:hover { border-color: #6366f1; color: #6366f1; }
        .filter-tab.active { background: #6366f1; border-color: #6366f1; color: #fff; }
        .filter-tab.active .tab-count { background: rgba(255,255,255,0.25); color: #fff; }
        .tab-count {
          font-size: 0.68rem;
          background: #f3f4f6;
          color: #6b7280;
          padding: 1px 6px;
          border-radius: 20px;
          font-weight: 700;
        }

        /* ── Grids ── */
        .vd-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }
        .vd-booking-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        /* ── Topbar inner ── */
        .vd-header-inner {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        /* ── Welcome banner ── */
        .vd-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: nowrap;
        }
        .vd-banner-right {
          text-align: right;
          flex-shrink: 0;
        }

        /* ── Logout btn ── */
        .vd-logout-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 9px;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          color: #374151;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          white-space: nowrap;
        }

        /* ── Availability badge ── */
        .vd-avail-badge {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
          white-space: nowrap;
        }

        /* ── TABLET: ≤ 900px ── */
        @media (max-width: 900px) {
          .vd-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
        }

        /* ── MOBILE: ≤ 640px ── */
        @media (max-width: 640px) {
          .vd-header-inner {
            height: auto;
            padding: 10px 0;
            flex-wrap: nowrap;
          }
          .vd-avail-badge {
            display: none; /* hide on tiny screens to prevent overflow */
          }
          .vd-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 20px;
          }
          .vd-booking-grid {
            grid-template-columns: 1fr;
          }
          .vd-banner {
            flex-direction: column;
            align-items: flex-start;
          }
          .vd-banner-right {
            text-align: left;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 4px;
          }
          .vd-banner-right-label {
            font-size: 0.72rem;
            color: rgba(255,255,255,0.65);
          }
          .vd-banner-right-count {
            font-size: 2rem !important;
          }
          .vd-logout-btn span.vd-logout-text {
            display: none; /* show icon only on very small screens */
          }
          .vd-logout-btn {
            padding: 8px 10px;
          }
        }

        /* ── X-SMALL: ≤ 400px ── */
        @media (max-width: 400px) {
          .vd-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
        }
      `}</style>

      <div className="vd-root">

        {/* ── Topbar ── */}
        <header style={{
          background: "#fff", borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
            <div className="vd-header-inner">
              {/* Logo + Vendor name */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.95rem", color: "#fff", fontWeight: 800, flexShrink: 0,
                }}>
                  {vendor?.name?.charAt(0)?.toUpperCase() || "V"}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Vendor Portal
                  </div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#111827", lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {vendor?.name || "Loading…"}
                  </div>
                </div>
              </div>

              {/* Right side: availability + logout */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                {vendor && (
                  <span
                    className="vd-avail-badge"
                    style={{
                      background: vendor.is_available ? "#d1fae5" : "#fee2e2",
                      color:      vendor.is_available ? "#065f46" : "#991b1b",
                    }}
                  >
                    {vendor.is_available ? "● Available" : "● Unavailable"}
                  </span>
                )}
                <button
                  className="vd-logout-btn"
                  onClick={handleLogout}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}
                >
                  {Icon.logout}
                  <span className="vd-logout-text">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 16px 60px" }}>

          {/* ── Welcome Banner ── */}
          {vendor && (
            <div style={{
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)",
              borderRadius: 16, padding: "20px 22px", marginBottom: 22,
              boxShadow: "0 8px 32px rgba(99,102,241,0.3)",
            }}>
              <div className="vd-banner">
                <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: 13,
                    background: "rgba(255,255,255,0.2)",
                    border: "2px solid rgba(255,255,255,0.35)",
                    overflow: "hidden", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.3rem", fontWeight: 800, color: "#fff",
                  }}>
                    {profileImg
                      ? <img src={profileImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
                      : vendor.name?.charAt(0)?.toUpperCase()
                    }
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", fontWeight: 600, marginBottom: 2 }}>
                      Welcome back 👋
                    </div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {vendor.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
                      {vendor.category_name || "Service Provider"} · {vendor.city}
                    </div>
                  </div>
                </div>

                <div className="vd-banner-right">
                  <span className="vd-banner-right-label" style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.65)", display: "block", marginBottom: 2 }}>
                    Total Assigned Bookings
                  </span>
                  <span className="vd-banner-right-count" style={{ fontSize: "2.2rem", fontWeight: 900, color: "#fff", lineHeight: 1, display: "block" }}>
                    {stats.total}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── Stats ── */}
          <div className="vd-stats-grid">
            <StatCard label="Pending"   value={stats.pending}   accent="#F59E0B" icon={Icon.clock} />
            <StatCard label="Confirmed" value={stats.confirmed} accent="#3B82F6" icon={Icon.check} />
            <StatCard label="Completed" value={stats.completed} accent="#10B981" icon={Icon.briefcase} />
            <StatCard label="Cancelled" value={stats.cancelled} accent="#EF4444" icon={Icon.tag} />
          </div>

          {/* ── Filter Tabs (horizontally scrollable) ── */}
          <div style={{ marginBottom: 18 }}>
            <div className="filter-scroll">
              <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#9ca3af", flexShrink: 0 }}>
                Filter:
              </span>
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  className={`filter-tab ${activeFilter === f.key ? "active" : ""}`}
                  onClick={() => setActiveFilter(f.key)}
                >
                  {f.label}
                  <span className="tab-count">{f.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Content ── */}
          {loading ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: "80px 20px", gap: 16,
            }}>
              <div className="vd-spinner" />
              <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>Loading your bookings…</p>
            </div>
          ) : error ? (
            <div style={{
              textAlign: "center", padding: "60px 20px",
              background: "#fff", borderRadius: 16, border: "1px solid #fee2e2",
            }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>⚠️</div>
              <p style={{ color: "#dc2626", fontWeight: 600, marginBottom: 16 }}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "10px 24px", background: "#6366f1", color: "#fff",
                  border: "none", borderRadius: 9, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "60px 16px",
              background: "#fff", borderRadius: 16, border: "1px dashed #e5e7eb",
            }}>
              <div style={{ fontSize: "3rem", marginBottom: 14 }}>📋</div>
              <h3 style={{ color: "#374151", fontWeight: 800, marginBottom: 8, fontSize: "1rem" }}>
                {activeFilter === "all" ? "No Bookings Assigned Yet" : `No ${activeFilter} bookings`}
              </h3>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
                {activeFilter === "all"
                  ? "The admin will assign bookings to you. Check back soon."
                  : `You have no ${activeFilter} bookings at the moment.`}
              </p>
              {activeFilter !== "all" && (
                <button
                  onClick={() => setActiveFilter("all")}
                  style={{
                    marginTop: 16, padding: "9px 20px",
                    background: "#6366f1", color: "#fff",
                    border: "none", borderRadius: 9,
                    fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                  }}
                >View All</button>
              )}
            </div>
          ) : (
            <>
              <div style={{ fontSize: "0.82rem", color: "#6b7280", fontWeight: 600, marginBottom: 14 }}>
                Showing {filtered.length} booking{filtered.length !== 1 ? "s" : ""}
                {activeFilter !== "all" ? ` · ${activeFilter}` : ""}
              </div>
              <div className="vd-booking-grid">
                {filtered.map(b => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    onViewDetail={setSelectedBooking}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Detail Modal (bottom sheet on mobile) ── */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </>
  );
}