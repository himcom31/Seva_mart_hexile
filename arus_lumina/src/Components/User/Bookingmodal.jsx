import { useState, useEffect, useRef } from "react";

const API_BASE1 = import.meta.env.VITE_API_URL;

const API_BASE = `${API_BASE1}/api`;

const TIME_SLOTS = [
  "09 AM - 11 AM",
  "11 AM - 01 PM",
  "01 PM - 03 PM",
  "03 PM - 05 PM",
  "05 PM - 07 PM",
  "07 PM - 09 PM",
];

const OTHERS_ENTRY = { id: "__others__", name: "Others", description: "Something not listed above" };

const pad = (n) => String(n).padStart(2, "0");

const TODAY = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
})();

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const toYMD   = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const fmtDisp = (ymd) => {
  if (!ymd) return "";
  const [y,m,d] = ymd.split("-");
  return `${d} ${MONTH_NAMES[parseInt(m)-1]} ${y}`;
};

function buildCalendar(year, month) {
  const first = new Date(year, month, 1).getDay();
  const days  = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
  return cells;
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom Date Picker
// ─────────────────────────────────────────────────────────────────────────────
function CustomDatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref             = useRef(null);
  const init            = value ? new Date(value + "T00:00:00") : new Date();
  const [viewYear, setVY] = useState(init.getFullYear());
  const [viewMonth,setVM] = useState(init.getMonth());

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const cells  = buildCalendar(viewYear, viewMonth);
  const prev   = () => { if (viewMonth===0){setVM(11);setVY(viewYear-1);}else setVM(viewMonth-1); };
  const next   = () => { if (viewMonth===11){setVM(0);setVY(viewYear+1);}else setVM(viewMonth+1); };
  const isPast     = (d) => d < TODAY;
  const isSelected = (d) => value && toYMD(d) === value;
  const isToday    = (d) => toYMD(d) === toYMD(TODAY);
  const select     = (d) => { if (isPast(d)) return; onChange(toYMD(d)); setOpen(false); };

  return (
    <div className="dp-wrap" ref={ref}>
      <button type="button" className={`dp-trigger${open?" active":""}`} onClick={()=>setOpen(!open)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8"  y1="2" x2="8"  y2="6"/>
          <line x1="3"  y1="10" x2="21" y2="10"/>
        </svg>
        <span>{value ? fmtDisp(value) : "Select date"}</span>
        <svg className="dp-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div className="dp-popup">
          <div className="dp-header">
            <button type="button" className="dp-nav" onClick={prev}>‹</button>
            <span className="dp-month-label">{MONTH_NAMES[viewMonth]} {viewYear}</span>
            <button type="button" className="dp-nav" onClick={next}>›</button>
          </div>
          <div className="dp-grid">
            {DAY_NAMES.map(d => <div key={d} className="dp-dayname">{d}</div>)}
            {cells.map((d,i) => {
              if (!d) return <div key={`e${i}`}/>;
              const past=isPast(d), sel=isSelected(d), tod=isToday(d);
              return (
                <button key={i} type="button" disabled={past}
                  className={`dp-day${past?" dp-past":""}${sel?" dp-selected":""}${tod&&!sel?" dp-today":""}`}
                  onClick={()=>select(d)}>
                  {d.getDate()}
                </button>
              );
            })}
          </div>
          <div className="dp-footer">
            <button type="button" className="dp-today-btn"
              onClick={()=>{ onChange(toYMD(TODAY)); setOpen(false); }}>
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-Service Picker
// ─────────────────────────────────────────────────────────────────────────────
function SubServicePicker({ serviceId, selected, onChange, hasError }) {
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading]         = useState(false);

  useEffect(() => {
    if (!serviceId) { setSubServices([]); return; }
    setLoading(true);
    fetch(`${API_BASE}/subservices/by-service/${serviceId}`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.subServices || data.data || []);
        setSubServices(list.filter(s => s.status === "active" || !s.status));
      })
      .catch(() => setSubServices([]))
      .finally(() => setLoading(false));
  }, [serviceId]);

  const allItems = [...subServices, OTHERS_ENTRY];

  const toggle = (ss) => {
    const exists = selected.find(s => s.id === ss.id);
    onChange(exists
      ? selected.filter(s => s.id !== ss.id)
      : [...selected, { id: ss.id, name: ss.name, price: ss.price ?? null }]
    );
  };
  const isChecked = (id) => selected.some(s => s.id === id);

  return (
    <div className={`bk-ss-section${hasError?" bk-ss-section--error":""}`}>
      <div className="bk-ss-header">
        <div className="bk-ss-title-row">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          <span className="bk-ss-title">What do you need?</span>
          <span className="bk-ss-req">*</span>
        </div>
        <p className="bk-ss-subtitle">Select all services that apply — at least one is required</p>
      </div>

      {hasError && (
        <div className="bk-ss-error-msg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8"  x2="12"    y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Please select at least one sub-service
        </div>
      )}

      {loading ? (
        <div className="bk-ss-loading">
          <span className="bk-ss-spinner"/>
          Loading available services…
        </div>
      ) : (
        <div className="bk-ss-grid">
          {allItems.map(ss => {
            const checked  = isChecked(ss.id);
            const isOthers = ss.id === "__others__";
            return (
              <label key={ss.id}
                className={`bk-ss-card${checked?" bk-ss-card--checked":""}${isOthers?" bk-ss-card--others":""}`}>
                <input type="checkbox" className="bk-ss-input" checked={checked} onChange={()=>toggle(ss)}/>

                <div className={`bk-ss-icon-wrap${isOthers?" bk-ss-icon-others":""}`}>
                  {isOthers ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="19" cy="12" r="1"/>
                      <circle cx="5"  cy="12" r="1"/>
                    </svg>
                  ) : ss.icon ? (
                    <img src={ss.icon} alt=""
                      className="bk-ss-icon-img" onError={e=>{ e.target.style.display="none"; }}/>
                  ) : (
                    <span className="bk-ss-icon-letter">{ss.name?.charAt(0)?.toUpperCase()}</span>
                  )}
                </div>

                <div className="bk-ss-info">
                  <span className="bk-ss-name">{ss.name}</span>
                  {!isOthers && (
                    <span className="bk-ss-price">
                      {ss.price != null && ss.price !== ""
                        ? `₹${Number(ss.price).toLocaleString("en-IN")}`
                        : <span className="bk-ss-price-na">Price on request</span>}
                    </span>
                  )}
                </div>

                <div className={`bk-ss-tick${checked?" bk-ss-tick--on":""}`}>
                  {checked && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      )}

      {selected.length > 0 && (
        <div className="bk-ss-pills">
          {selected.map(s => (
            <span key={s.id} className="bk-ss-pill">
              {s.name}
              <button type="button" className="bk-ss-pill-x" onClick={()=>toggle(s)}>✕</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Booking Modal
// ─────────────────────────────────────────────────────────────────────────────
export default function BookingModal({ service, onClose }) {
  const [form, setForm] = useState({
    full_name:      "",
    mobile:         "",
    address:        "",
    landmark:       "",
    city:           "Patna",
    preferred_date: toYMD(TODAY),
    preferred_time: "",
    notes:          "",
  });
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [submitting,   setSubmitting]   = useState(false);
  const [success,      setSuccess]      = useState(null);
  const [error,        setError]        = useState(null);
  const [ssError,      setSsError]      = useState(false);
  const [imgError,     setImgError]     = useState(false);

  if (!service) return null;

  const imgSrc = service.image
  ? service.image
  : "https://placehold.co/80x80/e2e8f0/94a3b8?text=S";

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError(null);
    setSsError(false);

    if (selectedSubs.length === 0) {
      setSsError(true);
      document.querySelector(".bk-ss-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!form.full_name.trim()) return setError("Full name is required.");
    if (!form.mobile.trim())    return setError("Mobile number is required.");
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) return setError("Enter a valid 10-digit mobile number.");
    if (!form.address.trim())   return setError("Address is required.");
    if (!form.preferred_date)   return setError("Please select a preferred date.");
    if (!form.preferred_time)   return setError("Please select a preferred time slot.");

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id:            service.id,
          full_name:             form.full_name.trim(),
          mobile:                form.mobile.trim(),
          address:               form.address.trim(),
          landmark:              form.landmark.trim() || undefined,
          city:                  form.city.trim() || "Patna",
          preferred_date:        form.preferred_date,
          preferred_time:        form.preferred_time,
          notes:                 form.notes.trim() || undefined,
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
    ? (() => { try { const a = JSON.parse(success.selected_sub_services); return Array.isArray(a)?a:[]; } catch { return []; } })()
    : [];

  return (
    <>
      <style>{BK_CSS}</style>

      <div className="bk-overlay" onClick={onClose}>
        <div className="bk-modal" onClick={e => e.stopPropagation()}>

          <button className="bk-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6"  x2="6"  y2="18"/>
              <line x1="6"  y1="6"  x2="18" y2="18"/>
            </svg>
          </button>

          {/* ── SUCCESS ── */}
          {success ? (
            <div className="bk-success">
              <div className="bk-success-icon">✓</div>
              <h2 className="bk-success-title">Booking Confirmed!</h2>
              <p className="bk-success-sub">Your booking has been submitted successfully.</p>
              <div className="bk-success-card">
                <div className="bk-suc-row"><span>Booking No.</span><strong>{success.booking_number}</strong></div>
                <div className="bk-suc-row"><span>Service</span><strong>{success.service_name}</strong></div>
                {successSubs.length > 0 && (
                  <div className="bk-suc-row bk-suc-row--top">
                    <span>Sub-Services</span>
                    <strong className="bk-suc-subs">{successSubs.map(s=>s.name).join(", ")}</strong>
                  </div>
                )}
                <div className="bk-suc-row"><span>Date</span><strong>{fmtDisp(success.preferred_date)}</strong></div>
                <div className="bk-suc-row"><span>Time</span><strong>{success.preferred_time}</strong></div>
                <div className="bk-suc-row">
                  <span>Status</span>
                  <strong className="bk-status-pending">Pending</strong>
                </div>
              </div>
              <p className="bk-success-note">We will confirm your booking shortly. Thank you!</p>
              <button className="bk-done-btn" onClick={onClose}>Done</button>
            </div>
          ) : (
            <>
              {/* ── HEADER ── */}
              <div className="bk-header">
                <h2 className="bk-heading">Book a Service</h2>
              </div>

              <div className="bk-scroll">

                {/* ── Service card ── */}
                <div className="bk-section">
                  <p className="bk-section-label">You are booking</p>
                  <div className="bk-service-card">
                    <div className="bk-svc-img-wrap">
                      <img
                        src={imgError ? "https://placehold.co/80x80/e2e8f0/94a3b8?text=S" : imgSrc}
                        alt={service.name}
                        onError={()=>setImgError(true)}
                        className="bk-svc-img"
                      />
                    </div>
                    <div className="bk-svc-info">
                      <div className="bk-svc-name">{service.name}</div>
                      {service.category_name && (
                        <div className="bk-svc-cat">in <strong>{service.category_name}</strong></div>
                      )}
                      <div className="bk-svc-meta-row">
                        {service.code && <span className="bk-svc-code">#{service.code}</span>}
                        <span className="bk-svc-badge" data-status={service.status}>{service.status}</span>
                        {service.verify_status==="verified" && (
                          <span className="bk-svc-verified">✓ Verified</span>
                        )}
                      </div>
                      {service.description && (
                        <p className="bk-svc-desc">{service.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── SUB-SERVICES ── */}
                <SubServicePicker
                  serviceId={service.id}
                  selected={selectedSubs}
                  onChange={(v)=>{ setSelectedSubs(v); if(v.length>0) setSsError(false); }}
                  hasError={ssError}
                />

                <div className="bk-divider"/>

                {/* ── Date & Time ── */}
                <div className="bk-section">
                  <p className="bk-section-label">When do you need it?</p>
                  <div className="bk-when-grid">
                    <div className="bk-field">
                      <label className="bk-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8"  y1="2" x2="8"  y2="6"/>
                          <line x1="3"  y1="10" x2="21" y2="10"/>
                        </svg>
                        Preferred Date
                      </label>
                      <CustomDatePicker value={form.preferred_date} onChange={v=>set("preferred_date",v)}/>
                    </div>
                    <div className="bk-field">
                      <label className="bk-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        Preferred Time
                      </label>
                      <div className="bk-slots">
                        {TIME_SLOTS.map(slot => (
                          <button key={slot} type="button"
                            className={`bk-slot${form.preferred_time===slot?" selected":""}`}
                            onClick={()=>set("preferred_time",slot)}>
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bk-divider"/>

                {/* ── Customer Details ── */}
                <div className="bk-section">
                  <p className="bk-section-label">Your Details</p>
                  <div className="bk-form-grid">
                    <div className="bk-field">
                      <label className="bk-label">Full Name <span className="bk-req">*</span></label>
                      <input className="bk-input" placeholder="Your full name"
                        value={form.full_name} onChange={e=>set("full_name",e.target.value)}/>
                    </div>
                    <div className="bk-field">
                      <label className="bk-label">Mobile No. <span className="bk-req">*</span></label>
                      <input className="bk-input" placeholder="10-digit mobile number" maxLength={10}
                        value={form.mobile} onChange={e=>set("mobile",e.target.value.replace(/\D/g,""))}/>
                    </div>
                    <div className="bk-field bk-field--full">
                      <label className="bk-label">Address <span className="bk-req">*</span></label>
                      <input className="bk-input" placeholder="eg. Flat/House No 22, Boring Road"
                        value={form.address} onChange={e=>set("address",e.target.value)}/>
                    </div>
                    <div className="bk-field">
                      <label className="bk-label">Landmark</label>
                      <input className="bk-input" placeholder="eg. Near XYZ School"
                        value={form.landmark} onChange={e=>set("landmark",e.target.value)}/>
                    </div>
                    <div className="bk-field">
                      <label className="bk-label">City</label>
                      <input className="bk-input" placeholder="City"
                        value={form.city} onChange={e=>set("city",e.target.value)}/>
                    </div>
                    <div className="bk-field bk-field--full">
                      <label className="bk-label">Additional Notes</label>
                      <textarea className="bk-textarea" rows={3}
                        placeholder="Any special instructions or notes (optional)"
                        value={form.notes} onChange={e=>set("notes",e.target.value)}/>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bk-error-box">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8"  x2="12"    y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}
              </div>

              {/* ── FOOTER ── */}
              <div className="bk-footer">
                <div className="bk-footer-summary">
                  <span className="bk-footer-svc">{service.name}</span>
                  {form.preferred_date && (
                    <span className="bk-footer-date">
                      {fmtDisp(form.preferred_date)}{form.preferred_time ? ` · ${form.preferred_time}` : ""}
                    </span>
                  )}
                  {selectedSubs.length > 0 && (
                    <span className="bk-footer-subs">
                      {selectedSubs.map(s=>s.name).join(" · ")}
                    </span>
                  )}
                </div>
                <button
                  className={`bk-submit-btn${submitting?" loading":""}`}
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <><span className="bk-btn-spinner"/>Submitting…</>
                  ) : "Submit Booking"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS — fully mobile-responsive
// ─────────────────────────────────────────────────────────────────────────────
const BK_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:wght@600&display=swap');

/* ── Reset ── */
.bk-overlay *, .bk-overlay *::before, .bk-overlay *::after {
  box-sizing: border-box;
}

/* ════════════════════════════════════
   OVERLAY
════════════════════════════════════ */
.bk-overlay {
  position: fixed; inset: 0;
  background: rgba(8,8,20,0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 9999;
  /* Mobile: sheet from bottom */
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
  animation: bkFadeIn 0.2s ease;
}
@keyframes bkFadeIn { from{opacity:0} to{opacity:1} }

/* Desktop: centered */
@media (min-width: 600px) {
  .bk-overlay {
    align-items: center;
    padding: 16px;
  }
}

/* ════════════════════════════════════
   MODAL SHELL
════════════════════════════════════ */
.bk-modal {
  background: #fff;
  width: 100%;
  max-width: 700px;
  /* Mobile: full-width bottom sheet */
  height: 96dvh;
  max-height: 96dvh;
  border-radius: 22px 22px 0 0;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 -8px 40px rgba(0,0,0,0.18);
  animation: bkSlideUp 0.3s cubic-bezier(0.34,1.4,0.64,1);
  overflow: hidden;
  font-family: 'DM Sans', sans-serif;
}
@keyframes bkSlideUp {
  from { transform: translateY(60px); opacity: 0; }
  to   { transform: none; opacity: 1; }
}

/* Desktop: centered card */
@media (min-width: 600px) {
  .bk-modal {
    height: auto;
    max-height: 92vh;
    border-radius: 22px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.22);
  }
}

/* Drag handle — mobile only */
.bk-modal::before {
  content: "";
  display: block;
  width: 40px; height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  margin: 10px auto 0;
  flex-shrink: 0;
}
@media (min-width: 600px) {
  .bk-modal::before { display: none; }
}

/* ════════════════════════════════════
   CLOSE BUTTON
════════════════════════════════════ */
.bk-close {
  position: absolute; top: 12px; right: 12px;
  background: #f3f4f6; border: none; border-radius: 50%;
  /* Visual size */
  width: 32px; height: 32px;
  /* Touch target */
  min-width: 44px; min-height: 44px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; z-index: 10; color: #374151;
  transition: background 0.15s, transform 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.bk-close:hover { background: #e5e7eb; transform: scale(1.08); }

/* ════════════════════════════════════
   HEADER
════════════════════════════════════ */
.bk-header {
  padding: 12px 16px 12px;
  border-bottom: 1px solid #f3f4f6;
  flex-shrink: 0;
}
@media (min-width: 600px) {
  .bk-header { padding: 22px 28px 16px; }
}

.bk-heading {
  font-family: 'Fraunces', serif;
  font-size: clamp(1.1rem, 4vw, 1.5rem);
  font-weight: 600;
  color: #111827;
  letter-spacing: -0.3px;
  padding-right: 48px; /* don't overlap close btn */
  margin: 0;
}

/* ════════════════════════════════════
   SCROLL BODY
════════════════════════════════════ */
.bk-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0 14px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb transparent;
  overscroll-behavior: contain;
}
@media (min-width: 600px) {
  .bk-scroll { padding: 0 28px; }
}
.bk-scroll::-webkit-scrollbar { width: 4px; }
.bk-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }

/* ════════════════════════════════════
   SECTIONS & DIVIDERS
════════════════════════════════════ */
.bk-section { padding: 14px 0; }
@media (min-width: 600px) { .bk-section { padding: 20px 0; } }

.bk-section-label {
  font-size: 0.67rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1px;
  color: #9ca3af; margin: 0 0 10px;
  display: flex; align-items: center; gap: 5px;
}
.bk-divider { border: none; border-top: 1px solid #f3f4f6; margin: 0; }

/* ════════════════════════════════════
   SERVICE CARD
════════════════════════════════════ */
.bk-service-card {
  display: flex; gap: 10px; align-items: flex-start;
  background: linear-gradient(135deg,#f8f9ff,#fff5fb);
  border: 1px solid #e8eaf6; border-radius: 14px;
  padding: 12px;
}
@media (min-width: 600px) {
  .bk-service-card { gap: 14px; padding: 14px; }
}

.bk-svc-img-wrap {
  width: 52px; height: 52px;
  border-radius: 10px; overflow: hidden; flex-shrink: 0;
  border: 1px solid #e5e7eb;
}
@media (min-width: 600px) {
  .bk-svc-img-wrap { width: 72px; height: 72px; }
}

.bk-svc-img { width:100%; height:100%; object-fit:cover; display:block; }
.bk-svc-info { flex:1; min-width:0; }
.bk-svc-name {
  font-size: clamp(0.85rem, 2.5vw, 1.05rem);
  font-weight: 700; color: #111827;
  margin-bottom: 3px; line-height: 1.3;
}
.bk-svc-cat { font-size: 0.78rem; color: #6b7280; margin-bottom: 5px; }
.bk-svc-cat strong { color: #374151; }
.bk-svc-meta-row {
  display: flex; align-items: center; gap: 5px;
  flex-wrap: wrap; margin-bottom: 4px;
}
.bk-svc-code {
  font-size: 0.68rem; font-weight: 600;
  color: #6b7280; background: #f3f4f6;
  padding: 2px 7px; border-radius: 5px;
}
.bk-svc-badge {
  font-size: 0.67rem; font-weight: 600;
  padding: 2px 7px; border-radius: 20px;
  text-transform: capitalize;
}
.bk-svc-badge[data-status="active"]   { background:#dcfce7; color:#16a34a; }
.bk-svc-badge[data-status="inactive"] { background:#fee2e2; color:#dc2626; }
.bk-svc-verified {
  font-size: 0.67rem; font-weight: 600;
  color: #2563eb; background: #dbeafe;
  padding: 2px 7px; border-radius: 20px;
}
.bk-svc-desc {
  font-size: 0.76rem; color: #6b7280; line-height: 1.5; margin-top: 3px;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}

/* ════════════════════════════════════
   SUB-SERVICE SECTION
════════════════════════════════════ */
.bk-ss-section {
  padding: 14px 0 4px;
  border-top: 1px solid #f3f4f6;
}
.bk-ss-section--error .bk-ss-title { color: #dc2626; }

.bk-ss-header { margin-bottom: 10px; }
.bk-ss-title-row {
  display: flex; align-items: center; gap: 6px;
  margin-bottom: 3px; color: #374151;
}
.bk-ss-title-row svg { color: #6366f1; flex-shrink: 0; }
.bk-ss-title { font-size: 0.82rem; font-weight: 700; letter-spacing: 0.2px; }
.bk-ss-req { color: #ef4444; font-size: 0.85rem; font-weight: 700; line-height: 1; }
.bk-ss-subtitle { font-size: 0.73rem; color: #9ca3af; margin: 0; padding-left: 21px; }

.bk-ss-error-msg {
  display: flex; align-items: center; gap: 7px;
  background: #fef2f2; border: 1px solid #fecaca;
  border-radius: 9px; padding: 9px 12px;
  font-size: 0.79rem; color: #dc2626; font-weight: 500;
  margin-bottom: 10px;
}

.bk-ss-loading {
  display: flex; align-items: center; gap: 8px;
  color: #9ca3af; font-size: 0.82rem; padding: 16px 0;
}
.bk-ss-spinner {
  width: 15px; height: 15px;
  border: 2px solid #e5e7eb; border-top-color: #6366f1;
  border-radius: 50%; animation: bkSpin 0.7s linear infinite; flex-shrink: 0;
}

/* Sub-service grid:
   Mobile  (<480px): 1 column
   ≥480px           : 2 columns */
.bk-ss-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}
@media (min-width: 480px) {
  .bk-ss-grid { grid-template-columns: 1fr 1fr; }
}

/* Sub-service card */
.bk-ss-card {
  display: flex; align-items: center; gap: 10px;
  border: 1.5px solid #e5e7eb; border-radius: 12px;
  padding: 10px 12px; cursor: pointer;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  background: #fff; position: relative;
  min-height: 52px;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.bk-ss-card:hover  { border-color: #c7d2fe; background: #fafafe; }
.bk-ss-card--checked {
  border-color: #6366f1;
  background: linear-gradient(135deg,#eef2ff,#f5f3ff);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
}
.bk-ss-card--others { border-style: dashed; border-color: #d1d5db; }
.bk-ss-card--others.bk-ss-card--checked { border-style: solid; }

.bk-ss-input { position:absolute; opacity:0; width:0; height:0; pointer-events:none; }

.bk-ss-icon-wrap {
  width: 36px; height: 36px; border-radius: 9px;
  background: #f3f4f6;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; overflow: hidden;
}
.bk-ss-icon-others { background: #f0f0ff; color: #6366f1; }
.bk-ss-icon-img { width:100%; height:100%; object-fit:cover; }
.bk-ss-icon-letter { font-size: 0.88rem; font-weight: 700; color: #9ca3af; }

.bk-ss-info { flex:1; min-width:0; }
.bk-ss-name {
  font-size: 0.82rem; font-weight: 600; color: #111827;
  display: block; line-height: 1.3;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.bk-ss-price {
  font-size: 0.76rem; font-weight: 700; color: #059669;
  display: block; margin-top: 2px; letter-spacing: -0.2px;
}
.bk-ss-price-na { font-size: 0.7rem; font-weight: 400; color: #9ca3af; }

.bk-ss-tick {
  width: 20px; height: 20px; border-radius: 6px; flex-shrink: 0;
  border: 2px solid #d1d5db; background: #fff;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.bk-ss-tick--on { border-color: #6366f1; background: #6366f1; color: #fff; }

.bk-ss-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; margin-bottom: 2px; }
.bk-ss-pill {
  display: inline-flex; align-items: center; gap: 5px;
  background: #eef2ff; color: #4338ca;
  border: 1px solid #c7d2fe; border-radius: 20px;
  padding: 4px 10px 4px 12px; font-size: 0.72rem; font-weight: 600;
}
.bk-ss-pill-x {
  background: none; border: none; cursor: pointer; color: #6366f1;
  font-size: 0.68rem; padding: 0; line-height: 1; opacity: 0.7;
  min-width: 20px; min-height: 20px;
  display: flex; align-items: center; justify-content: center;
}
.bk-ss-pill-x:hover { opacity: 1; }

/* ════════════════════════════════════
   DATE + TIME — stacked on mobile, side-by-side on tablet+
════════════════════════════════════ */
.bk-when-grid {
  display: grid;
  grid-template-columns: 1fr;   /* mobile: stacked */
  gap: 14px;
  align-items: start;
}
@media (min-width: 520px) {
  .bk-when-grid { grid-template-columns: 1fr 1fr; }
}

/* ════════════════════════════════════
   FORM GRID — stacked on mobile
════════════════════════════════════ */
.bk-form-grid {
  display: grid;
  grid-template-columns: 1fr;   /* mobile: stacked */
  gap: 12px;
}
@media (min-width: 480px) {
  .bk-form-grid { grid-template-columns: 1fr 1fr; gap: 14px; }
}

.bk-field { display: flex; flex-direction: column; gap: 5px; }
.bk-field--full { grid-column: 1 / -1; }

.bk-label {
  font-size: 0.77rem; font-weight: 600; color: #374151;
  display: flex; align-items: center; gap: 5px;
}
.bk-req { color: #ef4444; }

/* Inputs — font-size ≥16px stops iOS from zooming */
.bk-input, .bk-textarea {
  border: 1.5px solid #e5e7eb; border-radius: 9px;
  padding: 11px 13px;
  font-size: max(16px, 0.875rem);
  font-family: inherit; color: #111827; outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #fff; width: 100%;
}
.bk-input:focus, .bk-textarea:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}
.bk-input::placeholder, .bk-textarea::placeholder { color: #d1d5db; }
.bk-textarea { resize: vertical; min-height: 76px; }

/* ════════════════════════════════════
   TIME SLOTS
════════════════════════════════════ */
.bk-slots { display: flex; flex-wrap: wrap; gap: 6px; }
.bk-slot {
  padding: 8px 11px;
  border: 1.5px solid #e5e7eb; border-radius: 22px;
  font-size: 0.74rem; font-weight: 600; font-family: inherit;
  color: #374151; background: #fff; cursor: pointer;
  transition: all 0.15s; white-space: nowrap;
  min-height: 38px;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.bk-slot:hover { border-color: #6366f1; color: #6366f1; background: #eef2ff; }
.bk-slot.selected {
  border-color: #059669; color: #059669; background: #ecfdf5;
  box-shadow: 0 0 0 3px rgba(5,150,105,0.12);
}

/* ════════════════════════════════════
   DATE PICKER
════════════════════════════════════ */
.dp-wrap { position: relative; }
.dp-trigger {
  display: flex; align-items: center; gap: 8px; width: 100%;
  border: 1.5px solid #e5e7eb; border-radius: 9px;
  padding: 11px 13px;
  font-size: max(16px, 0.875rem);
  font-family: inherit; color: #111827;
  background: #fff; cursor: pointer; text-align: left;
  transition: border-color 0.2s, box-shadow 0.2s;
  min-height: 46px;
  touch-action: manipulation;
}
.dp-trigger:hover, .dp-trigger.active {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}
.dp-trigger svg:first-child { color: #9ca3af; flex-shrink: 0; }
.dp-trigger span { flex: 1; }
.dp-caret { color: #9ca3af; flex-shrink: 0; }

/* Popup — clamp to viewport on small screens */
.dp-popup {
  position: absolute; top: calc(100% + 6px); left: 0;
  width: min(320px, calc(100vw - 28px));
  background: #fff; border: 1px solid #e5e7eb; border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.14); z-index: 5000;
  padding: 14px;
  animation: dpPop 0.18s ease;
}
/* If picker is on right side, anchor to right instead */
@media (max-width: 479px) {
  .dp-popup { left: 0; right: 0; width: auto; }
}
@keyframes dpPop {
  from { opacity:0; transform:translateY(-6px); }
  to   { opacity:1; transform:none; }
}

.dp-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px;
}
.dp-month-label { font-weight: 700; font-size: 0.88rem; color: #111827; }
.dp-nav {
  background: #f3f4f6; border: none; border-radius: 7px;
  width: 34px; height: 34px; font-size: 1rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #374151; transition: background 0.15s;
  min-width: 44px; min-height: 44px;
}
.dp-nav:hover { background: #e5e7eb; }

.dp-grid {
  display: grid; grid-template-columns: repeat(7,1fr); gap: 2px;
  margin-bottom: 10px;
}
.dp-dayname {
  text-align: center; font-size: 0.62rem; font-weight: 700;
  color: #9ca3af; padding: 3px 0; text-transform: uppercase;
}
.dp-day {
  aspect-ratio: 1; border: none; background: transparent; border-radius: 7px;
  font-size: 0.8rem; font-family: inherit; color: #374151; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.12s, color 0.12s;
  min-width: 28px; min-height: 28px;
}
.dp-day:hover:not(:disabled):not(.dp-selected) { background: #eef2ff; color: #6366f1; }
.dp-day.dp-today:not(.dp-selected) { background: #f0fdf4; color: #16a34a; font-weight: 700; }
.dp-day.dp-selected { background: #6366f1; color: #fff; font-weight: 700; }
.dp-day.dp-past { color: #d1d5db; cursor: not-allowed; text-decoration: line-through; }

.dp-footer {
  border-top: 1px solid #f3f4f6; padding-top: 10px;
  display: flex; justify-content: center;
}
.dp-today-btn {
  background: none; border: 1.5px solid #e5e7eb; border-radius: 7px;
  padding: 6px 18px; font-size: 0.8rem; font-weight: 600;
  font-family: inherit; color: #6366f1; cursor: pointer; transition: all 0.15s;
}
.dp-today-btn:hover { background: #eef2ff; border-color: #6366f1; }

/* ════════════════════════════════════
   ERROR BOX
════════════════════════════════════ */
.bk-error-box {
  display: flex; align-items: flex-start; gap: 8px;
  background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px;
  padding: 11px 13px; font-size: 0.82rem; color: #dc2626;
  margin: 0 0 14px; line-height: 1.4;
}
.bk-error-box svg { flex-shrink: 0; margin-top: 1px; }

/* ════════════════════════════════════
   FOOTER
════════════════════════════════════ */
.bk-footer {
  padding: 10px 14px;
  /* Respect iPhone notch */
  padding-bottom: max(14px, env(safe-area-inset-bottom));
  border-top: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  background: #fff;
}
@media (min-width: 600px) {
  .bk-footer {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px 28px 20px;
  }
}

.bk-footer-summary { min-width: 0; }
.bk-footer-svc {
  display: block; font-size: 0.875rem; font-weight: 700; color: #111827;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.bk-footer-date { display: block; font-size: 0.74rem; color: #6b7280; margin-top: 1px; }
.bk-footer-subs {
  display: block; font-size: 0.71rem; color: #6366f1; font-weight: 500;
  margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

/* Submit button — full width on mobile, auto on desktop */
.bk-submit-btn {
  background: #111827; color: #fff; border: none; border-radius: 12px;
  padding: 13px 24px;
  font-size: clamp(0.85rem, 2.5vw, 0.9rem);
  font-weight: 700; font-family: inherit; cursor: pointer; white-space: nowrap;
  transition: background 0.2s, transform 0.15s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%;
  min-height: 48px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
@media (min-width: 600px) {
  .bk-submit-btn { width: auto; flex-shrink: 0; }
}
.bk-submit-btn:hover:not(:disabled) { background: #1f2937; transform: translateY(-1px); }
.bk-submit-btn:active { transform: translateY(0); }
.bk-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

.bk-btn-spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
  border-radius: 50%; animation: bkSpin 0.7s linear infinite; flex-shrink: 0;
}
@keyframes bkSpin { to { transform: rotate(360deg); } }

/* ════════════════════════════════════
   SUCCESS SCREEN
════════════════════════════════════ */
.bk-success {
  flex: 1; overflow-y: auto;
  display: flex; flex-direction: column; align-items: center;
  padding: 32px 16px 28px; text-align: center;
}
@media (min-width: 600px) {
  .bk-success { padding: 48px 32px 36px; }
}

.bk-success-icon {
  width: 60px; height: 60px; flex-shrink: 0;
  background: linear-gradient(135deg,#059669,#10b981); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; color: #fff; margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(5,150,105,0.3);
  animation: successPop 0.4s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes successPop { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }

.bk-success-title {
  font-family: 'Fraunces', serif;
  font-size: clamp(1.2rem, 4vw, 1.6rem);
  font-weight: 600; color: #111827; margin-bottom: 6px;
}
.bk-success-sub { font-size: 0.87rem; color: #6b7280; margin-bottom: 20px; }

.bk-success-card {
  width: 100%; max-width: 380px;
  background: #f9fafb; border: 1px solid #e5e7eb;
  border-radius: 14px; overflow: hidden; margin-bottom: 14px;
}
.bk-suc-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px; border-bottom: 1px solid #f3f4f6;
  font-size: 0.83rem; gap: 8px;
}
.bk-suc-row--top { align-items: flex-start; }
.bk-suc-row:last-child { border-bottom: none; }
.bk-suc-row span { color: #6b7280; flex-shrink: 0; }
.bk-suc-row strong { color: #111827; font-weight: 600; text-align: right; }
.bk-suc-subs { text-align: right; word-break: break-word; }
.bk-status-pending {
  background: #fef3c7; color: #d97706;
  padding: 2px 10px; border-radius: 20px; font-size: 0.74rem;
}

.bk-success-note {
  font-size: 0.79rem; color: #9ca3af; margin-bottom: 22px;
  max-width: 300px; line-height: 1.6;
}
.bk-done-btn {
  background: #111827; color: #fff; border: none; border-radius: 12px;
  padding: 13px 48px; font-size: 0.9rem; font-weight: 700;
  font-family: inherit; cursor: pointer; transition: background 0.2s;
  width: 100%; max-width: 300px;
  touch-action: manipulation;
}
.bk-done-btn:hover { background: #374151; }
`;