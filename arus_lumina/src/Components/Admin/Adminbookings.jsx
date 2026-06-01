import { useState, useEffect, useCallback } from "react";

const API_BASE121 = import.meta.env.VITE_API_URL;

const API_BASE = `${API_BASE121}/api`;


// ── Auth helper ───────────────────────────────────────────────────────────────
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("al_token") || ""}`,
});

// ── Constants ─────────────────────────────────────────────────────────────────
const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

const STATUS_STYLES = {
  pending:   { bg: "#fef3c7", color: "#d97706", dot: "#f59e0b" },
  confirmed: { bg: "#dbeafe", color: "#2563eb", dot: "#3b82f6" },
  completed: { bg: "#dcfce7", color: "#16a34a", dot: "#22c55e" },
  cancelled: { bg: "#fee2e2", color: "#dc2626", dot: "#ef4444" },
};

const fmt = (ymd) => {
  if (!ymd) return "—";
  const [y, m, d] = ymd.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d} ${months[parseInt(m) - 1]} ${y}`;
};

const fmtPrice = (price) => {
  if (price === null || price === undefined || price === "") return null;
  const num = parseFloat(price);
  if (isNaN(num)) return null;
  return `₹${num.toLocaleString("en-IN")}`;
};

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || { bg: "#f3f4f6", color: "#6b7280", dot: "#9ca3af" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color,
      padding: "3px 10px", borderRadius: 20,
      fontSize: "0.72rem", fontWeight: 700, textTransform: "capitalize",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, color, icon }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14,
      padding: "18px 20px", display: "flex", alignItems: "center", gap: 14,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: 12, background: color + "20",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.3rem", flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>{value ?? "—"}</div>
        <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: 3 }}>{label}</div>
      </div>
    </div>
  );
}

