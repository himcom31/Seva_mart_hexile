import { useState, useEffect, useCallback } from "react";
import BookingModal from "../../Components/User/Bookingmodal.jsx";
import ServiceDetailPage from "../../Components/User/Servicedetailpage.jsx"; // adjust path if needed

const API_BAS1 = import.meta.env.VITE_API_URL;

const API_BASE = `${API_BAS1}/api`;
const imgSrc = (url) =>
  url || "https://placehold.co/400x260/e2e8f0/94a3b8?text=No+Image";

const sortServices = (list, mode) => {
  const copy = [...list];
  if (mode === "a-z") return copy.sort((a, b) => a.name.localeCompare(b.name));
  if (mode === "z-a") return copy.sort((a, b) => b.name.localeCompare(a.name));
  if (mode === "newest") return copy.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  if (mode === "oldest") return copy.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  return copy;
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "a-z", label: "Name: A → Z" },
  { value: "z-a", label: "Name: Z → A" },
];

const ITEMS_PER_PAGE = 9;

// ── ServiceCard ───────────────────────────────────────────────────────────────
function ServiceCard({ service, onViewDetail, onBook }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="service-card">
      <div className="card-image-wrap" onClick={() => onViewDetail(service)} style={{ cursor: "pointer" }}>
        <img
          src={imgError ? "https://placehold.co/400x260/e2e8f0/94a3b8?text=No+Image" : imgSrc(service.image)}

          alt={service.name}
          onError={() => setImgError(true)}
          className="card-image"
        />
        {service.category_name && (
          <span className="card-category-tag">{service.category_name}</span>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-title" onClick={() => onViewDetail(service)} style={{ cursor: "pointer" }}>
          {service.name}
        </h3>
        <div className="card-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>Patna, Bihar</span>
        </div>
        <div className="card-footer">
          <span className="card-status" data-status={service.status}>{service.status}</span>
          {service.verify_status === "verified" && (
            <span className="card-verified">✓ Verified</span>
          )}
        </div>
        {/* Book Now opens the Booking Modal */}
        <button className="btn-book-card" onClick={() => onBook(service)}>Book Now</button>
      </div>
    </div>
  );
}

// ── Main ServicesPage ─────────────────────────────────────────────────────────
export default function ServicesPage() {
  const [allServices, setAllServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  // Read ?category= from URL so navbar category links land on the right filter
  const [activeCategory, setActiveCategory] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("category") || "all";
  });
  const [showMore, setShowMore] = useState(false);
  const [sortMode, setSortMode] = useState("newest");
  const [page, setPage] = useState(1);

  // detailService: opens ServiceDetailPage (full-screen)
  const [detailService, setDetailService] = useState(null);
  // bookingService: opens BookingModal
  const [bookingService, setBookingService] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sRes, cRes] = await Promise.all([
          fetch(`${API_BASE}/services`),
          fetch(`${API_BASE}/categories`),
        ]);
        const sData = await sRes.json();
        const cData = await cRes.json();
        setAllServices(sData.services || []);
        setCategories(cData.categories || []);
      } catch (err) {
        setError("Failed to load services. Please check your backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sync filter when browser back/forward changes the URL
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveCategory(params.get("category") || "all");
      setPage(1);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Keep the URL in sync when the user changes category inside the page
  const handleCategoryChange = (catId) => {
    const params = new URLSearchParams(window.location.search);
    if (catId === "all") {
      params.delete("category");
    } else {
      params.set("category", catId);
    }
    const newUrl = `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`;
    window.history.pushState({}, "", newUrl);
    setActiveCategory(catId);
    setPage(1);
  };

  const filtered = useCallback(() => {
    let list = allServices.filter((s) => s.status === "active");
    if (activeCategory !== "all") {
      list = list.filter((s) => String(s.category_id) === String(activeCategory));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.description && s.description.toLowerCase().includes(q)) ||
          (s.category_name && s.category_name.toLowerCase().includes(q))
      );
    }
    return sortServices(list, sortMode);
  }, [allServices, activeCategory, search, sortMode]);

  const results = filtered();
  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const paginated = results.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const resetFilters = () => {
    setSearch(""); handleCategoryChange("all"); setSortMode("newest");
  };

  const visibleCats = showMore ? categories : categories.slice(0, 5);

  return (
    <>
      <style>{CSS}</style>

      <div className="page-header">
        <h1 className="page-title">Services</h1>
        <nav className="breadcrumb">
          <span>🏠</span>
          <span className="bc-sep">›</span>
          <span>Services</span>
        </nav>
      </div>

      <div className="services-layout">
        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-title-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="14" y2="12" />
                <line x1="4" y1="18" x2="10" y2="18" />
              </svg>
              <span className="sidebar-title">Filters</span>
            </div>
            <button className="reset-btn" onClick={resetFilters}>Reset Filter</button>
          </div>

          <div className="filter-section">
            <label className="filter-label">Search By Keyword</label>
            <div className="search-input-wrap">
              <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="search-input"
                placeholder="What are you looking for?"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-toggle-row">
              <span className="filter-label">Categories</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            <ul className="category-list">
              <li
                className={`cat-item ${activeCategory === "all" ? "active" : ""}`}
                onClick={() => handleCategoryChange("all")}
              >All Category</li>
              {visibleCats.map((c) => (
                <li
                  key={c.id}
                  className={`cat-item ${String(activeCategory) === String(c.id) ? "active" : ""}`}
                  onClick={() => handleCategoryChange(String(c.id))}
                >
                  {c.name}
                </li>
              ))}
            </ul>
            {categories.length > 5 && (
              <button className="view-more-btn" onClick={() => setShowMore(!showMore)}>
                {showMore ? "View less ▲" : "View more ▾"}
              </button>
            )}
          </div>

          <button className="search-sidebar-btn" onClick={() => setPage(1)}>Search</button>
        </aside>

        {/* ── Main ── */}
        <main className="main-content">
          <div className="toolbar">
            <p className="results-count">
              Found <span className="count-highlight">{results.length} Services</span>
            </p>
            <div className="sort-wrap">
              <span className="sort-label">Sort</span>
              <div className="sort-select-wrap">
                <select
                  className="sort-select"
                  value={sortMode}
                  onChange={(e) => { setSortMode(e.target.value); setPage(1); }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <svg className="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="state-box">
              <div className="spinner" />
              <p>Loading services…</p>
            </div>
          ) : error ? (
            <div className="state-box error-state">
              <p>{error}</p>
              <button className="search-sidebar-btn" style={{ width: "auto", padding: "10px 24px" }} onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : paginated.length === 0 ? (
            <div className="state-box">
              <p>No services found matching your filters.</p>
              <button className="reset-btn" style={{ marginTop: 12 }} onClick={resetFilters}>Reset Filters</button>
            </div>
          ) : (
            <div className="service-grid">
              {paginated.map((s) => (
                <ServiceCard
                  key={s.id}
                  service={s}
                  onViewDetail={setDetailService}
                  onBook={setBookingService}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button className="page-btn prev-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>
                ← Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`page-btn ${p === page ? "active-page" : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button className="page-btn next-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                Next →
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ── Service Detail Page (full-screen overlay) ── */}
      {detailService && (
        <ServiceDetailPage
          service={detailService}
          onClose={() => setDetailService(null)}
          onBook={(svc) => {
            setDetailService(null);                    // close detail page first
            setBookingService(svc ?? detailService);   // open booking modal
          }}
        />
      )}

      {/* ── Booking Modal ── */}
      {bookingService && (
        <BookingModal
          service={bookingService}
          onClose={() => setBookingService(null)}
        />
      )}
    </>
  );
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:ital,wght@0,600;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body, #root {
  font-family: 'DM Sans', sans-serif;
  background: #f8f9fc;
  color: #1a1a2e;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #f0f4ff 0%, #fdf2fa 100%);
  padding: 48px 40px 40px;
  text-align: center;
  border-bottom: 1px solid #e8eaf0;
}
.page-title {
  font-family: 'Fraunces', serif;
  font-size: 2.4rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 10px;
  letter-spacing: -0.5px;
}
.breadcrumb {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.875rem;
  color: #6b7280;
}
.bc-sep { color: #9ca3af; }

.services-layout {
  display: flex;
  gap: 28px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 36px 24px 60px;
  align-items: flex-start;
}

.sidebar {
  width: 272px;
  flex-shrink: 0;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  position: sticky;
  top: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 20px;
}
.sidebar-title-row { display: flex; align-items: center; gap: 7px; }
.sidebar-title { font-weight: 600; font-size: 0.95rem; color: #111827; }
.reset-btn {
  background: none;
  border: none;
  font-size: 0.8rem;
  color: #6b7280;
  cursor: pointer;
  font-family: inherit;
  padding: 3px 0;
  text-decoration: underline;
}
.reset-btn:hover { color: #111827; }
.filter-section { margin-bottom: 24px; }
.filter-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 10px;
}
.filter-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.filter-toggle-row .filter-label { margin-bottom: 0; }
.search-input-wrap { position: relative; }
.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}
.search-input {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 9px 12px 9px 34px;
  font-size: 0.85rem;
  font-family: inherit;
  color: #374151;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus { border-color: #6366f1; }
.search-input::placeholder { color: #d1d5db; }
.category-list { list-style: none; }
.cat-item {
  padding: 7px 10px;
  font-size: 0.875rem;
  color: #4b5563;
  border-radius: 7px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  margin-bottom: 2px;
}
.cat-item:hover { background: #f3f4f6; color: #111827; }
.cat-item.active { background: #ede9fe; color: #4f46e5; font-weight: 600; }
.view-more-btn {
  background: none;
  border: none;
  color: #ec4899;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  margin-top: 6px;
  padding: 2px 0;
}
.view-more-btn:hover { color: #be185d; }
.search-sidebar-btn {
  width: 100%;
  background: #111827;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 4px;
}
.search-sidebar-btn:hover { background: #374151; }

.main-content { flex: 1; min-width: 0; }
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.results-count { font-size: 1rem; color: #374151; }
.count-highlight { color: #ec4899; font-weight: 700; }
.sort-wrap { display: flex; align-items: center; gap: 10px; }
.sort-label { font-size: 0.875rem; color: #6b7280; }
.sort-select-wrap { position: relative; display: flex; align-items: center; }
.sort-select {
  appearance: none;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 7px 34px 7px 12px;
  font-size: 0.85rem;
  font-family: inherit;
  color: #374151;
  background: #fff;
  cursor: pointer;
  outline: none;
}
.select-arrow { position: absolute; right: 10px; pointer-events: none; color: #9ca3af; }

.service-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}
@media (max-width: 900px) {
  .service-grid { grid-template-columns: repeat(2, 1fr); }
  .services-layout { flex-direction: column; }
  .sidebar { width: 100%; position: static; }
}
@media (max-width: 560px) {
  .service-grid { grid-template-columns: 1fr; }
}

.service-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
  display: flex;
  flex-direction: column;
}
.service-card:hover {
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  transform: translateY(-3px);
  border-color: #c7d2fe;
}
.card-image-wrap { position: relative; overflow: hidden; }
.card-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s;
}
.service-card:hover .card-image { transform: scale(1.04); }
.card-category-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255,255,255,0.92);
  border: 1px solid #e5e7eb;
  color: #374151;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  backdrop-filter: blur(4px);
}
.card-body { padding: 14px 16px 16px; display: flex; flex-direction: column; flex: 1; }
.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
  line-height: 1.35;
}
.card-location {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 10px;
}
.card-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 12px;
}
.card-status {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 20px;
  text-transform: capitalize;
}
.card-status[data-status="active"]   { background: #dcfce7; color: #16a34a; }
.card-status[data-status="inactive"] { background: #fee2e2; color: #dc2626; }
.card-verified {
  font-size: 0.72rem;
  font-weight: 600;
  color: #2563eb;
  background: #dbeafe;
  padding: 3px 9px;
  border-radius: 20px;
}
.btn-book-card {
  width: 100%;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 10px;
  font-size: 0.875rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  margin-top: auto;
}
.btn-book-card:hover { background: #4338ca; transform: translateY(-1px); }
.btn-book-card:active { transform: none; }

.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
  gap: 16px;
}
.error-state { color: #dc2626; }
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 40px;
}
.page-btn {
  min-width: 38px;
  height: 38px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
  font-weight: 500;
}
.page-btn:hover:not(:disabled) { border-color: #6366f1; color: #6366f1; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-btn.active-page { background: #6366f1; border-color: #6366f1; color: #fff; font-weight: 700; }
.prev-btn, .next-btn { padding: 0 16px; font-size: 0.82rem; }
`;