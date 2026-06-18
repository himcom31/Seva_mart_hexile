// src/pages/User/CustomerDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

/* ── Inject styles ── */
const injectStyles = () => {
  if (document.getElementById("cust-dashboard-styles")) return;
  const style = document.createElement("style");
  style.id = "cust-dashboard-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    .cd-root * { box-sizing: border-box; }
    .cd-root { font-family: 'Plus Jakarta Sans', sans-serif; }

    @keyframes cd-fade-up {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .cd-animate { animation: cd-fade-up 0.3s ease both; }

    /* ── Header card ── */
    .cd-header-card {
      background: #fff;
      border: 1px solid #f0f0f0;
      border-radius: 14px;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    }
    .cd-avatar {
      width: 44px; height: 44px; border-radius: 50%;
      background: #ede9fe;
      display: flex; align-items: center; justify-content: center;
      font-size: 15px; font-weight: 700; color: #6d28d9;
      flex-shrink: 0;
    }

    /* ── Stats bar ── */
    .cd-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }
    @media (max-width: 480px) {
      .cd-stats { grid-template-columns: repeat(2, 1fr); }
    }
    .cd-stat {
      background: #fafafa;
      border: 1px solid #f0f0f0;
      border-radius: 10px;
      padding: 12px 14px;
    }
    .cd-stat-label { font-size: 11px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .cd-stat-val   { font-size: 22px; font-weight: 800; color: #111827; }

    /* ── Filter chips ── */
    .cd-filter-row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-bottom: 14px; }
    .cd-chip {
      padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;
      border: 1.5px solid #e5e7eb; background: #fff; color: #6b7280;
      cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 5px;
      font-family: inherit;
    }
    .cd-chip:hover { border-color: #e91e8c; color: #e91e8c; }
    .cd-chip.active { background: #e91e8c; border-color: #e91e8c; color: #fff; }

    /* ── Search + sort row ── */
    .cd-toolbar { display: flex; gap: 8px; align-items: center; margin-bottom: 14px; flex-wrap: wrap; }
    .cd-search-wrap { position: relative; flex: 1; min-width: 180px; }
    .cd-search-wrap svg {
      position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
      color: #9ca3af; pointer-events: none;
    }
    .cd-search {
      width: 100%; padding: 8px 12px 8px 34px;
      border: 1.5px solid #e5e7eb; border-radius: 9px;
      font-size: 13px; font-family: inherit; color: #111827;
      background: #fff; outline: none; transition: border-color 0.15s;
    }
    .cd-search:focus { border-color: #e91e8c; }
    .cd-sort {
      padding: 8px 12px; border-radius: 9px; font-size: 12px; font-weight: 600;
      border: 1.5px solid #e5e7eb; background: #fff; color: #6b7280;
      cursor: pointer; font-family: inherit; outline: none;
    }

    /* ── Booking card ── */
    .cd-booking-card {
      background: #fff;
      border: 1px solid #f0f0f0;
      border-radius: 12px;
      padding: 16px 18px;
      margin-bottom: 10px;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .cd-booking-card:hover {
      border-color: rgba(233,30,140,0.3);
      box-shadow: 0 4px 14px rgba(233,30,140,0.07);
    }

    .cd-booking-top {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 12px;
    }
    .cd-booking-num  { font-size: 11px; color: #9ca3af; font-weight: 600; margin-bottom: 3px; }
    .cd-booking-name { font-size: 14px; font-weight: 700; color: #111827; }
    .cd-booking-cat  { font-size: 12px; color: #e91e8c; font-weight: 500; margin-top: 2px; }

    /* ── Badges ── */
    .cd-badge {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 10px; border-radius: 20px;
      font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
    }
    .cd-badge-pending   { background: #fef3c7; color: #92400e; }
    .cd-badge-confirmed { background: #dbeafe; color: #1e40af; }
    .cd-badge-completed { background: #d1fae5; color: #065f46; }
    .cd-badge-cancelled { background: #fee2e2; color: #991b1b; }

    /* ── Booking meta grid ── */
    .cd-meta {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 5px 16px; font-size: 12px; color: #6b7280;
    }
    .cd-meta-item { display: flex; align-items: center; gap: 5px; }
    .cd-addr {
      margin-top: 10px; padding-top: 10px;
      border-top: 1px solid #f3f4f6;
      font-size: 11px; color: #9ca3af;
      display: flex; align-items: center; gap: 5px;
    }
    .cd-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
    .cd-tag {
      background: #fdf2f8; color: #e91e8c;
      border-radius: 6px; padding: 2px 8px;
      font-size: 11px; font-weight: 600;
    }
    .cd-booking-date { font-size: 11px; color: #d1d5db; margin-top: 8px; }

    /* ── Utility ── */
    .cd-error {
      background: #fff0f5; border: 1px solid #fca5a5;
      border-radius: 8px; padding: 10px 14px;
      color: #be123c; font-size: 0.84rem; font-weight: 500; margin-bottom: 14px;
    }
    .cd-empty { text-align: center; padding: 48px 0; color: #9ca3af; }
    .cd-empty-icon { font-size: 3rem; margin-bottom: 12px; }

    .cd-logout-btn {
      background: none; border: 1.5px solid #e5e7eb; border-radius: 8px;
      padding: 7px 16px; cursor: pointer; font-size: 12px; font-weight: 600;
      color: #6b7280; font-family: inherit; transition: all 0.15s;
      display: flex; align-items: center; gap: 6px;
    }
    .cd-logout-btn:hover { border-color: #e91e8c; color: #e91e8c; }

    .cd-refresh-btn {
      width: 100%; margin-top: 14px; padding: 10px;
      border-radius: 10px; border: 1.5px solid #f0f0f0;
      background: #fafafa; cursor: pointer; font-family: inherit;
      font-size: 13px; font-weight: 600; color: #6b7280;
      transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 6px;
    }
    .cd-refresh-btn:hover { border-color: #e91e8c; color: #e91e8c; }
    .cd-refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  `;
  document.head.appendChild(style);
};

/* ── Status badge ── */
const StatusBadge = ({ status }) => {
  const cls = {
    pending:   "cd-badge cd-badge-pending",
    confirmed: "cd-badge cd-badge-confirmed",
    completed: "cd-badge cd-badge-completed",
    cancelled: "cd-badge cd-badge-cancelled",
  }[status] || "cd-badge cd-badge-pending";

  const icons = { pending: "⏳", confirmed: "✅", completed: "🎉", cancelled: "❌" };

  return (
    <span className={cls}>
      {icons[status] || "📋"} {status}
    </span>
  );
};

/* ── Filter chips config ── */
const STATUS_FILTERS = [
  { label: "All",       value: "all",       icon: "🗂️" },
  { label: "Pending",   value: "pending",   icon: "⏳" },
  { label: "Confirmed", value: "confirmed", icon: "✅" },
  { label: "Completed", value: "completed", icon: "🎉" },
  { label: "Cancelled", value: "cancelled", icon: "❌" },
];

const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "A–Z",          value: "az"     },
  { label: "Z–A",          value: "za"     },
];

/* ── Main component ── */
const CustomerDashboard = () => {
  injectStyles();

  const navigate = useNavigate();
  const [mobile, setMobile]             = useState("");
  const [bookings, setBookings]         = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  /* filter + search + sort state */
  const [activeStatus, setActiveStatus] = useState("all");
  const [searchQuery, setSearchQuery]   = useState("");
  const [sortBy, setSortBy]             = useState("newest");

  useEffect(() => {
    const saved = localStorage.getItem("al_customer_mobile");
    if (!saved) { navigate("/user/customer/login"); return; }
    setMobile(saved);
    fetchBookings(saved);
  }, [navigate]);

  const fetchBookings = async (mob) => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`${API_BASE}/book/customer/${mob}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No bookings found");
      setBookings(data.bookings || []);
      if (data.bookings?.length > 0) setCustomerName(data.bookings[0].full_name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("al_customer_mobile");
    navigate("/user/home");
  };

  /* ── Derived counts for stat bar ── */
  const counts = useMemo(() => ({
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === "pending").length,
    completed: bookings.filter(b => b.status === "completed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
  }), [bookings]);

  /* ── Filtered + sorted bookings ── */
  const filtered = useMemo(() => {
    let list = [...bookings];

    /* status filter */
    if (activeStatus !== "all") list = list.filter(b => b.status === activeStatus);

    /* search */
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(b =>
        b.service_name?.toLowerCase().includes(q) ||
        b.booking_number?.toLowerCase().includes(q) ||
        b.category_name?.toLowerCase().includes(q) ||
        b.city?.toLowerCase().includes(q) ||
        b.vendor_name?.toLowerCase().includes(q)
      );
    }

    /* sort */
    list.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "az")     return a.service_name.localeCompare(b.service_name);
      if (sortBy === "za")     return b.service_name.localeCompare(a.service_name);
      return 0;
    });

    return list;
  }, [bookings, activeStatus, searchQuery, sortBy]);

  /* ── Initials helper ── */
  const initials = (name) =>
    name ? name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase() : "CU";

  return (
    <div
      className="cd-root"
      style={{
        minHeight: "100vh",
        background: "#f9f9fb",
        padding: "24px 16px",
      }}
    >
      <div
        className="cd-animate"
        style={{ maxWidth: 640, margin: "0 auto" }}
      >
        {/* ── Header ── */}
        <div className="cd-header-card">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="cd-avatar">{initials(customerName)}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                {customerName || "Customer"}
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                📱 {mobile}
              </div>
            </div>
          </div>
          <button className="cd-logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>

        {/* ── Stat bar ── */}
        <div className="cd-stats">
          {[
            { label: "Total",     val: counts.total,     color: "#111827" },
            { label: "Pending",   val: counts.pending,   color: "#92400e" },
            { label: "Completed", val: counts.completed, color: "#065f46" },
            { label: "Cancelled", val: counts.cancelled, color: "#991b1b" },
          ].map(({ label, val, color }) => (
            <div className="cd-stat" key={label}>
              <div className="cd-stat-label">{label}</div>
              <div className="cd-stat-val" style={{ color }}>{val}</div>
            </div>
          ))}
        </div>

        {/* ── Search + Sort ── */}
        <div className="cd-toolbar">
          <div className="cd-search-wrap">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="cd-search"
              placeholder="Search service, booking #, city…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="cd-sort"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* ── Status filter chips ── */}
        <div className="cd-filter-row">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              className={`cd-chip${activeStatus === f.value ? " active" : ""}`}
              onClick={() => setActiveStatus(f.value)}
            >
              {f.icon} {f.label}
              {f.value !== "all" && (
                <span style={{
                  background: activeStatus === f.value ? "rgba(255,255,255,0.25)" : "#f3f4f6",
                  color: activeStatus === f.value ? "#fff" : "#6b7280",
                  borderRadius: 10, padding: "0 5px", fontSize: 10, fontWeight: 700,
                }}>
                  {bookings.filter(b => b.status === f.value).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Error ── */}
        {error && <div className="cd-error">⚠️ {error}</div>}

        {/* ── Loading skeleton ── */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af", fontSize: 14 }}>
            🔄 Loading your bookings…
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && filtered.length === 0 && !error && (
          <div className="cd-empty">
            <div className="cd-empty-icon">📭</div>
            <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
              {searchQuery || activeStatus !== "all"
                ? "No bookings match your filter."
                : "No bookings found for this number."}
            </p>
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setActiveStatus("all"); }}
                style={{
                  marginTop: 10, background: "none", border: "1.5px solid #e5e7eb",
                  borderRadius: 8, padding: "6px 14px", cursor: "pointer",
                  fontSize: 12, fontWeight: 600, color: "#6b7280", fontFamily: "inherit",
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* ── Booking cards ── */}
        {!loading && filtered.map((b, idx) => (
          <div
            key={b.id}
            className="cd-booking-card cd-animate"
            style={{ animationDelay: `${idx * 0.04}s` }}
          >
            <div className="cd-booking-top">
              <div>
                <div className="cd-booking-num">#{b.booking_number}</div>
                <div className="cd-booking-name">{b.service_name}</div>
                {b.category_name && (
                  <div className="cd-booking-cat">📂 {b.category_name}</div>
                )}
              </div>
              <StatusBadge status={b.status} />
            </div>

            <div className="cd-meta">
              <span className="cd-meta-item">📅 {b.preferred_date}</span>
              <span className="cd-meta-item">🕐 {b.preferred_time}</span>
              <span className="cd-meta-item">📍 {b.city}</span>
              {b.vendor_name && (
                <span className="cd-meta-item">🔧 {b.vendor_name}</span>
              )}
            </div>

            {b.address && (
              <div className="cd-addr">
                📌 {b.address}{b.landmark ? `, ${b.landmark}` : ""}
              </div>
            )}

            {b.selected_sub_services?.length > 0 && (
              <div className="cd-tags">
                {b.selected_sub_services.map((s, i) => (
                  <span key={i} className="cd-tag">{s.name}</span>
                ))}
              </div>
            )}

            <div className="cd-booking-date">
              Booked:{" "}
              {new Date(b.created_at).toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", year: "numeric",
              })}
            </div>
          </div>
        ))}

        {/* ── Refresh button ── */}
        <button
          className="cd-refresh-btn"
          onClick={() => fetchBookings(mobile)}
          disabled={loading}
        >
          🔄 {loading ? "Refreshing…" : "Refresh Bookings"}
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboard;