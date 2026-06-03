import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const API_BASE1 = import.meta.env.VITE_API_URL;

const API_BASE = `${API_BASE1}/api`;
const token = () => localStorage.getItem("al_token") || "";
const imgUrl = (url) => url || null;

const generateSlug = (name) =>
  name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const colors = { success: "bg-emerald-500", error: "bg-red-500", info: "bg-blue-500" };
  return (
    <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-semibold animate-slide-in ${colors[toast.type] || colors.info}`}>
      {toast.type === "success" && <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>}
      {toast.type === "error" && <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>}
      {toast.msg}
    </div>
  );
}

// ─── TOGGLE ───────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, size = "md" }) {
  const h = size === "sm" ? "h-5 w-9" : "h-6 w-11";
  const dot = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const tr = size === "sm" ? (checked ? "translate-x-5" : "translate-x-1") : (checked ? "translate-x-6" : "translate-x-1");
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center rounded-full transition-colors focus:outline-none ${h} ${checked ? "bg-violet-500" : "bg-gray-200"}`}>
      <span className={`inline-block transform rounded-full bg-white shadow transition-transform ${dot} ${tr}`}/>
    </button>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    active:   "bg-emerald-50 text-emerald-600 ring-emerald-200",
    inactive: "bg-gray-100 text-gray-500 ring-gray-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ${map[status] || map.inactive}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "active" ? "bg-emerald-500" : "bg-gray-400"}`}/>
      {status === "active" ? "Active" : "Inactive"}
    </span>
  );
}

