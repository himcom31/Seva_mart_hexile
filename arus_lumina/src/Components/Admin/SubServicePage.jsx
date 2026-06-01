import { useState, useEffect, useRef, useCallback } from "react";
const API_BASE1 = import.meta.env.VITE_API_URL;

const API_BASE = `${API_BASE1}/api`;

// ── helpers ──────────────────────────────────────────────────────────────────
const token  = () => localStorage.getItem("al_token") || "";
const imgUrl = (filename) =>
  filename ? `${API_BASE.replace("/api", "")}/uploads/subservices/${filename}` : null;

function generateSlug(name) {
  return name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? "bg-pink-500" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ── ImageUpload ───────────────────────────────────────────────────────────────
function ImageUpload({ label, file, preview, onChange, onRemove }) {
  const ref = useRef();
  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) onChange(f);
  };
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      {preview ? (
        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
          <img src={preview} alt={label} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center leading-none"
          >×</button>
        </div>
      ) : (
        <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
      )}
      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-colors"
        onClick={() => ref.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <svg className="w-5 h-5 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
        </svg>
        <p className="text-xs text-gray-500">
          <span className="text-pink-500 font-semibold">Click to Upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-400 mt-0.5">JPG or PNG (Max 2 MB)</p>
        <input ref={ref} type="file" accept="image/*" className="hidden"
          onChange={(e) => onChange(e.target.files[0])} />
      </div>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function SubServiceModal({ open, onClose, onSaved, editItem, services }) {
  const isEdit = !!editItem;

  const blank = { service_id: "", name: "", slug: "", description: "", price: "", status: true, featured: false };
  const [form, setForm]               = useState(blank);
  const [imageFile, setImageFile]     = useState(null);
  const [iconFile,  setIconFile]      = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [iconPreview,  setIconPreview]  = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error,   setError]           = useState("");

  // Group services by category for the <select>
  const grouped = services.reduce((acc, svc) => {
    const cat = svc.category_name || "Uncategorised";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(svc);
    return acc;
  }, {});

  useEffect(() => {
    if (editItem) {
      setForm({
        service_id:  editItem.service_id  ?? "",
        name:        editItem.name        ?? "",
        slug:        editItem.slug        ?? "",
        description: editItem.description ?? "",
        price:       editItem.price       ?? "",
        status:      editItem.status === "active",
        featured:    !!editItem.featured,
      });
      setImagePreview(imgUrl(editItem.image));
      setIconPreview(imgUrl(editItem.icon));
      setImageFile(null);
      setIconFile(null);
    } else {
      setForm(blank);
      setImageFile(null); setIconFile(null);
      setImagePreview(null); setIconPreview(null);
    }
    setError("");
  }, [editItem, open]);

  const handleNameChange = (v) =>
    setForm((f) => ({ ...f, name: v, slug: isEdit ? f.slug : generateSlug(v) }));

  const pickFile = (file, setFile, setPreview) => {
    setFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.service_id)   return setError("Please select a service.");
    if (!form.name.trim())  return setError("Sub service name is required.");
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("service_id",  form.service_id);
      fd.append("name",        form.name);
      fd.append("slug",        form.slug || generateSlug(form.name));
      fd.append("description", form.description);
      fd.append("price",       form.price);
      fd.append("status",      form.status   ? "active"   : "inactive");
      fd.append("featured",    form.featured ? "true"     : "false");
      if (imageFile) fd.append("image", imageFile);
      if (iconFile)  fd.append("icon",  iconFile);

      const url    = isEdit
        ? `${API_BASE}/subservices/${editItem.id}`
        : `${API_BASE}/subservices`;
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token()}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      onSaved();
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 py-6 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            {isEdit ? "Edit Sub Service" : "Add Sub Service"}
          </h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-sm">{error}</div>
          )}

          {/* Parent Service */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Parent Service
            </label>
            <select
              value={form.service_id}
              onChange={(e) => setForm((f) => ({ ...f, service_id: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 appearance-none"
            >
              <option value="">— Select a service —</option>
              {Object.entries(grouped).map(([cat, svcs]) => (
                <optgroup key={cat} label={cat}>
                  {svcs.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Name + Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sub Service Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. LED TV Repair"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="led-tv-repair"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Price <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="0.00"
                className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>
          </div>

          {/* Image + Icon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUpload
              label="Image"
              file={imageFile}
              preview={imagePreview}
              onChange={(f) => pickFile(f, setImageFile, setImagePreview)}
              onRemove={() => { setImageFile(null); setImagePreview(null); }}
            />
            <ImageUpload
              label="Icon"
              file={iconFile}
              preview={iconPreview}
              onChange={(f) => pickFile(f, setIconFile, setIconPreview)}
              onRemove={() => { setIconFile(null); setIconPreview(null); }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of this sub service…"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 resize-none"
            />
          </div>

          {/* Status + Featured */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">Status</span>
              <Toggle checked={form.status}   onChange={(v) => setForm((f) => ({ ...f, status: v }))} />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">Featured</span>
              <Toggle checked={form.featured} onChange={(v) => setForm((f) => ({ ...f, featured: v }))} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex justify-end gap-3">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-pink-500 text-white text-sm font-bold hover:bg-pink-600 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            )}
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DeleteConfirm ─────────────────────────────────────────────────────────────
function DeleteConfirm({ open, onClose, onConfirm, name, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Delete Sub Service</h3>
            <p className="text-xs text-gray-500">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-800">"{name}"</span>?
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition disabled:opacity-60">
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SubServicePage() {
  const [subServices, setSubServices] = useState([]);
  const [services,    setServices]    = useState([]);   // parent services (not categories)
  const [loading,     setLoading]     = useState(true);

  // filters
  const [search,      setSearch]      = useState("");
  const [filterSvc,   setFilterSvc]   = useState("");   // filter by service_id
  const [pageSize,    setPageSize]    = useState(10);
  const [page,        setPage]        = useState(1);

  // modals
  const [modalOpen,     setModalOpen]     = useState(false);
  const [editItem,      setEditItem]      = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [ssRes, svcRes] = await Promise.all([
        fetch(`${API_BASE}/subservices`),
        fetch(`${API_BASE}/services`),        // fetch services as parents
      ]);
      const ssData  = await ssRes.json();
      const svcData = await svcRes.json();
      setSubServices(ssData.subServices || []);
      setServices(svcData.services || svcData || []);
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
      const res = await fetch(`${API_BASE}/subservices/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Sub Service deleted successfully");
      fetchAll();
      setDeleteTarget(null);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleFeatured = async (item) => {
    try {
      const fd = new FormData();
      fd.append("featured",   item.featured ? "false" : "true");
      fd.append("service_id", item.service_id);
      fd.append("name",       item.name);
      fd.append("slug",       item.slug);
      fd.append("status",     item.status);
      await fetch(`${API_BASE}/subservices/${item.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token()}` },
        body: fd,
      });
      fetchAll();
    } catch { /* silent */ }
  };

  // filtered + paginated
  const filtered = subServices.filter((s) => {
    const q          = search.toLowerCase();
    const matchSearch = !q ||
      s.name?.toLowerCase().includes(q) ||
      s.slug?.toLowerCase().includes(q) ||
      s.service_name?.toLowerCase().includes(q);
    const matchSvc   = filterSvc ? String(s.service_id) === String(filterSvc) : true;
    return matchSearch && matchSvc;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Unique services list for the filter dropdown
  const uniqueServices = services;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-xl shadow-lg text-sm font-semibold text-white transition-all ${
          toast.type === "error" ? "bg-red-500" : "bg-green-500"
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Sub Services</h1>
            <nav className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <span>Dashboard</span><span>/</span><span>Service</span><span>/</span>
              <span className="text-gray-600 font-medium">Sub Services</span>
            </nav>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            {/* Filter by service */}
            <select
              value={filterSvc}
              onChange={(e) => { setFilterSvc(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-pink-400 min-w-[180px]"
            >
              <option value="">All Services</option>
              {uniqueServices.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <button
              onClick={() => { setEditItem(null); setModalOpen(true); }}
              className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-sm whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
              </svg>
              Add Sub Service
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-pink-400 text-sm"
              >
                {[5, 10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <span>entries</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Search:</span>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search…"
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-pink-400 w-48 sm:w-56"
              />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["#", "Sub Service", "Service", "Category", "Price", "Status", "Featured", "Action"].map((h) => (
                    <th key={h}
                      className="text-left px-5 py-3 text-gray-600 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={9} className="py-16 text-center text-gray-400">
                    <svg className="animate-spin w-6 h-6 mx-auto mb-2 text-pink-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Loading…
                  </td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={9} className="py-16 text-center text-gray-400">No sub services found.</td></tr>
                ) : paginated.map((s, i) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-gray-500 font-medium">
                      {(page - 1) * pageSize + i + 1}
                    </td>

                    {/* Name + image */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {imgUrl(s.image) ? (
                          <img src={imgUrl(s.image)} alt={s.name}
                            className="w-11 h-11 rounded-lg object-cover border border-gray-100" />
                        ) : (
                          <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800 max-w-[160px] truncate">{s.name}</p>
                          {s.icon && <p className="text-xs text-gray-400 mt-0.5">Has icon</p>}
                        </div>
                      </div>
                    </td>


                    {/* Parent service */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {s.service_name || "—"}
                      </span>
                    </td>

                    {/* Category (grandparent) */}
                    <td className="px-5 py-4 text-gray-500 text-xs">{s.category_name || "—"}</td>

                    {/* Price */}
                    <td className="px-5 py-4 font-semibold text-gray-700">
                      {s.price != null ? `₹${Number(s.price).toLocaleString("en-IN")}` : <span className="text-gray-300 font-normal">—</span>}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        s.status === "active"
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          s.status === "active" ? "bg-green-500" : "bg-gray-400"
                        }`}/>
                        {s.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Featured */}
                    <td className="px-5 py-4">
                      <Toggle checked={!!s.featured} onChange={() => handleToggleFeatured(s)} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditItem(s); setModalOpen(true); }}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition text-gray-500 hover:text-blue-500"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition text-gray-500 hover:text-red-500"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {loading ? (
              <div className="py-12 text-center text-gray-400 text-sm">Loading…</div>
            ) : paginated.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">No sub services found.</div>
            ) : paginated.map((s, i) => (
              <div key={s.id} className="px-4 py-4 flex items-start gap-3">
                <div className="text-xs text-gray-400 w-5 mt-1 shrink-0">
                  {(page - 1) * pageSize + i + 1}
                </div>
                {imgUrl(s.image) ? (
                  <img src={imgUrl(s.image)} alt={s.name}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{s.name}</p>
                  <p className="text-xs text-gray-400 truncate">{s.slug}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                      {s.service_name || "—"}
                    </span>
                    {s.category_name && (
                      <span className="text-xs text-gray-400">{s.category_name}</span>
                    )}
                  </div>
                  {s.price != null && (
                    <p className="text-xs font-semibold text-gray-700 mt-1">
                      ₹{Number(s.price).toLocaleString("en-IN")}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      s.status === "active" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.status === "active" ? "bg-green-500" : "bg-gray-400"}`}/>
                      {s.status === "active" ? "Active" : "Inactive"}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span>Featured</span>
                      <Toggle checked={!!s.featured} onChange={() => handleToggleFeatured(s)} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => { setEditItem(s); setModalOpen(true); }}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-blue-50 transition text-gray-500 hover:text-blue-500"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(s)}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-red-50 transition text-gray-500 hover:text-red-500"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 text-sm text-gray-500">
              <span>
                Showing {Math.min((page - 1) * pageSize + 1, filtered.length)}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium transition"
                >Previous</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p = i + 1;
                  if (totalPages > 5 && page > 3) p = page - 2 + i;
                  if (p > totalPages) return null;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                        page === p
                          ? "bg-pink-500 text-white border border-pink-500"
                          : "border border-gray-200 hover:bg-gray-50"
                      }`}>
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium transition"
                >Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <SubServiceModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditItem(null); }}
        onSaved={() => {
          fetchAll();
          showToast(editItem ? "Sub Service updated!" : "Sub Service added!");
        }}
        editItem={editItem}
        services={services}
      />
      <DeleteConfirm
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        name={deleteTarget?.name}
        loading={deleteLoading}
      />
    </div>
  );
}