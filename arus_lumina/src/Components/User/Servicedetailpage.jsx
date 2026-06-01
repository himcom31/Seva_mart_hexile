import { useState, useEffect } from "react";
import BookingModal from "./BookingModal";
const API_BASE1 = import.meta.env.VITE_API_URL;

const API_BASE = `${API_BASE1}/api`;

// ── ServiceDetailPage ─────────────────────────────────────────────────────────
// Props:
//   service  — the service object (from the card click)
//   onClose  — called to close/go back
//   onBook   — called to open booking modal from parent
//             (if not provided, the page manages its own modal)
export default function ServiceDetailPage({ service, onClose, onBook: onBookProp }) {
  const [subServices,  setSubServices]  = useState([]);
  const [loadingSubs,  setLoadingSubs]  = useState(true);
  const [bookingOpen,  setBookingOpen]  = useState(false);

  // Fetch sub-services for this service
  useEffect(() => {
    if (!service?.id) return;
    fetch(`${API_BASE}/subservices/by-service/${service.id}`)
      .then(r => r.json())
      .then(d => {
        const list = Array.isArray(d) ? d : (d.subServices || d.data || []);
        setSubServices(list.filter(s => s.status === "active" || !s.status));
      })
      .catch(() => setSubServices([]))
      .finally(() => setLoadingSubs(false));
  }, [service?.id]);

  if (!service) return null;

  // Collect all gallery images
  const galleryImages = [
    service.image  ? `${API_BASE1}/uploads/services/${service.image}`  : null,
    service.image2 ? `${API_BASE1}/uploads/services/${service.image2}` : null,
    service.image3 ? `${API_BASE1}/uploads/services/${service.image3}` : null,
  ].filter(Boolean);

  const mainImg = galleryImages[0] || "https://placehold.co/600x380/e2e8f0/94a3b8?text=Service";

  const handleBook = () => {
    if (onBookProp) onBookProp();
    else setBookingOpen(true);
  };

  const fmtPrice = (p) => {
    if (p == null || p === "") return null;
    const n = parseFloat(p);
    return isNaN(n) ? null : `₹${n.toLocaleString("en-IN")}`;
  };

  return (
    <>
      <style>{DETAIL_CSS}</style>

      {/* Full-page overlay */}
      <div className="sd-overlay">
        <div className="sd-page">

          {/* ── Top nav / back ── */}
          <div className="sd-topnav">
            <button className="sd-back-btn" onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back
            </button>
            <div className="sd-breadcrumb">
              <span onClick={onClose} className="sd-breadcrumb-link">Services</span>
              <span className="sd-breadcrumb-sep">›</span>
              <span className="sd-breadcrumb-cur">Service Details</span>
            </div>
          </div>

          {/* ── Page title + Book button ── */}
          <div className="sd-title-bar">
            <div className="sd-title-info">
              <h1 className="sd-title">{service.name}</h1>
              <div className="sd-meta-row">
                {service.category_name && (
                  <span className="sd-meta-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {service.category_name}
                  </span>
                )}
                {service.verify_status === "verified" && (
                  <span className="sd-verified-badge">✓ Verified</span>
                )}
                {service.code && (
                  <span className="sd-code-badge">#{service.code}</span>
                )}
              </div>
            </div>
            <button className="sd-book-btn" onClick={handleBook}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Book Service
            </button>
          </div>

          {/* ── Main content grid ── */}
          <div className="sd-content">

            {/* LEFT: main image + detail sections */}
            <div className="sd-left">

              {/* Main image */}
              <div className="sd-main-img-wrap">
                <img
                  src={mainImg}
                  alt={service.name}
                  className="sd-main-img"
                  onError={e => e.target.src = "https://placehold.co/600x380/e2e8f0/94a3b8?text=Service"}
                />
              </div>

              {/* Thumbnail strip */}
              {galleryImages.length > 1 && (
                <div className="sd-thumbs">
                  {galleryImages.map((img, i) => (
                    <img key={i} src={img} alt="" className="sd-thumb"
                      onError={e => e.target.style.display = "none"}/>
                  ))}
                </div>
              )}

              {/* ── Service Overview ── */}
              {service.description && (
                <Accordion title="Service Overview" defaultOpen>
                  <p className="sd-overview-text">{service.description}</p>
                </Accordion>
              )}

              {/* ── Services Offered (Sub-services) ── */}
              <Accordion title="Services Offered" defaultOpen>
                {loadingSubs ? (
                  <div className="sd-loading-row">
                    <span className="sd-spinner"/>
                    Loading sub-services…
                  </div>
                ) : subServices.length === 0 ? (
                  <p className="sd-empty-text">No sub-services listed.</p>
                ) : (
                  <div className="sd-subservices">
                    {subServices.map(ss => {
                      const price = fmtPrice(ss.price);
                      const icon = ss.icon
                        ? `${API_BASE1}/uploads/subservices/${ss.icon}`
                        : null;
                      return (
                        <div key={ss.id} className="sd-subsvc-row">
                          <div className="sd-subsvc-left">
                            {/* Icon */}
                            <div className="sd-subsvc-icon">
                              {icon ? (
                                <img src={icon} alt=""
                                  onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}/>
                              ) : null}
                              <span className="sd-subsvc-letter" style={icon ? {display:"none"} : {}}>
                                {ss.name?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                            <div className="sd-subsvc-info">
                              <div className="sd-subsvc-name">{ss.name}</div>
                              {ss.description && (
                                <div className="sd-subsvc-desc">{ss.description}</div>
                              )}
                            </div>
                          </div>
                          {price && (
                            <div className="sd-subsvc-price">{price}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Accordion>

              {/* ── Includes (Category) ── */}
              <Accordion title="Includes" defaultOpen>
                {service.category_name ? (
                  <div className="sd-includes-list">
                    <span className="sd-include-tag">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {service.category_name}
                    </span>
                  </div>
                ) : (
                  <p className="sd-empty-text">No category assigned.</p>
                )}
              </Accordion>

              {/* ── Gallery ── */}
              <Accordion title="Gallery" defaultOpen>
                {galleryImages.length === 0 ? (
                  <p className="sd-empty-text">No images available.</p>
                ) : (
                  <div className="sd-gallery">
                    {galleryImages.map((img, i) => (
                      <div key={i} className="sd-gallery-item">
                        <img src={img} alt={`Gallery ${i+1}`}
                          onError={e => e.target.parentElement.style.display="none"}/>
                      </div>
                    ))}
                  </div>
                )}
              </Accordion>

            </div>

            {/* RIGHT: sticky Book Now card (desktop) */}
            <div className="sd-right">
              <div className="sd-sticky-card">
                <button className="sd-sticky-book-btn" onClick={handleBook}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Book Service
                </button>

                {/* Quick info */}
                <div className="sd-sticky-info">
                  {service.category_name && (
                    <div className="sd-sticky-row">
                      <span className="sd-sticky-label">Category</span>
                      <span className="sd-sticky-val">{service.category_name}</span>
                    </div>
                  )}
                  {service.status && (
                    <div className="sd-sticky-row">
                      <span className="sd-sticky-label">Status</span>
                      <span className={`sd-status-chip sd-status-${service.status}`}>
                        {service.status}
                      </span>
                    </div>
                  )}
                  {subServices.length > 0 && (
                    <div className="sd-sticky-row">
                      <span className="sd-sticky-label">Sub-services</span>
                      <span className="sd-sticky-val">{subServices.length} available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal (self-managed when no onBook prop) */}
      {bookingOpen && (
        <BookingModal service={service} onClose={() => setBookingOpen(false)} />
      )}
    </>
  );
}

// ── Accordion ─────────────────────────────────────────────────────────────────
function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="sd-accordion">
      <button className="sd-accordion-header" onClick={() => setOpen(o => !o)}>
        <span>{title}</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && <div className="sd-accordion-body">{children}</div>}
    </div>
  );
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const DETAIL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Fraunces:wght@600;700&display=swap');

/* ── Overlay — full screen page ── */
.sd-overlay {
  position: fixed; inset: 0; z-index: 8000;
  background: #f8f9fc;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  animation: sdFadeIn 0.2s ease;
}
@keyframes sdFadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }

.sd-page {
  font-family: 'DM Sans', sans-serif;
  max-width: 1080px;
  margin: 0 auto;
  padding: 20px 24px 80px;
  color: #111827;
}
@media (max-width: 600px) { .sd-page { padding: 12px 14px 60px; } }

/* ── Top nav ── */
.sd-topnav {
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 20px;
}
.sd-back-btn {
  display: flex; align-items: center; gap: 5px;
  background: #fff; border: 1.5px solid #e5e7eb;
  border-radius: 9px; padding: 7px 14px;
  font-size: 0.82rem; font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  color: #374151; cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.sd-back-btn:hover { border-color: #6366f1; color: #6366f1; }
.sd-breadcrumb {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.8rem; color: #9ca3af;
}
.sd-breadcrumb-link { cursor: pointer; color: #6b7280; }
.sd-breadcrumb-link:hover { color: #6366f1; }
.sd-breadcrumb-sep { color: #d1d5db; }
.sd-breadcrumb-cur { color: #374151; font-weight: 600; }

/* ── Title bar ── */
.sd-title-bar {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 16px; margin-bottom: 20px; flex-wrap: wrap;
}
.sd-title {
  font-family: 'Fraunces', serif;
  font-size: 1.5rem; font-weight: 700;
  color: #111827; margin: 0 0 8px;
  line-height: 1.2;
}
@media (max-width: 600px) { .sd-title { font-size: 1.2rem; } }
.sd-meta-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.sd-meta-item {
  display: flex; align-items: center; gap: 4px;
  font-size: 0.8rem; color: #6b7280;
}
.sd-verified-badge {
  font-size: 0.72rem; font-weight: 700; color: #16a34a;
  background: #dcfce7; padding: 2px 9px; border-radius: 20px;
}
.sd-code-badge {
  font-size: 0.72rem; font-weight: 600; color: #6b7280;
  background: #f3f4f6; padding: 2px 8px; border-radius: 6px;
}
.sd-book-btn {
  display: flex; align-items: center; gap: 7px;
  background: #ec4899; color: #fff;
  border: none; border-radius: 10px;
  padding: 12px 24px;
  font-size: 0.9rem; font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; white-space: nowrap;
  transition: background 0.18s, transform 0.15s;
  flex-shrink: 0;
}
.sd-book-btn:hover { background: #db2777; transform: translateY(-1px); }

/* ── Content grid ── */
.sd-content {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 28px;
  align-items: start;
}
@media (max-width: 860px) {
  .sd-content { grid-template-columns: 1fr; }
  .sd-right { display: none; } /* hide sticky on mobile — top button is sufficient */
}

/* ── Left column ── */
.sd-left { display: flex; flex-direction: column; gap: 0; }

/* ── Main image ── */
.sd-main-img-wrap {
  width: 100%; border-radius: 16px; overflow: hidden;
  background: #e5e7eb; margin-bottom: 10px;
  aspect-ratio: 16/9;
}
.sd-main-img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* Thumbnails */
.sd-thumbs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
.sd-thumb {
  width: 72px; height: 56px; border-radius: 9px; object-fit: cover;
  border: 2px solid #e5e7eb; cursor: pointer; transition: border-color 0.15s;
}
.sd-thumb:hover { border-color: #6366f1; }

/* ── Accordion ── */
.sd-accordion {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  margin-bottom: 12px;
  overflow: hidden;
}
.sd-accordion-header {
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  padding: 15px 18px;
  background: none; border: none; cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem; font-weight: 700; color: #111827;
  text-align: left; gap: 8px;
}
.sd-accordion-header:hover { background: #f9fafb; }
.sd-accordion-body { padding: 4px 18px 18px; }

/* Overview text */
.sd-overview-text {
  font-size: 0.875rem; color: #4b5563; line-height: 1.7; margin: 0;
}
.sd-empty-text { font-size: 0.85rem; color: #9ca3af; margin: 0; }

/* Sub-services */
.sd-subservices { display: flex; flex-direction: column; gap: 0; }
.sd-subsvc-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
  gap: 12px;
}
.sd-subsvc-row:last-child { border-bottom: none; }
.sd-subsvc-left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
.sd-subsvc-icon {
  width: 40px; height: 40px; border-radius: 9px;
  background: #f3f4f6; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.sd-subsvc-icon img { width: 100%; height: 100%; object-fit: cover; }
.sd-subsvc-letter { font-size: 0.9rem; font-weight: 700; color: #9ca3af; }
.sd-subsvc-info { flex: 1; min-width: 0; }
.sd-subsvc-name { font-size: 0.875rem; font-weight: 700; color: #111827; }
.sd-subsvc-desc { font-size: 0.78rem; color: #6b7280; margin-top: 2px; line-height: 1.4; }
.sd-subsvc-price {
  font-size: 0.9rem; font-weight: 700; color: #111827;
  white-space: nowrap; flex-shrink: 0;
  background: #f9fafb; border: 1px solid #e5e7eb;
  padding: 3px 12px; border-radius: 20px;
}

/* Loading */
.sd-loading-row {
  display: flex; align-items: center; gap: 8px;
  color: #9ca3af; font-size: 0.85rem; padding: 8px 0;
}
.sd-spinner {
  width: 14px; height: 14px;
  border: 2px solid #e5e7eb; border-top-color: #6366f1;
  border-radius: 50%; animation: sdSpin 0.7s linear infinite; flex-shrink: 0;
}
@keyframes sdSpin { to { transform: rotate(360deg); } }

/* Includes */
.sd-includes-list { display: flex; flex-wrap: wrap; gap: 8px; }
.sd-include-tag {
  display: inline-flex; align-items: center; gap: 6px;
  background: #f0fdf4; color: #16a34a;
  border: 1px solid #bbf7d0;
  padding: 5px 12px; border-radius: 20px;
  font-size: 0.82rem; font-weight: 600;
}

/* Gallery */
.sd-gallery { display: flex; flex-wrap: wrap; gap: 10px; }
.sd-gallery-item {
  width: 120px; height: 90px; border-radius: 10px;
  overflow: hidden; background: #f3f4f6;
  border: 1px solid #e5e7eb;
}
.sd-gallery-item img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}

/* ── Right sticky card ── */
.sd-right { position: sticky; top: 20px; }
.sd-sticky-card {
  background: #fff; border: 1px solid #e5e7eb;
  border-radius: 16px; padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.07);
}
.sd-sticky-book-btn {
  width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
  background: #ec4899; color: #fff;
  border: none; border-radius: 10px; padding: 13px 0;
  font-size: 0.9rem; font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; margin-bottom: 18px;
  transition: background 0.18s, transform 0.15s;
}
.sd-sticky-book-btn:hover { background: #db2777; transform: translateY(-1px); }
.sd-sticky-info { display: flex; flex-direction: column; gap: 12px; }
.sd-sticky-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.sd-sticky-label { font-size: 0.78rem; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; }
.sd-sticky-val { font-size: 0.85rem; font-weight: 600; color: #111827; text-align: right; }
.sd-status-chip {
  font-size: 0.72rem; font-weight: 700; padding: 2px 9px; border-radius: 20px; text-transform: capitalize;
}
.sd-status-active   { background: #dcfce7; color: #16a34a; }
.sd-status-inactive { background: #fee2e2; color: #dc2626; }
`;