// ─── VERIFY BADGE ─────────────────────────────────────────────────────────────
function VerifyBadge({ status }) {
  const map = {
    verified: "bg-blue-50 text-blue-600 ring-blue-200",
    pending:  "bg-amber-50 text-amber-600 ring-amber-200",
    rejected: "bg-red-50 text-red-500 ring-red-200",
  };
  const icons = {
    verified: "✓",
    pending:  "⏳",
    rejected: "✕",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ${map[status] || map.pending}`}>
      <span>{icons[status] || "?"}</span>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending"}
    </span>
  );
}

// ─── IMAGE UPLOAD ─────────────────────────────────────────────────────────────
function ImageUpload({ label, preview, onChange, onRemove }) {
  const ref = useRef();
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</label>
      {preview ? (
        <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-violet-200 shadow">
          <img src={preview} alt={label} className="w-full h-full object-cover"/>
          <button type="button" onClick={onRemove}
            className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow hover:bg-red-600 transition">×</button>
        </div>
      ) : (
        <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50">
          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
      )}
      <div
        onClick={() => ref.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onChange(f); }}
        className="border-2 border-dashed border-gray-200 rounded-xl p-3 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-all group"
      >
        <svg className="w-5 h-5 text-gray-300 group-hover:text-violet-400 mx-auto mb-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
        </svg>
        <p className="text-xs text-gray-400"><span className="text-violet-500 font-bold">Click</span> or drag & drop</p>
        <p className="text-[10px] text-gray-300 mt-0.5">JPG, PNG · Max 450×450px</p>
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => onChange(e.target.files[0])}/>
      </div>
    </div>
  );
}

// ─── SERVICE MODAL ────────────────────────────────────────────────────────────
function ServiceModal({ open, onClose, onSaved, editItem, categories }) {
  const isEdit = !!editItem;
  const blankForm = { category_id: "", name: "", slug: "", code: "", code_prefix: "PROD", description: "", status: true, featured: false, verify_status: "pending" };
  const [form, setForm] = useState(blankForm);
  const [imageFile, setImageFile] = useState(null);
  const [iconFile, setIconFile]   = useState(null);
  const [imagePrev, setImagePrev] = useState(null);
  const [iconPrev, setIconPrev]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (open) {
      if (editItem) {
        setForm({
          category_id: editItem.category_id ?? "",
          name: editItem.name ?? "",
          slug: editItem.slug ?? "",
          code: editItem.code ?? "",
          code_prefix: "PROD",
          description: editItem.description ?? "",
          status: editItem.status === "active",
          featured: !!editItem.featured,
          verify_status: editItem.verify_status ?? "pending",
        });
      setImagePrev(editItem.image || null);
setIconPrev(editItem.icon || null);
      } else {
        setForm(blankForm);
        setImagePrev(null); setIconPrev(null);
      }
      setImageFile(null); setIconFile(null);
      setError("");
      setActiveTab("basic");
    }
  }, [open, editItem]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleNameChange = (v) => {
    set("name", v);
    if (!isEdit) set("slug", generateSlug(v));
  };

  const handleSubmit = async () => {
    if (!form.category_id) return setError("Please select a category.");
    if (!form.name.trim()) return setError("Service name is required.");
    setError(""); setLoading(true);
    try {
      const fd = new FormData();
      fd.append("category_id", form.category_id);
      fd.append("name", form.name);
      fd.append("slug", form.slug || generateSlug(form.name));
      if (form.code) fd.append("code", form.code);
      fd.append("code_prefix", form.code_prefix || "PROD");
      fd.append("description", form.description);
      fd.append("status", form.status ? "active" : "inactive");
      fd.append("featured", form.featured ? "true" : "false");
      fd.append("verify_status", form.verify_status);
      if (imageFile) fd.append("image", imageFile);
      if (iconFile)  fd.append("icon", iconFile);

      const url    = isEdit ? `${API_BASE}/services/${editItem.id}` : `${API_BASE}/services`;
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token()}` }, body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");
      onSaved(data.service);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "media", label: "Media" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-3 py-6 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden mx-auto my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-violet-500 px-6 pt-6 pb-0">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-black text-white">{isEdit ? "Edit Service" : "Add New Service"}</h2>
              <p className="text-violet-200 text-xs mt-0.5">{isEdit ? `Editing: ${editItem.name}` : "Create a new service listing"}</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 text-white transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          {/* Tabs */}
          <div className="flex gap-1">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all ${activeTab === t.id ? "bg-white text-violet-600" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 min-h-[300px]">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {error}
            </div>
          )}

          {/* BASIC TAB */}
          {activeTab === "basic" && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Category *</label>
                <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 appearance-none">
                  <option value="">— Select Category —</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Service Name *</label>
                  <input type="text" value={form.name} onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Deep House Cleaning"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Slug</label>
                  <input type="text" value={form.slug} onChange={(e) => set("slug", e.target.value)}
                    placeholder="auto-generated-from-name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-gray-50"/>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Code Prefix</label>
                  <input type="text" value={form.code_prefix} onChange={(e) => set("code_prefix", e.target.value.toUpperCase())}
                    placeholder="PROD"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"/>
                  <p className="text-[10px] text-gray-400 mt-1">Leave Code blank to auto-generate</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Code (optional)</label>
                  <input type="text" value={form.code} onChange={(e) => set("code", e.target.value)}
                    placeholder="Auto: PROD001"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-gray-50"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe this service..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none"/>
              </div>
            </div>
          )}

          {/* MEDIA TAB */}
          {activeTab === "media" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <ImageUpload label="Service Image" preview={imagePrev}
                onChange={(f) => { setImageFile(f); setImagePrev(URL.createObjectURL(f)); }}
                onRemove={() => { setImageFile(null); setImagePrev(null); }}/>
              <ImageUpload label="Service Icon" preview={iconPrev}
                onChange={(f) => { setIconFile(f); setIconPrev(URL.createObjectURL(f)); }}
                onRemove={() => { setIconFile(null); setIconPrev(null); }}/>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="flex flex-col gap-5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-700">Status</p>
                    <p className="text-xs text-gray-400 mt-0.5">{form.status ? "Visible to users" : "Hidden from listing"}</p>
                  </div>
                  <Toggle checked={form.status} onChange={(v) => set("status", v)}/>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-700">Featured</p>
                    <p className="text-xs text-gray-400 mt-0.5">{form.featured ? "Shown in highlights" : "Standard listing"}</p>
                  </div>
                  <Toggle checked={form.featured} onChange={(v) => set("featured", v)}/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Verification Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {["pending", "verified", "rejected"].map((s) => (
                    <button key={s} type="button" onClick={() => set("verify_status", s)}
                      className={`py-2.5 rounded-xl text-xs font-bold capitalize border-2 transition-all ${form.verify_status === s
                        ? s === "verified" ? "border-blue-500 bg-blue-50 text-blue-600"
                          : s === "rejected" ? "border-red-400 bg-red-50 text-red-500"
                          : "border-amber-400 bg-amber-50 text-amber-600"
                        : "border-gray-200 text-gray-400 hover:border-gray-300"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex justify-between items-center">
          <div className="flex gap-1">
            {tabs.map((t, idx) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`w-2 h-2 rounded-full transition-all ${activeTab === t.id ? "bg-violet-500 w-4" : "bg-gray-200 hover:bg-gray-300"}`}/>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition">Cancel</button>
            <button onClick={handleSubmit} disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-violet-500 text-white text-sm font-black hover:bg-violet-600 transition disabled:opacity-60 flex items-center gap-2 shadow-lg shadow-violet-200">
              {loading && <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>}
              {loading ? "Saving…" : isEdit ? "Update Service" : "Create Service"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DELETE MODAL ─────────────────────────────────────────────────────────────
function DeleteModal({ open, onClose, onConfirm, name, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </div>
        <h3 className="text-lg font-black text-center text-gray-800 mb-1">Delete Service?</h3>
        <p className="text-sm text-center text-gray-500 mb-5">
          "<span className="font-bold text-gray-700">{name}</span>" will be permanently removed. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-black hover:bg-red-600 transition disabled:opacity-60 flex items-center justify-center gap-2">
            {loading && <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>}
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── VERIFY DROPDOWN ──────────────────────────────────────────────────────────
function VerifyDropdown({ item, onUpdate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="focus:outline-none">
        <VerifyBadge status={item.verify_status}/>
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-30 bg-white border border-gray-100 rounded-2xl shadow-xl py-1.5 w-36 overflow-hidden">
          {["pending", "verified", "rejected"].map((s) => (
            <button key={s} onClick={() => { onUpdate(item, s); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-xs font-bold capitalize hover:bg-gray-50 transition ${item.verify_status === s ? "text-violet-600" : "text-gray-600"}`}>
              {item.verify_status === s && "✓ "}{s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ServicePage() {
  const [services, setServices]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);

  const [search, setSearch]   = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage]         = useState(1);

  const [modalOpen, setModalOpen]       = useState(false);
  const [editItem, setEditItem]         = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, cRes] = await Promise.all([
        fetch(`${API_BASE}/services`),
        fetch(`${API_BASE}/categories`),
      ]);
      const sData = await sRes.json();
      const cData = await cRes.json();
      setServices(sData.services || []);
      setCategories(cData.categories || cData || []);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_BASE}/services/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Service deleted");
      fetchAll();
      setDeleteTarget(null);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const res = await fetch(`${API_BASE}/services/${item.id}/toggle-status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (!res.ok) throw new Error("Toggle failed");
      fetchAll();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const handleToggleFeatured = async (item) => {
    try {
      const fd = new FormData();
      fd.append("featured", item.featured ? "false" : "true");
      fd.append("name", item.name);
      fd.append("category_id", item.category_id);
      fd.append("slug", item.slug);
      fd.append("status", item.status);
      await fetch(`${API_BASE}/services/${item.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token()}` },
        body: fd,
      });
      fetchAll();
    } catch { /* silent */ }
  };

  const handleVerifyUpdate = async (item, verify_status) => {
    try {
      const res = await fetch(`${API_BASE}/services/${item.id}/verify`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
        body: JSON.stringify({ verify_status }),
      });
      if (!res.ok) throw new Error("Update failed");
      showToast(`Verify status → ${verify_status}`);
      fetchAll();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  // filter + paginate
  const filtered = services.filter((s) => {
    const q = search.toLowerCase();
    const matchQ = s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q) || (s.code || "").toLowerCase().includes(q);
    const matchCat = filterCat ? String(s.category_id) === filterCat : true;
    const matchStatus = filterStatus ? s.status === filterStatus : true;
    return matchQ && matchCat && matchStatus;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);

  // stats
  const totalActive   = services.filter((s) => s.status === "active").length;
  const totalFeatured = services.filter((s) => s.featured).length;
  const totalVerified = services.filter((s) => s.verify_status === "verified").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .service-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes slide-in { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        @keyframes fade-up { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .animate-fade-up { animation: fade-up 0.4s ease-out both; }
      `}</style>

      <div className="service-root min-h-screen bg-slate-50">
        <Toast toast={toast}/>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-fade-up">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <span>Dashboard</span><span className="text-gray-300">/</span>
                <span>Service</span><span className="text-gray-300">/</span>
                <span className="text-violet-600 font-bold">Services</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Services</h1>
            </div>
            <button onClick={() => { setEditItem(null); setModalOpen(true); }}
              className="flex items-center gap-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-black px-5 py-3 rounded-2xl transition shadow-lg shadow-violet-200 whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
              Add Service
            </button>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total",    value: services.length,  color: "from-violet-500 to-violet-400", icon: "🗂️" },
              { label: "Active",   value: totalActive,      color: "from-emerald-500 to-emerald-400", icon: "✅" },
              { label: "Featured", value: totalFeatured,    color: "from-amber-500 to-amber-400", icon: "⭐" },
              { label: "Verified", value: totalVerified,    color: "from-blue-500 to-blue-400", icon: "🔵" },
            ].map((s, i) => (
              <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white animate-fade-up`} style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-xs font-bold uppercase tracking-widest">{s.label}</span>
                  <span className="text-lg">{s.icon}</span>
                </div>
                <p className="text-3xl font-black">{loading ? "—" : s.value}</p>
              </div>
            ))}
          </div>

          {/* ── Table Card ── */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-up" style={{ animationDelay: "240ms" }}>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 px-5 py-4 border-b border-gray-50">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Show</span>
                <select value={pageSize} onChange={(e) => { setPageSize(+e.target.value); setPage(1); }}
                  className="border border-gray-200 rounded-xl px-2.5 py-1.5 text-sm focus:outline-none focus:border-violet-400">
                  {[5, 10, 25, 50].map((n) => <option key={n}>{n}</option>)}
                </select>
                <span>entries</span>
              </div>
              <div className="flex flex-1 flex-wrap gap-2 sm:justify-end">
                <select value={filterCat} onChange={(e) => { setFilterCat(e.target.value); setPage(1); }}
                  className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-violet-400 bg-white min-w-[130px]">
                  <option value="">All Categories</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                  className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-violet-400 bg-white">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search…"
                    className="border border-gray-200 rounded-xl pl-8 pr-4 py-1.5 text-sm focus:outline-none focus:border-violet-400 w-44"/>
                </div>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100">
                    {["#", "Service", "Code", "Category", "Status", "Verify", "Featured", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={8} className="py-16 text-center">
                      <svg className="animate-spin w-7 h-7 mx-auto text-violet-400 mb-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      <p className="text-gray-400 text-sm">Loading services…</p>
                    </td></tr>
                  ) : paginated.length === 0 ? (
                    <tr><td colSpan={8} className="py-16 text-center text-gray-400 text-sm">No services match your filters.</td></tr>
                  ) : paginated.map((s, i) => (
                    <tr key={s.id} className="hover:bg-violet-50/30 transition-colors group">
                      <td className="px-5 py-4 text-gray-400 font-medium text-xs">{(page - 1) * pageSize + i + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {imgUrl(s.image) ? (
                            <img src={imgUrl(s.image)} alt={s.name} className="w-10 h-10 rounded-xl object-cover border border-gray-100 shadow-sm"/>
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-400 font-black text-sm shrink-0">
                              {s.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-gray-800 max-w-[160px] truncate">{s.name}</p>
                            <p className="text-[11px] text-gray-400 truncate max-w-[160px]">{s.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">{s.code}</span>
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-sm font-medium">{s.category_name || "—"}</td>
                      <td className="px-5 py-4">
                        <button onClick={() => handleToggleStatus(s)} className="focus:outline-none" title="Toggle status">
                          <StatusBadge status={s.status}/>
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <VerifyDropdown item={s} onUpdate={handleVerifyUpdate}/>
                      </td>
                      <td className="px-5 py-4">
                        <Toggle checked={!!s.featured} onChange={() => handleToggleFeatured(s)} size="sm"/>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditItem(s); setModalOpen(true); }}
                            className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-violet-50 hover:border-violet-300 hover:text-violet-600 text-gray-500 transition">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                          </button>
                          <button onClick={() => setDeleteTarget(s)}
                            className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-300 hover:text-red-500 text-gray-500 transition">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-50">
              {loading ? (
                <div className="py-12 text-center text-gray-400 text-sm">Loading…</div>
              ) : paginated.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">No services found.</div>
              ) : paginated.map((s, i) => (
                <div key={s.id} className="px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="text-xs text-gray-400 w-5 mt-1 shrink-0 font-bold">{(page - 1) * pageSize + i + 1}</div>
                    {imgUrl(s.image) ? (
                      <img src={imgUrl(s.image)} alt={s.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-sm shrink-0"/>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-500 font-black text-lg shrink-0">
                        {s.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-gray-800 truncate text-sm">{s.name}</p>
                          <p className="text-[11px] text-gray-400 font-mono truncate">{s.slug}</p>
                        </div>
                        <span className="font-mono text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg whitespace-nowrap shrink-0">{s.code}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{s.category_name || "—"}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <button onClick={() => handleToggleStatus(s)}><StatusBadge status={s.status}/></button>
                        <VerifyDropdown item={s} onUpdate={handleVerifyUpdate}/>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <span>Featured</span>
                          <Toggle checked={!!s.featured} onChange={() => handleToggleFeatured(s)} size="sm"/>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button onClick={() => { setEditItem(s); setModalOpen(true); }}
                        className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-violet-50 text-gray-500 transition">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button onClick={() => setDeleteTarget(s)}
                        className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-red-50 text-gray-500 transition">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-50 text-sm text-gray-500">
                <span className="text-xs">
                  Showing <span className="font-bold text-gray-700">{Math.min((page - 1) * pageSize + 1, filtered.length)}</span>–<span className="font-bold text-gray-700">{Math.min(page * pageSize, filtered.length)}</span> of <span className="font-bold text-gray-700">{filtered.length}</span>
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">← Prev</button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let p = i + 1;
                    if (totalPages > 5 && page > 3) p = page - 2 + i;
                    if (p > totalPages) return null;
                    return (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition ${page === p ? "bg-violet-500 text-white shadow-md shadow-violet-200" : "border border-gray-200 hover:bg-gray-50 text-gray-600"}`}>
                        {p}
                      </button>
                    );
                  })}
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">Next →</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <ServiceModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditItem(null); }}
          onSaved={() => { fetchAll(); showToast(editItem ? "Service updated!" : "Service created!"); }}
          editItem={editItem}
          categories={categories}
        />
        <DeleteModal
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          name={deleteTarget?.name}
          loading={deleteLoading}
        />
      </div>
    </>
  );
}