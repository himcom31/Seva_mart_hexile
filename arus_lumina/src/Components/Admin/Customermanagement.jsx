import { useState, useEffect, useCallback } from "react";


const API_BASE1 = import.meta.env.VITE_API_URL;

const API_BASE = `${API_BASE1}/api/book`;

const STATUS_CONFIG = {
  pending:   { color: "bg-amber-100 text-amber-800 border-amber-200",   dot: "bg-amber-400" },
  confirmed: { color: "bg-blue-100 text-blue-800 border-blue-200",      dot: "bg-blue-400" },
  completed: { color: "bg-emerald-100 text-emerald-800 border-emerald-200", dot: "bg-emerald-400" },
  cancelled: { color: "bg-red-100 text-red-800 border-red-200",         dot: "bg-red-400" },
};

const VALID_STATUSES = ["pending", "confirmed", "completed", "cancelled"];

const token = () => localStorage.getItem("al_token") || "";

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, accent }) {
  return (
    <div className={`rounded-2xl border bg-white p-5 shadow-sm flex flex-col gap-1 border-l-4 ${accent}`}>
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</span>
      <span className="text-3xl font-black text-slate-800 tabular-nums">{value ?? "—"}</span>
    </div>
  );
}

function Badge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

function DetailRow({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
      <span className="text-sm text-slate-700 font-medium break-words">{value}</span>
    </div>
  );
}

function BookingDrawer({ booking, onClose, onStatusChange, onDelete }) {
  const [status, setStatus] = useState(booking.status);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleStatusUpdate = async () => {
    setSaving(true);
    try {
      await apiFetch(`/${booking.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      onStatusChange(booking.id, status);
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete booking ${booking.booking_number}? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await apiFetch(`/${booking.id}`, { method: "DELETE" });
      onDelete(booking.id);
      onClose();
    } catch (e) {
      alert(e.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      {/* Panel */}
      <div className="w-full max-w-md bg-white shadow-2xl flex flex-col overflow-hidden animate-[slideIn_0.25s_ease]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b bg-slate-50">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Booking Details</p>
            <p className="text-lg font-black text-slate-800 font-mono">{booking.booking_number}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-200 transition-colors text-slate-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Status badge */}
          <div className="flex items-center gap-3">
            <Badge status={booking.status} />
            <span className="text-xs text-slate-400">{new Date(booking.created_at).toLocaleString()}</span>
          </div>

          {/* Sections */}
          <Section title="Customer">
            <DetailRow label="Full Name" value={booking.full_name} />
            <DetailRow label="Mobile" value={booking.mobile} />
          </Section>

          <Section title="Service">
            <DetailRow label="Service" value={booking.service_name} />
            <DetailRow label="Category" value={booking.category_name} />
            <DetailRow label="Service Code" value={booking.service_code} />
            <DetailRow label="Service ID" value={booking.service_id} />
          </Section>

          <Section title="Address">
            <DetailRow label="Address" value={booking.address} />
            <DetailRow label="Landmark" value={booking.landmark} />
            <DetailRow label="City" value={booking.city} />
          </Section>

          <Section title="Schedule">
            <DetailRow label="Preferred Date" value={booking.preferred_date} />
            <DetailRow label="Preferred Time" value={booking.preferred_time} />
          </Section>

          {booking.vendor_name && (
            <Section title="Assigned Vendor">
              <DetailRow label="Vendor Name" value={booking.vendor_name} />
              <DetailRow label="Vendor ID" value={booking.vendor_id} />
            </Section>
          )}

          {booking.notes && (
            <Section title="Notes">
              <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 border">{booking.notes}</p>
            </Section>
          )}
        </div>

        {/* Footer actions */}
        <div className="border-t px-6 py-4 bg-slate-50 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Update Status</p>
          <div className="flex gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {VALID_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={saving || status === booking.status}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full rounded-xl border border-red-200 bg-red-50 py-2 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors disabled:opacity-40"
          >
            {deleting ? "Deleting…" : "Delete Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 border-b pb-1">{title}</p>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function CustomerManagement() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [bRes, sRes] = await Promise.all([
        apiFetch("/"),
        apiFetch("/stats"),
      ]);
      setBookings(bRes.bookings || []);
      setStats(sRes.stats || null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleStatusChange = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    if (selected?.id === id) setSelected((s) => ({ ...s, status: newStatus }));
  };

  const handleDelete = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const filtered = bookings.filter((b) => {
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.full_name?.toLowerCase().includes(q) ||
      b.booking_number?.toLowerCase().includes(q) ||
      b.mobile?.includes(q) ||
      b.service_name?.toLowerCase().includes(q) ||
      b.city?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Customer Management</h1>
          <p className="text-xs text-slate-400 font-medium">Manage all customer bookings</p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <StatCard label="Total"     value={stats.total}     accent="border-slate-400" />
            <StatCard label="Pending"   value={stats.pending}   accent="border-amber-400" />
            <StatCard label="Confirmed" value={stats.confirmed} accent="border-blue-400"  />
            <StatCard label="Completed" value={stats.completed} accent="border-emerald-400" />
            <StatCard label="Cancelled" value={stats.cancelled} accent="border-red-400"   />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, booking #, mobile, service…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", ...VALID_STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition-colors border ${
                  filterStatus === s
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-center">
            <p className="text-red-600 font-semibold">{error}</p>
            <button onClick={loadData} className="mt-3 text-sm text-red-500 underline">Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-white border p-12 text-center text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="font-semibold text-sm">No bookings found</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b text-left">
                    {["Booking #","Customer","Mobile","Service","City","Date & Time","Vendor","Status","Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => (
                    <tr
                      key={b.id}
                      className={`border-b last:border-0 hover:bg-indigo-50/40 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-indigo-700 whitespace-nowrap">{b.booking_number}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{b.full_name}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{b.mobile}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-700">{b.service_name}</div>
                        {b.category_name && <div className="text-xs text-slate-400">{b.category_name}</div>}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{b.city}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-slate-700">{b.preferred_date}</div>
                        <div className="text-xs text-slate-400">{b.preferred_time}</div>
                      </td>
                      <td className="px-4 py-3">
                        {b.vendor_name ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-violet-50 border border-violet-200 px-2 py-0.5 text-xs font-semibold text-violet-700">
                            {b.vendor_name}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge status={b.status} />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelected(b)}
                          className="rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors whitespace-nowrap"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t bg-slate-50 text-xs text-slate-400 font-medium">
              Showing {filtered.length} of {bookings.length} bookings
            </div>
          </div>
        )}
      </main>

      {/* Slide-over Drawer */}
      {selected && (
        <BookingDrawer
          booking={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}