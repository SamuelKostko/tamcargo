/**
 * TAM Cargo — Landing Page
 * Stack: React + Tailwind (via CDN config) + Lucide-React + Framer-Motion-like CSS
 * Architecture mirrors: /src/components/{Navbar, Hero, Tracking, Services, Trust, Footer}
 */

import { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import {
  Anchor, Plane, Truck, FileCheck, MapPin, Phone, Mail,
  ArrowRight, Search, X, ChevronDown, Globe, Shield,
  Clock, Package, Star, Menu, MessageCircle, ChevronRight,
  Boxes, Ship, Wind, BarChart3, CheckCircle2, Instagram,
  Facebook, Linkedin, Twitter, Zap
} from "lucide-react";
import tamCargoLogo from "./assets/TAM CARGO.png";
import tamFondo from "./assets/TAM.png";
import heroImage from "./assets/hero.png";
import TrackingVisualizer from "./components/TrackingVisualizer";
import AdminDashboard from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

/* ─────────────────────────────────────────
   DESIGN TOKENS  (mirrors tailwind.config)
───────────────────────────────────────── */
const C = {
  navy: "#fff7f7",
  navyMid: "#fff1f1",
  navyLight: "#ffe4e4",
  electric: "#B11E22",
  electricLight: "#c9474a",
  cyan: "#d96568",
  cyanLight: "#e78f91",
  white: "#241415",
  gray: "#7a5e60",
  grayLight: "#4f383a",
};

/* ─────────────────────────────────────────
   useScrollAnimation hook
───────────────────────────────────────── */
function useScrollAnimation() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ─────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: ${C.navy};
    --navy-mid: ${C.navyMid};
    --navy-light: ${C.navyLight};
    --electric: ${C.electric};
    --electric-light: ${C.electricLight};
    --cyan: ${C.cyan};
    --cyan-light: ${C.cyanLight};
    --white: ${C.white};
    --gray: ${C.gray};
    --gray-light: ${C.grayLight};
    --font-sans: 'Space Grotesk', sans-serif;
    --font-mono: 'DM Mono', monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--navy);
    color: var(--white);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--navy); }
  ::-webkit-scrollbar-thumb { background: var(--electric); border-radius: 2px; }

  /* Fade-in animation */
  .fade-up {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 0.65s ease, transform 0.65s ease;
  }
  .fade-up.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .fade-up.delay-1 { transition-delay: 0.1s; }
  .fade-up.delay-2 { transition-delay: 0.2s; }
  .fade-up.delay-3 { transition-delay: 0.3s; }
  .fade-up.delay-4 { transition-delay: 0.4s; }

  /* Grid noise texture overlay */
  .noise::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1;
  }

  /* Animated gradient border */
  .grad-border {
    position: relative;
    background: linear-gradient(var(--navy-mid), var(--navy-mid)) padding-box,
                linear-gradient(135deg, var(--electric), var(--cyan)) border-box;
    border: 1px solid transparent;
    border-radius: 16px;
  }

  /* Glow dot */
  .glow-dot::before {
    content: '';
    position: absolute;
    width: 280px; height: 280px;
    background: radial-gradient(circle, rgba(177,30,34,0.18) 0%, transparent 70%);
    border-radius: 50%;
    top: -60px; left: -60px;
    pointer-events: none;
  }

  /* Smooth hover card lift */
  .card-hover {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .card-hover:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 48px rgba(177,30,34,0.2);
  }

  /* Stripe horizontal line */
  .h-stripe {
    background: linear-gradient(90deg, transparent, var(--electric), var(--cyan), transparent);
    height: 1px;
    border: none;
  }

  /* Tracking modal backdrop */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { 
    from { opacity: 0; transform: translateY(40px) scale(0.95); } 
    to { opacity: 1; transform: translateY(0) scale(1); } 
  }

  .modal-card { 
    animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.7);
  }

  /* Nav link underline effect */
  .nav-link {
    position: relative;
    color: rgba(255,255,255,0.9);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    transition: color 0.2s;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0;
    width: 0; height: 1.5px;
    background: var(--cyan);
    transition: width 0.25s ease;
  }
  .nav-link:hover { color: #fff; }
  .nav-link:hover::after { width: 100%; }

  /* Mobile menu */
  .mobile-menu {
    position: fixed;
    top: 0; left: 0;
    width: 280px; height: 100vh;
    background: var(--navy-mid);
    border-right: 1px solid rgba(177,30,34,0.2);
    z-index: 9000;
    transform: translateX(-100%);
    transition: transform 0.35s ease;
    display: flex;
    flex-direction: column;
    padding: 80px 32px 32px;
    gap: 8px;
  }
  .mobile-menu.open { transform: translateX(0); }

  /* WhatsApp FAB */
  .whatsapp-fab {
    position: fixed;
    bottom: 28px; right: 28px;
    width: 56px; height: 56px;
    background: linear-gradient(135deg, #25d366, #128c7e);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    z-index: 8888;
    box-shadow: 0 8px 24px rgba(37,211,102,0.35);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    text-decoration: none;
  }
  .whatsapp-fab:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 32px rgba(37,211,102,0.5);
  }

  /* Stats counter */
  .stat-card {
    background: rgba(177,30,34,0.05);
    border: 1px solid rgba(177,30,34,0.14);
    border-radius: 12px;
    padding: 28px 24px;
    text-align: center;
    transition: background 0.3s;
  }
  .stat-card:hover { background: rgba(177,30,34,0.1); }

  /* Button styles */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 28px;
    background: linear-gradient(135deg, var(--electric), #6d1732);
    color: white;
    border: none;
    border-radius: 8px;
    font-family: var(--font-sans);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;
    text-decoration: none;
    white-space: nowrap;
  }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

  .btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 28px;
    background: transparent;
    color: var(--cyan);
    border: 1.5px solid var(--cyan);
    border-radius: 8px;
    font-family: var(--font-sans);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
    text-decoration: none;
    white-space: nowrap;
  }
  .btn-outline:hover { background: rgba(217,101,104,0.1); transform: translateY(-1px); }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 28px;
    background: transparent;
    color: var(--gray);
    border: 1px solid #eee;
    border-radius: 8px;
    font-family: var(--font-sans);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    white-space: nowrap;
    justify-content: center;
  }
  .btn-secondary:hover { background: #f9f9f9; border-color: #ddd; }

  .hero-badge {
    max-width: 100%;
  }
  .hero-badge-text {
    white-space: normal;
    line-height: 1.45;
  }

  .hero-search-form {
    display: flex;
    align-items: stretch;
    gap: 0;
  }

  .contact-band {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 22px;
    align-items: center;
  }

  .contact-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 2fr;
    gap: 22px;
  }

  .footer-address-grid {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 20px;
    row-gap: 14px;
  }

  /* Responsive utils */
  @media (max-width: 768px) {
    .hide-mobile { display: none !important; }
    .show-mobile { display: flex !important; }

    .hero-search-form {
      flex-direction: column;
      background: rgba(177,30,34,0.15) !important;
      border-radius: 16px !important;
    }

    .hero-search-form .input-wrapper {
      width: 100%;
      border-bottom: 1px solid rgba(217,101,104,0.2);
    }

    .hero-search-form button {
      width: 100% !important;
      padding: 16px !important;
      border-radius: 0 0 16px 16px !important;
    }

    .hero-badge {
      padding: 8px 12px !important;
      margin-bottom: 20px !important;
      width: 100%;
      justify-content: center;
    }

    .hero-badge-text {
      font-size: 0.68rem !important;
      letter-spacing: 0.05em !important;
    }

    .contact-band {
      grid-template-columns: 1fr;
      gap: 24px;
      padding: 36px 22px !important;
      text-align: center;
    }

    .contact-actions {
      width: 100%;
      align-items: stretch;
    }

    .contact-actions a {
      justify-content: center;
      width: 100%;
    }

    .footer-grid {
      grid-template-columns: 1fr;
      gap: 26px;
    }

    .footer-address-grid {
      grid-template-columns: 1fr;
      row-gap: 12px;
    }
  }

  @media (min-width: 769px) and (max-width: 1100px) {
    .footer-grid {
      grid-template-columns: 1.4fr 1fr 1fr;
    }

    .footer-address-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (min-width: 769px) {
    .show-mobile { display: none !important; }
  }
`;

/* ─────────────────────────────────────────
   COMPONENT: Navbar
───────────────────────────────────────── */
function Navbar({ onTrack, onFreight }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Servicios", href: "#servicios" },
    { label: "¿Por qué TAM?", href: "#confianza" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Contacto", href: "#contacto" },
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 5000,
        padding: "0 24px",
        height: "68px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(15,23,42,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(177,30,34,0.15)" : "none",
        transition: "all 0.3s ease",
      }}>
        {/* Logo */}


        {/* Desktop links */}
        <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {links.map(l => (
            <a key={l.label} className="nav-link" href={l.href}>{l.label}</a>
          ))}
        </div>

        {/* CTA + mobile menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            className="btn-primary hide-mobile"
            onClick={onTrack}
            style={{
              padding: "8px 18px", fontSize: "0.82rem",
              background: "linear-gradient(135deg, #B11E22, #d96568)"
            }}
          >
            <Search size={14} /> Rastrear Carga
          </button>
          <button
            className="btn-outline hide-mobile"
            onClick={onFreight}
            style={{ padding: "8px 18px", fontSize: "0.82rem" }}
          >
            <BarChart3 size={14} /> Cálculo de Flete
          </button>
          <button
            className="show-mobile"
            onClick={() => setMenuOpen(true)}
            style={{ background: "none", border: "none", color: "white", cursor: "pointer", padding: 4 }}
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
        style={{ paddingTop: "72px" }}
      >
        <button onClick={() => setMenuOpen(false)}
          style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: C.gray, cursor: "pointer" }}>
          <X size={22} />
        </button>
        {links.map((l, i) => (
          <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
            style={{
              color: C.grayLight, textDecoration: "none", fontSize: "1rem", fontWeight: 500,
              padding: "12px 0", borderBottom: "1px solid rgba(177,30,34,0.08)",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
            {l.label} <ChevronRight size={16} color={C.cyan} />
          </a>
        ))}
        <button className="btn-primary" onClick={() => { onTrack(); setMenuOpen(false); }}
          style={{ marginTop: 24, justifyContent: "center", background: "linear-gradient(135deg, #B11E22, #d96568)" }}>
          <Search size={15} /> Rastrear Carga
        </button>
        <button className="btn-outline" onClick={() => { onFreight(); setMenuOpen(false); }}
          style={{ marginTop: 12, justifyContent: "center" }}>
          <BarChart3 size={15} /> Cálculo de Flete
        </button>
      </div>
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 8999
        }} />
      )}
    </>
  );
}

/* ─────────────────────────────────────────
   COMPONENT: TrackingModal
───────────────────────────────────────── */
function TrackingModal({ onClose, initialId = "" }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(8px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 860,
          width: "100%",
          maxHeight: "92vh",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative"
        }}
      >
        {/* Botón X — absoluto esquina superior derecha */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280",
            zIndex: 10,
            transition: "background 0.2s"
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#111"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.color = "#6b7280"; }}
        >
          <X size={18} />
        </button>

        {/* Header con franja de color */}
        <div style={{
          padding: "28px 32px 20px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          gap: "14px"
        }}>
          <div style={{
            width: "42px", height: "42px",
            background: "#B11E22",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Package size={22} color="white" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>
              Rastreo de Carga
            </h2>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af", marginTop: "2px" }}>
              Seguimiento en tiempo real · TAM Cargo
            </p>
          </div>
        </div>

        {/* Contenido scrollable */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          <TrackingVisualizer initialId={initialId} />

          {/* Footer ayuda */}
          <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid #e5e7eb", textAlign: "center" }}>
            <p style={{ margin: "0 0 12px", fontSize: "0.8rem", color: "#9ca3af" }}>¿Necesita asistencia personalizada?</p>
            <a
              href="https://wa.me/+584123580995"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                padding: "12px 28px",
                background: "#25D366", color: "white",
                borderRadius: "12px", fontWeight: 700,
                textDecoration: "none", fontSize: "0.9rem",
                boxShadow: "0 4px 14px rgba(37,211,102,0.3)"
              }}
            >
              <MessageCircle size={18} /> Contactar con Soporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function FreightCalculatorModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    origen: "miami",
    destino: "Caracas",
    modalidad: "aereo",
    tipoCarga: "general",
    descripcion: "",
    peso: "",
    largo: "",
    ancho: "",
    alto: "",
    cantidad: 1,
    cbmDirecto: ""
  });

  const [resultado, setResultado] = useState(null);

  const TARIFAS = {
    miami: {
      Caracas: {
        aereo: {
          general: { rate: 5.50, unit: "lb", time: "7-12 días" },
          especial: { rate: 7.50, unit: "lb", time: "7-12 días" }
        },
        maritimo: {
          general: { rate: 32.00, unit: "ft³", time: "15-25 días" },
          especial: { rate: 38.00, unit: "ft³", time: "15-25 días" }
        }
      },
      Margarita: {
        aereo: {
          general: { rate: 6.50, unit: "lb", time: "10-15 días" },
          especial: { rate: 8.50, unit: "lb", time: "10-15 días" }
        },
        maritimo: {
          general: { rate: 42.00, unit: "ft³", time: "25-35 días" },
          especial: { rate: 48.00, unit: "ft³", time: "25-35 días" }
        }
      }
    },
    china: {
      Caracas: {
        aereo: {
          general: { rate: 25.00, unit: "kg", time: "25-35 días" },
          especial: { rate: 28.00, unit: "kg", time: "25-35 días" }
        },
        maritimo: {
          general: { rate: 850.00, unit: "CBM", time: "65-75 días" },
          especial: { rate: 950.00, unit: "CBM", time: "65-75 días" }
        }
      },
      Margarita: {
        aereo: {
          general: { rate: 30.00, unit: "kg", time: "30-40 días" },
          especial: { rate: 33.00, unit: "kg", time: "30-40 días" }
        },
        maritimo: {
          general: { rate: 1030.00, unit: "CBM", time: "75-90 días" },
          especial: { rate: 1130.00, unit: "CBM", time: "75-90 días" }
        }
      }
    }
  };

  const estadosVzla = ["Caracas", "Margarita"];

  const handleSiguiente = () => setStep(s => s + 1);
  const handleAtras = () => setStep(s => s - 1);

  const calcular = () => {
    const { origen, destino, modalidad, tipoCarga, peso, largo, ancho, alto, cantidad, cbmDirecto } = formData;
    const p = parseFloat(peso) || 0;
    const l = parseFloat(largo) || 0;
    const a = parseFloat(ancho) || 0;
    const h = parseFloat(alto) || 0;
    const cant = parseFloat(cantidad) || 1;

    // Si es carga prohibida, no calculamos y salimos
    if (tipoCarga === "prohibida") return;

    // CASO ESPECIAL: Aéreo Margarita (Solo manual)
    if (destino === "Margarita" && modalidad === "aereo") {
      setResultado({
        total: "CONSULTAR",
        breakdown: "Cotización requerida con asesor",
        isManual: true,
        volume: 0,
        chargeBy: "Manual",
        time: "Verificar con asesor",
        unit: "Manual"
      });
      setStep(4);
      return;
    }

    const isChinaMaritimo = (origen === "china" && modalidad === "maritimo");
    const effectiveTipoCarga = (tipoCarga === "especial" && !isChinaMaritimo) ? "general" : tipoCarga;

    const config = TARIFAS[origen][destino][modalidad][effectiveTipoCarga];
    let billableAmount = 0;
    let detail = "";
    let volumeTotal = 0;
    let chargeBy = "physical"; // 'physical' or 'volumetric'

    if (origen === "miami") {
      if (modalidad === "aereo") {
        const volIn3 = (l * a * h);
        const volWeight = volIn3 > 0 ? (volIn3 / 166) : 0;
        if (volWeight > p) {
          chargeBy = "volumetric";
          billableAmount = volWeight * cant;
        } else {
          billableAmount = p * cant;
        }
        detail = `${billableAmount.toFixed(2)} Lbs`;
        volumeTotal = volIn3 / 1728; // volume in ft3 for reference
      } else {
        chargeBy = "volume";
        const volFt3 = (l * a * h) / 1728;
        billableAmount = volFt3 * cant;
        detail = `${billableAmount.toFixed(2)} ft³`;
        volumeTotal = volFt3;
      }
    } else {
      if (modalidad === "aereo") {
        const volCm3 = (l * a * h);
        const volWeight = volCm3 > 0 ? (volCm3 / 5000) : 0;
        if (volWeight > p) {
          chargeBy = "volumetric";
          billableAmount = volWeight * cant;
        } else {
          billableAmount = p * cant;
        }
        detail = `${billableAmount.toFixed(2)} Kg`;
        volumeTotal = volCm3 / 1000000; // in CBM for reference
      } else {
        chargeBy = "volume";
        const cbm = cbmDirecto ? parseFloat(cbmDirecto) : (l * a * h) / 1000000;
        const cbmByWeight = p / 900; // 900kg = 1 CBM rule

        if (cbmByWeight > cbm) {
          chargeBy = "density"; // Case for weight-based volume
          billableAmount = cbmByWeight * cant;
        } else {
          billableAmount = cbm * cant;
        }

        detail = `${billableAmount.toFixed(2)} CBM`;
        volumeTotal = cbm;
      }
    }

    setResultado({
      total: (billableAmount * config.rate).toLocaleString('en-US', { minimumFractionDigits: 2 }),
      breakdown: `${detail} × REF. ${config.rate}`,
      volume: volumeTotal.toFixed(3),
      chargeBy,
      time: config.time,
      unit: config.unit
    });

    // Validar límite de 8 CBM solicitado por el usuario
    const totalShipmentCBM = (origen === "miami") ? (volumeTotal * cant * 0.028317) : (volumeTotal * cant);
    if (totalShipmentCBM > 7.9) {
      setResultado({
        total: "CONSULTA CON ASESOR",
        breakdown: "Carga de gran volumen (> 8 CBM)",
        isManual: true,
        volume: (volumeTotal * cant).toFixed(3),
        chargeBy: "Manual",
        time: "Sujeto a cotización",
        unit: "CBM"
      });
    }

    setStep(4);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div style={{ display: "grid", gap: 24 }}>
            <div style={{ textAlign: "center" }}>
              <label style={{ fontSize: "0.9rem", color: C.gray, marginBottom: 12, display: "block" }}>Paso 1 de 3: Selección de Ruta</label>
              <div style={{ display: "flex", gap: 12 }}>
                <div
                  onClick={() => setFormData({ ...formData, origen: "miami" })}
                  style={{
                    flex: 1, padding: "20px", borderRadius: 16, cursor: "pointer", border: "2px solid",
                    borderColor: formData.origen === "miami" ? C.electric : "rgba(0,0,0,0.05)",
                    background: formData.origen === "miami" ? "rgba(177,30,34,0.05)" : "white",
                    transition: "0.3s"
                  }}
                >
                  <img src="https://flagcdn.com/w80/us.png" style={{ width: 40, marginBottom: 10, borderRadius: 4 }} alt="USA" />
                  <div style={{ fontWeight: 700 }}>Miami, USA</div>
                </div>
                <div
                  onClick={() => setFormData({ ...formData, origen: "china" })}
                  style={{
                    flex: 1, padding: "20px", borderRadius: 16, cursor: "pointer", border: "2px solid",
                    borderColor: formData.origen === "china" ? C.electric : "rgba(0,0,0,0.05)",
                    background: formData.origen === "china" ? "rgba(177,30,34,0.05)" : "white",
                    transition: "0.3s"
                  }}
                >
                  <img src="https://flagcdn.com/w80/cn.png" style={{ width: 40, marginBottom: 10, borderRadius: 4 }} alt="China" />
                  <div style={{ fontWeight: 700 }}>China</div>
                </div>
              </div>
            </div>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: C.grayLight, marginBottom: 8, display: "block" }}>Destino en Venezuela</label>
              <select
                value={formData.destino}
                onChange={e => setFormData({ ...formData, destino: e.target.value })}
                style={{ width: "100%", padding: "12px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.1)", background: "white" }}
              >
                {estadosVzla.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-secondary" onClick={onClose} style={{ flex: 1, padding: 14 }}>CANCELAR</button>
              <button className="btn-primary" onClick={handleSiguiente} style={{ flex: 1, padding: 14 }}>CONTINUAR</button>
            </div>
          </div>
        );
      case 2:
        return (
          <div style={{ display: "grid", gap: 24 }}>
            <div style={{ textAlign: "center" }}>
              <label style={{ fontSize: "0.9rem", color: C.gray, marginBottom: 12, display: "block" }}>Paso 2 de 3: Modalidad y Carga</label>
              <div style={{ display: "flex", gap: 12 }}>
                <div
                  onClick={() => setFormData({ ...formData, modalidad: "aereo" })}
                  style={{
                    flex: 1, padding: "20px", borderRadius: 16, cursor: "pointer", border: "2px solid",
                    borderColor: formData.modalidad === "aereo" ? C.electric : "rgba(0,0,0,0.05)",
                    background: formData.modalidad === "aereo" ? "rgba(177,30,34,0.05)" : "white"
                  }}
                >
                  <Plane size={24} color={formData.modalidad === "aereo" ? C.electric : C.gray} style={{ marginBottom: 10 }} />
                  <div style={{ fontWeight: 700 }}>Aéreo</div>
                  <div style={{ fontSize: "0.7rem", color: C.gray }}>
                    {formData.tipoCarga === "prohibida" ? "Bloqueado" : (
                      formData.destino === "Margarita"
                        ? "Previa cotización con asesor"
                        : TARIFAS[formData.origen][formData.destino].aereo[formData.tipoCarga]?.time
                    )}
                  </div>
                </div>
                <div
                  onClick={() => setFormData({ ...formData, modalidad: "maritimo" })}
                  style={{
                    flex: 1, padding: "20px", borderRadius: 16, cursor: "pointer", border: "2px solid",
                    borderColor: formData.modalidad === "maritimo" ? C.electric : "rgba(0,0,0,0.05)",
                    background: formData.modalidad === "maritimo" ? "rgba(177,30,34,0.05)" : "white"
                  }}
                >
                  <Ship size={24} color={formData.modalidad === "maritimo" ? C.electric : C.gray} style={{ marginBottom: 10 }} />
                  <div style={{ fontWeight: 700 }}>Marítimo</div>
                  <div style={{ fontSize: "0.7rem", color: C.gray }}>
                    {formData.tipoCarga === "prohibida" ? "Bloqueado" : TARIFAS[formData.origen][formData.destino].maritimo[formData.tipoCarga]?.time}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: C.grayLight, marginBottom: 8, display: "block" }}>Tipo de Carga</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["general", "especial"].map(t => (
                  <button
                    key={t}
                    onClick={() => setFormData({ ...formData, tipoCarga: t })}
                    style={{
                      flex: 1, padding: "10px", borderRadius: 10, fontSize: "0.85rem", textTransform: "capitalize",
                      border: "1px solid", cursor: "pointer",
                      borderColor: formData.tipoCarga === t ? C.electric : "rgba(0,0,0,0.1)",
                      background: formData.tipoCarga === t ? "rgba(177,30,34,0.05)" : "white",
                      color: formData.tipoCarga === t ? C.electric : C.gray
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: C.grayLight, marginBottom: 8, display: "block" }}>Descripción del producto</label>
              <input
                placeholder="Ej: Repuestos, Ropa, Electrónica..."
                value={formData.descripcion}
                onChange={e => {
                  const val = e.target.value.toLowerCase();

                  // Diccionario de productos prohíbidos (Restricción total en Venezuela)
                  const prohibidosKeywords = [
                    // --- SEGURIDAD Y DEFENSA ---
                    'dron', 'drone', 'uav', 'rpa', 'cuadricoptero', 'camara espia',
                    'microcamara', 'lentes con camara', 'boligrafo camara',
                    'mascara antigas', 'chaleco antibalas', 'casco tactico', 'codera', 'rodillera tactica',
                    'puño de acero', 'manopla', 'gas pimienta', 'taser', 'electroshock',
                    'mira telescopica', 'binoculares nocturnos', 'radio transmisor', 'walkie talkie',
                    // --- EXPLOSIVOS Y ARMAS ---
                    'arma', 'pistola', 'rifle', 'escopeta', 'municion', 'bala', 'balines',
                    'aire comprimido', 'paintball', 'fuego artificial', 'pirotecnia', 'polvora',
                    // --- RESTRICCIÓN DE VENTA Y SALUD ---
                    'vaper', 'vapeador', 'cigarrillo electronico', 'esencia para vaper', 'e-liquid',
                    'tabaco', 'cigarrillo', 'chimó', 'licor', 'whisky', 'vino', 'cerveza',
                    // --- VALORES Y OTROS ---
                    'dinero', 'billete', 'moneda', 'joya', 'oro', 'diamante', 'lingote',
                    'material pornografico', 'droga', 'estupefaciente', 'precursor quimico'
                  ];

                  // Diccionario de productos especiales (Prioridad Media)
                  const especialKeywords = [
                    // --- ROPA Y CALZADO ---
                    'zapato', 'calzado', 'tenis', 'bota', 'sandalia', 'ropa', 'prenda', 'franela',
                    'camisa', 'pantalon', 'jean', 'chaqueta', 'sueter', 'vestido', 'lenceria',
                    'ropa interior', 'textil', 'tela', 'sabana', 'paño',
                    // --- IMPLEMENTOS MÉDICOS Y PUNZANTES ---
                    'bisturi', 'hoja de bisturi', 'aguja', 'aguja hipodermica', 'jeringa',
                    'escalpelo', 'cateter', 'lanceta', 'instrumental quirurgico', 'termometro',
                    'tensiometro', 'insumo medico', 'gasas', 'guantes quirurgicos',
                    // --- ELECTRÓNICOS Y BATERÍAS ---
                    'bateria', 'pila', 'lithium', 'litio', 'powerbank', 'laptop', 'computadora',
                    'celular', 'telefono', 'tablet', 'ipad', 'smartwatch', 'consola', 'playstation',
                    'xbox', 'nintendo', 'televisor', 'monitor', 'panel solar', 'inversor', 'ups',
                    // --- CUIDADO PERSONAL Y COSMÉTICA ---
                    'perfume', 'fragancia', 'colonia', 'aerosol', 'spray', 'esmalte', 'acetona',
                    'alcohol', 'gel antibacterial', 'shampoo', 'crema', 'maquillaje', 'tinte',
                    // --- SALUD, SUPLEMENTOS Y QUÍMICOS ---
                    'medicina', 'medicamento', 'pastilla', 'jarabe', 'suplemento', 'vitamina',
                    'proteina', 'creatina', 'limpiador', 'detergente', 'cloro', 'desinfectante',
                    'pintura', 'solvente', 'tinner', 'aceite motor', 'lubricante',
                    // --- REPUESTOS Y FRÁGILES ---
                    'motor', 'compresor', 'amortiguador', 'bomba de gasolina', 'transmision',
                    'repuesto usado', 'vidrio', 'cristal', 'ceramica', 'porcelana', 'espejo'
                  ];

                  const isProhibido = prohibidosKeywords.some(key => val.includes(key));
                  const isSpecial = especialKeywords.some(key => val.includes(key));

                  setFormData({
                    ...formData,
                    descripcion: e.target.value,
                    tipoCarga: isProhibido ? "prohibida" : (isSpecial ? "especial" : "general")
                  });
                }}
                style={{
                  width: "100%", padding: "12px", borderRadius: 12,
                  border: `1px solid ${formData.tipoCarga === "prohibida" ? "#ff4d4f" : "rgba(0,0,0,0.1)"}`,
                  background: formData.tipoCarga === "prohibida" ? "#fff1f0" : "white"
                }}
              />

              {formData.tipoCarga === "prohibida" && (
                <div style={{
                  fontSize: "0.75rem", color: "#cf1322", marginTop: 8, fontWeight: 700,
                  display: "flex", flexDirection: "column", gap: 4, background: "#fff1f0",
                  padding: "12px", borderRadius: 8, border: "1px solid #ff4d4f"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <X size={14} /> 🚫 MERCANCÍA PROHIBIDA DETECTADA
                  </div>
                  <div style={{ fontWeight: 400, color: "#820014" }}>
                    Este artículo no cumple con las políticas de transporte o leyes internacionales. No podemos procesar este envío.
                  </div>
                </div>
              )}

              {formData.tipoCarga === "especial" && formData.origen === "china" && formData.modalidad === "maritimo" && (
                <div style={{
                  fontSize: "0.75rem", color: "#B11E22", marginTop: 8, fontWeight: 700,
                  display: "flex", alignItems: "center", gap: 6, background: "rgba(177,30,34,0.05)",
                  padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(177,30,34,0.1)"
                }}>
                  <BarChart3 size={12} /> ✨ Tarifa Especial Detectada (Electrónica/Líquidos/Valor)
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-secondary" onClick={handleAtras} style={{ flex: 1, padding: 14 }}>ATRÁS</button>
              <button className="btn-primary" onClick={handleSiguiente} style={{ flex: 1, padding: 14 }}>CONTINUAR</button>
            </div>
          </div>
        );
      case 3:
        const isMaritimo = formData.modalidad === "maritimo";
        return (
          <div style={{ display: "grid", gap: 16 }}>
            <label style={{ fontSize: "0.9rem", color: C.gray, textAlign: "center", display: "block" }}>Paso 3 de 3: Detalles de la Carga</label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: "0.8rem", color: C.gray }}>Cantidad de Bultos</label>
                <input type="number" min="1" value={formData.cantidad} onChange={e => setFormData({ ...formData, cantidad: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #ddd" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", color: C.gray }}>Peso Real ({formData.origen === "miami" ? "Lbs" : "Kg"})</label>
                <input type="number" value={formData.peso} onChange={e => setFormData({ ...formData, peso: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #ddd" }} />
              </div>
            </div>

            {/* Si NO hay un volumen directo ingresado, mostramos las medidas individuales */}
            {!formData.cbmDirecto && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: "0.8rem", color: C.gray }}>Largo ({formData.origen === "miami" ? "in" : "cm"})</label>
                  <input type="number" value={formData.largo} onChange={e => setFormData({ ...formData, largo: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #ddd" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: C.gray }}>Ancho ({formData.origen === "miami" ? "in" : "cm"})</label>
                  <input type="number" value={formData.ancho} onChange={e => setFormData({ ...formData, ancho: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #ddd" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: C.gray }}>Alto ({formData.origen === "miami" ? "in" : "cm"})</label>
                  <input type="number" value={formData.alto} onChange={e => setFormData({ ...formData, alto: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #ddd" }} />
                </div>
              </div>
            )}

            {isMaritimo && (
              <div style={{
                marginTop: 8, padding: 16, borderRadius: 12,
                border: "2px dashed #ddd", background: formData.cbmDirecto ? "rgba(177,30,34,0.02)" : "transparent"
              }}>
                <label style={{ fontSize: "0.8rem", color: C.gray, display: "block", marginBottom: 8, textAlign: "center" }}>
                  {formData.origen === "miami" ? "O ingrese Pies Cúbicos (ft³) Totales" : "O ingrese Metros Cúbicos (CBM) Totales"}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cbmDirecto}
                  onChange={e => setFormData({ ...formData, cbmDirecto: e.target.value })}
                  placeholder={formData.origen === "miami" ? "Ej: 5.2" : "Ej: 0.15"}
                  style={{
                    width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #ddd",
                    fontSize: "1rem", textAlign: "center", background: "white"
                  }}
                />
              </div>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <button className="btn-secondary" onClick={handleAtras} style={{ flex: 1, padding: 14 }}>ATRÁS</button>
              <button className="btn-primary" onClick={calcular} style={{ flex: 1, padding: 14 }}>CALCULAR</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div style={{ textAlign: "center" }}>
            <div style={{
              background: resultado.isManual ? "linear-gradient(135deg, #128C7E, #25D366)" : "linear-gradient(135deg, #B11E22, #d96568)",
              padding: "40px 20px", borderRadius: 24, color: "white", marginBottom: 24,
              boxShadow: resultado.isManual ? "0 15px 35px rgba(37,211,102,0.3)" : "0 15px 35px rgba(177,30,34,0.3)"
            }}>
              <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                {resultado.isManual ? "Requerido" : "Costo Referencial"}
              </div>
              <div style={{ fontSize: resultado.isManual ? "1.6rem" : "3rem", fontWeight: 800 }}>
                {resultado.isManual ? "" : "$"}{resultado.total}
              </div>
              <div style={{ fontSize: "1rem", marginTop: 8, opacity: 0.9 }}>{resultado.breakdown}</div>
            </div>

            <div style={{ display: "grid", gap: 12, textAlign: "left", padding: "0 10px", marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
                <span style={{ color: C.gray }}>Ruta:</span>
                <span style={{ fontWeight: 600 }}>{formData.origen.toUpperCase()} ➔ {formData.destino}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
                <span style={{ color: C.gray }}>Medidas:</span>
                <span style={{ fontWeight: 600 }}>{formData.largo}x{formData.ancho}x{formData.alto} {formData.origen === "miami" ? "in" : "cm"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
                <span style={{ color: C.gray }}>Volumen Total:</span>
                <span style={{ fontWeight: 600 }}>{resultado.volume} {formData.origen === "miami" ? "ft³" : "CBM"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
                <span style={{ color: C.gray }}>Peso Físico:</span>
                <span style={{ fontWeight: 600 }}>{formData.peso} {formData.origen === "miami" ? "Lbs" : "Kg"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
                <span style={{ color: C.gray }}>Base del Cobro:</span>
                <span style={{
                  fontWeight: 700,
                  color: (resultado.chargeBy === "volumetric" || resultado.chargeBy === "volume" || resultado.chargeBy === "density") ? "#B11E22" : C.electric
                }}>
                  {resultado.chargeBy === "volumetric" ? "Peso Volumétrico" : (resultado.chargeBy === "volume" ? "Volumen" : (resultado.chargeBy === "density" ? "CBM (Exceso Peso)" : "Peso Físico"))}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                const isChinaMaritimo = (formData.origen === "china" && formData.modalidad === "maritimo");
                const appliedType = (formData.tipoCarga === "especial" && !isChinaMaritimo) ? "GENERAL" : formData.tipoCarga.toUpperCase();
                const msg = `Hola TAM Cargo, deseo gestionar esta cotización:
📦 ORIGEN: ${formData.origen.toUpperCase()}
📍 DESTINO: ${formData.destino.toUpperCase()}
🚢 MODALIDAD: ${formData.modalidad.toUpperCase()} (${appliedType})
🏷️ PRODUCTO: ${formData.descripcion}
📏 MEDIDAS: ${formData.largo}x${formData.ancho}x${formData.alto} ${formData.origen === "miami" ? "in" : "cm"}
📦 VOLUMEN: ${resultado.volume} ${formData.origen === "miami" ? "ft³" : "CBM"}
⚖️ PESO: ${formData.peso} ${formData.origen === "miami" ? "Lbs" : "Kg"}
📉 COBRADO POR: ${resultado.chargeBy === "density" ? "CBM (EXCESO PESO)" : resultado.chargeBy.toUpperCase()}
💰 COSTO REF: ${resultado.isManual ? "POR DEFINIR (Consultar Asesor)" : "$" + resultado.total}`;
                window.open(`https://wa.me/584123580995?text=${encodeURIComponent(msg)}`, "_blank");
              }}
              style={{
                width: "100%", padding: 18, borderRadius: 16, border: "none",
                background: "#25D366", color: "white", fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                boxShadow: "0 10px 20px rgba(37,211,102,0.2)", fontSize: "1rem"
              }}
            >
              CONFIRMAR ENVÍO CON ASESOR
            </button>

            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <button className="btn-secondary" onClick={() => setStep(3)} style={{ flex: 1, padding: 14 }}>ATRÁS</button>
              <button className="btn-primary" onClick={() => setStep(1)}
                style={{ flex: 1, padding: 14, background: "none", color: C.gray, border: "1px solid #eee" }}>
                NUEVO CÁLCULO
              </button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card grad-border" onClick={e => e.stopPropagation()}
        style={{ maxWidth: 500, width: "100%", padding: "40px", overflowY: "auto", maxHeight: "90vh", borderRadius: 24 }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 20, right: 20, background: "none", border: "none",
          color: C.gray, cursor: "pointer"
        }}><X size={20} /></button>

        {step < 4 && (
          <div style={{ marginBottom: 30 }}>
            <div style={{ display: "flex", gap: 4, height: 4, background: "#eee", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${(step / 3) * 100}%`, background: C.electric, transition: "0.3s" }} />
            </div>
          </div>
        )}

        {renderStep()}
      </div>
    </div>
  );
}

function PrivacyPolicyModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card grad-border"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 820, width: "100%", padding: "36px 32px", position: "relative" }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "none",
            border: "none",
            color: C.gray,
            cursor: "pointer",
          }}
          aria-label="Cerrar política de privacidad"
        >
          <X size={18} />
        </button>

        <h3 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: 14 }}>
          Política de Privacidad
        </h3>
        <div
          style={{
            maxHeight: "62vh",
            overflowY: "auto",
            paddingRight: 8,
            textAlign: "left",
          }}
        >
          <h4 style={{ fontSize: "1rem", fontWeight: 700, color: C.white, marginBottom: 10 }}>
            Política de Privacidad y Confidencialidad Logística
          </h4>
          <p style={{ color: C.grayLight, lineHeight: 1.7, marginBottom: 14 }}>
            En TamCargo, la seguridad de la información es el motor de nuestras operaciones.
            Entendemos que en el comercio internacional, los datos no son solo registros,
            sino activos estratégicos de nuestros clientes.
          </p>

          <h5 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.white, margin: "16px 0 8px" }}>
            1. Compromiso de Confidencialidad Blindada
          </h5>
          <p style={{ color: C.gray, lineHeight: 1.7, marginBottom: 10 }}>
            Nuestra política se rige por un principio de aislamiento de información.
            Bajo ninguna circunstancia compartiremos:
          </p>
          <ul style={{ margin: "0 0 12px 18px", color: C.grayLight, lineHeight: 1.7 }}>
            <li>
              <strong>Datos de Proveedores:</strong> La identidad y contacto de sus fabricantes
              o proveedores son exclusivos de su cuenta.
            </li>
            <li>
              <strong>Estado de carga:</strong> El rastreo, ubicación y manifiestos de carga son
              accesibles únicamente para el titular de la cuenta o personas autorizadas por el mismo.
            </li>
            <li>
              <strong>Rutas y Costos:</strong> La información logística y comercial es estrictamente
              confidencial y no se utilizará como referencia pública para otros clientes.
            </li>
          </ul>

          <h5 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.white, margin: "16px 0 8px" }}>
            2. Información que Recopilamos
          </h5>
          <p style={{ color: C.gray, lineHeight: 1.7, marginBottom: 10 }}>
            Para garantizar el éxito de sus embarques, recolectamos:
          </p>
          <ul style={{ margin: "0 0 12px 18px", color: C.grayLight, lineHeight: 1.7 }}>
            <li>Datos de identificación fiscal y legal.</li>
            <li>Documentación de importación/exportación (Bill of Lading, facturas comerciales, listas de empaque).</li>
            <li>Información de contacto de destinatarios y remitentes.</li>
          </ul>

          <h5 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.white, margin: "16px 0 8px" }}>
            3. Uso de la Información
          </h5>
          <p style={{ color: C.gray, lineHeight: 1.7, marginBottom: 10 }}>
            La información recopilada se utiliza exclusivamente para:
          </p>
          <ul style={{ margin: "0 0 12px 18px", color: C.grayLight, lineHeight: 1.7 }}>
            <li>La gestión y despacho aduanal de sus mercancías.</li>
            <li>La coordinación del transporte terrestre, marítimo o aéreo.</li>
            <li>Cumplir con las regulaciones de comercio exterior y normativas legales vigentes.</li>
          </ul>

          <h5 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.white, margin: "16px 0 8px" }}>
            4. Protección de Datos entre Clientes
          </h5>
          <p style={{ color: C.grayLight, lineHeight: 1.7, marginBottom: 12 }}>
            Mantenemos sistemas de gestión de datos independientes para evitar cualquier filtración cruzada.
            Un cliente nunca tendrá acceso a los detalles operativos, orígenes o destinos de la carga de otro
            cliente, garantizando así la libre competencia y la protección de sus secretos comerciales.
          </p>

          <h5 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.white, margin: "16px 0 8px" }}>
            5. Transferencias a Terceros
          </h5>
          <p style={{ color: C.grayLight, lineHeight: 1.7, marginBottom: 6 }}>
            Solo compartiremos información con autoridades aduaneras, transportistas y agentes de carga
            necesarios para completar el ciclo logístico. Estos terceros están sujetos a contratos de
            confidencialidad que prohíben el uso de sus datos para fines ajenos al servicio contratado.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
          <button onClick={onClose} className="btn-outline" style={{ fontSize: "0.85rem", padding: "10px 18px" }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function TermsOfServiceModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card grad-border"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 820, width: "100%", padding: "36px 32px", position: "relative" }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "none",
            border: "none",
            color: C.gray,
            cursor: "pointer",
          }}
          aria-label="Cerrar términos de servicio"
        >
          <X size={18} />
        </button>

        <h3 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: 14 }}>
          Términos de Servicio
        </h3>
        <div
          style={{
            maxHeight: "62vh",
            overflowY: "auto",
            paddingRight: 8,
            textAlign: "left",
          }}
        >
          <h4 style={{ fontSize: "1rem", fontWeight: 700, color: C.white, marginBottom: 10 }}>
            Términos y Condiciones del Servicio Logístico
          </h4>
          <p style={{ color: C.grayLight, lineHeight: 1.7, marginBottom: 14 }}>
            Al contratar nuestros servicios, el Cliente acepta de manera íntegra las siguientes cláusulas.
          </p>

          <h5 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.white, margin: "16px 0 8px" }}>
            1. Trayectoria y Capacidad Operativa
          </h5>
          <p style={{ color: C.gray, lineHeight: 1.7, marginBottom: 10 }}>
            La Empresa declara contar con más de 20 años de experiencia en el sector de logística internacional.
            Todos los servicios son gestionados por personal altamente capacitado normativamente en aduanas,
            cubicaje y gestión de riesgos, garantizando un estándar de ejecución profesional en cada etapa de
            la cadena de suministro.
          </p>

          <h5 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.white, margin: "16px 0 8px" }}>
            2. Servicios de Consolidación de Carga
          </h5>
          <ul style={{ margin: "0 0 12px 18px", color: C.grayLight, lineHeight: 1.7 }}>
            <li>
              <strong>Beneficio de Gratuidad:</strong> La Empresa ofrece un servicio de consolidación de carga
              de diferentes proveedores sin costo de almacenaje por un período máximo de treinta (30) días
              calendario (un mes).
            </li>
            <li>
              <strong>Cargos Posteriores:</strong> Transcurrido el mes de gratuidad, se generarán cargos por
              almacenaje según la tarifa vigente, a menos que se pacte lo contrario por escrito.
            </li>
            <li>
              <strong>Responsabilidad:</strong> El Cliente es responsable de asegurar que sus proveedores entreguen
              la carga con la documentación técnica y comercial correcta para su debida consolidación.
            </li>
          </ul>

          <h5 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.white, margin: "16px 0 8px" }}>
            3. Confidencialidad Blindada y Protección de Datos
          </h5>
          <p style={{ color: C.gray, lineHeight: 1.7, marginBottom: 10 }}>
            Este es un pilar fundamental de nuestra relación comercial.
          </p>
          <ul style={{ margin: "0 0 12px 18px", color: C.grayLight, lineHeight: 1.7 }}>
            <li>
              <strong>Aislamiento de Información:</strong> La Empresa se compromete a no compartir, bajo ninguna
              circunstancia, información relativa a los proveedores, orígenes, costos o estatus de carga de un
              Cliente con otros clientes o terceros ajenos a la operación logística.
            </li>
            <li>
              <strong>Secreto Comercial:</strong> Reconocemos que la red de proveedores del Cliente es un activo
              estratégico. Nuestro personal está sujeto a acuerdos de confidencialidad estrictos para proteger
              esta información.
            </li>
            <li>
              <strong>Uso de Datos:</strong> Los datos proporcionados se utilizarán exclusivamente para la ejecución
              de los servicios contratados y el cumplimiento de normativas legales.
            </li>
          </ul>

          <h5 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.white, margin: "16px 0 8px" }}>
            4. Fletes y Entregas
          </h5>
          <ul style={{ margin: "0 0 12px 18px", color: C.grayLight, lineHeight: 1.7 }}>
            <li>
              <strong>Entrega Garantizada:</strong> La Empresa se compromete a realizar sus mejores esfuerzos para
              cumplir con los tiempos de tránsito estimados. No obstante, no se hace responsable por retrasos
              derivados de causas de fuerza mayor, huelgas, condiciones climáticas o demoras en inspecciones
              aduaneras ajenas a nuestro control.
            </li>
            <li>
              <strong>Seguro de Carga:</strong> Se recomienda al Cliente la contratación de un seguro de carga.
              La responsabilidad de La Empresa se limita a lo establecido en los convenios internacionales de
              transporte (CIM, CMR, Reglas de Hamburgo, etc.).
            </li>
          </ul>

          <h5 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.white, margin: "16px 0 8px" }}>
            5. Búsqueda de Proveedores
          </h5>
          <p style={{ color: C.gray, lineHeight: 1.7, marginBottom: 10 }}>
            En el servicio de búsqueda de proveedores, La Empresa actúa como facilitador basado en su experiencia
            de mercado. La decisión final de compra y la calidad intrínseca de los productos son responsabilidad
            del Cliente y su relación directa con el fabricante.
          </p>

          <h5 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.white, margin: "16px 0 8px" }}>
            6. Obligaciones del Cliente
          </h5>
          <p style={{ color: C.gray, lineHeight: 1.7, marginBottom: 10 }}>
            El Cliente garantiza que toda la información suministrada sobre la naturaleza de la carga es veraz y
            cumple con las leyes internacionales de comercio, absteniéndose de enviar mercancías peligrosas o
            prohibidas sin previa declaración y autorización.
          </p>

          <h5 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.white, margin: "16px 0 8px" }}>
            7. Responsabilidades y Gastos Adicionales
          </h5>
          <ul style={{ margin: "0 0 12px 18px", color: C.grayLight, lineHeight: 1.7 }}>
            <li>
              <strong>Gastos de Terceros:</strong> La Empresa no se hace responsable por gastos extraordinarios
              generados por almacenajes en puertos, depósitos externos o recargos impuestos por las autoridades
              aduaneras derivados de inspecciones, demoras del cliente o falta de documentación del proveedor.
            </li>
            <li>
              <strong>Revisiones y Decomisos:</strong> La Empresa no asume responsabilidad alguna por objetos
              extraviados, dañados o faltantes durante las revisiones físicas realizadas por las autoridades de
              aduana, ni por el decomiso de mercancías por parte de entes gubernamentales.
            </li>
            <li>
              <strong>Daños Fortuitos:</strong> La Empresa no se hace responsable por daños sufridos en la carga
              debidos a casos fortuitos, fuerza mayor o incidentes durante el tránsito que escapan al control
              directo de nuestro personal. Se recomienda encarecidamente la contratación de un seguro de carga.
            </li>
          </ul>

          <h5 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.white, margin: "16px 0 8px" }}>
            8. Determinación de Costos, Pesaje y Condiciones de Pago
          </h5>
          <ul style={{ margin: "0 0 12px 18px", color: C.grayLight, lineHeight: 1.7 }}>
            <li>
              <strong>Liquidación Final y Re-pese:</strong> El costo total del servicio logístico se determinará de
              manera definitiva una vez que la carga llegue a nuestro almacén de recepción en origen. Al recibir la
              mercancía, nuestro personal procederá a la medición técnica y pesaje físico (re-pese). Los costos
              finales se basarán exclusivamente en estas medidas confirmadas, las cuales prevalecerán sobre cualquier
              estimación previa o información proporcionada en facturas comerciales y listas de empaque (packing list).
            </li>
            <li>
              <strong>Momento y Lugar de Cobro:</strong> El pago total de los servicios contratados, fletes y gastos
              asociados se realizará de manera obligatoria una vez que la carga se encuentre en la Aduana destino.
            </li>
            <li>
              <strong>Condición de Entrega:</strong> La liberación de la mercancía y su posterior entrega al Cliente
              o transporte final en territorio nacional están estrictamente sujetas a la cancelación total de la
              factura emitida. La Empresa se reserva el derecho de retener la carga hasta que el pago haya sido
              verificado satisfactoriamente.
            </li>
            <li>
              <strong>Gastos Extraordinarios:</strong> No nos hacemos responsables por gastos extras generados por
              almacenajes, demoras o recargos por aduanas derivados de falta de pago oportuno por parte del Cliente
              o retrasos en la documentación requerida.
            </li>
          </ul>

          <p style={{ color: C.grayLight, lineHeight: 1.7, marginBottom: 6 }}>
            La aceptación de estos términos se entiende otorgada al contratar cualquiera de nuestros servicios.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
          <button onClick={onClose} className="btn-outline" style={{ fontSize: "0.85rem", padding: "10px 18px" }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPONENT: Hero
───────────────────────────────────────── */
function Hero({ onTrack }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onTrack(query);
  };

  return (
    <section id="inicio" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      {/* Background image with overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `url(${tamFondo})`,
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 1,
        filter: "brightness(0.4)",
        width: "100%",
      }} />
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(135deg, rgba(8,8,8,0.48) 0%, rgba(8,8,8,0.35) 50%, rgba(8,8,8,0.45) 100%)",
      }} />

      {/* Decorative grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        backgroundImage: "linear-gradient(rgba(177,30,34,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(177,30,34,0.04) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Glow blobs */}
      <div style={{
        position: "absolute", top: "20%", left: "-5%", zIndex: 2,
        width: 500, height: 500,
        background: "radial-gradient(circle, rgba(177,30,34,0.12) 0%, transparent 65%)",
        borderRadius: "50%",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", right: "0%", zIndex: 2,
        width: 400, height: 400,
        background: "radial-gradient(circle, rgba(217,101,104,0.1) 0%, transparent 65%)",
        borderRadius: "50%",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 3,
        maxWidth: 1200, margin: "0 auto",
        padding: "90px 18px 44px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}>
        <div style={{ marginBottom: 20, animation: "slideUp 0.7s ease both" }}>
          <img
            src={tamCargoLogo}
            alt="TAM Cargo"
            style={{
              height: "clamp(72px, 12vw, 130px)",
              width: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.35))",
            }}
          />
        </div>

        {/* Badge */}
        <div className="hero-badge" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(177,30,34,0.15)", border: "1px solid rgba(217,101,104,0.3)",
          borderRadius: 24, padding: "6px 16px", marginBottom: 28,
          animation: "slideUp 0.7s ease both",
        }}>
          <Globe size={13} color={C.cyan} />
          <span className="hero-badge-text" style={{ fontSize: "0.75rem", color: C.cyan, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Logística Internacional · Desde China hasta Venezuela y el Mundo
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)",
          fontWeight: 800,
          color: "white",
          lineHeight: 1.08,
          letterSpacing: "-0.03em",
          maxWidth: 740,
          margin: "0 auto 24px",
          animation: "slideUp 0.7s 0.1s ease both",
        }}>
          Tu Carga.<br />
          <span style={{ color: "white" }}>
            Nuestra Misión.
          </span><br />
          Un Solo Destino.
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
          color: "rgba(255,255,255,0.92)",
          maxWidth: 540,
          lineHeight: 1.7,
          margin: "0 auto 40px",
          animation: "slideUp 0.7s 0.2s ease both",
        }}>
          Soluciones integrales de transporte <strong style={{ color: "white" }}>Marítimo, Aéreo y Terrestre</strong> con gestión aduanera incluida. Especialistas en envíos a Venezuela y Worldwide.
        </p>

        {/* Tracking search bar */}
        <form className="hero-search-form" onSubmit={handleSearch} style={{
          maxWidth: 560,
          width: "100%",
          background: "rgba(177,30,34,0.1)",
          border: "1.5px solid rgba(217,101,104,0.3)",
          borderRadius: 12,
          overflow: "hidden",
          margin: "0 auto 20px",
          backdropFilter: "blur(12px)",
          animation: "slideUp 0.7s 0.3s ease both",
          display: 'flex',
        }}>
          <div className="input-wrapper" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <Search size={18} color="rgba(255,255,255,0.9)" style={{ marginLeft: '16px', flexShrink: 0 }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ingresa tu número de seguimiento..."
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: "white", fontFamily: "var(--font-sans)", fontSize: "0.95rem",
                padding: "16px 12px",
              }}
              onFocus={e => e.target.placeholder = ""}
              onBlur={e => e.target.placeholder = "Ingresa tu número de seguimiento..."}
            />
          </div>
          <button type="submit" style={{
            padding: "0 28px",
            background: "linear-gradient(135deg, #B11E22, #d96568)",
            color: "white", border: "none", cursor: "pointer",
            fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "0.9rem",
            display: "flex", alignItems: "center", justifyContent: 'center', gap: 8,
            transition: "all 0.2s",
          }}
            onMouseOver={e => e.currentTarget.style.opacity = 0.9}
            onMouseOut={e => e.currentTarget.style.opacity = 1}
          >
            Rastrear <ArrowRight size={16} />
          </button>
        </form>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", animation: "slideUp 0.7s 0.4s ease both" }}>
          <a href="#servicios" className="btn-primary"
            style={{ background: "linear-gradient(135deg, #B11E22, #d96568)", padding: "13px 28px" }}>
            Ver Servicios <ChevronDown size={15} />
          </a>
          <a href="#contacto" className="btn-outline" style={{ padding: "13px 28px" }}>
            Cotizar Envío
          </a>
        </div>

        {/* Mini stats */}
        <div style={{
          display: "flex", gap: 18, marginTop: 30, flexWrap: "wrap", justifyContent: "center",
          animation: "slideUp 0.7s 0.5s ease both",
        }}>
          {[
            { value: "20+", label: "Años de experiencia" },
            { value: "99%", label: "Entregas a tiempo" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: "1.65rem", fontWeight: 800, color: "white", letterSpacing: "-0.04em" }}>{s.value}</span>
              <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.88)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 3,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        animation: "pulse-glow 2s infinite",
      }}>
        <ChevronDown size={20} color={C.cyan} />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   COMPONENT: Services
───────────────────────────────────────── */
const services = [
  {
    icon: FileCheck,
    title: "Módulo de compras",
    color: "#B11E22",
    desc: "Asesoría en la compra de productos chinos, desde la selección hasta la recepción en nuestro almacén.",
    features: ["Pago a proveedores", "Búsqueda de proveedores", "Manejo de ordenes", "Verificación de proveedores"],
  },
  {
    icon: Ship,
    title: "Consolidación de Carga",
    color: "#B11E22",
    desc: "Consolida tu carga para optimizar costos. Agrupamos tu carga,  manteniendo la seguridad y tiempos de entrega. Durante un mes sin costo adicional.",
    features: ["Pick-up en China", "Almacenaje gratuito por 30 días", "Re-packing adaptado a tu carga", "Seguimiento dedicado"],
  },
  {
    icon: Ship,
    title: "Carga Marítima",
    color: "#B11E22",
    desc: "Transporte de contenedores FCL y LCL (consolidados). Salidas constantes hacia puertos venezolanos e internacionales con seguimiento completo.",
    features: ["Contenedores FCL / LCL", "Consolidados recurrentes", "Permisos de exportación"],
  },
  {
    icon: Plane,
    title: "Carga Aérea",
    color: "#B11E22",
    desc: "Transporte de carga aérea internacional. Salidas constantes hacia destinos globales con seguimiento completo.",
    features: ["Vuelos recurrentes", "Seguimiento en tiempo real", "Manejo de documentación", "Solo disponible carga comercial"],
  },
  {
    icon: FileCheck,
    title: "Gestión Aduanera",
    color: "#6f1d3a",
    desc: "Gestión integral de trámites de importación y exportación. Nuestros despachantes certificados garantizan el cumplimiento normativo.",
    features: ["Import / Export", "Permisos y licencias", "Clasificación arancelaria", "Asesoría permanente"],
  },
];

function Services() {
  const { ref, visible } = useScrollAnimation();

  return (
    <section id="servicios" style={{ padding: "56px 18px", maxWidth: 1380, margin: "0 auto" }}>
      <div ref={ref} className={`fade-up ${visible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: 30 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(177,30,34,0.1)", border: "1px solid rgba(177,30,34,0.3)",
          borderRadius: 20, padding: "5px 14px", marginBottom: 20,
        }}>
          <Boxes size={12} color={C.electric} />
          <span style={{ fontSize: "0.72rem", color: C.electric, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Nuestros Servicios
          </span>
        </div>
        <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16 }}>
          Soluciones Logísticas <span style={{ color: C.cyan }}>360°</span>
        </h2>
        <p style={{ color: C.gray, maxWidth: 540, margin: "0 auto", lineHeight: 1.65 }}>
          De la recolección al destino final, cubrimos cada eslabón de la cadena con estándares internacionales.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 24,
      }}>
        {services.map((s, i) => {
          const { ref: cRef, visible: cVis } = useScrollAnimation();
          return (
            <div key={s.title} ref={cRef}
              className={`grad-border card-hover fade-up ${cVis ? "visible" : ""} delay-${i + 1}`}
              style={{
                padding: "34px 30px",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
                textAlign: "left",
                background: "#cecece",
              }}>
              {/* Icon */}
              <div style={{
                width: 52, height: 52, borderRadius: 12, marginBottom: 20,
                background: `rgba(${s.color === "#B11E22" ? "177,30,34" : s.color === "#d96568" ? "217,101,104" : s.color === "#a11f4a" ? "201,71,74" : "140,49,52"},0.15)`,
                border: `1.5px solid ${s.color}33`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <s.icon size={24} color={s.color} />
              </div>

              <h3 style={{ fontSize: "1.22rem", fontWeight: 700, marginBottom: 12 }}>{s.title}</h3>
              <p style={{ color: C.gray, fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 22 }}>{s.desc}</p>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {s.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "0.92rem", color: C.grayLight, lineHeight: 1.45 }}>
                    <CheckCircle2 size={14} color={s.color} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Glow corner */}
              <div style={{
                position: "absolute", bottom: -30, right: -30,
                width: 100, height: 100,
                background: `radial-gradient(circle, ${s.color}15 0%, transparent 70%)`,
                borderRadius: "50%",
              }} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   COMPONENT: Trust / Why TAM
───────────────────────────────────────── */
function Trust() {
  const { ref, visible } = useScrollAnimation();
  const stats = [
    { icon: Globe, value: "10+", label: "Destinos Internacionales" },
    { icon: Package, value: "10K+", label: "Envíos Completados" },
    { icon: Clock, value: "99%", label: "Puntualidad Garantizada" },
    { icon: Star, value: "4.9", label: "Satisfacción del Cliente" },
  ];
  const reasons = [
    { icon: Shield, title: "Seguridad y Confianza", desc: "Rastreo en cada etapa del proceso logístico." },
    { icon: Zap, title: "Velocidad Operativa", desc: "Procesos optimizados para minimizar tiempos en aduanas y puertos." },
    { icon: BarChart3, title: "Visibilidad Total", desc: "Reportes y actualizaciones en tiempo real sobre el estado de tu mercancía." },
    { icon: CheckCircle2, title: "Expertos en Venezuela", desc: "Décadas de experiencia en las rutas China–Venezuela con gestión completa." },
  ];

  return (
    <section id="confianza" style={{
      position: "relative", padding: "56px 0", overflow: "hidden",
      background: "linear-gradient(180deg, transparent, rgba(177,30,34,0.04) 50%, transparent)",
    }}>
      <hr className="h-stripe" style={{ maxWidth: 800, margin: "0 auto 34px" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Stats row */}
        <div ref={ref} className={`fade-up ${visible ? "visible" : ""}`}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 34 }}>
          {stats.map((s, i) => (
            <div key={s.label} className="stat-card">
              <s.icon size={22} color={C.cyan} style={{ marginBottom: 12 }} />
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#000", letterSpacing: "-0.04em", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "0.78rem", color: "#000", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Two column: text + reasons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26, alignItems: "start" }}
          className="two-col-responsive">
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(217,101,104,0.1)", border: "1px solid rgba(217,101,104,0.25)",
              borderRadius: 20, padding: "5px 14px", marginBottom: 20,
            }}>
              <MapPin size={12} color={C.cyan} />
              <span style={{ fontSize: "0.72rem", color: C.cyan, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                ¿Por qué TAM Cargo?
              </span>
            </div>
            <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 20, lineHeight: 1.2 }}>
              La solución integral para envíos a <span style={{ color: C.cyan }}>Venezuela</span> e Internacional
            </h2>
            <p style={{ color: C.gray, lineHeight: 1.75, marginBottom: 20, fontSize: "0.93rem" }}>
              En TAM Cargo nos dedicamos al transporte marítimo y aéreo, así como a soluciones logísticas integrales: aduanas y almacenaje. Somos el puente confiable entre tus negocios y Venezuela.
            </p>
            <p style={{ color: C.gray, lineHeight: 1.75, fontSize: "0.93rem", marginBottom: 22 }}>
              Con presencia en Estados Unidos, China y Venezuela, ofrecemos cobertura completa con personal especializado en cada nodo de la cadena de suministro.
            </p>
            <a href="#contacto" className="btn-primary" style={{ background: "linear-gradient(135deg, #B11E22, #d96568)" }}>
              Hablar con un Asesor <ArrowRight size={15} />
            </a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {reasons.map((r, i) => (
              <div key={r.title} style={{
                background: "rgba(177,30,34,0.04)",
                border: "1px solid rgba(177,30,34,0.1)",
                borderRadius: 14, padding: "24px 20px",
                color: "#000",
                transition: "border-color 0.3s, background 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(217,101,104,0.3)"; e.currentTarget.style.background = "rgba(177,30,34,0.07)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(177,30,34,0.1)"; e.currentTarget.style.background = "rgba(177,30,34,0.04)"; }}
              >
                <r.icon size={20} color={C.cyan} style={{ marginBottom: 12 }} />
                <h4 style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: 8, color: "#000" }}>{r.title}</h4>
                <p style={{ fontSize: "0.78rem", color: "#000", lineHeight: 1.6 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .two-col-responsive {
          @media (max-width: 768px) {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .two-col-responsive { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────
   COMPONENT: About / Nosotros
───────────────────────────────────────── */
function About() {
  const { ref, visible } = useScrollAnimation();
  return (
    <section
      id="nosotros"
      style={{
        padding: "46px 0",
        backgroundImage:
          "linear-gradient(rgba(18,10,11,0.82), rgba(18,10,11,0.82)), url('https://www.publicdomainpictures.net/pictures/500000/velka/containerschip-vrachtschip-boot-1679508667oFJ.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        border: "1px solid rgba(217,101,104,0.2)",
      }}
    >
      <div
        ref={ref}
        className={`fade-up ${visible ? "visible" : ""}`}
        style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", padding: "0 24px" }}
      >
        <h2
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: 20,
            color: "#fff",
          }}
        >
          Nuestra <span style={{ color: "#f19496" }}>Misión</span>
        </h2>
        <p style={{
          fontSize: "1.05rem", lineHeight: 1.8, color: "rgba(255,255,255,0.92)",
          maxWidth: 680, margin: "0 auto 22px",
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(217,101,104,0.28)",
          borderRadius: 16, padding: "20px 18px",
        }}>
          "Brindar soluciones logísticas integrales de transporte marítimo y aéreo con los más altos estándares de calidad, seguridad y puntualidad, conectando a nuestros clientes con el mundo y facilitando el comercio internacional hacia Venezuela y destinos globales."
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          {[
            { label: "Misión", desc: "Logística confiable y puntual" },
            { label: "Visión", desc: "Líder regional en carga internacional." },
            { label: "Valores", desc: "Transparencia · Compromiso · Excelencia" },
          ].map(v => (
            <div key={v.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.7rem", color: "#f19496", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{v.label}</div>
              <div style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.9)" }}>{v.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   COMPONENT: Contact / CTA Band
───────────────────────────────────────── */
function Contact() {
  const { ref, visible } = useScrollAnimation();
  return (
    <section
      id="contacto"
      style={{
        padding: "42px 18px",
        background: "#fff",
      }}
    >
      <div ref={ref} className={`fade-up ${visible ? "visible" : ""} contact-band`} style={{
        maxWidth: 1200, margin: "0 auto",
        background: "linear-gradient(145deg, #1a0f11 0%, #241416 60%, #2a171a 100%)",
        border: "1px solid rgba(217,101,104,0.35)",
        borderRadius: 24, padding: "36px 24px",
      }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12, color: "#fff" }}>
            ¿Listo para enviar tu carga?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.65, maxWidth: 480, margin: "0 auto 24px" }}>
            Contáctanos hoy y recibe una cotización personalizada en menos de 24 horas. Nuestro equipo de expertos está listo para asesorarte.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <a href="tel:+584123580995" style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.92)", textDecoration: "none", fontSize: "0.88rem" }}>
              <Phone size={15} color={C.cyan} /> +58 (412) 358-0995
            </a>
            <a href="mailto:info@tam-cargo.com" style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.92)", textDecoration: "none", fontSize: "0.88rem" }}>
              <Mail size={15} color={C.cyan} /> info@tam-cargo.com
            </a>
          </div>
        </div>
        <div className="contact-actions">
          <a href="https://wa.me/+584123580995" className="btn-primary"
            style={{ background: "linear-gradient(135deg, #25d366, #128c7e)", padding: "13px 28px" }}>
            <MessageCircle size={16} /> WhatsApp
          </a>
          <a href="mailto:info@tam-cargo.com" className="btn-outline" style={{ padding: "13px 28px" }}>
            Enviar Email
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   COMPONENT: Footer
───────────────────────────────────────── */
function Footer({ onOpenPrivacy, onOpenTerms }) {
  const footerLinks = {
    "Servicios": ["Carga Marítima", "Carga Aérea", "Transporte Terrestre", "Gestión Aduanera", "Almacenaje"],
    "Legal": ["Términos de Servicio", "Política de Privacidad"],
  };
  const footerAddresses = [
    { title: "España", detail: "Calle Mario Roso De Luna 29. Nave 1 Posterior. San Blas Canillejas. 28022" },
    { title: "Estados Unidos", detail: "8000 NW 29th St, Doral, FL 33122/33198" },
    { title: "Venezuela", detail: "Caracas" },
    { title: "China", detail: "Room 101, Building 1, Factory Area, No. 31 Fulin Road, Fuzhushan, Liaobu Town, Dongguan City, Guangdong Province" },

  ];

  return (
    <footer style={{
      background: C.navyMid,
      borderTop: "1px solid rgba(177,30,34,0.15)",
      padding: "34px 18px 14px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="footer-grid" style={{ marginBottom: 22 }}>
          {/* Brand col */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: "linear-gradient(135deg, #B11E22, #d96568)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Ship size={18} color="white" />
              </div>
              <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>TAM<span style={{ color: C.cyan }}>Cargo</span></span>
            </div>
            <p style={{ color: C.gray, fontSize: "0.85rem", lineHeight: 1.7, marginBottom: 20, maxWidth: 260 }}>
              Transporte marítimo, aéreo y soluciones logísticas integrales. Tu socio confiable en comercio internacional.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {[Instagram].map((Icon, i) => (
                <a key={i} href="https://www.instagram.com/tamcargoglobal/" target="_blank" rel="noreferrer" style={{
                  width: 34, height: 34,
                  background: "rgba(177,30,34,0.08)",
                  border: "1px solid rgba(177,30,34,0.16)",
                  borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                  color: C.gray, textDecoration: "none",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.cyan; e.currentTarget.style.color = C.cyan; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(177,30,34,0.16)"; e.currentTarget.style.color = C.gray; }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.white, marginBottom: 16 }}>{title}</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map(l => (
                  <li key={l}>
                    <a
                      href="#"
                      style={{ color: C.gray, textDecoration: "none", fontSize: "0.85rem", transition: "color 0.2s" }}
                      onClick={e => {
                        if (l === "Términos de Servicio") {
                          e.preventDefault();
                          onOpenTerms();
                        }
                        if (l === "Política de Privacidad") {
                          e.preventDefault();
                          onOpenPrivacy();
                        }
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = C.cyanLight}
                      onMouseLeave={e => e.currentTarget.style.color = C.gray}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div style={{ textAlign: "left" }}>
            <h4 style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.white, marginBottom: 16 }}>
              Direcciones
            </h4>
            <ul className="footer-address-grid">
              {footerAddresses.map(item => (
                <li key={item.title} style={{ display: "flex", alignItems: "flex-start", gap: 8, textAlign: "left" }}>
                  <MapPin size={14} color={C.cyan} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div style={{ lineHeight: 1.55 }}>
                    <div style={{ color: C.grayLight, fontSize: "0.86rem", fontWeight: 600 }}>{item.title}</div>
                    <div style={{ color: C.gray, fontSize: "0.82rem", marginTop: 2, overflowWrap: "anywhere" }}>{item.detail}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid rgba(177,30,34,0.1)", marginBottom: 24 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ color: C.gray, fontSize: "0.8rem" }}>© 2026 TAM Cargo Logistics. Todos los derechos reservados.</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div 
              onClick={() => window.location.href='/login'} 
              style={{ cursor: 'default', display: 'flex', alignItems: 'center' }}
            >
              <Wind size={12} color={C.electric} />
            </div>
            <span style={{ color: C.gray, fontSize: "0.78rem", fontFamily: "var(--font-mono)" }}>
              Desarrollado por KostkoDeveloper
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────
   LANDING PAGE COMPONENT
───────────────────────────────────────── */
function LandingPage() {
  const [showModal, setShowModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showFreightModal, setShowFreightModal] = useState(false);
  const [initialTrackingId, setInitialTrackingId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('t');
    if (t) {
      handleOpenTracking(t);
    }
  }, []);

  const handleOpenTracking = (id = "") => {
    setInitialTrackingId(typeof id === 'string' ? id : "");
    setShowModal(true);
  };

  return (
    <>
      <style>{globalStyles}</style>

      <Navbar onTrack={() => handleOpenTracking()} onFreight={() => setShowFreightModal(true)} />

      <main>
        <Hero onTrack={(id) => handleOpenTracking(id)} />
        <Services />
        <Trust />
        <About />
        <Contact />
      </main>

      <Footer
        onOpenPrivacy={() => setShowPrivacyModal(true)}
        onOpenTerms={() => setShowTermsModal(true)}
      />

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/+584123580995?text=Hola%2C%20me%20interesa%20cotizar%20un%20env%C3%ADo%20con%20TAM%20Cargo"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-fab pulse-glow"
        title="Escríbenos por WhatsApp"
      >
        <MessageCircle size={24} color="white" />
      </a>

      {/* Tracking modal */}
      {showModal && <TrackingModal onClose={() => setShowModal(false)} initialId={initialTrackingId} />}
      {showPrivacyModal && <PrivacyPolicyModal onClose={() => setShowPrivacyModal(false)} />}
      {showTermsModal && <TermsOfServiceModal onClose={() => setShowTermsModal(false)} />}
      {showFreightModal && <FreightCalculatorModal onClose={() => setShowFreightModal(false)} />}
    </>
  );
}

/* ─────────────────────────────────────────
   MAIN ROUTER
───────────────────────────────────────── */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/login" element={<AdminLogin />} />
    </Routes>
  );
}


