// src/Components/Vendor/VendorRegister.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE1 = import.meta.env.VITE_API_URL;
const API_BASE  = `${API_BASE1}/api`;

const injectStyles = () => {
  if (document.getElementById("vendor-modal-styles")) return;
  const s = document.createElement("style");
  s.id = "vendor-modal-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .vrm-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
      z-index: 9999; display: flex; align-items: center; justify-content: center;
      padding: 16px; animation: vrm-fade-in 0.2s ease;
    }
    @keyframes vrm-fade-in { from { opacity: 0; } to { opacity: 1; } }

    .vrm-card {
      background: #fff; border-radius: 18px; width: 100%;
      max-width: 640px; max-height: 92vh; overflow-y: auto; position: relative;
      animation: vrm-slide-up 0.25s cubic-bezier(0.34,1.56,0.64,1);
      scrollbar-width: thin; scrollbar-color: #e0e0e0 transparent;
    }
    .vrm-card::-webkit-scrollbar { width: 4px; }
    .vrm-card::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }
    @keyframes vrm-slide-up {
      from { opacity: 0; transform: translateY(28px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    .vrm-header {
      padding: 24px 28px 0; display: flex;
      align-items: flex-start; justify-content: space-between; gap: 12px;
    }
    .vrm-header-text h2 {
      font-family: 'Outfit', sans-serif; font-size: 1.35rem;
      font-weight: 700; color: #111; line-height: 1.2;
    }
    .vrm-header-text p {
      font-family: 'Outfit', sans-serif; font-size: 0.82rem; color: #777; margin-top: 4px;
    }
    .vrm-close {
      width: 32px; height: 32px; border-radius: 50%; border: none;
      background: #f0f0f0; color: #555; font-size: 1.1rem; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: background 0.15s; line-height: 1;
    }
    .vrm-close:hover { background: #e0e0e0; color: #111; }

    .vrm-divider-line { height: 1px; background: #f0f0f0; margin: 20px 0 0; }

    .vrm-steps {
      display: flex; align-items: center; justify-content: center;
      gap: 0; padding: 20px 28px 0;
    }
    .vrm-step {
      display: flex; flex-direction: column; align-items: center;
      gap: 5px; flex: 1; position: relative;
    }
    .vrm-step-circle {
      width: 30px; height: 30px; border-radius: 50%; border: 2px solid #e8e8e8;
      background: #fff; display: flex; align-items: center; justify-content: center;
      font-family: 'Outfit', sans-serif; font-size: 0.78rem; font-weight: 600;
      color: #bbb; z-index: 1; transition: all 0.25s;
    }
    .vrm-step.active .vrm-step-circle { border-color: #c2185b; background: #c2185b; color: #fff; }
    .vrm-step.done   .vrm-step-circle { border-color: #16a34a; background: #16a34a; color: #fff; }
    .vrm-step-label {
      font-family: 'Outfit', sans-serif; font-size: 0.7rem;
      color: #bbb; white-space: nowrap; transition: color 0.25s;
    }
    .vrm-step.active .vrm-step-label { color: #c2185b; font-weight: 600; }
    .vrm-step.done   .vrm-step-label { color: #16a34a; }
    .vrm-step-line {
      flex: 1; height: 2px; background: #e8e8e8;
      margin-bottom: 22px; transition: background 0.25s;
    }
    .vrm-step-line.done { background: #16a34a; }

    .vrm-body { padding: 20px 28px 28px; }

    .vrm-section-title {
      font-family: 'Outfit', sans-serif; font-size: 0.75rem; font-weight: 600;
      color: #aaa; letter-spacing: 0.07em; text-transform: uppercase; margin: 0 0 14px;
    }

    .vrm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
    .vrm-grid-full { grid-column: 1 / -1; }

    .vrm-field { display: flex; flex-direction: column; gap: 5px; }
    .vrm-label { font-family: 'Outfit', sans-serif; font-size: 0.82rem; font-weight: 500; color: #333; }
    .vrm-hint  { font-family: 'Outfit', sans-serif; font-size: 0.75rem; color: #aaa; margin-top: 3px; }

    .vrm-input {
      width: 100%; padding: 11px 14px;
      border: 1.5px solid #e8e8e8; border-radius: 10px;
      font-family: 'Outfit', sans-serif; font-size: 0.88rem; color: #111;
      background: #fff; outline: none;
      transition: border-color 0.18s, box-shadow 0.18s; appearance: none;
    }
    .vrm-input::placeholder { color: #bbb; }
    .vrm-input:focus { border-color: #c2185b; box-shadow: 0 0 0 3px rgba(194,24,91,0.08); }
    .vrm-input.error { border-color: #f87171; }
    .vrm-input option { color: #111; background: #fff; }
    .vrm-input:disabled { background: #fafafa; color: #bbb; cursor: not-allowed; }

    /* ── Multi-select vendor category picker ── */
    .vrm-multiselect-box {
      border: 1.5px solid #e8e8e8; border-radius: 10px;
      padding: 10px 12px; background: #fff;
      transition: border-color 0.18s, box-shadow 0.18s; cursor: text;
    }
    .vrm-multiselect-box:focus-within {
      border-color: #c2185b; box-shadow: 0 0 0 3px rgba(194,24,91,0.08);
    }
    .vrm-chips {
      display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px;
    }
    .vrm-chip {
      display: inline-flex; align-items: center; gap: 5px;
      background: #fce4ec; color: #c2185b;
      font-family: 'Outfit', sans-serif; font-size: 0.78rem; font-weight: 600;
      padding: 3px 9px 3px 10px; border-radius: 20px;
      animation: vrm-chip-in 0.18s ease;
    }
    @keyframes vrm-chip-in { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
    .vrm-chip-remove {
      background: none; border: none; cursor: pointer; color: #c2185b;
      font-size: 0.85rem; padding: 0; line-height: 1; display: flex; align-items: center;
      opacity: 0.6; transition: opacity 0.15s;
    }
    .vrm-chip-remove:hover { opacity: 1; }
    .vrm-multiselect-search {
      border: none; outline: none; font-family: 'Outfit', sans-serif;
      font-size: 0.88rem; color: #111; width: 100%; background: transparent;
      min-width: 120px;
    }
    .vrm-multiselect-search::placeholder { color: #bbb; }
    .vrm-dropdown {
      border: 1.5px solid #e8e8e8; border-radius: 10px; background: #fff;
      max-height: 180px; overflow-y: auto; margin-top: 4px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.10); z-index: 100; position: relative;
      scrollbar-width: thin; scrollbar-color: #e8e8e8 transparent;
    }
    .vrm-dropdown-item {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 14px; cursor: pointer;
      font-family: 'Outfit', sans-serif; font-size: 0.88rem; color: #111;
      transition: background 0.12s;
    }
    .vrm-dropdown-item:hover { background: #fce4ec; }
    .vrm-dropdown-item.selected { background: #fce4ec; color: #c2185b; font-weight: 600; }
    .vrm-dropdown-item-check {
      width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid #e0e0e0;
      background: #fff; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all 0.15s;
    }
    .vrm-dropdown-item.selected .vrm-dropdown-item-check {
      background: #c2185b; border-color: #c2185b; color: #fff;
    }
    .vrm-dropdown-empty {
      padding: 12px 14px; font-family: 'Outfit', sans-serif;
      font-size: 0.85rem; color: #bbb; text-align: center;
    }
    /* ── end multi-select ── */

    .vrm-phone-row {
      display: flex; border: 1.5px solid #e8e8e8; border-radius: 10px;
      overflow: hidden; transition: border-color 0.18s, box-shadow 0.18s;
    }
    .vrm-phone-row:focus-within { border-color: #c2185b; box-shadow: 0 0 0 3px rgba(194,24,91,0.08); }
    .vrm-phone-flag {
      display: flex; align-items: center; gap: 6px; padding: 0 10px;
      background: #f9f9f9; border-right: 1.5px solid #e8e8e8;
      font-family: 'Outfit', sans-serif; font-size: 0.82rem; color: #444;
      white-space: nowrap; cursor: pointer; user-select: none;
    }
    .vrm-phone-flag select {
      border: none; background: transparent;
      font-family: 'Outfit', sans-serif; font-size: 0.82rem; color: #444;
      outline: none; cursor: pointer; appearance: none; -webkit-appearance: none;
    }
    .vrm-phone-num {
      flex: 1; border: none; padding: 11px 12px;
      font-family: 'Outfit', sans-serif; font-size: 0.88rem;
      color: #111; outline: none; background: transparent;
    }
    .vrm-phone-num::placeholder { color: #bbb; }

    .vrm-pass-wrap { position: relative; }
    .vrm-pass-wrap .vrm-input { padding-right: 44px; }
    .vrm-eye {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer; color: #bbb;
      font-size: 1rem; padding: 0; line-height: 1; transition: color 0.15s;
    }
    .vrm-eye:hover { color: #555; }

    .vrm-strength-bar { display: flex; gap: 4px; margin-top: 6px; }
    .vrm-strength-seg {
      flex: 1; height: 3px; border-radius: 3px;
      background: #e8e8e8; transition: background 0.25s;
    }
    .vrm-strength-label { font-family: 'Outfit', sans-serif; font-size: 0.72rem; margin-top: 3px; }

    .vrm-errors {
      background: #fff5f5; border: 1px solid #fecaca;
      border-radius: 10px; padding: 12px 14px; margin-bottom: 16px;
    }
    .vrm-errors p {
      font-family: 'Outfit', sans-serif; font-size: 0.82rem;
      color: #dc2626; margin-bottom: 3px;
    }
    .vrm-errors p:last-child { margin-bottom: 0; }
    .vrm-success {
      background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px;
      padding: 12px 14px; margin-bottom: 16px;
      font-family: 'Outfit', sans-serif; font-size: 0.85rem; color: #16a34a;
      display: flex; align-items: center; gap: 8px;
    }

    .vrm-footer {
      padding: 18px 28px 24px; display: flex;
      justify-content: space-between; align-items: center; gap: 12px;
      border-top: 1px solid #f0f0f0;
    }
    .vrm-footer-right { display: flex; gap: 10px; align-items: center; }

    .vrm-btn-cancel {
      padding: 11px 22px; border-radius: 10px; border: 1.5px solid #e0e0e0;
      background: #fff; color: #555; font-family: 'Outfit', sans-serif;
      font-size: 0.9rem; font-weight: 500; cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
    }
    .vrm-btn-cancel:hover { background: #f5f5f5; border-color: #ccc; }

    .vrm-btn-back {
      padding: 11px 20px; border-radius: 10px; border: 1.5px solid #e8e8e8;
      background: #fff; color: #555; font-family: 'Outfit', sans-serif;
      font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: background 0.15s;
    }
    .vrm-btn-back:hover { background: #f5f5f5; }

    .vrm-btn-next {
      padding: 11px 28px; border-radius: 10px; border: none;
      background: linear-gradient(135deg, #e91e8c 0%, #c2185b 100%);
      color: #fff; font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 600;
      cursor: pointer; box-shadow: 0 3px 14px rgba(194,24,91,0.3);
      transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
      display: flex; align-items: center; gap: 8px;
    }
    .vrm-btn-next:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(194,24,91,0.38); }
    .vrm-btn-next:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    .vrm-spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff;
      border-radius: 50%; animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .vrm-step-count { font-family: 'Outfit', sans-serif; font-size: 0.78rem; color: #bbb; }

    .vrm-signin {
      text-align: center; font-family: 'Outfit', sans-serif;
      font-size: 0.82rem; color: #888; padding: 0 28px 20px;
    }
    .vrm-signin a { color: #c2185b; font-weight: 600; text-decoration: none; }
    .vrm-signin a:hover { text-decoration: underline; }

    .vrm-textarea {
      width: 100%; padding: 11px 14px; border: 1.5px solid #e8e8e8; border-radius: 10px;
      font-family: 'Outfit', sans-serif; font-size: 0.88rem; color: #111; background: #fff;
      outline: none; transition: border-color 0.18s, box-shadow 0.18s;
      resize: vertical; min-height: 70px;
    }
    .vrm-textarea::placeholder { color: #bbb; }
    .vrm-textarea:focus { border-color: #c2185b; box-shadow: 0 0 0 3px rgba(194,24,91,0.08); }

    .vrm-honeypot { opacity: 0; position: absolute; top: 0; left: 0; height: 0; width: 0; z-index: -1; }

    @media (max-width: 520px) {
      .vrm-overlay { padding: 0; align-items: flex-end; }
      .vrm-card { border-radius: 20px 20px 0 0; max-height: 95vh; }
      .vrm-header, .vrm-body, .vrm-signin { padding-left: 18px; padding-right: 18px; }
      .vrm-footer { padding: 14px 18px 20px; flex-wrap: wrap; }
      .vrm-footer-right { width: 100%; }
      .vrm-btn-next { width: 100%; justify-content: center; }
      .vrm-btn-back { width: 100%; justify-content: center; }
      .vrm-grid { grid-template-columns: 1fr; }
      .vrm-steps { padding: 16px 18px 0; }
    }
  `;
  document.head.appendChild(s);
};

const COUNTRY_CODES = [
  { code: "+91",  flag: "🇮🇳", label: "IN" },
  { code: "+1",   flag: "🇺🇸", label: "US" },
  { code: "+44",  flag: "🇬🇧", label: "GB" },
  { code: "+61",  flag: "🇦🇺", label: "AU" },
  { code: "+971", flag: "🇦🇪", label: "AE" },
];

const EXPERIENCE_OPTIONS = [
  { label: "Less than 1 year", value: "0" },
  { label: "1–2 years",        value: "1" },
  { label: "3–5 years",        value: "3" },
  { label: "5–10 years",       value: "5" },
  { label: "10+ years",        value: "10" },
];

const VENDOR_TYPES = [
  { label: "Individual", value: "individual" },
  { label: "Company",    value: "company" },
];

const getStrength = (pw) => {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  const map = [
    { label: "",       color: "#e8e8e8" },
    { label: "Weak",   color: "#ef4444" },
    { label: "Fair",   color: "#f97316" },
    { label: "Good",   color: "#eab308" },
    { label: "Strong", color: "#22c55e" },
  ];
  return { score, ...map[score] };
};

const STEPS = ["Personal", "Service"];

// ── Multi-select vendor category component ────────────────────────────────────
function VendorCategoryMultiSelect({ vendorCategories, loading, selectedIds, onChange }) {
  const [search, setSearch]       = useState("");
  const [open, setOpen]           = useState(false);
  const containerRef              = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = vendorCategories.filter(
    (vc) =>
      !search.trim() ||
      vc.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const removeChip = (id, e) => {
    e.stopPropagation();
    onChange(selectedIds.filter((x) => x !== id));
  };

  const selectedItems = vendorCategories.filter((vc) => selectedIds.includes(vc.id));

  return (
    <div ref={containerRef}>
      <div
        className="vrm-multiselect-box"
        onClick={() => { setOpen(true); }}
      >
        <div className="vrm-chips">
          {selectedItems.map((vc) => (
            <span key={vc.id} className="vrm-chip">
              
              {vc.name}
              <button
                type="button"
                className="vrm-chip-remove"
                onClick={(e) => removeChip(vc.id, e)}
                aria-label={`Remove ${vc.name}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <input
          className="vrm-multiselect-search"
          type="text"
          placeholder={selectedItems.length === 0 ? (loading ? "Loading categories…" : "Search & select categories…") : "Add more…"}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          disabled={loading}
          autoComplete="off"
        />
      </div>

      {open && !loading && (
        <div className="vrm-dropdown">
          {filtered.length === 0 ? (
            <div className="vrm-dropdown-empty">
              {vendorCategories.length === 0 ? "No vendor categories found." : "No results for that search."}
            </div>
          ) : (
            filtered.map((vc) => {
              const isSelected = selectedIds.includes(vc.id);
              return (
                <div
                  key={vc.id}
                  className={`vrm-dropdown-item${isSelected ? " selected" : ""}`}
                  onMouseDown={(e) => { e.preventDefault(); toggle(vc.id); }}
                >
                  <div className="vrm-dropdown-item-check">
                    {isSelected && <span style={{ fontSize: "0.7rem" }}>✓</span>}
                  </div>
                  <span>{vc.name}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function VendorRegister({ onClose }) {
  injectStyles();
  const navigate = useNavigate();

  // Vendor categories (from /api/vendor-categories)
  const [vendorCategories, setVendorCategories] = useState([]);
  const [vendorCatLoading, setVendorCatLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/vendor-categories`)
      .then((r) => r.json())
      .then((d) => {
        // API returns { success, data: [...] }
        setVendorCategories(d.data || d.vendorCategories || []);
        setVendorCatLoading(false);
      })
      .catch(() => setVendorCatLoading(false));
  }, []);

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    // Step 1 — Personal
    first_name: "", last_name: "", email: "",
    country_code: "+91", mobile: "",
    password: "", confirm_password: "",
    // Step 2 — Service
    aadhaar: "", experience: "",
    vendor_category_ids: [],   // ← multi-select array
    city: "", address: "",
    vendor_type: "individual", notes: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [errors,   setErrors]   = useState([]);
  const [success,  setSuccess]  = useState("");
  const [loading,  setLoading]  = useState(false);

  const strength = getStrength(form.password);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape" && onClose) onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  const mountedRef = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => { mountedRef.current = true; }, 300);
    return () => clearTimeout(t);
  }, []);

  const set = (field) => (e) => {
    if (!mountedRef.current) return;
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const setVendorCatIds = (ids) => {
    setForm((f) => ({ ...f, vendor_category_ids: ids }));
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const validateStep1 = () => {
    const errs = [];
    if (!form.first_name.trim())  errs.push("First name is required.");
    if (!form.last_name.trim())   errs.push("Last name is required.");
    if (!form.email.trim())       errs.push("Email is required.");
    if (!form.mobile.trim())      errs.push("Mobile number is required.");
    if (!form.password)           errs.push("Password is required.");
    if (form.password.length < 8) errs.push("Password must be at least 8 characters.");
    if (!/\d/.test(form.password)) errs.push("Password must contain at least one number.");
    if (form.password !== form.confirm_password) errs.push("Passwords do not match.");
    return errs;
  };

  const validateStep2 = () => {
    const errs = [];
    if (!form.aadhaar.trim())              errs.push("Aadhaar number is required.");
    if (form.aadhaar.trim().length !== 12) errs.push("Aadhaar must be exactly 12 digits.");
    if (!form.experience)                  errs.push("Experience is required.");
    if (form.vendor_category_ids.length === 0)
      errs.push("Please select at least one vendor category.");
    if (!form.city.trim())    errs.push("City is required.");
    if (!form.address.trim()) errs.push("Address is required.");
    return errs;
  };

  const goNext = () => {
    setErrors([]);
    const errs = validateStep1();
    if (errs.length) { setErrors(errs); return; }
    setStep(2);
    setTimeout(() => document.querySelector(".vrm-card")?.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  const goBack = () => { setErrors([]); setStep(1); };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== 2) return;

    setErrors([]);
    const errs = validateStep2();
    if (errs.length) { setErrors(errs); return; }

    setSuccess(""); setLoading(true);

    try {
      const fd = new FormData();
      fd.append("name",             `${form.first_name.trim()} ${form.last_name.trim()}`);
      fd.append("email",            form.email.trim());
      fd.append("mobile",           `${form.country_code}${form.mobile.trim()}`);
      fd.append("aadhaar",          form.aadhaar.trim());
      fd.append("password",         form.password);
      fd.append("confirm_password", form.confirm_password);
      fd.append("experience",       form.experience);
      fd.append("city",             form.city.trim());
      fd.append("address",          form.address.trim());
      fd.append("vendor_type",      form.vendor_type);

      // Send multiple vendor category IDs
      // Some backends expect repeated keys; others prefer JSON string
      form.vendor_category_ids.forEach((id) => fd.append("vendor_category_ids[]", id));
      // Also send as JSON string as a fallback
      fd.append("vendor_category_ids", JSON.stringify(form.vendor_category_ids));

      if (form.notes.trim()) fd.append("notes", form.notes.trim());

      const res  = await fetch(`${API_BASE}/vendors/register`, { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrors(data.errors || [data.message || "Registration failed."]);
        setLoading(false);
        return;
      }

      if (data.token) localStorage.setItem("vendorToken", data.token);
      setSuccess(data.message || "Registered successfully! Redirecting to login…");
      setTimeout(() => navigate("/user/VendorLogin"), 2200);
    } catch {
      setErrors(["Network error. Please check your connection and try again."]);
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => { if (e.target === e.currentTarget && onClose) onClose(); };

  return (
    <div className="vrm-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="Vendor Registration">
      <div className="vrm-card">

        {/* ── Header ── */}
        <div className="vrm-header">
          <div className="vrm-header-text">
            <h2>Become a Provider</h2>
            <p>Complete 2 steps to create your vendor account</p>
          </div>
          {onClose && <button className="vrm-close" onClick={onClose} aria-label="Close">✕</button>}
        </div>

        {/* ── Progress Steps ── */}
        <div className="vrm-steps">
          {STEPS.map((label, i) => {
            const num = i + 1;
            const cls = num < step ? "done" : num === step ? "active" : "";
            return (
              <React.Fragment key={label}>
                <div className={`vrm-step ${cls}`}>
                  <div className="vrm-step-circle">{num < step ? "✓" : num}</div>
                  <span className="vrm-step-label">{label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`vrm-step-line ${num < step ? "done" : ""}`} />}
              </React.Fragment>
            );
          })}
        </div>

        <div className="vrm-divider-line" />

        {/* ── Alerts ── */}
        {(errors.length > 0 || success) && (
          <div style={{ padding: "16px 28px 0" }}>
            {errors.length > 0 && <div className="vrm-errors">{errors.map((e, i) => <p key={i}>⚠ {e}</p>)}</div>}
            {success && <div className="vrm-success"><span>✅</span> {success}</div>}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          noValidate
          onKeyDown={(e) => { if (e.key === "Enter" && step !== 2) e.preventDefault(); }}
        >
          {/* Honeypot */}
          <div className="vrm-honeypot" aria-hidden="true">
            <input type="text"     name="username" tabIndex={-1} readOnly />
            <input type="password" name="password" tabIndex={-1} readOnly />
            <input type="email"    name="email"    tabIndex={-1} readOnly />
          </div>

          {/* ══════════════ STEP 1 — Personal Info ══════════════ */}
          {step === 1 && (
            <div className="vrm-body">
              <p className="vrm-section-title">Personal Information</p>
              <div className="vrm-grid">

                <div className="vrm-field">
                  <label className="vrm-label">First Name *</label>
                  <input className="vrm-input" type="text" placeholder="Rahul"
                    autoComplete="off" value={form.first_name} onChange={set("first_name")} />
                </div>

                <div className="vrm-field">
                  <label className="vrm-label">Last Name *</label>
                  <input className="vrm-input" type="text" placeholder="Sharma"
                    autoComplete="off" value={form.last_name} onChange={set("last_name")} />
                </div>

                <div className="vrm-field vrm-grid-full">
                  <label className="vrm-label">Email Address *</label>
                  <input className="vrm-input" type="email" placeholder="rahul@example.com"
                    autoComplete="off" value={form.email} onChange={set("email")} />
                </div>

                <div className="vrm-field vrm-grid-full">
                  <label className="vrm-label">Mobile Number *</label>
                  <div className="vrm-phone-row">
                    <div className="vrm-phone-flag">
                      <span>{COUNTRY_CODES.find((c) => c.code === form.country_code)?.flag ?? "🇮🇳"}</span>
                      <select value={form.country_code} onChange={set("country_code")} aria-label="Country code">
                        {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code}>{c.code} {c.label}</option>)}
                      </select>
                      <span style={{ fontSize: "0.7rem", color: "#aaa" }}>▾</span>
                    </div>
                    <input className="vrm-phone-num" type="tel" placeholder="9876543210"
                      maxLength={10} autoComplete="off" value={form.mobile} onChange={set("mobile")} />
                  </div>
                  <span className="vrm-hint">10-digit number without country code</span>
                </div>

                <div className="vrm-field">
                  <label className="vrm-label">Password *</label>
                  <div className="vrm-pass-wrap">
                    <input className="vrm-input" type={showPass ? "text" : "password"}
                      placeholder="Min. 8 chars + 1 number"
                      autoComplete="new-password"
                      value={form.password} onChange={set("password")} />
                    <button type="button" className="vrm-eye"
                      onClick={() => setShowPass((p) => !p)} aria-label={showPass ? "Hide" : "Show"}>
                      {showPass ? "🙈" : "👁"}
                    </button>
                  </div>
                  {form.password && (
                    <>
                      <div className="vrm-strength-bar">
                        {[1, 2, 3, 4].map((n) => (
                          <div key={n} className="vrm-strength-seg"
                            style={{ background: n <= strength.score ? strength.color : "#e8e8e8" }} />
                        ))}
                      </div>
                      <span className="vrm-strength-label" style={{ color: strength.color }}>{strength.label}</span>
                    </>
                  )}
                </div>

                <div className="vrm-field">
                  <label className="vrm-label">Confirm Password *</label>
                  <div className="vrm-pass-wrap">
                    <input className="vrm-input"
                      type={showConf ? "text" : "password"}
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      value={form.confirm_password} onChange={set("confirm_password")}
                      style={form.confirm_password && form.confirm_password !== form.password
                        ? { borderColor: "#f87171" } : {}} />
                    <button type="button" className="vrm-eye"
                      onClick={() => setShowConf((p) => !p)} aria-label={showConf ? "Hide" : "Show"}>
                      {showConf ? "🙈" : "👁"}
                    </button>
                  </div>
                  {form.confirm_password && form.confirm_password !== form.password && (
                    <span className="vrm-hint" style={{ color: "#ef4444" }}>Passwords do not match</span>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ══════════════ STEP 2 — Service Info ══════════════ */}
          {step === 2 && (
            <div className="vrm-body">
              <p className="vrm-section-title">Service Information</p>
              <div className="vrm-grid">

                <div className="vrm-field">
                  <label className="vrm-label">Aadhaar Number *</label>
                  <input className="vrm-input" type="text" placeholder="123456789012"
                    maxLength={12} inputMode="numeric" autoComplete="off"
                    value={form.aadhaar} onChange={set("aadhaar")} />
                  <span className="vrm-hint">12-digit Aadhaar card number</span>
                </div>

                <div className="vrm-field">
                  <label className="vrm-label">Years of Experience *</label>
                  <select className="vrm-input" value={form.experience} onChange={set("experience")} autoComplete="off">
                    <option value="">Select experience</option>
                    {EXPERIENCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                {/* ── Vendor Category Multi-select ── */}
                <div className="vrm-field vrm-grid-full">
                  <label className="vrm-label">
                    Vendor Categories *
                    {form.vendor_category_ids.length > 0 && (
                      <span style={{
                        marginLeft: 8, background: "#c2185b", color: "#fff",
                        borderRadius: 20, padding: "1px 8px",
                        fontSize: "0.72rem", fontWeight: 700,
                      }}>
                        {form.vendor_category_ids.length} selected
                      </span>
                    )}
                  </label>
                  <VendorCategoryMultiSelect
                    vendorCategories={vendorCategories}
                    loading={vendorCatLoading}
                    selectedIds={form.vendor_category_ids}
                    onChange={setVendorCatIds}
                  />
                  {!vendorCatLoading && vendorCategories.length === 0 && (
                    <span className="vrm-hint" style={{ color: "#ef4444" }}>
                      Could not load vendor categories. Check API.
                    </span>
                  )}
                  {vendorCategories.length > 0 && (
                    <span className="vrm-hint">
                      Click to open the list. Select multiple categories that describe your services.
                    </span>
                  )}
                </div>

                <div className="vrm-field">
                  <label className="vrm-label">Vendor Type *</label>
                  <select className="vrm-input" value={form.vendor_type} onChange={set("vendor_type")} autoComplete="off">
                    {VENDOR_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                <div className="vrm-field">
                  <label className="vrm-label">City *</label>
                  <input className="vrm-input" type="text" placeholder="Mumbai"
                    autoComplete="off" value={form.city} onChange={set("city")} />
                </div>

                <div className="vrm-field vrm-grid-full">
                  <label className="vrm-label">Full Address *</label>
                  <textarea className="vrm-textarea"
                    placeholder="House / Flat No., Street, Area, Landmark"
                    autoComplete="off" value={form.address} onChange={set("address")} />
                  <span className="vrm-hint">Saved to the database as your service address</span>
                </div>

                <div className="vrm-field vrm-grid-full">
                  <label className="vrm-label">
                    Additional Notes <span style={{ color: "#bbb", fontWeight: 400 }}>(optional)</span>
                  </label>
                  <textarea className="vrm-textarea"
                    placeholder="Any extra info about your services…"
                    autoComplete="off" value={form.notes} onChange={set("notes")} style={{ minHeight: 54 }} />
                </div>

              </div>
            </div>
          )}

          {/* ── Footer ── */}
          <div className="vrm-footer">
            <span className="vrm-step-count">Step {step} of {STEPS.length}</span>
            <div className="vrm-footer-right">
              {step === 1 && onClose && (
                <button type="button" className="vrm-btn-cancel" onClick={onClose}>Cancel</button>
              )}
              {step === 2 && (
                <button type="button" className="vrm-btn-back" onClick={goBack}>← Back</button>
              )}
              {step === 1 ? (
                <button type="button" className="vrm-btn-next" onClick={goNext}>Next →</button>
              ) : (
                <button className="vrm-btn-next" type="submit" disabled={loading || !!success}>
                  {loading
                    ? <><span className="vrm-spinner" /> Registering…</>
                    : <>Submit Registration →</>}
                </button>
              )}
            </div>
          </div>
        </form>

        <p className="vrm-signin">
          Already registered? <a href="/user/VendorLogin">Sign in here</a>
        </p>

      </div>
    </div>
  );
}