import { useState, useEffect, useCallback } from "react";

const API_BASE1 = import.meta.env.VITE_API_URL;

const API = `${API_BASE1}/api`;

const getToken = () => localStorage.getItem("al_token") || "";

const api = async (method, path, body, isFormData = false) => {
  const headers = { Authorization: `Bearer ${getToken()}` };
  if (!isFormData) headers["Content-Type"] = "application/json";
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const Badge = ({ label, type = "neutral" }) => {
  const styles = {
    active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border border-amber-200",
    inactive: "bg-gray-100 text-gray-600 border border-gray-200",
    suspended: "bg-red-50 text-red-700 border border-red-200",
    verified: "bg-blue-50 text-blue-700 border border-blue-200",
    rejected: "bg-red-50 text-red-700 border border-red-200",
    neutral: "bg-gray-100 text-gray-600 border border-gray-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[type] || styles.neutral}`}>
      {label}
    </span>
  );
};

const Avatar = ({ name, photo, size = "md" }) => {
  const initials = name ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "?";
  const sz = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-12 h-12 text-base" : "w-9 h-9 text-sm";
  const colors = ["bg-violet-100 text-violet-700", "bg-cyan-100 text-cyan-700", "bg-rose-100 text-rose-700", "bg-amber-100 text-amber-700", "bg-emerald-100 text-emerald-700"];
  const color = colors[(initials.charCodeAt(0) || 0) % colors.length];
  if (photo) return <img src={`${API.replace("/api", "")}/uploads/vendors/${photo}`} alt={name} className={`${sz} rounded-full object-cover ring-1 ring-gray-200`} />;
  return <div className={`${sz} ${color} rounded-full flex items-center justify-center font-semibold flex-shrink-0`}>{initials}</div>;
};

const Spinner = ({ sm }) => (
  <svg className={`animate-spin ${sm ? "w-4 h-4" : "w-6 h-6"} text-indigo-600`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

const Modal = ({ title, onClose, children, wide }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-3xl" : "max-w-lg"} max-h-[92vh] overflow-auto`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
    {children}
  </div>
);

const Input = ({ ...props }) => (
  <input {...props} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition placeholder-gray-400" />
);

const Select = ({ children, ...props }) => (
  <select {...props} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition bg-white">
    {children}
  </select>
);

const toast = (msg, type = "success") => {
  const el = document.createElement("div");
  el.className = `fixed bottom-6 right-6 z-[99] px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${type === "error" ? "bg-red-600 text-white" : "bg-gray-900 text-white"}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
};

// ── Stats Cards ───────────────────────────────────────────────────────────────
const StatsBar = ({ vendors }) => {
  const total = vendors.length;
  const active = vendors.filter(v => v.status === "active").length;
  const pending = vendors.filter(v => v.status === "pending").length;
  const suspended = vendors.filter(v => v.status === "suspended").length;
  const verified = vendors.filter(v => v.verify_status === "verified").length;

  const cards = [
    { label: "Total Vendors", value: total, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0", color: "text-indigo-600 bg-indigo-50" },
    { label: "Active", value: active, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-emerald-600 bg-emerald-50" },
    { label: "Pending", value: pending, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-amber-600 bg-amber-50" },
    { label: "Suspended", value: suspended, icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636", color: "text-red-600 bg-red-50" },
    { label: "Verified", value: verified, icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", color: "text-blue-600 bg-blue-50" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {cards.map(c => (
        <div key={c.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg ${c.color} flex items-center justify-center flex-shrink-0`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={c.icon} /></svg>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900 leading-none">{c.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Vendor Detail Drawer ──────────────────────────────────────────────────────
const VendorDrawer = ({ vendor: v, onClose, onRefresh }) => {
  const [tab, setTab] = useState("overview");
  const [attendance, setAttendance] = useState([]);
  const [services, setServices] = useState([]);
  const [perf, setPerf] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === "attendance") api("GET", `/vendors/${v.id}/attendance`).then(d => setAttendance(d.attendance));
    if (tab === "services") api("GET", `/vendors/${v.id}/services`).then(d => setServices(d.services));
    if (tab === "performance") api("GET", `/vendors/${v.id}/performance`).then(d => setPerf(d.performance));
  }, [tab, v.id]);

  const setStatus = async (status) => {
    setLoading(true);
    try {
      await api("PATCH", `/vendors/${v.id}/status`, { status });
      toast(`Status set to ${status}`);
      onRefresh();
    } catch (e) { toast(e.message, "error"); }
    setLoading(false);
  };

  const setVerify = async (verify_status) => {
    setLoading(true);
    try {
      await api("PATCH", `/vendors/${v.id}/verify`, { verify_status });
      toast(`Verify status: ${verify_status}`);
      onRefresh();
    } catch (e) { toast(e.message, "error"); }
    setLoading(false);
  };

  const toggleAvail = async () => {
    try {
      await api("PATCH", `/vendors/${v.id}/availability`);
      toast("Availability toggled");
      onRefresh();
    } catch (e) { toast(e.message, "error"); }
  };

  const del = async () => {
    if (!confirm(`Delete vendor "${v.name}"? This cannot be undone.`)) return;
    try {
      await api("DELETE", `/vendors/${v.id}`);
      toast("Vendor deleted");
      onClose();
      onRefresh();
    } catch (e) { toast(e.message, "error"); }
  };

  const TABS = ["overview", "services", "attendance", "performance"];

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-2xl bg-white h-full overflow-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start gap-4">
          <Avatar name={v.name} photo={v.profile_photo} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-semibold text-gray-900">{v.name}</h2>
              <Badge label={v.status} type={v.status} />
              <Badge label={v.verify_status} type={v.verify_status === "verified" ? "verified" : v.verify_status === "rejected" ? "rejected" : "pending"} />
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{v.mobile} {v.email && `· ${v.email}`}</p>
            <p className="text-xs text-gray-400 mt-0.5">{v.city} · {v.vendor_type} · {v.experience}y exp · {v.category_name || "No category"}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-3 border-b border-gray-100 flex flex-wrap gap-2">
          <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none" onChange={e => e.target.value && setStatus(e.target.value)} value="">
            <option value="">Set Status…</option>
            {["active", "inactive", "suspended", "pending"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none" onChange={e => e.target.value && setVerify(e.target.value)} value="">
            <option value="">Set Verify…</option>
            {["pending", "verified", "rejected"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={toggleAvail} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
            {v.is_available ? "Mark Unavailable" : "Mark Available"}
          </button>
          <button onClick={del} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition ml-auto">
            Delete
          </button>
          {loading && <Spinner sm />}
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-100 flex gap-1">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-2.5 text-sm capitalize transition border-b-2 -mb-px ${tab === t ? "border-indigo-600 text-indigo-600 font-medium" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 flex-1 overflow-auto">
          {tab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Mobile", v.mobile], ["Email", v.email || "—"], ["Aadhaar", v.aadhaar],
                  ["City", v.city], ["Address", v.address || "—"], ["Type", v.vendor_type],
                  ["Experience", `${v.experience} years`], ["Rating", v.rating || 0],
                  ["Total Jobs", v.total_jobs || 0], ["Completed", v.completed_jobs || 0],
                  ["Cancelled", v.cancelled_jobs || 0], ["Available", v.is_available ? "Yes" : "No"],
                ].map(([k, val]) => (
                  <div key={k} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">{k}</p>
                    <p className="text-sm font-medium text-gray-800 mt-0.5 break-all">{val}</p>
                  </div>
                ))}
                <div className="col-span-2 bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Vendor Categories</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {v.vendorCategories?.length > 0
                      ? v.vendorCategories.map(vc => (
                        <span key={vc.id} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-medium">
                          {vc.name}
                        </span>
                      ))
                      : <span className="text-sm text-gray-400">None assigned</span>
                    }
                  </div>
                </div>
              </div>
              {v.notes && <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-800"><strong>Notes:</strong> {v.notes}</div>}
              <div className="text-xs text-gray-400">Registered: {new Date(v.registered_at).toLocaleString()}</div>

              {/* Documents */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Documents</p>
                <div className="flex flex-wrap gap-2">
                  {[["Profile Photo", v.profile_photo], ["Aadhaar Front", v.aadhaar_front], ["Aadhaar Back", v.aadhaar_back], ["Certificate", v.certificate]].map(([label, file]) => (
                    file ? (
                      <a key={label} href={`${API.replace("/api", "")}/uploads/vendors/${file}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-700 text-xs hover:bg-indigo-50 transition">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" /></svg>
                        {label}
                      </a>
                    ) : (
                      <span key={label} className="px-3 py-1.5 rounded-lg border border-gray-100 text-gray-400 text-xs">{label}: —</span>
                    )
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "services" && (
            <div>
              {services.length === 0
                ? <p className="text-sm text-gray-400 text-center py-8">No services assigned</p>
                : <div className="space-y-2">
                  {services.map(s => (
                    <div key={s.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.code} · {s.category_name}</p>
                      </div>
                      <button onClick={async () => {
                        await api("DELETE", `/vendors/${v.id}/services/${s.id}`);
                        setServices(ss => ss.filter(x => x.id !== s.id));
                        toast("Service removed");
                      }} className="text-red-500 hover:text-red-700 text-xs">Remove</button>
                    </div>
                  ))}
                </div>
              }
            </div>
          )}

          {tab === "attendance" && (
            <div>
              {attendance.length === 0
                ? <p className="text-sm text-gray-400 text-center py-8">No attendance records</p>
                : <div className="space-y-1.5">
                  {attendance.map(a => (
                    <div key={a.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5">
                      <span className="text-sm text-gray-700">{a.date}</span>
                      <Badge label={a.status} type={a.status === "present" ? "active" : a.status === "absent" ? "suspended" : "pending"} />
                      {a.note && <span className="text-xs text-gray-400">{a.note}</span>}
                    </div>
                  ))}
                </div>
              }
            </div>
          )}

          {tab === "performance" && perf && (
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Total Jobs", perf.total_jobs], ["Completed", perf.completed_jobs],
                ["Cancelled", perf.cancelled_jobs], ["Completion Rate", perf.completion_rate],
                ["Avg Rating", perf.avg_rating], ["Avg Response Time", `${perf.avg_response_time}s`],
              ].map(([k, val]) => (
                <div key={k} className="bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-100 p-4">
                  <p className="text-xs text-indigo-500 font-medium">{k}</p>
                  <p className="text-2xl font-bold text-indigo-800 mt-1">{val}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Attendance Modal ──────────────────────────────────────────────────────────
const AttendanceModal = ({ vendorId, onClose }) => {
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], status: "present", note: "" });
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    setLoading(true);
    try {
      await api("POST", `/vendors/${vendorId}/attendance`, form);
      toast("Attendance marked");
      onClose();
    } catch (e) { toast(e.message, "error"); }
    setLoading(false);
  };
  return (
    <Modal title="Mark Attendance" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Date"><Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></Field>
        <Field label="Status">
          <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            {["present", "absent", "leave", "holiday"].map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="Note (optional)"><Input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} /></Field>
        <button onClick={submit} disabled={loading} className="w-full bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50">
          {loading ? "Saving…" : "Mark Attendance"}
        </button>
      </div>
    </Modal>
  );
};

// ── Edit Vendor Modal ─────────────────────────────────────────────────────────
const EditVendorModal = ({ vendor, onClose, onRefresh }) => {
  const [form, setForm] = useState({
    name: vendor.name || "", email: vendor.email || "",
    experience: vendor.experience || 0, city: vendor.city || "",
    address: vendor.address || "", vendor_type: vendor.vendor_type || "individual",
    notes: vendor.notes || "",
  });
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    setLoading(true);
    try {
      await api("PUT", `/vendors/${vendor.id}`, form);
      toast("Vendor updated");
      onRefresh();
      onClose();
    } catch (e) { toast(e.message, "error"); }
    setLoading(false);
  };
  return (
    <Modal title={`Edit — ${vendor.name}`} onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name"><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></Field>
        <Field label="Email"><Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></Field>
        <Field label="City"><Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></Field>
        <Field label="Experience (years)"><Input type="number" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} /></Field>
        <Field label="Vendor Type">
          <Select value={form.vendor_type} onChange={e => setForm(f => ({ ...f, vendor_type: e.target.value }))}>
            <option value="individual">Individual</option>
            <option value="company">Company</option>
          </Select>
        </Field>
        <Field label="Address"><Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></Field>
        <div className="col-span-2">
          <Field label="Notes">
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition resize-none h-20" />
          </Field>
        </div>
      </div>
      <button onClick={submit} disabled={loading} className="mt-5 w-full bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50">
        {loading ? "Saving…" : "Save Changes"}
      </button>
    </Modal>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function VendorManagement() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [attendTarget, setAttendTarget] = useState(null);
  const [filters, setFilters] = useState({ status: "", city: "", verify_status: "" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const loadVendors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.city) params.set("city", filters.city);
      if (filters.verify_status) params.set("verify_status", filters.verify_status);
      const data = await api("GET", `/vendors?${params}`);
      setVendors(data.vendors || []);
    } catch (e) { toast(e.message, "error"); }
    setLoading(false);
  }, [filters]);

  useEffect(() => { loadVendors(); setPage(1); }, [loadVendors]);

  const filtered = vendors.filter(v =>
    !search ||
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.mobile?.includes(search) ||
    v.email?.toLowerCase().includes(search.toLowerCase()) ||
    v.city?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const cities = [...new Set(vendors.map(v => v.city).filter(Boolean))];

  // Refresh selected vendor after actions
  const refreshSelected = async () => {
    await loadVendors();
    if (selected) {
      const data = await api("GET", `/vendors/${selected.id}`);
      setSelected(data.vendor);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900 leading-none">Vendor Management</h1>
              <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
            </div>
          </div>
          <div className="flex-1" />
          <button onClick={loadVendors} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <StatsBar vendors={vendors} />

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-52">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search name, mobile, email, city…"
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition" />
          </div>
          <Select value={filters.status} onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }} style={{ width: 140 }}>
            <option value="">All Status</option>
            {["active", "inactive", "pending", "suspended"].map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select value={filters.verify_status} onChange={e => { setFilters(f => ({ ...f, verify_status: e.target.value })); setPage(1); }} style={{ width: 150 }}>
            <option value="">All Verify</option>
            {["pending", "verified", "rejected"].map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select value={filters.city} onChange={e => { setFilters(f => ({ ...f, city: e.target.value })); setPage(1); }} style={{ width: 130 }}>
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
          {(filters.status || filters.verify_status || filters.city || search) && (
            <button onClick={() => { setFilters({ status: "", city: "", verify_status: "" }); setSearch(""); setPage(1); }}
              className="px-3 py-2 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              Clear
            </button>
          )}
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} vendor{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Spinner /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <p className="text-sm">No vendors found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {["Vendor", "Category", "City", "Status", "Verify", "Available", "Rating", "Actions"].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-gray-500 px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paged.map(v => (
                    <tr key={v.id} className="hover:bg-gray-50/50 transition group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={v.name} photo={v.profile_photo} size="sm" />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{v.name}</p>
                            <p className="text-xs text-gray-400">#{v.id} · {v.vendor_type}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-xs">
                        {v.vendorCategories?.length > 0
                          ? <div className="flex flex-wrap gap-1">
                            {v.vendorCategories.map(vc => (
                              <span key={vc.id} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-medium whitespace-nowrap">
                                {vc.name}
                              </span>
                            ))}
                          </div>
                          : <span className="text-gray-400">—</span>
                        }
                      </td>                      <td className="px-4 py-3 text-gray-600 text-xs">{v.city}</td>
                      <td className="px-4 py-3"><Badge label={v.status} type={v.status} /></td>
                      <td className="px-4 py-3"><Badge label={v.verify_status} type={v.verify_status === "verified" ? "verified" : v.verify_status === "rejected" ? "rejected" : "pending"} /></td>
                      <td className="px-4 py-3">
                        <span className={`inline-block w-2 h-2 rounded-full ${v.is_available ? "bg-emerald-500" : "bg-gray-300"}`} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-amber-500">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          <span className="text-xs text-gray-700">{v.rating || "—"}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setSelected(v)} title="View Details"
                            className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600 transition">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                          <button onClick={() => setEditTarget(v)} title="Edit"
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={() => setAttendTarget(v.id)} title="Mark Attendance"
                            className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Page {page} of {totalPages} · {filtered.length} vendors
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition">←</button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = page <= 4 ? i + 1 : page + i - 3;
                  if (p < 1 || p > totalPages) return null;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`px-2.5 py-1.5 text-xs rounded-lg border transition ${p === page ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-200 hover:bg-gray-50"}`}>
                      {p}
                    </button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition">→</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drawers & Modals */}
      {selected && <VendorDrawer vendor={selected} onClose={() => setSelected(null)} onRefresh={refreshSelected} />}
      {editTarget && <EditVendorModal vendor={editTarget} onClose={() => setEditTarget(null)} onRefresh={loadVendors} />}
      {attendTarget && <AttendanceModal vendorId={attendTarget} onClose={() => setAttendTarget(null)} />}
    </div>
  );
}