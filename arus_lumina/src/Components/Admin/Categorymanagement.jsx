import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Plus, Pencil, Trash2, Settings, ChevronDown, X, Upload } from "lucide-react";

const API_BASE121 = import.meta.env.VITE_API_URL;
const API_BASE = `${API_BASE121}/api/categories`;
const UPLOADS  = `${API_BASE121}/uploads/categories/`;

const token = () => localStorage.getItem("al_token") || "";
const authHeaders = () => ({ Authorization: `Bearer ${token()}` });

function slugify(str) {
  return str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      aria-pressed={value}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2
        ${value ? "bg-pink-500" : "bg-slate-200"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200
        ${value ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

function DropZone({ label, previewUrl, onFile }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-[13px] font-semibold text-slate-700">{label}</label>
      {previewUrl && (
        <div className="w-14 h-14 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
          <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
        </div>
      )}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]); }}
        onClick={() => inputRef.current.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed px-3 py-5 text-center transition-colors
          ${dragging ? "border-pink-400 bg-pink-50" : "border-slate-200 hover:border-pink-300 hover:bg-pink-50/40"}`}
      >
        <Upload size={16} className="mx-auto mb-1.5 text-slate-400" />
        <p className="text-[12px]">
          <span className="text-pink-500 font-semibold">Click to Upload</span>
          <span className="text-slate-500"> or drag and drop</span>
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">JPG or PNG (Max 450 × 450 px)</p>
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png" className="hidden"
        onChange={(e) => { if (e.target.files[0]) onFile(e.target.files[0]); }} />
    </div>
  );
}

function CategoryModal({ editData, onClose, onSaved }) {
  const isEdit = !!editData;
  const [form, setForm] = useState({
    language: editData?.language || "en",
    name: editData?.name || "",
    slug: editData?.slug || "",
    description: editData?.description || "",
    status: editData?.status === "active",
    featured: editData?.featured === 1,
  });
  const [imageFile, setImageFile] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editData?.image ? UPLOADS + editData.image : null);
  const [iconPreview, setIconPreview] = useState(editData?.icon ? UPLOADS + editData.icon : null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleNameChange = (val) => {
    setForm(f => ({ ...f, name: val, slug: isEdit ? f.slug : slugify(val) }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError("Category name is required."); return; }
    setSaving(true); setError("");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === "status") fd.append("status", v ? "active" : "inactive");
      else if (k === "featured") fd.append("featured", v ? "true" : "false");
      else fd.append(k, v);
    });
    if (imageFile) fd.append("image", imageFile);
    if (iconFile) fd.append("icon", iconFile);
    try {
      const url = isEdit ? `${API_BASE}/${editData.id}` : API_BASE;
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: authHeaders(), body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Something went wrong."); return; }
      onSaved(data.category);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white w-full sm:max-w-[680px] sm:mx-4 sm:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col"
        style={{ maxHeight: "92dvh" }}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-[16px] sm:text-[17px] font-bold text-slate-800">
            {isEdit ? "Edit Category" : "Add Category"}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center"
          >
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-4 sm:py-5 space-y-4 overscroll-contain">

          {/* Language */}
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Language</label>
            <div className="relative">
              <select
                value={form.language}
                onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                className="w-full appearance-none rounded-xl border border-slate-200 px-4 py-3 pr-10 text-[14px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                <option value="en">English</option>
                <option value="ar">Arabic</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Name + Slug — stacked on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Category Name</label>
              <input
                type="text"
                placeholder="Enter Category Name"
                value={form.name}
                onChange={e => handleNameChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[14px] text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Slug</label>
              <input
                type="text"
                placeholder="Enter Slug"
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[14px] text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>

          {/* Image + Icon — stacked on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DropZone label="Image" previewUrl={imagePreview} onFile={(f) => { setImageFile(f); setImagePreview(URL.createObjectURL(f)); }} />
            <DropZone label="Icon"  previewUrl={iconPreview}  onFile={(f) => { setIconFile(f);  setIconPreview(URL.createObjectURL(f));  }} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Description</label>
            <textarea
              rows={3}
              placeholder="Enter Description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[14px] text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
            />
          </div>

          {/* Status + Featured */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-3">
              <span className="text-[13px] font-semibold text-slate-700">Status</span>
              <Toggle value={form.status} onChange={v => setForm(f => ({ ...f, status: v }))} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-3">
              <span className="text-[13px] font-semibold text-slate-700">Featured</span>
              <Toggle value={form.featured} onChange={v => setForm(f => ({ ...f, featured: v }))} />
            </div>
          </div>

          {error && (
            <p className="text-[13px] text-red-500 bg-red-50 px-4 py-2.5 rounded-xl border border-red-200">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-3 px-4 sm:px-6 py-4 border-t border-slate-100 shrink-0"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-[13.5px] font-medium text-slate-600 hover:bg-slate-50 transition-colors active:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 px-4 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white text-[13.5px] font-semibold transition-colors disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ category, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const confirm = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${category.id}`, { method: "DELETE", headers: authHeaders() });
      if (res.ok) onDeleted(category.id);
      else onClose();
    } catch { onClose(); } finally { setLoading(false); }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white w-full sm:max-w-sm sm:mx-4 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4"
        style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex justify-center sm:hidden mb-1">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
            <Trash2 size={18} className="text-red-500" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-[15px]">Delete Category</p>
            <p className="text-[13px] text-slate-500 mt-0.5 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">"{category.name}"</span>?
              This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-200 text-[13.5px] font-medium text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-[13.5px] font-semibold transition-colors disabled:opacity-60"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const active = status === "active";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap
      ${active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? "bg-green-500" : "bg-slate-400"}`} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function FeaturedToggle({ category, onToggled }) {
  const [loading, setLoading] = useState(false);
  const toggle = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("featured", category.featured === 1 ? "false" : "true");
      const res = await fetch(`${API_BASE}/${category.id}`, { method: "PUT", headers: authHeaders(), body: fd });
      if (res.ok) { const data = await res.json(); onToggled(data.category); }
    } finally { setLoading(false); }
  };
  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-pressed={category.featured === 1}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-1
        ${category.featured === 1 ? "bg-pink-500" : "bg-slate-200"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200
        ${category.featured === 1 ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

/* ── Mobile card ── */
function CategoryCard({ cat, idx, onEdit, onDelete, onToggled }) {
  return (
    <div className="px-4 py-4 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
          {cat.image
            ? <img src={UPLOADS + cat.image} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
            : <div className="w-full h-full flex items-center justify-center text-slate-400 text-[14px] font-bold uppercase">{cat.name?.charAt(0)}</div>
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[14px] font-semibold text-slate-800 truncate">{cat.name}</p>
            <span className="text-[11px] text-slate-400 shrink-0 bg-slate-100 px-1.5 py-0.5 rounded-md font-mono">#{idx}</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">{cat.slug}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <StatusBadge status={cat.status} />
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-slate-500 font-medium">Featured</span>
          <FeaturedToggle category={cat} onToggled={onToggled} />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={() => onEdit(cat)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12.5px] font-semibold text-blue-600 bg-blue-50 active:bg-blue-100 transition-colors"
        >
          <Pencil size={13} /> Edit
        </button>
        <button
          onClick={() => onDelete(cat)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12.5px] font-semibold text-red-500 bg-red-50 active:bg-red-100 transition-colors"
        >
          <Trash2 size={13} /> Delete
        </button>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 active:bg-slate-200 transition-colors shrink-0"
        >
          <Settings size={14} className="text-slate-500" />
        </button>
      </div>
    </div>
  );
}

function SkeletonRows({ count = 5 }) {
  return Array.from({ length: count }).map((_, i) => (
    <tr key={i} className="border-b border-slate-100">
      {[10, 200, 120, 80, 60, 70].map((w, j) => (
        <td key={j} className="px-5 py-4">
          <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: w }} />
        </td>
      ))}
    </tr>
  ));
}

function MobileSkeletonCards({ count = 4 }) {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className="px-4 py-4 border-b border-slate-100 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-slate-100 rounded w-3/4" />
          <div className="h-2.5 bg-slate-100 rounded w-1/2" />
        </div>
      </div>
      <div className="flex justify-between">
        <div className="h-6 bg-slate-100 rounded-full w-16" />
        <div className="h-6 bg-slate-100 rounded-full w-24" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-9 bg-slate-100 rounded-xl" />
        <div className="flex-1 h-9 bg-slate-100 rounded-xl" />
        <div className="w-10 h-9 bg-slate-100 rounded-xl" />
      </div>
    </div>
  ));
}

/* ── Main Page ── */
export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [language, setLanguage] = useState("en");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setCategories(data.categories || []);
    } catch { setCategories([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const filtered = categories.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.slug?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleSaved = (cat) => {
    setCategories(prev => {
      const idx = prev.findIndex(c => c.id === cat.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = cat; return next; }
      return [cat, ...prev];
    });
    setShowModal(false); setEditData(null);
  };
  const handleDeleted = (id) => { setCategories(prev => prev.filter(c => c.id !== id)); setDeleteTarget(null); };
  const handleToggled = (updated) => { setCategories(prev => prev.map(c => c.id === updated.id ? updated : c)); };
  const openAdd = () => { setEditData(null); setShowModal(true); };
  const openEdit = (cat) => { setEditData(cat); setShowModal(true); };

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, "…", totalPages];
    if (page >= totalPages - 2) return [1, "…", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "…", page - 1, page, page + 1, "…", totalPages];
  };

  return (
    <div className="min-h-screen bg-slate-50" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-4 sm:mb-6">
          <p className="text-[11px] sm:text-[12px] text-slate-400 mb-1.5">
            Dashboard <span className="mx-1 text-slate-300">/</span>
            Service <span className="mx-1 text-slate-300">/</span>
            <span className="text-slate-600 font-medium">Category</span>
          </p>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h1 className="text-[20px] sm:text-[24px] font-bold text-slate-800 leading-tight">Category</h1>
            <div className="flex items-center gap-2">
              {/* Language selector */}
              <div className="relative">
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-300 h-10"
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                  <option value="fr">French</option>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              {/* Add button */}
              <button
                onClick={openAdd}
                className="flex items-center gap-1.5 px-4 h-10 rounded-xl bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white text-[13.5px] font-semibold transition-colors whitespace-nowrap"
              >
                <Plus size={15} />
                <span>Add Category</span>
              </button>
            </div>
          </div>
        </div>

        {/* Summary stats — mobile only */}
        {!loading && (
          <div className="grid grid-cols-3 gap-2 mb-4 sm:hidden">
            {[
              { label: "Total", value: categories.length, color: "text-slate-700", bg: "bg-white" },
              { label: "Active", value: categories.filter(c => c.status === "active").length, color: "text-green-700", bg: "bg-green-50" },
              { label: "Featured", value: categories.filter(c => c.featured === 1).length, color: "text-pink-700", bg: "bg-pink-50" },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-xl border border-slate-100 p-3 text-center`}>
                <p className={`text-[20px] font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Controls bar */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-[13px] text-slate-600">
              <span>Show</span>
              <select
                value={perPage}
                onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                {[5, 10, 25, 50].map(n => <option key={n}>{n}</option>)}
              </select>
              <span className="text-slate-500">entries</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-slate-500 shrink-0">Search:</span>
              <div className="relative flex-1 sm:flex-none">
                <input
                  type="search"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="w-full sm:w-56 rounded-xl border border-slate-200 pl-4 pr-9 py-2 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="Search categories…"
                />
                <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-left">
                  {["#", "Category", "Slug", "Status", "Featured", "Actions"].map((h, i) => (
                    <th key={h} className={`px-5 py-3.5 text-[11.5px] font-bold text-slate-500 uppercase tracking-wider
                      ${i === 0 ? "w-10" : ""} ${h === "Actions" ? "text-right" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <SkeletonRows count={perPage > 10 ? 10 : perPage} />
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Search size={28} strokeWidth={1.5} />
                        <p className="text-[14px]">No categories found.</p>
                        {search && <p className="text-[12px]">Try a different search term.</p>}
                      </div>
                    </td>
                  </tr>
                ) : paginated.map((cat, idx) => (
                  <tr key={cat.id} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors group">
                    <td className="px-5 py-4 text-[13px] text-slate-400 font-mono">{(page - 1) * perPage + idx + 1}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          {cat.image
                            ? <img src={UPLOADS + cat.image} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
                            : <div className="w-full h-full flex items-center justify-center text-slate-300 text-[11px] font-bold uppercase">{cat.name?.charAt(0)}</div>
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-medium text-slate-800 truncate max-w-[160px]">{cat.name}</p>
                          {cat.description && (
                            <p className="text-[11.5px] text-slate-400 truncate max-w-[160px] mt-0.5">{cat.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-slate-500 font-mono max-w-[140px]">
                      <span className="truncate block">{cat.slug}</span>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={cat.status} /></td>
                    <td className="px-5 py-4"><FeaturedToggle category={cat} onToggled={handleToggled} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 justify-end opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(cat)}
                          title="Edit"
                          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-500 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
                          title="Delete"
                          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                        <button
                          title="Settings"
                          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <Settings size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="sm:hidden">
            {loading ? (
              <MobileSkeletonCards count={4} />
            ) : paginated.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-2 text-slate-400">
                <Search size={28} strokeWidth={1.5} />
                <p className="text-[14px]">No categories found.</p>
                {search && <p className="text-[12px]">Try a different search term.</p>}
              </div>
            ) : paginated.map((cat, idx) => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                idx={(page - 1) * perPage + idx + 1}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
                onToggled={handleToggled}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-4 border-t border-slate-100">
            <p className="text-[12px] text-slate-500 text-center sm:text-left order-2 sm:order-1">
              {filtered.length === 0
                ? "No results"
                : `Showing ${(page - 1) * perPage + 1}–${Math.min(page * perPage, filtered.length)} of ${filtered.length} entries`
              }
            </p>

            <div className="flex items-center justify-center gap-1 order-1 sm:order-2 flex-wrap">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="hidden sm:flex px-3 py-1.5 rounded-lg border border-slate-200 text-[12px] text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >«</button>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >Prev</button>

              {/* Page numbers — desktop */}
              <div className="hidden sm:flex items-center gap-1">
                {getPageNumbers().map((pg, i) =>
                  pg === "…" ? (
                    <span key={`e-${i}`} className="w-8 text-center text-[13px] text-slate-400">…</span>
                  ) : (
                    <button
                      key={pg}
                      onClick={() => setPage(pg)}
                      className={`w-8 h-8 rounded-lg text-[13px] font-semibold transition-colors
                        ${pg === page ? "bg-pink-500 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                    >{pg}</button>
                  )
                )}
              </div>

              {/* Mobile: current page indicator */}
              <span className="sm:hidden text-[13px] text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold">
                {page} / {totalPages}
              </span>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >Next</button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="hidden sm:flex px-3 py-1.5 rounded-lg border border-slate-200 text-[12px] text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >»</button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <CategoryModal
          editData={editData}
          onClose={() => { setShowModal(false); setEditData(null); }}
          onSaved={handleSaved}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          category={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}