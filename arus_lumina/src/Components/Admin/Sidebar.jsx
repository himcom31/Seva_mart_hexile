import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, CalendarDays, MessageSquare,
  Bot, Globe, LogOut, Menu, X, ChevronDown, AlignLeft
} from "lucide-react";

function SidebarItem({ to, icon, label, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
        ${active
          ? "bg-pink-50 text-pink-600"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
      `}
    >
      <span className={`shrink-0 ${active ? "text-pink-500" : "text-slate-400 group-hover:text-slate-600"}`}>
        {icon}
      </span>
      <span className="text-[13.5px] font-medium leading-none">{label}</span>
    </Link>
  );
}

function CollapsibleItem({ icon, label, subItems, isActive, onSubClick }) {
  const anyActive = subItems.some(s => isActive(s.path));
  const [open, setOpen] = useState(anyActive);

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
          ${anyActive ? "bg-pink-50 text-pink-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
        `}
      >
        <span className={`shrink-0 ${anyActive ? "text-pink-500" : "text-slate-400 group-hover:text-slate-600"}`}>
          {icon}
        </span>
        <span className="text-[13.5px] font-medium flex-1 text-left leading-none">{label}</span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="ml-4 mt-0.5 space-y-0.5 pl-5 border-l border-slate-100">
          {subItems.map((sub, i) => (
            <Link
              key={i}
              to={sub.path}
              onClick={onSubClick}
              className={`
                block py-2 px-2 text-[13px] font-medium rounded-lg transition-colors
                ${isActive(sub.path) ? "text-pink-500" : "text-slate-500 hover:text-slate-800"}
              `}
            >
              <span className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive(sub.path) ? "bg-pink-500" : "bg-slate-300"}`} />
                {sub.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <circle cx="21" cy="21" r="10" stroke="#ec4899" strokeWidth="2.5" fill="none" />
      <circle cx="21" cy="21" r="3.5" fill="#ec4899" />
      <line x1="21" y1="4" x2="21" y2="11" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
      <line x1="21" y1="31" x2="21" y2="38" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="21" x2="11" y2="21" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
      <line x1="31" y1="21" x2="38" y2="21" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const menuSections = [
    {
      group: null,
      items: [
        { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin/dashboard" },
      ]
    },
    {
      group: "Application",   ///vendor-categories
      items: [
        { label: "Bookings Management", icon: <AlignLeft size={18} />, path: "/admin/bookings" },
        { label: "Vendor Management", icon: <CalendarDays size={18} />, path: "/admin/vendors" },
        { label: "Customer Database", icon: <MessageSquare size={18} />, path: "/admin/customers" },
        { label: "Vendor Categories", icon: <Globe size={18} />, path: "/admin/vendor-categories" },
      ]
    },
    {
      group: "Services",
      items: [
        { label: "Service Management", icon: <Bot size={18} />, path: "/admin/services" },
        { label: "Category Management", icon: <Globe size={18} />, path: "/admin/categories" },
        { label: "Sub Service", icon: <Globe size={18} />, path: "/admin/SubServicePage" },
      ]
    }
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
  <img
    src="/logo121.jpeg"
    alt="Arus Lumina"
    style={{ height: 60, width: "auto" }}
  />
  <span
    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    className="text-[17px] font-bold text-slate-800 tracking-tight"
  >
    ARUS<span className="text-pink-500"> LUMINA</span>
  </span>
</div>
        {/* Close button — mobile only */}
        <button
          className="md:hidden w-8 h-8 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors flex items-center justify-center"
          onClick={closeMobile}
          aria-label="Close menu"
        >
          <X size={18} className="text-slate-500" />
        </button>
      </div>

      {/* Nav — scrollable */}
      <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4 space-y-5">
        {menuSections.map((section, si) => (
          <div key={si} className="space-y-0.5">
            {section.group && (
              <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                {section.group}
              </p>
            )}
            {section.items.map((item, ii) =>
              item.subItems ? (
                <CollapsibleItem
                  key={ii}
                  icon={item.icon}
                  label={item.label}
                  subItems={item.subItems}
                  isActive={isActive}
                  onSubClick={closeMobile}
                />
              ) : (
                <SidebarItem
                  key={ii}
                  to={item.path}
                  icon={item.icon}
                  label={item.label}
                  active={isActive(item.path)}
                  onClick={closeMobile}
                />
              )
            )}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-100 shrink-0"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 active:bg-red-100 transition-all group"
        >
          <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform shrink-0" />
          <span className="text-[13.5px] font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 bg-white border-b border-slate-200 h-14"
        style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="flex items-center gap-2">
            <img
    src="/logo121.jpeg"
    alt="Arus Lumina"
    style={{ height: 60, width: "auto" }}
  />
          <span className="text-[16px] font-bold text-slate-800 tracking-tight">
            ARUS<span className="text-pink-500"> LUMINA</span>
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} className="text-slate-600" />
        </button>
      </div>

      {/* Mobile backdrop */}
      <div
        className={`
          md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm
          transition-opacity duration-300
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Sidebar drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-[100dvh] z-50 bg-white border-r border-slate-200
          transition-transform duration-300 ease-in-out
          w-[280px] max-w-[85vw]
          md:sticky md:top-0 md:h-screen md:w-[260px] md:translate-x-0 md:flex md:flex-col md:shrink-0
          ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
        aria-label="Sidebar navigation"
      >
        <SidebarContent />
      </aside>
    </>
  );
}