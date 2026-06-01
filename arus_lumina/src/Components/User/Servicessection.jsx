import { useState, useEffect } from "react";
import BookingModal from "./BookingModal";
import ServiceDetailPage from "./ServiceDetailPage";
const API_BASE1 = import.meta.env.VITE_API_URL;

const API_BASE = `${API_BASE1}/api`;

export default function ServicesSection() {
  const [allServices, setAllServices] = useState([]);
  const [services,    setServices]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [booking,     setBooking]     = useState(null);
  const [viewing,     setViewing]     = useState(null);
  const [activeCat,   setActiveCat]   = useState(null);
  const [catName,     setCatName]     = useState("");

  /* ── Read ?category= from URL on mount ── */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const catId  = params.get("category");
    const name   = params.get("name") || "";
    setActiveCat(catId || null);
    setCatName(decodeURIComponent(name));
  }, []);

  /* ── Listen for browser back/forward ── */
  useEffect(() => {
    const onPop = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveCat(params.get("category") || null);
      setCatName(decodeURIComponent(params.get("name") || ""));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /* ── Fetch all services once ── */
  useEffect(() => {
    fetch(`${API_BASE}/services`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => {
        const all = d.services || d || [];
        setAllServices(all);
      })
      .catch(() => setError("Failed to load services."))
      .finally(() => setLoading(false));
  }, []);

  /* ── Filter whenever activeCat or allServices changes ── */
  useEffect(() => {
    if (!activeCat) {
      setServices(allServices);
    } else {
      const filtered = allServices.filter(svc =>
        String(svc.category_id) === String(activeCat) ||
        String(svc.categoryId)  === String(activeCat) ||
        String(svc.category)    === String(activeCat)
      );
      setServices(filtered);
    }
  }, [activeCat, allServices]);

  /* ── Clear filter ── */
  const clearFilter = () => {
    setActiveCat(null);
    setCatName("");
    window.history.pushState({}, "", "/user/services");
  };

  /* ── Open detail page for a service ── */
  const handleView = (svc) => {
    setViewing(svc);
    setBooking(null); // close booking if open
  };

  /* ── Open booking modal for a service ── */
  const handleBook = (svc) => {
    setBooking(svc);
    setViewing(null); // close detail if open
  };

  /* ── Called from ServiceDetailPage's "Book Service" button ── */
  const handleBookFromDetail = () => {
    if (viewing) {
      const svc = viewing;
      setViewing(null);
      // small delay so detail page unmounts cleanly before modal opens
      setTimeout(() => setBooking(svc), 50);
    }
  };

  /* ── Close detail page ── */
  const handleCloseDetail = () => {
    setViewing(null);
  };

  /* ── Close booking modal ── */
  const handleCloseBooking = () => {
    setBooking(null);
  };

  /* ── Loading ── */
  if (loading) return (
    <div style={styles.center}>
      <div style={styles.spinner} />
      <p style={{ color: "#9ca3af", marginTop: 14, fontSize: "0.9rem" }}>
        Loading services…
      </p>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div style={styles.center}>
      <p style={{ color: "#ef4444" }}>⚠ {error}</p>
    </div>
  );

  return (
    <>
      <style>{CSS}</style>

      <section className="svc-section">

        {/* ── Heading ── */}
        <div className="svc-heading-wrap">
          {activeCat ? (
            <>
              <div className="svc-cat-breadcrumb">
                <a
                  href="/user/services"
                  className="svc-breadcrumb-home"
                  onClick={(e) => { e.preventDefault(); clearFilter(); }}
                >
                  All Services
                </a>
                <span className="svc-breadcrumb-sep">›</span>
                <span className="svc-breadcrumb-current">{catName || "Category"}</span>
              </div>
              <h2 className="svc-heading">
                {catName
                  ? <><span className="svc-heading-accent">{catName}</span> Services</>
                  : <>Filtered <span className="svc-heading-accent">Services</span></>
                }
              </h2>
              <p className="svc-subheading">
                Showing all services under this category
              </p>
              <button
                className="svc-filter-clear svc-filter-clear--pill"
                onClick={clearFilter}
              >
                ✕ Clear filter &amp; show all
              </button>
            </>
          ) : (
            <>
              <h2 className="svc-heading">
                Book <span className="svc-heading-accent">Now</span>
              </h2>
              <p className="svc-subheading">
                Each listing is designed to be clear and concise, providing customers
              </p>
            </>
          )}
        </div>

        {/* ── Grid or empty state ── */}
        {services.length === 0 ? (
          <div style={styles.center}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🔍</div>
            <p style={{ color: "#9ca3af", fontSize: "0.95rem", marginBottom: 16 }}>
              {activeCat
                ? `No services found for "${catName || "this category"}".`
                : "No services available."}
            </p>
            {activeCat && (
              <button
                className="svc-filter-clear svc-filter-clear--standalone"
                onClick={clearFilter}
              >
                ← Show all services
              </button>
            )}
          </div>
        ) : (
          <div className="svc-grid">
            {services.map(svc => (
              <ServiceCard
                key={svc.id || svc._id}
                service={svc}
                onBook={() => handleBook(svc)}
                onView={() => handleView(svc)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Booking Modal ── */}
      {booking && (
        <BookingModal
          service={booking}
          onClose={handleCloseBooking}
        />
      )}

      {/* ── Service Detail Page ── */}
      {viewing && (
        <ServiceDetailPage
          service={viewing}
          onClose={handleCloseDetail}
          onBook={handleBookFromDetail}
        />
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   Individual Service Card
═══════════════════════════════════════════════════════════ */
function ServiceCard({ service, onBook, onView }) {
  const [imgIdx,   setImgIdx]   = useState(0);
  const [imgError, setImgError] = useState(false);

  const images = [
    service.image  ? `${API_BASE1}/uploads/services/${service.image}`  : null,
    service.image2 ? `${API_BASE1}/uploads/services/${service.image2}` : null,
    service.image3 ? `${API_BASE1}/uploads/services/${service.image3}` : null,
  ].filter(Boolean);

  const hasMultiple = images.length > 1;
  const imgSrc = images.length > 0
    ? images[imgIdx]
    : "https://placehold.co/400x240/e2e8f0/94a3b8?text=Service";

  const prevImg = e => {
    e.stopPropagation();
    setImgIdx(i => (i - 1 + images.length) % images.length);
  };
  const nextImg = e => {
    e.stopPropagation();
    setImgIdx(i => (i + 1) % images.length);
  };

  return (
    <div className="svc-card" onClick={onView}>

      {/* ── Image area ── */}
      <div className="svc-card-img-wrap">

        {service.verify_status === "verified" && (
          <div className="svc-card-badge">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}

        <img
          src={imgError
            ? "https://placehold.co/400x240/e2e8f0/94a3b8?text=Service"
            : imgSrc}
          alt={service.name}
          className="svc-card-img"
          onError={() => setImgError(true)}
        />

        {hasMultiple && (
          <>
            <button className="svc-img-arrow svc-img-arrow--left"  onClick={prevImg}>‹</button>
            <button className="svc-img-arrow svc-img-arrow--right" onClick={nextImg}>›</button>
          </>
        )}

        {hasMultiple && (
          <div className="svc-img-dots">
            {images.map((_, i) => (
              <span
                key={i}
                className={`svc-img-dot${i === imgIdx ? " active" : ""}`}
                onClick={e => { e.stopPropagation(); setImgIdx(i); }}
              />
            ))}
          </div>
        )}

        <button
          className="svc-card-fav"
          onClick={e => e.stopPropagation()}
          aria-label="Add to favourites"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* ── Card body ── */}
      <div className="svc-card-body">
        <h3 className="svc-card-name">{service.name}</h3>
        <button
          className="svc-book-btn"
          onClick={e => { e.stopPropagation(); onBook(); }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Inline styles
═══════════════════════════════════════════════════════════ */
const styles = {
  center: {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "80px 20px",
  },
  spinner: {
    width: 36, height: 36,
    border: "3px solid #e5e7eb",
    borderTopColor: "#6366f1",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
};

/* ═══════════════════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Fraunces:wght@600;700&display=swap');

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Section ── */
.svc-section {
  font-family: 'DM Sans', sans-serif;
  padding: 28px 12px 48px;
  background: #f8f9fc;
  box-sizing: border-box;
  width: 100%;
}

/* ── Heading ── */
.svc-heading-wrap { text-align: center; margin-bottom: 40px; }
.svc-heading {
  font-family: 'Fraunces', serif;
  font-size: clamp(1.4rem, 4vw, 2rem);
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px;
}
.svc-heading-accent { color: #a855f7; }
.svc-subheading { color: #6b7280; font-size: 0.95rem; margin: 0 0 12px; }

/* ── Breadcrumb ── */
.svc-cat-breadcrumb {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  font-size: 0.82rem;
}
.svc-breadcrumb-home {
  color: #a855f7;
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.15s;
}
.svc-breadcrumb-home:hover { opacity: 0.75; }
.svc-breadcrumb-sep { color: #9ca3af; }
.svc-breadcrumb-current { color: #374151; font-weight: 500; }

/* ── Filter clear button variants ── */
.svc-filter-clear {
  background: none;
  border: 1.5px solid #a855f7;
  color: #a855f7;
  border-radius: 8px;
  padding: 5px 14px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.18s, color 0.18s;
}
.svc-filter-clear:hover { background: #a855f7; color: #fff; }

.svc-filter-clear--pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  border-radius: 999px;
  padding: 5px 16px;
  background: #fdf4ff;
  border-color: #d8b4fe;
}
.svc-filter-clear--pill:hover { background: #a855f7; border-color: #a855f7; color: #fff; }

.svc-filter-clear--standalone {
  margin-top: 8px;
  padding: 8px 20px;
  font-size: 0.85rem;
  border-radius: 10px;
}

/* ── Grid — always 5 per row ── */
.svc-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  width: 100%;
  box-sizing: border-box;
}
@media (min-width: 900px)  { .svc-grid { gap: 14px; } }
@media (min-width: 1200px) { .svc-section { padding: 60px 40px 80px; } .svc-grid { gap: 20px; } }

/* ── Card ── */
.svc-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}
.svc-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.12);
}
@media (hover: none) {
  .svc-card:hover { transform: none; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
}

/* ── Card image ── */
.svc-card-img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #f3f4f6;
  flex-shrink: 0;
}
.svc-card-img {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
  transition: transform 0.3s;
}
.svc-card:hover .svc-card-img { transform: scale(1.04); }

/* Verified badge */
.svc-card-badge {
  position: absolute; top: 0; left: 0; z-index: 2;
  width: 0; height: 0; border-style: solid;
  border-width: 38px 38px 0 0;
  border-color: #22c55e transparent transparent transparent;
}
.svc-card-badge svg { position: absolute; top: -32px; left: 3px; }

/* Favourite button */
.svc-card-fav {
  position: absolute; top: 8px; right: 8px; z-index: 2;
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(255,255,255,0.9);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #374151;
  transition: color 0.15s, background 0.15s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.12);
  touch-action: manipulation;
}
.svc-card-fav:hover { color: #ef4444; background: #fff; }

/* Slider arrows */
.svc-img-arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  z-index: 2; background: rgba(255,255,255,0.9);
  border: none; border-radius: 50%;
  width: 28px; height: 28px;
  font-size: 1.1rem; cursor: pointer; color: #374151;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  transition: background 0.15s; touch-action: manipulation;
}
.svc-img-arrow:hover { background: #fff; }
.svc-img-arrow--left  { left: 6px; }
.svc-img-arrow--right { right: 6px; }

/* Dots */
.svc-img-dots {
  position: absolute; bottom: 7px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 4px; z-index: 2;
}
.svc-img-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: rgba(255,255,255,0.6); cursor: pointer;
  transition: background 0.15s;
}
.svc-img-dot.active { background: #fff; }

/* ── Card body ── */
.svc-card-body {
  padding: 4px 5px 6px;
  display: flex; flex-direction: column; gap: 4px; flex: 1;
}
.svc-card-name {
  font-size: clamp(0.44rem, 2.2vw, 0.9rem);
  font-weight: 700; color: #111827; margin: 0;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
@media (min-width: 900px)  { .svc-card-body { padding: 10px 12px 12px; gap: 8px; } }
@media (min-width: 1200px) { .svc-card-body { padding: 12px 14px 14px; gap: 10px; } }

/* Book Now button */
.svc-book-btn {
  width: 100%; padding: 4px 0;
  background: #111827; color: #fff;
  border: none; border-radius: 5px;
  font-size: clamp(0.38rem, 1.9vw, 0.82rem);
  font-weight: 700; font-family: 'DM Sans', sans-serif;
  cursor: pointer; letter-spacing: 0;
  transition: background 0.18s, transform 0.15s;
  margin-top: auto; touch-action: manipulation;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.svc-book-btn:hover  { background: #1f2937; transform: translateY(-1px); }
.svc-book-btn:active { transform: translateY(0); }
@media (min-width: 900px)  { .svc-book-btn { padding: 8px 0; border-radius: 8px; } }
@media (min-width: 1200px) { .svc-book-btn { padding: 9px 0; border-radius: 9px; } }

/* Shrink overlay elements on tiny cards */
@media (max-width: 500px) {
  .svc-card-fav { width: 20px; height: 20px; top: 3px; right: 3px; }
  .svc-card-fav svg { width: 9px; height: 9px; }
  .svc-img-arrow { width: 16px; height: 16px; font-size: 0.75rem; }
  .svc-img-arrow--left  { left: 1px; }
  .svc-img-arrow--right { right: 1px; }
  .svc-img-dot { width: 4px; height: 4px; }
  .svc-card-badge { border-width: 26px 26px 0 0; }
  .svc-card-badge svg { top: -22px; left: 2px; width: 8px; height: 8px; }
}
`;