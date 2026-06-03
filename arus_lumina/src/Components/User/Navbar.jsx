// src/Components/User/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
const API_BASE1 = import.meta.env.VITE_API_URL;


const API_BASE    = `${API_BASE1}/api`;
const SERVER_BASE = API_BASE1

const FALLBACK_ICONS = [
  "🔧","🏠","🧹","🍽","🚗","⚡","💅","🌿","🎨","📦","🏊","🐾","💻","📸","🎓",
];

/**
 * Build a full image URL from what the backend stores.
 * Backend saves only the filename (e.g. "1748123456-photo.png")
 * under  /uploads/categories/  on the server.
 * Full URL → http://localhost:5000/uploads/categories/1748123456-photo.png
 */
const buildImageUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  return url; // Cloudinary URLs are stored directly now
};

/* ── Smart icon renderer ── */
const CatIcon = ({ icon, image, fallbackEmoji, size = 34 }) => {
  const [imgError, setImgError] = useState(false);
  const src = buildImageUrl(icon) || buildImageUrl(image);

  const box = {
    width: size, height: size,
    borderRadius: 9,
    background: "#fff5fb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: size > 28 ? "1rem" : "0.85rem",
    flexShrink: 0,
    border: "1px solid #fce4f3",
    overflow: "hidden",
  };

  if (src && !imgError) {
    return (
      <span style={box}>
        <img
          src={src}
          alt=""
          onError={() => setImgError(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </span>
    );
  }
  return <span style={box}>{fallbackEmoji}</span>;
};

/* ── Inject styles once ── */
const injectStyles = () => {
  if (document.getElementById("navbar-styles")) return;
  const style = document.createElement("style");
  style.id = "navbar-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    .navbar-root { font-family: 'Plus Jakarta Sans', sans-serif; }

    @keyframes nav-fade-down {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes mobile-slide-down {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .cat-dropdown  { animation: nav-fade-down 0.18s ease both; }
    .mobile-drawer { animation: mobile-slide-down 0.22s ease both; }

    .nav-link-item {
      position: relative;
      font-size: 0.875rem; font-weight: 500;
      color: #374151; text-decoration: none;
      padding: 6px 4px; transition: color 0.2s; white-space: nowrap;
    }
    .nav-link-item::after {
      content: ''; position: absolute;
      bottom: 0; left: 0; width: 0; height: 2px;
      border-radius: 2px;
      background: linear-gradient(90deg, #e91e8c, #c2185b);
      transition: width 0.25s ease;
    }
    .nav-link-item:hover { color: #e91e8c; }
    .nav-link-item:hover::after { width: 100%; }
    .nav-link-item.active { color: #e91e8c; font-weight: 600; }
    .nav-link-item.active::after { width: 100%; }

    .cat-btn {
      background: none; border: none; cursor: pointer;
      font-family: inherit; font-size: 0.875rem; font-weight: 500;
      color: #374151; display: flex; align-items: center; gap: 6px;
      padding: 6px 4px; transition: color 0.2s;
      position: relative; white-space: nowrap;
    }
    .cat-btn::after {
      content: ''; position: absolute;
      bottom: 0; left: 0; width: 0; height: 2px;
      border-radius: 2px;
      background: linear-gradient(90deg, #e91e8c, #c2185b);
      transition: width 0.25s ease;
    }
    .cat-btn:hover, .cat-btn.open { color: #e91e8c; }
    .cat-btn:hover::after, .cat-btn.open::after { width: 100%; }

    .cat-item {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 10px; border-radius: 10px;
      font-size: 0.84rem; color: #374151;
      text-decoration: none; transition: background 0.15s, color 0.15s;
    }
    .cat-item:hover { background: #fdf2f8; color: #e91e8c; }

    .btn-outline {
      font-size: 0.82rem; font-weight: 600;
      padding: 8px 16px; border-radius: 9px;
      border: 1.5px solid #e91e8c; color: #e91e8c;
      background: transparent; text-decoration: none;
      white-space: nowrap; transition: background 0.2s, color 0.2s; cursor: pointer;
    }
    .btn-outline:hover { background: #e91e8c; color: #fff; }

    .btn-primary {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 18px; border-radius: 9px;
      background: linear-gradient(135deg, #e91e8c, #c2185b);
      color: #fff; font-size: 0.82rem; font-weight: 700;
      text-decoration: none; white-space: nowrap;
      box-shadow: 0 3px 14px rgba(233,30,140,0.32);
      transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
    }
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(233,30,140,0.42);
      opacity: 0.93;
    }

    .hamburger-btn {
      display: none; background: none; border: none;
      cursor: pointer; font-size: 1.3rem; color: #374151;
      padding: 4px 8px; border-radius: 8px; transition: background 0.15s;
    }
    .hamburger-btn:hover { background: #f3f4f6; }

    @media (max-width: 1024px) {
      .desktop-nav   { display: none !important; }
      .desktop-right { display: none !important; }
      .hamburger-btn { display: flex; align-items: center; }
    }
    @media (min-width: 1025px) {
      .mobile-drawer { display: none !important; }
    }
  `;
  document.head.appendChild(style);
};

const Navbar = () => {
  injectStyles();

  const [menuOpen,    setMenuOpen]    = useState(false);
  const [catOpen,     setCatOpen]     = useState(false);
  const [categories,  setCategories]  = useState([]);
  const [catLoading,  setCatLoading]  = useState(false);
  const [catError,    setCatError]    = useState(false);
  const catRef = useRef(null);

  /* ── Lazy-fetch categories ── */
  useEffect(() => {
    if (catOpen && categories.length === 0 && !catLoading) {
      setCatLoading(true);
      setCatError(false);
      fetch(`${API_BASE}/categories`)
        .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
        .then((data) => {
          const cats = Array.isArray(data)
            ? data
            : data.categories || data.data || data.result || [];
          setCategories(cats);
        })
        .catch(() => setCatError(true))
        .finally(() => setCatLoading(false));
    }
  }, [catOpen]);

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Build category URL with query param ── */
  const getCategoryUrl = (cat) => {
    const id = cat.id || cat._id;
    return `/user/services?category=${id}`;
  };

  const navItems = [
    { label: "Home",     href: "/user/home",     active: true  },
    { label: "Service",  href: "/user/services", active: false },
    { label: "About Us", href: "/user/about",    active: false },
  ];

  const GridIcon = () => (
    <span style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2.5px", width:13, height:13, flexShrink:0 }}>
      {[0,1,2,3].map((i) => (
        <span key={i} style={{ width:5, height:5, borderRadius:1.5, background:"currentColor", display:"block" }} />
      ))}
    </span>
  );

  const Chevron = () => (
    <span style={{
      fontSize: "0.6rem", display: "inline-block",
      transition: "transform 0.22s",
      transform: catOpen ? "rotate(180deg)" : "rotate(0deg)",
    }}>▾</span>
  );

  /* ── Desktop dropdown ── */
  const CatDropdown = () => (
    <div className="cat-dropdown" style={{
      position: "absolute", top: "calc(100% + 10px)", left: 0,
      background: "#fff", border: "1px solid #f0f0f0",
      borderRadius: 14, padding: "10px 8px",
      boxShadow: "0 12px 40px rgba(0,0,0,0.11), 0 2px 8px rgba(233,30,140,0.07)",
      minWidth: 260, zIndex: 300,
    }}>
      {catLoading && (
        <p style={{ padding:"14px 10px", textAlign:"center", color:"#aaa", fontSize:"0.82rem", margin:0 }}>
          Loading categories…
        </p>
      )}
      {catError && (
        <p style={{ padding:"12px 10px", textAlign:"center", color:"#e91e8c", fontSize:"0.82rem", margin:0 }}>
          ⚠️ Could not load categories
        </p>
      )}
      {!catLoading && !catError && categories.map((cat, i) => (
        <a
          key={cat.id || cat._id || i}
          href={getCategoryUrl(cat)}
          className="cat-item"
          onClick={() => setCatOpen(false)}
        >
          <CatIcon
            icon={cat.icon}
            image={cat.image}
            fallbackEmoji={FALLBACK_ICONS[i % FALLBACK_ICONS.length]}
            size={36}
          />
          <span style={{ fontWeight:500 }}>{cat.name || cat.title || "Category"}</span>
        </a>
      ))}
      {!catLoading && !catError && categories.length === 0 && (
        <p style={{ padding:"12px", textAlign:"center", color:"#aaa", fontSize:"0.82rem", margin:0 }}>
          No categories found
        </p>
      )}
    </div>
  );

  /* ─────────────── RENDER ─────────────── */
  return (
    <nav className="navbar-root" style={{
      position: "sticky", top: 0, zIndex: 200,
      background: "rgba(255,255,255,0.96)",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid #f0f0f0",
      boxShadow: "0 1px 16px rgba(0,0,0,0.06)",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto", padding: "0 24px",
        height: 66, display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 24,
      }}>

        {/* Logo */}
        <a href="/user/home" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none", flexShrink:0 }}>
  <img
    src="/logo121.jpeg"
    alt="Arus Lumina"
    style={{ height: 60, width: "auto" }}
  />
</a>

        {/* Desktop Nav */}
        <ul className="desktop-nav" style={{ display:"flex", alignItems:"center", gap:28, listStyle:"none", margin:0, padding:0, flex:1 }}>
          <li ref={catRef} style={{ position:"relative", listStyle:"none" }}>
            <button className={`cat-btn ${catOpen ? "open" : ""}`} onClick={() => setCatOpen((p) => !p)}>
              <GridIcon />
              Categories
              <Chevron />
            </button>
            {catOpen && <CatDropdown />}
          </li>
          {navItems.map((item) => (
            <li key={item.label} style={{ listStyle:"none" }}>
              <a href={item.href} className={`nav-link-item ${item.active ? "active" : ""}`}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Right */}
        <div className="desktop-right" style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <a href="/user/VendorLogin"    className="btn-outline">🔐 Vendor Login</a>
          <a href="/user/Vendorregister" className="btn-primary">👤 Vendor Registration</a>
        </div>

        {/* Hamburger */}
        <button className="hamburger-btn" onClick={() => setMenuOpen((p) => !p)} aria-label="Toggle menu">
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="mobile-drawer" style={{
          background:"#fff", borderTop:"1px solid #f0f0f0",
          padding:"16px 20px 20px", display:"flex", flexDirection:"column",
          gap:2, boxShadow:"0 8px 24px rgba(0,0,0,0.08)",
        }}>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display:"block", padding:"11px 14px", borderRadius:10,
                fontFamily:"'Plus Jakarta Sans',sans-serif",
                fontSize:"0.9rem", fontWeight: item.active ? 600 : 500,
                color: item.active ? "#e91e8c" : "#374151",
                textDecoration:"none",
                background: item.active ? "#fdf2f8" : "transparent",
                transition:"background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => { if (!item.active) { e.currentTarget.style.background="#f9fafb"; e.currentTarget.style.color="#e91e8c"; } }}
              onMouseLeave={(e) => { if (!item.active) { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#374151"; } }}
            >
              {item.label}
            </a>
          ))}

          {/* Mobile categories */}
          {categories.length > 0 && (
            <>
              <div style={{
                padding:"10px 14px 6px",
                fontFamily:"'Plus Jakarta Sans',sans-serif",
                fontSize:"0.78rem", fontWeight:700, color:"#e91e8c",
                letterSpacing:"0.06em", textTransform:"uppercase",
              }}>
                📂 Categories
              </div>
              {categories.slice(0, 6).map((cat, i) => (
                <a
                  key={cat.id || cat._id || i}
                  href={getCategoryUrl(cat)}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display:"flex", alignItems:"center", gap:10,
                    padding:"9px 14px 9px 24px", borderRadius:10,
                    fontFamily:"'Plus Jakarta Sans',sans-serif",
                    fontSize:"0.86rem", color:"#374151",
                    textDecoration:"none", transition:"background 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background="#fdf2f8"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background="transparent"; }}
                >
                  <CatIcon
                    icon={cat.icon}
                    image={cat.image}
                    fallbackEmoji={FALLBACK_ICONS[i % FALLBACK_ICONS.length]}
                    size={28}
                  />
                  <span>{cat.name || cat.title}</span>
                </a>
              ))}
            </>
          )}

          {/* Mobile buttons */}
          <div style={{ borderTop:"1px solid #f0f0f0", marginTop:10, paddingTop:14, display:"flex", gap:10 }}>
            <a href="/user/VendorLogin"    className="btn-outline" style={{ flex:1, textAlign:"center" }}>🔐 Vendor Login</a>
            <a href="/user/Vendorregister" className="btn-primary" style={{ flex:1, justifyContent:"center" }}>👤 Register</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;