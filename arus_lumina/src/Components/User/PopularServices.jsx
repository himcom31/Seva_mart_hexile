import { useState, useEffect, useRef } from "react";

const API_BASE1 = import.meta.env.VITE_API_URL;

const API_BASE = `${API_BASE1}/api`;

const imgUrl = (_, file) => file || null;  // file is now a full Cloudinary URL


const fmtPrice = (p) => {
  if (p == null || p === "") return null;
  const n = parseFloat(p);
  return isNaN(n) ? null : `₹${n.toLocaleString("en-IN")}`;
};

const pad = (n) => String(n).padStart(2, "0");
const TODAY = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
const toYMD = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const fmtDisp = (ymd) => {
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-");
  return `${d} ${MONTH_NAMES[parseInt(m) - 1]} ${y}`;
};
function buildCalendar(year, month) {
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
  return cells;
}

const TIME_SLOTS = ["09 AM - 11 AM", "11 AM - 01 PM", "01 PM - 03 PM", "03 PM - 05 PM", "05 PM - 07 PM", "07 PM - 09 PM"];
const OTHERS_ENTRY = { id: "__others__", name: "Others", description: "Something not listed above" };

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedService, setSelectedService] = useState(null);
  return selectedService ? (
    <ServiceDetailPage service={selectedService} onClose={() => setSelectedService(null)} />
  ) : (
    <PopularServicesSection onSelectService={setSelectedService} />
  );
}

