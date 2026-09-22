import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import TabaotModal from "@/components/modals/TabaotModal";
import LinksModal from "@/components/modals/LinksModal";
import IdeasModal from "@/components/modals/IdeasModal";
import EmailModal from "@/components/modals/EmailModal";

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(null);

  const navLinks = [
    { label: "🏠 דשבורד", to: "/" },
    { label: "📋 הוראות תוכנית", to: "/plan-instructions" },
  ];

  const navActions = [
    { label: "🔗 קישורים", onClick: () => setModal("links") },
    { label: "📑 תב״עות", onClick: () => setModal("tabaot") },
    { label: "💡 רעיונות", onClick: () => setModal("ideas") },
    { label: "🖨 הדפס", onClick: () => window.print() },
    { label: "✉️ מייל", onClick: () => setModal("email") },
  ];

  return (
    <>
      <header dir="rtl" style={{ background: "#1a3060" }} className="sticky top-0 z-50 no-print">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="py-1 text-center" style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>
            אגף הנדסה — עיריית אשדוד
          </div>
          <div className="flex items-center justify-between pb-2">
            <div>
              <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 900, fontFamily: "'Frank Ruhl Libre', serif", lineHeight: 1.2 }}>
                דשבורד אדריכלית העיר
              </h1>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>עץ ארגוני · תכולת עבודה · 2025</div>
            </div>
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(l => (
                <Link key={l.to} to={l.to} className="px-3 py-1.5 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                  {l.label}
                </Link>
              ))}
              {navActions.map(a => (
                <button key={a.label} onClick={a.onClick} className="px-3 py-1.5 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                  {a.label}
                </button>
              ))}
            </nav>
            {/* Mobile hamburger */}
            <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(v => !v)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {/* Gradient line */}
        <div style={{ height: 3, background: "linear-gradient(to left, #2d8fd4, transparent)" }} />
        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: "#132348" }} className="md:hidden px-4 pb-4 flex flex-col gap-1">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="py-2 text-sm text-white/80 border-b border-white/10">
                {l.label}
              </Link>
            ))}
            {navActions.map(a => (
              <button key={a.label} onClick={() => { a.onClick(); setMenuOpen(false); }} className="py-2 text-sm text-white/80 text-right border-b border-white/10">
                {a.label}
              </button>
            ))}
          </div>
        )}
      </header>
      {modal === "tabaot"  && <TabaotModal  onClose={() => setModal(null)} />}
      {modal === "links"   && <LinksModal   onClose={() => setModal(null)} />}
      {modal === "ideas"   && <IdeasModal   onClose={() => setModal(null)} />}
      {modal === "email"   && <EmailModal   onClose={() => setModal(null)} />}
    </>
  );
}