import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL 
const ICONS = [
  { id: "wrench", emoji: "🔧" },
  { id: "house", emoji: "🏠" },
  { id: "car", emoji: "🚗" },
  { id: "leaf", emoji: "🌿" },
  { id: "laptop", emoji: "💻" },
  { id: "scissors", emoji: "✂️" },
  { id: "building", emoji: "🏢" },
  { id: "heart", emoji: "❤️" },
  { id: "shirt", emoji: "👕" },
  { id: "camera", emoji: "📷" },
  { id: "bolt", emoji: "⚡" },
  { id: "drop", emoji: "💧" },
  { id: "flame", emoji: "🔥" },
  { id: "shield", emoji: "🛡️" },
  { id: "star", emoji: "⭐" },
  { id: "settings", emoji: "⚙️" },
];

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// ─── Reusable Components ──────────────────────────────────────────────────────

const Badge = ({ active }) =>
  active ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
      Inactive
    </span>
  );

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-blue-700 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg animate-pulse">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      {message}
    </div>
  );
};

// ─── Add/Edit Modal ───────────────────────────────────────────────────────────

const CategoryModal = ({ mode, category, onClose, onSave }) => {
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [icon, setIcon] = useState(category?.icon || ICONS[0].id);
  const [isActive, setIsActive] = useState(category?.is_active ?? 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const slug = slugify(name);

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Category name is required."); return; }
    setError("");
    setLoading(true);
    try {
      const payload = { name: name.trim(), description, icon, is_active: isActive };
      let res;
      if (mode === "edit") {
        res = await axios.put(`${API}/api/vendor-categories/${category.id}`, payload);
      } else {
        res = await axios.post(`${API}/api/vendor-categories`, payload);
      }
      onSave(res.data.data, mode);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">
            {mode === "edit" ? "Edit category" : "Add vendor category"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Category name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Plumbing Services"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {name && (
              <p className="mt-1 text-xs text-gray-400 font-mono">
                slug: <span className="text-gray-600">{slug}</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Brief description of this category..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Icon picker */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Icon</label>
            <div className="grid grid-cols-8 gap-1.5">
              {ICONS.map((ic) => (
                <button
                  key={ic.id}
                  onClick={() => setIcon(ic.id)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition border
                    ${icon === ic.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-100 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {ic.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Status (edit only) */}
          {mode === "edit" && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
              <select
                value={isActive}
                onChange={(e) => setIsActive(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 text-sm font-medium bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Saving..." : mode === "edit" ? "Update category" : "Save category"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

const DeleteModal = ({ category, onClose, onConfirm, loading }) => (
  <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl text-center p-8">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-gray-800 mb-1">Delete category?</h3>
      <p className="text-sm text-gray-500 mb-6">
        This will permanently delete <span className="font-medium text-gray-700">{category.name}</span> and cannot be undone.
      </p>
      <div className="flex justify-center gap-3">
        <button onClick={onClose} className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="px-5 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-60"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VendorCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(null); // null | { mode: 'add'|'edit', category? }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/api/vendor-categories`);
      setCategories(res.data.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // Handle save from modal
  const handleSave = (savedCat, mode) => {
    if (mode === "edit") {
      setCategories((prev) => prev.map((c) => (c.id === savedCat.id ? savedCat : c)));
      showToast("Category updated successfully");
    } else {
      setCategories((prev) => [savedCat, ...prev]);
      showToast("Category added successfully");
    }
    setModal(null);
  };

  // Toggle active status
  const handleToggle = async (cat) => {
    try {
      await axios.patch(`${API}/api/vendor-categories/${cat.id}/deactivate`);
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, is_active: c.is_active ? 0 : 1 } : c))
      );
      showToast(cat.is_active ? "Category deactivated" : "Category activated");
    } catch {
      showToast("Failed to update status");
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`${API}/api/vendor-categories/${deleteTarget.id}`);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      showToast("Category deleted");
      setDeleteTarget(null);
    } catch {
      showToast("Failed to delete category");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtered view
  const filtered = categories.filter((c) => {
    if (filter === "active" && !c.is_active) return false;
    if (filter === "inactive" && c.is_active) return false;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.slug.includes(q);
  });

  const total = categories.length;
  const activeCount = categories.filter((c) => c.is_active).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">Vendor Categories</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage service categories for vendors and customers</p>
          </div>
          <button
            onClick={() => setModal({ mode: "add" })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add category
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total", value: total, note: "All time" },
            { label: "Active", value: activeCount, note: "Visible to users", green: true },
            { label: "Inactive", value: total - activeCount, note: "Hidden" },
            { label: "This month", value: 2, note: "New additions" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className={`text-2xl font-semibold ${s.green ? "text-green-600" : "text-gray-800"}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.note}</p>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-gray-100">
            {/* Filter tabs */}
            <div className="flex gap-1">
              {["all", "active", "inactive"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition
                    ${filter === f
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:bg-gray-50"
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 max-w-xs">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent text-xs text-gray-700 outline-none w-full placeholder-gray-400"
              />
            </div>

            <span className="ml-auto text-xs text-gray-400">
              {filtered.length} {filtered.length === 1 ? "category" : "categories"}
            </span>
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-16 text-center text-sm text-gray-400">Loading categories...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">
              <p className="text-3xl mb-3">🔍</p>
              No categories found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Icon", "Name", "Slug", "Status", "Created", "Actions"].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-5 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cat) => {
                    const iconData = ICONS.find((i) => i.id === cat.icon) || ICONS[0];
                    return (
                      <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-base">
                            {iconData.emoji}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-800">{cat.name}</p>
                          {cat.description && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{cat.description}</p>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {cat.slug}
                          </code>
                        </td>
                        <td className="px-5 py-3">
                          <Badge active={cat.is_active} />
                        </td>
                        <td className="px-5 py-3 text-xs text-gray-400">
                          {cat.created_at?.slice(0, 10)}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5">
                            {/* Edit */}
                            <button
                              onClick={() => setModal({ mode: "edit", category: cat })}
                              title="Edit"
                              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {/* Toggle active */}
                            <button
                              onClick={() => handleToggle(cat)}
                              title={cat.is_active ? "Deactivate" : "Activate"}
                              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 transition"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cat.is_active ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                              </svg>
                            </button>
                            {/* Delete */}
                            <button
                              onClick={() => setDeleteTarget(cat)}
                              title="Delete"
                              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <CategoryModal
          mode={modal.mode}
          category={modal.category}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          category={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}