// ─── Popular Services Section ─────────────────────────────────────────────────
function PopularServicesSection({ onSelectService }) {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingSvcs, setLoadingSvcs] = useState(false);
  const [wished, setWished] = useState({});
  // Horizontal scroll ref for category tabs on mobile
  const tabsRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((r) => r.json())
      .then((d) => {
        const cats = d.categories || d || [];
        setCategories(cats);
        if (cats.length > 0) setActiveCategory(cats[0].id);
      })
      .catch(() => setCategories([]))
      .finally(() => setLoadingCats(false));
  }, []);

  useEffect(() => {
    if (!activeCategory) return;
    setLoadingSvcs(true);
    fetch(`${API_BASE}/services/by-category/${activeCategory}`)
      .then((r) => r.json())
      .then((d) => {
        const svcs = d.services || d || [];
        const active = svcs.filter((s) => s.status === "active" || !s.status);
        const latest4 = [...active]
          .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
          .slice(0, 4);
        setServices(latest4);
      })
      .catch(() => setServices([]))
      .finally(() => setLoadingSvcs(false));
  }, [activeCategory]);

  const toggleWish = (e, id) => {
    e.stopPropagation();
    setWished((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-10 sm:py-16 px-4 bg-white">
      {/* Heading */}
      <div className="text-center mb-8 sm:mb-10 px-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          Our Popular{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Services
          </span>
        </h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
          Each listing is designed to be clear and concise, providing customers
          with all the information they need.
        </p>
      </div>

      {/* Category Tabs — horizontally scrollable on mobile */}
      {loadingCats ? (
        <div className="flex gap-3 mb-8 sm:mb-10 overflow-hidden px-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-9 w-24 flex-shrink-0 bg-gray-100 rounded-full animate-pulse" />
          ))}
        </div>
      ) : (
        <div
          ref={tabsRef}
          className="flex gap-2 mb-8 sm:mb-10 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:justify-center scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 sm:px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${activeCategory === cat.id
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white border-transparent shadow-md shadow-pink-200"
                  : "bg-white text-gray-600 border-gray-200 hover:border-pink-300 hover:text-pink-500"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Service Cards */}
      {loadingSvcs ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 max-w-6xl mx-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
              <div className="h-36 sm:h-48 bg-gray-200" />
              <div className="p-3 sm:p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 sm:py-20 text-gray-400">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium text-sm">No services found in this category.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between max-w-6xl mx-auto mb-3 px-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Latest {services.length}
            </span>
            <span className="text-[11px] text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
              Newest first
            </span>
          </div>

          {/* 2-col on mobile, 4-col on lg */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 max-w-6xl mx-auto">
            {services.map((svc, idx) => {
              const thumb = svc.image || "https://placehold.co/400x260/f1f5f9/94a3b8?text=Service";

              const lowestPrice = fmtPrice(svc.price);
              return (
                <div
                  key={svc.id}
                  onClick={() => onSelectService(svc)}
                  className="group cursor-pointer rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={thumb}
                      alt={svc.name}
                      className="w-full h-36 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => (e.target.src = "https://placehold.co/400x260/f1f5f9/94a3b8?text=Service")}
                    />
                    <button
                      onClick={(e) => toggleWish(e, svc.id)}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow hover:scale-110 transition-transform"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24"
                        fill={wished[svc.id] ? "#ec4899" : "none"}
                        stroke={wished[svc.id] ? "#ec4899" : "#9ca3af"}
                        strokeWidth="2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        NEW
                      </span>
                    )}
                    {svc.verify_status === "verified" && idx !== 0 && (
                      <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-green-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-snug mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                      {svc.name}
                    </h3>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-0.5">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="#facc15">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span className="text-[10px] sm:text-xs text-gray-500 font-medium">5.0</span>
                      </div>
                      {lowestPrice ? (
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-700 truncate">From {lowestPrice}</span>
                      ) : (
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-400">Details →</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {services.length > 0 && (
        <div className="flex justify-center mt-8 sm:mt-10">
          <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-7 sm:px-8 py-3 rounded-full transition-all duration-200 text-sm hover:gap-3">
            View All
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}

// ─── Service Detail Page ──────────────────────────────────────────────────────
function ServiceDetailPage({ service, onClose }) {
  const [subServices, setSubServices] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!service?.id) return;
    fetch(`${API_BASE}/subservices/by-service/${service.id}`)
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d) ? d : d.subServices || d.data || [];
        setSubServices(list.filter((s) => s.status === "active" || !s.status));
      })
      .catch(() => setSubServices([]))
      .finally(() => setLoadingSubs(false));
  }, [service?.id]);

  if (!service) return null;

  const galleryImages = [
    service.image,
    service.image2,
    service.image3,
  ].filter(Boolean);

  const mainImg = galleryImages[activeImg] || "https://placehold.co/800x500/f1f5f9/94a3b8?text=Service";

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-28 sm:pb-10">

        {/* Top Nav */}
        <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 sm:gap-2 bg-white border border-gray-200 hover:border-pink-400 hover:text-pink-500 text-gray-600 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl transition-all flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-400 min-w-0">
            <span className="cursor-pointer hover:text-pink-500 transition-colors flex-shrink-0" onClick={onClose}>Services</span>
            <span className="flex-shrink-0">›</span>
            <span className="text-gray-700 font-semibold truncate">Service Details</span>
          </nav>
        </div>

        {/* Title Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight mb-2 leading-tight">
                {service.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                {service.category_name && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {service.category_name}
                  </span>
                )}
                {service.verify_status === "verified" && (
                  <span className="text-[11px] font-bold text-green-600 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                    ✓ Verified
                  </span>
                )}
                {service.code && (
                  <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                    #{service.code}
                  </span>
                )}
              </div>
            </div>
            {/* Book button hidden on mobile — shown in sticky bottom bar */}
            <button
              onClick={() => setBookingOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-pink-200 hover:-translate-y-0.5 transition-all duration-200 text-sm flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Book Service
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">

          {/* LEFT */}
          <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-4">
            {/* Main image */}
            <div className="rounded-2xl overflow-hidden bg-gray-200 w-full" style={{ aspectRatio: "16/9" }}>
              <img
                src={mainImg} alt={service.name}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = "https://placehold.co/800x500/f1f5f9/94a3b8?text=Service")}
              />
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {galleryImages.map((img, i) => (
                  <button
                    key={i} onClick={() => setActiveImg(i)}
                    className={`w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${activeImg === i ? "border-pink-500" : "border-gray-200 hover:border-pink-300"
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {service.description && (
              <Accordion title="Service Overview" defaultOpen>
                <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
              </Accordion>
            )}

            <Accordion title="Services Offered" defaultOpen>
              {loadingSubs ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
                  <span className="w-4 h-4 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin flex-shrink-0" />
                  Loading sub-services…
                </div>
              ) : subServices.length === 0 ? (
                <p className="text-sm text-gray-400">No sub-services listed.</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {subServices.map((ss) => {
                    const price = fmtPrice(ss.price);
                    const icon = imgUrl("subservices", ss.icon);
                    return (
                      <div key={ss.id} className="flex items-center justify-between py-3 gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {icon ? (
                              <img src={icon} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm font-bold text-gray-400">{ss.name?.charAt(0)?.toUpperCase()}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-gray-800 truncate">{ss.name}</div>
                            {ss.description && (
                              <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{ss.description}</div>
                            )}
                          </div>
                        </div>
                        {price && (
                          <span className="text-xs sm:text-sm font-bold text-gray-800 bg-gray-50 border border-gray-200 px-2.5 sm:px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                            {price}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Accordion>

            <Accordion title="Includes" defaultOpen>
              {service.category_name ? (
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full text-xs font-semibold">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {service.category_name}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No category assigned.</p>
              )}
            </Accordion>

            <Accordion title="Gallery" defaultOpen>
              {galleryImages.length === 0 ? (
                <p className="text-sm text-gray-400">No images available.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {galleryImages.map((img, i) => (
                    <div key={i} className="w-24 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                      <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </Accordion>
          </div>

          {/* RIGHT Sticky — desktop only */}
          <div className="hidden lg:block">
            <div className="sticky top-6 bg-white border border-gray-200 rounded-2xl p-5 shadow-lg shadow-gray-100">
              <button
                onClick={() => setBookingOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 rounded-xl shadow-md shadow-pink-200 hover:-translate-y-0.5 transition-all duration-200 text-sm mb-5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Book Service
              </button>
              <div className="flex flex-col gap-3">
                {service.category_name && (
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Category</span>
                    <span className="text-sm font-semibold text-gray-800">{service.category_name}</span>
                  </div>
                )}
                {service.status && (
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Status</span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${service.status === "active"
                        ? "bg-green-50 text-green-600 border border-green-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                      }`}>{service.status}</span>
                  </div>
                )}
                {subServices.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Sub-services</span>
                    <span className="text-sm font-semibold text-gray-800">{subServices.length} available</span>
                  </div>
                )}
                {service.verify_status && (
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Verify</span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${service.verify_status === "verified" ? "bg-green-50 text-green-600 border border-green-200"
                        : service.verify_status === "rejected" ? "bg-red-50 text-red-600 border border-red-200"
                          : "bg-yellow-50 text-yellow-600 border border-yellow-200"
                      }`}>{service.verify_status}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom Book button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 px-4 py-3 safe-bottom">
        <button
          onClick={() => setBookingOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-200 text-sm active:scale-[0.98] transition-transform"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Book Service
        </button>
      </div>

      {bookingOpen && (
        <BookingModal service={service} onClose={() => setBookingOpen(false)} />
      )}
    </div>
  );
}

// ─── Accordion ────────────────────────────────────────────────────────────────
function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 text-sm font-bold text-gray-800 hover:bg-gray-50 transition-colors text-left"
      >
        <span>{title}</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          className={`transition-transform duration-200 flex-shrink-0 ml-2 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="px-4 sm:px-5 pb-4 sm:pb-5">{children}</div>}
    </div>
  );
}

// ─── Custom Date Picker ───────────────────────────────────────────────────────
function CustomDatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const init = value ? new Date(value + "T00:00:00") : new Date();
  const [viewYear, setVY] = useState(init.getFullYear());
  const [viewMonth, setVM] = useState(init.getMonth());

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const cells = buildCalendar(viewYear, viewMonth);
  const prev = () => { if (viewMonth === 0) { setVM(11); setVY(viewYear - 1); } else setVM(viewMonth - 1); };
  const next = () => { if (viewMonth === 11) { setVM(0); setVY(viewYear + 1); } else setVM(viewMonth + 1); };
  const isPast = (d) => d < TODAY;
  const isSelected = (d) => value && toYMD(d) === value;
  const isToday = (d) => toYMD(d) === toYMD(TODAY);
  const select = (d) => { if (isPast(d)) return; onChange(toYMD(d)); setOpen(false); };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 w-full border-2 rounded-xl px-3 py-2.5 text-sm font-medium bg-white text-gray-800 transition-all ${open ? "border-indigo-500 ring-2 ring-indigo-100" : "border-gray-200 hover:border-indigo-400"
          }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 flex-shrink-0">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span className="flex-1 text-left truncate">{value ? fmtDisp(value) : "Select date"}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        /* Calendar — fixed on mobile so it doesn't overflow the modal */
        <div className="absolute top-full left-0 mt-1.5 z-[200] bg-white border border-gray-200 rounded-2xl shadow-xl p-3 sm:p-4 w-[calc(100vw-2rem)] max-w-[17rem] sm:w-72">
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={prev} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-colors text-lg leading-none">‹</button>
            <span className="text-sm font-bold text-gray-800">{MONTH_NAMES[viewMonth]} {viewYear}</span>
            <button type="button" onClick={next} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-colors text-lg leading-none">›</button>
          </div>
          <div className="grid grid-cols-7 mb-1">
            {DAY_NAMES.map((d) => (
              <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((d, i) => {
              if (!d) return <div key={`e${i}`} />;
              const past = isPast(d), sel = isSelected(d), tod = isToday(d);
              return (
                <button
                  key={i} type="button" disabled={past}
                  onClick={() => select(d)}
                  className={`aspect-square flex items-center justify-center text-xs font-medium rounded-lg transition-all ${sel ? "bg-indigo-500 text-white font-bold"
                      : past ? "text-gray-300 line-through cursor-not-allowed"
                        : tod ? "bg-green-50 text-green-600 font-bold hover:bg-green-100"
                          : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
          <div className="border-t border-gray-100 pt-3 mt-2 flex justify-center">
            <button
              type="button"
              onClick={() => { onChange(toYMD(TODAY)); setOpen(false); }}
              className="text-xs font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-4 py-1.5 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-Service Picker ───────────────────────────────────────────────────────
function SubServicePicker({ serviceId, selected, onChange, hasError }) {
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!serviceId) { setSubServices([]); return; }
    setLoading(true);
    fetch(`${API_BASE}/subservices/by-service/${serviceId}`)
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.subServices || data.data || []);
        setSubServices(list.filter((s) => s.status === "active" || !s.status));
      })
      .catch(() => setSubServices([]))
      .finally(() => setLoading(false));
  }, [serviceId]);

  const allItems = [...subServices, OTHERS_ENTRY];
  const toggle = (ss) => {
    const exists = selected.find((s) => s.id === ss.id);
    onChange(exists
      ? selected.filter((s) => s.id !== ss.id)
      : [...selected, { id: ss.id, name: ss.name, price: ss.price ?? null }]
    );
  };
  const isChecked = (id) => selected.some((s) => s.id === id);

  return (
    <div className={`py-4 border-t ${hasError ? "border-red-200" : "border-gray-100"}`}>
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
          <span className={`text-sm font-bold ${hasError ? "text-red-600" : "text-gray-800"}`}>What do you need?</span>
          <span className="text-red-500 font-bold text-sm">*</span>
        </div>
        <p className="text-xs text-gray-400 pl-5">Select all that apply — at least one required</p>
      </div>

      {hasError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3 text-xs text-red-600 font-medium">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Please select at least one sub-service
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
          <span className="w-4 h-4 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin flex-shrink-0" />
          Loading available services…
        </div>
      ) : (
        /* Single column on mobile, 2-col on sm+ */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {allItems.map((ss) => {
            const checked = isChecked(ss.id);
            const isOthers = ss.id === "__others__";
            return (
              <label
                key={ss.id}
                className={`flex items-center gap-3 border-2 rounded-xl px-3 py-2.5 cursor-pointer transition-all select-none active:scale-[0.98] ${checked
                    ? "border-indigo-500 bg-indigo-50 shadow-sm shadow-indigo-100"
                    : isOthers
                      ? "border-dashed border-gray-300 hover:border-indigo-300 bg-white"
                      : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/40 bg-white"
                  }`}
              >
                <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggle(ss)} />
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${isOthers ? "bg-indigo-100" : "bg-gray-100"}`}>
                  {isOthers ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                      <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
                    </svg>
                  ) : ss.icon ? (
                    <img src={ss.icon} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                  ) : (
                    <span className="text-sm font-bold text-gray-400">{ss.name?.charAt(0)?.toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-gray-800 truncate">{ss.name}</span>
                  {!isOthers && (
                    <span className="block text-xs font-bold text-emerald-600 mt-0.5">
                      {ss.price != null && ss.price !== ""
                        ? `₹${Number(ss.price).toLocaleString("en-IN")}`
                        : <span className="font-normal text-gray-400">Price on request</span>}
                    </span>
                  )}
                </div>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${checked ? "border-indigo-500 bg-indigo-500" : "border-gray-300 bg-white"
                  }`}>
                  {checked && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      )}

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selected.map((s) => (
            <span key={s.id} className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-3 py-1 text-xs font-semibold">
              {s.name}
              <button type="button" onClick={() => toggle(s)} className="text-indigo-400 hover:text-indigo-700 leading-none ml-0.5 flex items-center justify-center w-4 h-4 flex-shrink-0">✕</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Booking Modal ────────────────────────────────────────────────────────────
function BookingModal({ service, onClose }) {
  const [form, setForm] = useState({
    full_name: "", mobile: "", address: "", landmark: "",
    city: "Patna", preferred_date: toYMD(TODAY), preferred_time: "", notes: "",
  });
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [ssError, setSsError] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  if (!service) return null;
  const imgSrc = service.image || "https://placehold.co/80x80/e2e8f0/94a3b8?text=S";


  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError(null); setSsError(false);
    if (selectedSubs.length === 0) {
      setSsError(true);
      document.querySelector("[data-ss-section]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!form.full_name.trim()) return setError("Full name is required.");
    if (!form.mobile.trim()) return setError("Mobile number is required.");
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) return setError("Enter a valid 10-digit mobile number.");
    if (!form.address.trim()) return setError("Address is required.");
    if (!form.preferred_date) return setError("Please select a preferred date.");
    if (!form.preferred_time) return setError("Please select a preferred time slot.");

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: service.id,
          full_name: form.full_name.trim(),
          mobile: form.mobile.trim(),
          address: form.address.trim(),
          landmark: form.landmark.trim() || undefined,
          city: form.city.trim() || "Patna",
          preferred_date: form.preferred_date,
          preferred_time: form.preferred_time,
          notes: form.notes.trim() || undefined,
          selected_sub_services: JSON.stringify(selectedSubs),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed.");
      setSuccess(data.booking);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const successSubs = success?.selected_sub_services
    ? (() => { try { const a = JSON.parse(success.selected_sub_services); return Array.isArray(a) ? a : []; } catch { return []; } })()
    : [];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-2xl flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        style={{ maxHeight: "95dvh", height: success ? "auto" : undefined }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* ── SUCCESS ── */}
        {success ? (
          <div className="flex flex-col items-center text-center px-5 sm:px-6 py-8 sm:py-10 overflow-y-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg shadow-green-200 mb-4">
              ✓
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1">Booking Confirmed!</h2>
            <p className="text-sm text-gray-500 mb-5 sm:mb-6">Your booking has been submitted successfully.</p>
            <div className="w-full max-w-sm bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden mb-4 text-left">
              {[
                ["Booking No.", success.booking_number],
                ["Service", success.service_name],
                successSubs.length > 0 ? ["Sub-Services", successSubs.map((s) => s.name).join(", ")] : null,
                ["Date", fmtDisp(success.preferred_date)],
                ["Time", success.preferred_time],
              ].filter(Boolean).map(([label, val], i) => (
                <div key={i} className="flex items-start justify-between px-4 py-3 border-b border-gray-100 last:border-0 gap-3">
                  <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
                  <span className="text-xs font-semibold text-gray-800 text-right break-words">{val}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-gray-500">Status</span>
                <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full">Pending</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-5 sm:mb-6 max-w-xs">We will confirm your booking shortly. Thank you!</p>
            <button onClick={onClose} className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-10 sm:px-12 py-3 rounded-xl transition-colors w-full max-w-xs">
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900">Book a Service</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors flex-shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 -webkit-overflow-scrolling-touch">

              {/* Service card */}
              <div className="py-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">You are booking</p>
                <div className="flex gap-3 items-start bg-gradient-to-r from-indigo-50 to-pink-50 border border-indigo-100 rounded-2xl p-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                    <img
                      src={imgErr ? "https://placehold.co/80x80/e2e8f0/94a3b8?text=S" : imgSrc}
                      alt={service.name}
                      onError={() => setImgErr(true)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 leading-snug mb-1">{service.name}</p>
                    {service.category_name && (
                      <p className="text-xs text-gray-500 mb-1.5">in <strong className="text-gray-700">{service.category_name}</strong></p>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {service.code && (
                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">#{service.code}</span>
                      )}
                      {service.status && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${service.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}>{service.status}</span>
                      )}
                      {service.verify_status === "verified" && (
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">✓ Verified</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-services */}
              <div data-ss-section>
                <SubServicePicker
                  serviceId={service.id}
                  selected={selectedSubs}
                  onChange={(v) => { setSelectedSubs(v); if (v.length > 0) setSsError(false); }}
                  hasError={ssError}
                />
              </div>

              <hr className="border-gray-100" />

              {/* Date & Time */}
              <div className="py-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">When do you need it?</p>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Preferred Date
                    </label>
                    <CustomDatePicker value={form.preferred_date} onChange={(v) => set("preferred_date", v)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                      Preferred Time
                    </label>
                    {/* Time slots — 2-col grid on mobile for better tap targets */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot} type="button"
                          onClick={() => set("preferred_time", slot)}
                          className={`px-2 py-2.5 rounded-xl text-xs font-semibold border transition-all text-center active:scale-95 ${form.preferred_time === slot
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100"
                              : "border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50"
                            }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Customer details */}
              <div className="py-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Your Details</p>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Full Name <span className="text-red-500">*</span></label>
                    <input
                      className="border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-3 text-sm outline-none transition-all placeholder-gray-300 bg-white w-full"
                      placeholder="Your full name"
                      value={form.full_name} onChange={(e) => set("full_name", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Mobile No. <span className="text-red-500">*</span></label>
                    <input
                      className="border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-3 text-sm outline-none transition-all placeholder-gray-300 bg-white w-full"
                      placeholder="10-digit mobile number" maxLength={10} inputMode="numeric"
                      value={form.mobile} onChange={(e) => set("mobile", e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Address <span className="text-red-500">*</span></label>
                    <input
                      className="border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-3 text-sm outline-none transition-all placeholder-gray-300 bg-white w-full"
                      placeholder="eg. Flat/House No 22, Boring Road"
                      value={form.address} onChange={(e) => set("address", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600">Landmark</label>
                      <input
                        className="border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-3 text-sm outline-none transition-all placeholder-gray-300 bg-white w-full"
                        placeholder="eg. Near XYZ School"
                        value={form.landmark} onChange={(e) => set("landmark", e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600">City</label>
                      <input
                        className="border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-3 text-sm outline-none transition-all placeholder-gray-300 bg-white w-full"
                        placeholder="City"
                        value={form.city} onChange={(e) => set("city", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Additional Notes</label>
                    <textarea
                      rows={3}
                      className="border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-3 text-sm outline-none transition-all placeholder-gray-300 bg-white resize-none w-full"
                      placeholder="Any special instructions or notes (optional)"
                      value={form.notes} onChange={(e) => set("notes", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-sm text-red-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Bottom spacer so footer doesn't cover content */}
              <div className="h-2" />
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-gray-100 px-4 sm:px-5 py-3 sm:py-4 bg-white">
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900 truncate">{service.name}</p>
                  {form.preferred_date && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {fmtDisp(form.preferred_date)}{form.preferred_time ? ` · ${form.preferred_time}` : ""}
                    </p>
                  )}
                  {selectedSubs.length > 0 && (
                    <p className="text-xs text-indigo-600 font-medium mt-0.5 truncate">
                      {selectedSubs.map((s) => s.name).join(" · ")}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-all text-sm w-full active:scale-[0.98]"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin flex-shrink-0" />
                    Submitting…
                  </>
                ) : "Submit Booking"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}