// ── Booking Detail Drawer ─────────────────────────────────────────────────────
function BookingDrawer({ booking, vendors, onClose, onStatusChange, onDelete, onVendorAssign }) {
  const [status,        setStatus]        = useState(booking.status);
  const [saving,        setSaving]        = useState(false);
  const [deleting,      setDeleting]      = useState(false);
  const [confirm,       setConfirm]       = useState(false);

  // Vendor assignment state
  const [vendorMode,    setVendorMode]    = useState(false);
  const [vendorSearch,  setVendorSearch]  = useState("");
  const [selectedVid,   setSelectedVid]   = useState(booking.vendor_id   || null);
  const [selectedVName, setSelectedVName] = useState(booking.vendor_name || "");
  const [assigning,     setAssigning]     = useState(false);
  const [vendorMsg,     setVendorMsg]     = useState("");

  // ── Parse selected_sub_services ───────────────────────────────────────────
  const subServices = (() => {
    if (!booking.selected_sub_services) return [];
    if (Array.isArray(booking.selected_sub_services)) return booking.selected_sub_services;
    try { return JSON.parse(booking.selected_sub_services); } catch { return []; }
  })();

  // ── Total price of selected sub-services ─────────────────────────────────
  const subServicesTotal = subServices.reduce((sum, ss) => {
    const p = parseFloat(ss.price);
    return isNaN(p) ? sum : sum + p;
  }, 0);

  // Filter vendors list by search
  const filteredVendors = (vendors || []).filter(v =>
    v.name?.toLowerCase().includes(vendorSearch.toLowerCase()) ||
    v.mobile?.includes(vendorSearch) ||
    String(v.id).includes(vendorSearch)
  );

  const handleStatusSave = async () => {
    if (status === booking.status) return onClose();
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/book/${booking.id}/status`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onStatusChange(data.booking);
      onClose();
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/book/${booking.id}`, {
        method: "DELETE", headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Delete failed");
      onDelete(booking.id);
      onClose();
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleAssignVendor = async () => {
    if (!selectedVid) return;
    setAssigning(true);
    setVendorMsg("");
    try {
      const res = await fetch(`${API_BASE}/book/${booking.id}/assign-vendor`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ vendor_id: selectedVid, vendor_name: selectedVName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onVendorAssign(data.booking);
      setVendorMsg("✓ Vendor assigned successfully");
      setVendorMode(false);
    } catch (e) {
      setVendorMsg("✗ " + e.message);
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveVendor = async () => {
    setAssigning(true);
    setVendorMsg("");
    try {
      const res = await fetch(`${API_BASE}/book/${booking.id}/assign-vendor`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ vendor_id: null, vendor_name: null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSelectedVid(null);
      setSelectedVName("");
      onVendorAssign(data.booking);
      setVendorMsg("✓ Vendor removed");
    } catch (e) {
      setVendorMsg("✗ " + e.message);
    } finally {
      setAssigning(false);
    }
  };

  const Row = ({ label, value }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
      <span style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: 600, minWidth: 120 }}>{label}</span>
      <span style={{ fontSize: "0.875rem", color: "#111827", fontWeight: 500, textAlign: "right", flex: 1 }}>{value || "—"}</span>
    </div>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 3000,
      display: "flex", alignItems: "flex-start", justifyContent: "flex-end",
    }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "absolute", inset: 0,
        background: "rgba(10,10,25,0.45)", backdropFilter: "blur(3px)",
      }} />

      {/* Drawer */}
      <div style={{
        position: "relative", width: 440, height: "100vh",
        background: "#fff", boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
        display: "flex", flexDirection: "column", overflowY: "auto",
        animation: "drawerIn 0.25s cubic-bezier(0.34,1.2,0.64,1)",
      }}>
        <style>{`@keyframes drawerIn { from { transform: translateX(100%); } to { transform: none; } }`}</style>

        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f3f4f6",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#9ca3af",
              textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Booking Details</div>
            <div style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>
              {booking.booking_number}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "#f3f4f6", border: "none", borderRadius: "50%",
            width: 34, height: 34, cursor: "pointer", fontSize: "0.85rem",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>

          {/* Service Info */}
          <div style={{ background: "linear-gradient(135deg,#f0f4ff,#fff5fb)",
            border: "1px solid #e8eaf6", borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9ca3af",
              textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Service</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#111827" }}>{booking.service_name}</div>
            {booking.category_name && (
              <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: 2 }}>
                in <strong>{booking.category_name}</strong>
              </div>
            )}
            {booking.service_code && (
              <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: 4 }}>
                Code: #{booking.service_code}
              </div>
            )}
          </div>

          {/* ── Selected Sub-Services ─────────────────────────────────────────── */}
          <div style={{ marginBottom: 20 }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 10,
            }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9ca3af",
                textTransform: "uppercase", letterSpacing: 1 }}>
                Selected Sub-Services
              </div>
              {subServices.length > 0 && (
                <span style={{
                  fontSize: "0.7rem", fontWeight: 700, color: "#6366f1",
                  background: "#eef2ff", border: "1px solid #c7d2fe",
                  padding: "2px 8px", borderRadius: 20,
                }}>
                  {subServices.length} selected
                </span>
              )}
            </div>

            {subServices.length === 0 ? (
              <div style={{
                background: "#f9fafb", border: "1.5px dashed #d1d5db",
                borderRadius: 10, padding: "14px 16px",
                fontSize: "0.85rem", color: "#9ca3af", textAlign: "center",
              }}>
                No sub-services selected
              </div>
            ) : (
              <div style={{
                border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden",
                background: "#fff",
              }}>
                {subServices.map((ss, idx) => {
                  const price = fmtPrice(ss.price);
                  const isLast = idx === subServices.length - 1;
                  return (
                    <div key={ss.id ?? idx} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "11px 14px",
                      borderBottom: isLast ? "none" : "1px solid #f3f4f6",
                      background: idx % 2 === 0 ? "#fff" : "#fafafa",
                    }}>
                      {/* Left: index dot + name */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                          background: ss.name === "Others"
                            ? "linear-gradient(135deg,#e5e7eb,#d1d5db)"
                            : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: ss.name === "Others" ? "#6b7280" : "#fff",
                          fontSize: "0.65rem", fontWeight: 800,
                        }}>
                          {idx + 1}
                        </div>
                        <span style={{
                          fontSize: "0.875rem", fontWeight: 600, color: "#111827",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {ss.name}
                        </span>
                      </div>

                      {/* Right: price */}
                      <div style={{ flexShrink: 0, marginLeft: 10 }}>
                        {price ? (
                          <span style={{
                            fontSize: "0.85rem", fontWeight: 700, color: "#16a34a",
                            background: "#f0fdf4", border: "1px solid #bbf7d0",
                            padding: "3px 10px", borderRadius: 20,
                          }}>
                            {price}
                          </span>
                        ) : (
                          <span style={{
                            fontSize: "0.78rem", color: "#9ca3af",
                            fontStyle: "italic",
                          }}>
                            {ss.name === "Others" ? "Custom" : "Price on request"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Total row — only if at least one item has a price */}
                {subServicesTotal > 0 && (
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "11px 14px",
                    borderTop: "2px solid #e5e7eb",
                    background: "#f9fafb",
                  }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#374151" }}>
                      Estimated Total
                    </span>
                    <span style={{
                      fontSize: "0.95rem", fontWeight: 800, color: "#111827",
                    }}>
                      ₹{subServicesTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* ── End Selected Sub-Services ─────────────────────────────────────── */}

          {/* Customer Info */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9ca3af",
              textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Customer</div>
            <Row label="Full Name"  value={booking.full_name} />
            <Row label="Mobile"     value={booking.mobile} />
            <Row label="Address"    value={booking.address} />
            <Row label="Landmark"   value={booking.landmark} />
            <Row label="City"       value={booking.city} />
          </div>

          {/* Schedule */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9ca3af",
              textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Schedule</div>
            <Row label="Preferred Date" value={fmt(booking.preferred_date)} />
            <Row label="Preferred Time" value={booking.preferred_time} />
            <Row label="Booked On"      value={booking.created_at ? new Date(booking.created_at).toLocaleString() : "—"} />
          </div>

          {/* Notes */}
          {booking.notes && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9ca3af",
                textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Notes</div>
              <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10,
                padding: "10px 14px", fontSize: "0.875rem", color: "#4b5563", lineHeight: 1.6 }}>
                {booking.notes}
              </div>
            </div>
          )}

          {/* ── Vendor Assignment ────────────────────────────────────────────── */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9ca3af",
                textTransform: "uppercase", letterSpacing: 1 }}>Assigned Vendor</div>
              <button
                onClick={() => { setVendorMode(v => !v); setVendorMsg(""); }}
                style={{
                  fontSize: "0.75rem", fontWeight: 700, fontFamily: "inherit",
                  padding: "4px 12px", borderRadius: 8, cursor: "pointer",
                  border: "1.5px solid #6366f1", color: "#6366f1", background: "#eef2ff",
                  transition: "all 0.15s",
                }}
              >{vendorMode ? "Cancel" : selectedVid ? "Change" : "Assign"}</button>
            </div>

            {/* Current vendor chip */}
            {!vendorMode && (
              selectedVid ? (
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "#f0fdf4", border: "1px solid #bbf7d0",
                  borderRadius: 10, padding: "10px 14px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontWeight: 800, fontSize: "0.85rem", flexShrink: 0,
                    }}>
                      {selectedVName?.charAt(0)?.toUpperCase() || "V"}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "#111827" }}>{selectedVName}</div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>Vendor ID: {selectedVid}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveVendor}
                    disabled={assigning}
                    style={{
                      fontSize: "0.75rem", fontWeight: 600, fontFamily: "inherit",
                      padding: "4px 10px", borderRadius: 7, cursor: "pointer",
                      border: "1px solid #fca5a5", color: "#dc2626", background: "#fff",
                      opacity: assigning ? 0.6 : 1,
                    }}
                  >Remove</button>
                </div>
              ) : (
                <div style={{
                  background: "#f9fafb", border: "1.5px dashed #d1d5db",
                  borderRadius: 10, padding: "12px 14px",
                  fontSize: "0.85rem", color: "#9ca3af", textAlign: "center",
                }}>No vendor assigned yet</div>
              )
            )}

            {/* Vendor picker panel */}
            {vendorMode && (
              <div style={{
                border: "1.5px solid #e5e7eb", borderRadius: 12,
                background: "#fafafa", overflow: "hidden",
              }}>
                {/* Search */}
                <div style={{ padding: "10px 12px", borderBottom: "1px solid #e5e7eb" }}>
                  <input
                    autoFocus
                    value={vendorSearch}
                    onChange={e => setVendorSearch(e.target.value)}
                    placeholder="Search vendors by name, mobile, ID…"
                    style={{
                      width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8,
                      padding: "8px 12px", fontSize: "0.82rem", fontFamily: "inherit",
                      color: "#374151", outline: "none", background: "#fff",
                      boxSizing: "border-box",
                    }}
                    onFocus={e => e.target.style.borderColor = "#6366f1"}
                    onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>

                {/* Vendor list */}
                <div style={{ maxHeight: 220, overflowY: "auto" }}>
                  {filteredVendors.length === 0 ? (
                    <div style={{ padding: "24px 16px", textAlign: "center", color: "#9ca3af", fontSize: "0.82rem" }}>
                      No vendors found
                    </div>
                  ) : (
                    filteredVendors.map(v => {
                      const isChosen = selectedVid === v.id;
                      return (
                        <div
                          key={v.id}
                          onClick={() => { setSelectedVid(v.id); setSelectedVName(v.name); }}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "10px 14px", cursor: "pointer",
                            borderBottom: "1px solid #f3f4f6",
                            background: isChosen ? "#eef2ff" : "transparent",
                            transition: "background 0.1s",
                          }}
                          onMouseEnter={e => !isChosen && (e.currentTarget.style.background = "#f9fafb")}
                          onMouseLeave={e => !isChosen && (e.currentTarget.style.background = "transparent")}
                        >
                          <div style={{
                            width: 32, height: 32, borderRadius: "50%",
                            background: isChosen
                              ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                              : "linear-gradient(135deg,#e5e7eb,#d1d5db)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: isChosen ? "#fff" : "#6b7280",
                            fontWeight: 800, fontSize: "0.8rem", flexShrink: 0,
                          }}>
                            {v.name?.charAt(0)?.toUpperCase() || "V"}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: "0.85rem",
                              color: isChosen ? "#4338ca" : "#111827",
                              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {v.name}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                              ID: {v.id}{v.mobile ? ` · ${v.mobile}` : ""}
                              {v.category ? ` · ${v.category}` : ""}
                            </div>
                          </div>
                          {isChosen && (
                            <div style={{ color: "#6366f1", fontSize: "1rem", flexShrink: 0 }}>✓</div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Confirm assign button */}
                <div style={{ padding: "10px 12px", borderTop: "1px solid #e5e7eb" }}>
                  <button
                    onClick={handleAssignVendor}
                    disabled={!selectedVid || assigning}
                    style={{
                      width: "100%", padding: "9px", borderRadius: 9,
                      border: "none", fontFamily: "inherit",
                      background: selectedVid ? "#6366f1" : "#e5e7eb",
                      color: selectedVid ? "#fff" : "#9ca3af",
                      fontWeight: 700, fontSize: "0.85rem",
                      cursor: selectedVid && !assigning ? "pointer" : "not-allowed",
                      opacity: assigning ? 0.7 : 1, transition: "all 0.15s",
                    }}
                  >
                    {assigning ? "Assigning…" : selectedVid ? `Assign ${selectedVName}` : "Select a vendor"}
                  </button>
                </div>
              </div>
            )}

            {/* Feedback message */}
            {vendorMsg && (
              <div style={{
                marginTop: 8, fontSize: "0.8rem", fontWeight: 600,
                color: vendorMsg.startsWith("✓") ? "#16a34a" : "#dc2626",
                padding: "6px 10px", borderRadius: 8,
                background: vendorMsg.startsWith("✓") ? "#f0fdf4" : "#fef2f2",
              }}>{vendorMsg}</div>
            )}
          </div>
          {/* ── End Vendor Assignment ─────────────────────────────────────── */}

          {/* Update Status */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9ca3af",
              textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Update Status</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {STATUSES.map(s => {
                const st = STATUS_STYLES[s];
                const active = status === s;
                return (
                  <button key={s} onClick={() => setStatus(s)} style={{
                    padding: "7px 16px", borderRadius: 22,
                    border: active ? `2px solid ${st.color}` : "1.5px solid #e5e7eb",
                    background: active ? st.bg : "#fff",
                    color: active ? st.color : "#6b7280",
                    fontWeight: active ? 700 : 500,
                    fontSize: "0.8rem", cursor: "pointer",
                    textTransform: "capitalize", fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}>{s}</button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #f3f4f6",
          display: "flex", gap: 10, flexShrink: 0 }}>
          {!confirm ? (
            <>
              <button onClick={() => setConfirm(true)} style={{
                flex: 1, padding: "10px", borderRadius: 10,
                border: "1.5px solid #fecaca", background: "#fff",
                color: "#dc2626", fontWeight: 700, fontSize: "0.85rem",
                cursor: "pointer", fontFamily: "inherit",
              }}>Delete</button>
              <button onClick={handleStatusSave} disabled={saving} style={{
                flex: 2, padding: "10px", borderRadius: 10,
                border: "none", background: "#111827",
                color: "#fff", fontWeight: 700, fontSize: "0.85rem",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1, fontFamily: "inherit",
              }}>{saving ? "Saving…" : "Save Changes"}</button>
            </>
          ) : (
            <>
              <button onClick={() => setConfirm(false)} style={{
                flex: 1, padding: "10px", borderRadius: 10,
                border: "1.5px solid #e5e7eb", background: "#fff",
                color: "#374151", fontWeight: 700, fontSize: "0.85rem",
                cursor: "pointer", fontFamily: "inherit",
              }}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting} style={{
                flex: 2, padding: "10px", borderRadius: 10,
                border: "none", background: "#dc2626",
                color: "#fff", fontWeight: 700, fontSize: "0.85rem",
                cursor: deleting ? "not-allowed" : "pointer",
                opacity: deleting ? 0.7 : 1, fontFamily: "inherit",
              }}>{deleting ? "Deleting…" : "Confirm Delete"}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Bookings Page ──────────────────────────────────────────────────
export default function AdminBookings() {
  const [bookings,     setBookings]     = useState([]);
  const [stats,        setStats]        = useState(null);
  const [vendors,      setVendors]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  const [filterStatus, setFilterStatus] = useState("all");
  const [search,       setSearch]       = useState("");
  const [selected,     setSelected]     = useState(null);
  const [page,         setPage]         = useState(1);

  const PER_PAGE = 10;

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [bRes, sRes, vRes] = await Promise.all([
        fetch(`${API_BASE}/book`,         { headers: authHeaders() }),
        fetch(`${API_BASE}/book/stats`,   { headers: authHeaders() }),
        fetch(`${API_BASE}/vendors`,      { headers: authHeaders() }),
      ]);
      const bData = await bRes.json();
      const sData = await sRes.json();
      const vData = vRes.ok ? await vRes.json() : { vendors: [] };

      if (!bRes.ok) throw new Error(bData.message || "Failed to load bookings");
      setBookings(bData.bookings || []);
      setStats(sData.stats || null);
      setVendors(vData.vendors || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Filter + Search ──────────────────────────────────────────────────────
  const filtered = bookings.filter(b => {
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch = !q || (
      b.booking_number?.toLowerCase().includes(q) ||
      b.full_name?.toLowerCase().includes(q) ||
      b.mobile?.toLowerCase().includes(q) ||
      b.service_name?.toLowerCase().includes(q)
    );
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleStatusChange = (updated) => {
    setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
    fetchAll();
  };

  const handleDelete = (id) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    fetchAll();
  };

  const handleVendorAssign = (updated) => {
    setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
    setSelected(updated);
  };

  return (
    <>
      <style>{ADMIN_CSS}</style>

      <div className="ab-page">
        {/* ── Page Title ── */}
        <div className="ab-topbar">
          <div>
            <h1 className="ab-title">Bookings</h1>
            <p className="ab-sub">Manage all service bookings</p>
          </div>
          <button className="ab-refresh-btn" onClick={fetchAll}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Refresh
          </button>
        </div>

        {/* ── Stats ── */}
        {stats && (
          <div className="ab-stats-grid">
            <StatCard label="Total Bookings" value={stats.total}     color="#6366f1" icon="📋" />
            <StatCard label="Pending"        value={stats.pending}   color="#f59e0b" icon="⏳" />
            <StatCard label="Confirmed"      value={stats.confirmed} color="#3b82f6" icon="✅" />
            <StatCard label="Completed"      value={stats.completed} color="#22c55e" icon="🎉" />
            <StatCard label="Cancelled"      value={stats.cancelled} color="#ef4444" icon="❌" />
          </div>
        )}

        {/* ── Filters ── */}
        <div className="ab-toolbar">
          <div className="ab-search-wrap">
            <svg className="ab-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="ab-search"
              placeholder="Search by name, mobile, booking no, service…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="ab-status-tabs">
            {["all", ...STATUSES].map(s => (
              <button
                key={s}
                className={`ab-tab ${filterStatus === s ? "active" : ""}`}
                data-status={s}
                onClick={() => { setFilterStatus(s); setPage(1); }}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                {s !== "all" && stats && (
                  <span className="ab-tab-count">{stats[s] ?? 0}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="ab-table-wrap">
          {loading ? (
            <div className="ab-state">
              <div className="ab-spinner" />
              <p>Loading bookings…</p>
            </div>
          ) : error ? (
            <div className="ab-state ab-error">
              <p>⚠ {error}</p>
              <button className="ab-refresh-btn" onClick={fetchAll}>Retry</button>
            </div>
          ) : paginated.length === 0 ? (
            <div className="ab-state">
              <p style={{ fontSize: "2rem" }}>📭</p>
              <p>No bookings found.</p>
            </div>
          ) : (
            <table className="ab-table">
              <thead>
                <tr>
                  <th>Booking #</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>City</th>
                  <th>Vendor</th>
                  <th>Status</th>
                  <th>Booked On</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(b => (
                  <tr key={b.id} className="ab-row" onClick={() => setSelected(b)}>
                    <td>
                      <span className="ab-booking-num">{b.booking_number}</span>
                    </td>
                    <td>
                      <div className="ab-customer-name">{b.full_name}</div>
                      <div className="ab-customer-mobile">{b.mobile}</div>
                    </td>
                    <td>
                      <div className="ab-svc-name">{b.service_name}</div>
                      {b.category_name && (
                        <div className="ab-svc-cat">{b.category_name}</div>
                      )}
                    </td>
                    <td>
                      <div className="ab-date">{fmt(b.preferred_date)}</div>
                      <div className="ab-time">{b.preferred_time}</div>
                    </td>
                    <td className="ab-city">{b.city}</td>
                    <td>
                      {b.vendor_name ? (
                        <span className="ab-vendor-chip">{b.vendor_name}</span>
                      ) : (
                        <span className="ab-vendor-none">Unassigned</span>
                      )}
                    </td>
                    <td><StatusBadge status={b.status} /></td>
                    <td className="ab-createdat">
                      {b.created_at ? new Date(b.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td>
                      <button className="ab-view-btn" onClick={e => { e.stopPropagation(); setSelected(b); }}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="ab-pagination">
            <span className="ab-page-info">
              Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="ab-page-btns">
              <button className="ab-page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`ab-page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="ab-page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Drawer ── */}
      {selected && (
        <BookingDrawer
          booking={selected}
          vendors={vendors}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onVendorAssign={handleVendorAssign}
        />
      )}
    </>
  );
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const ADMIN_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.ab-page {
  font-family: 'DM Sans', sans-serif;
  background: #f8f9fc;
  min-height: 100vh;
  padding: 32px 28px 60px;
  color: #111827;
}

/* ── Topbar ── */
.ab-topbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 16px;
  flex-wrap: wrap;
}
.ab-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 4px;
  letter-spacing: -0.5px;
}
.ab-sub { font-size: 0.85rem; color: #6b7280; margin: 0; }
.ab-refresh-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.ab-refresh-btn:hover { border-color: #6366f1; color: #6366f1; }

/* ── Stats ── */
.ab-stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}
@media (max-width: 1100px) { .ab-stats-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 640px)  { .ab-stats-grid { grid-template-columns: repeat(2, 1fr); } }

/* ── Toolbar ── */
.ab-toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}
.ab-search-wrap {
  position: relative;
  flex: 1;
  min-width: 220px;
}
.ab-search-icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}
.ab-search {
  width: 100%;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  padding: 9px 13px 9px 36px;
  font-size: 0.875rem;
  font-family: inherit;
  color: #374151;
  background: #fff;
  outline: none;
  transition: border-color 0.2s;
}
.ab-search:focus { border-color: #6366f1; }
.ab-search::placeholder { color: #d1d5db; }

.ab-status-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.ab-tab {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 22px;
  background: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: inherit;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.ab-tab:hover { border-color: #6366f1; color: #6366f1; }
.ab-tab.active { background: #111827; border-color: #111827; color: #fff; }
.ab-tab-count {
  background: rgba(255,255,255,0.2);
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
}
.ab-tab.active .ab-tab-count { background: rgba(255,255,255,0.25); }

/* ── Table ── */
.ab-table-wrap {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}
.ab-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.ab-table thead tr {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}
.ab-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 0.72rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}
.ab-row {
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background 0.12s;
}
.ab-row:last-child { border-bottom: none; }
.ab-row:hover { background: #f9fafb; }
.ab-table td { padding: 13px 16px; vertical-align: middle; }

.ab-booking-num {
  font-size: 0.78rem;
  font-weight: 700;
  color: #6366f1;
  background: #eef2ff;
  padding: 3px 8px;
  border-radius: 6px;
  white-space: nowrap;
}
.ab-customer-name { font-weight: 600; color: #111827; }
.ab-customer-mobile { font-size: 0.78rem; color: #6b7280; margin-top: 2px; }
.ab-svc-name { font-weight: 600; color: #111827; }
.ab-svc-cat { font-size: 0.78rem; color: #9ca3af; margin-top: 2px; }
.ab-date { font-weight: 600; color: #111827; white-space: nowrap; }
.ab-time { font-size: 0.78rem; color: #6b7280; margin-top: 2px; white-space: nowrap; }
.ab-city { color: #6b7280; font-size: 0.85rem; }
.ab-createdat { color: #9ca3af; font-size: 0.8rem; white-space: nowrap; }

/* ── Vendor chips in table ── */
.ab-vendor-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #4338ca;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  padding: 3px 9px;
  border-radius: 20px;
  white-space: nowrap;
}
.ab-vendor-chip::before {
  content: '';
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #6366f1;
  flex-shrink: 0;
}
.ab-vendor-none {
  font-size: 0.78rem;
  color: #d1d5db;
  font-style: italic;
}

.ab-view-btn {
  padding: 6px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: inherit;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.ab-view-btn:hover { border-color: #6366f1; color: #6366f1; background: #eef2ff; }

/* ── Empty / Loading ── */
.ab-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 72px 20px;
  text-align: center;
  color: #6b7280;
  gap: 12px;
  font-size: 0.9rem;
}
.ab-error { color: #dc2626; }
.ab-spinner {
  width: 36px; height: 36px;
  border: 3px solid #e5e7eb;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: abSpin 0.7s linear infinite;
}
@keyframes abSpin { to { transform: rotate(360deg); } }

/* ── Pagination ── */
.ab-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  gap: 16px;
  flex-wrap: wrap;
}
.ab-page-info { font-size: 0.82rem; color: #6b7280; }
.ab-page-btns { display: flex; gap: 6px; flex-wrap: wrap; }
.ab-page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  border-radius: 8px;
  font-size: 0.82rem;
  font-family: inherit;
  color: #374151;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.15s;
}
.ab-page-btn:hover:not(:disabled) { border-color: #6366f1; color: #6366f1; }
.ab-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.ab-page-btn.active { background: #111827; border-color: #111827; color: #fff; font-weight: 700; }
`;