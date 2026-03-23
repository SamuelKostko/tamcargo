/**
 * TAM Cargo — Landing Page
 * Stack: React + Tailwind (via CDN config) + Lucide-React + Framer-Motion-like CSS
 * Architecture mirrors: /src/components/{Navbar, Hero, Tracking, Services, Trust, Footer}
 */

import { useState, useEffect, useRef } from "react";
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

/* ─────────────────────────────────────────
   DESIGN TOKENS  (mirrors tailwind.config)
───────────────────────────────────────── */
const C = {
  navy:    "#fff7f7",
  navyMid: "#fff1f1",
  navyLight:"#ffe4e4",
  electric:"#B11E22",
  electricLight:"#c9474a",
  cyan:    "#d96568",
  cyanLight:"#e78f91",
  white:   "#241415",
  gray:    "#7a5e60",
  grayLight:"#4f383a",
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
    background: rgba(177,30,34,0.14);
    backdrop-filter: blur(8px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    animation: fadeIn 0.25s ease;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(217,101,104,0.3); }
    50% { box-shadow: 0 0 0 12px rgba(217,101,104,0); }
  }

  .modal-card { animation: slideUp 0.35s ease; }
  .pulse-glow { animation: pulse-glow 2.5s infinite; }

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
    top: 0; right: 0;
    width: 280px; height: 100vh;
    background: var(--navy-mid);
    border-left: 1px solid rgba(177,30,34,0.2);
    z-index: 9000;
    transform: translateX(100%);
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

  /* Responsive utils */
  @media (max-width: 768px) {
    .hide-mobile { display: none !important; }
    .show-mobile { display: flex !important; }
  }
  @media (min-width: 769px) {
    .show-mobile { display: none !important; }
  }
`;

/* ─────────────────────────────────────────
   COMPONENT: Navbar
───────────────────────────────────────── */
function Navbar({ onTrack }) {
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
            style={{ padding: "8px 18px", fontSize: "0.82rem",
              background: "linear-gradient(135deg, #B11E22, #d96568)" }}
          >
            <Search size={14} /> Rastrear Carga
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
            style={{ color: C.grayLight, textDecoration: "none", fontSize: "1rem", fontWeight: 500,
              padding: "12px 0", borderBottom: "1px solid rgba(177,30,34,0.08)",
              display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {l.label} <ChevronRight size={16} color={C.cyan} />
          </a>
        ))}
        <button className="btn-primary" onClick={() => { onTrack(); setMenuOpen(false); }}
          style={{ marginTop: 24, justifyContent: "center", background: "linear-gradient(135deg, #B11E22, #d96568)" }}>
          <Search size={15} /> Rastrear Carga
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
function TrackingModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card grad-border" onClick={e => e.stopPropagation()}
        style={{ maxWidth: 480, width: "100%", padding: "48px 40px", textAlign: "center", position: "relative" }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16, background: "none", border: "none",
          color: C.gray, cursor: "pointer"
        }}><X size={18} /></button>

        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: "linear-gradient(135deg, rgba(177,30,34,0.2), rgba(217,101,104,0.2))",
          border: "1.5px solid rgba(217,101,104,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
        }}>
          <Package size={28} color={C.cyan} />
        </div>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(217,101,104,0.1)", border: "1px solid rgba(217,101,104,0.25)",
          borderRadius: 20, padding: "4px 14px", marginBottom: 20,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.cyan, display: "block" }} />
          <span style={{ fontSize: "0.72rem", color: C.cyan, fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            En desarrollo
          </span>
        </div>

        <h3 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: 12, lineHeight: 1.3 }}>
          Módulo de Tracking <br />en Actualización
        </h3>
        <p style={{ color: C.gray, fontSize: "0.9rem", lineHeight: 1.65, marginBottom: 28 }}>
          Muy pronto podrás rastrear tus contenedores y envíos en <strong style={{ color: C.cyanLight }}>tiempo real</strong>. 
          Estamos construyendo una plataforma de seguimiento de última generación para darte visibilidad total de tu carga.
        </p>
        <p style={{ color: C.grayLight, fontSize: "0.82rem", marginBottom: 28 }}>
          Mientras tanto, contacta a nuestro equipo para obtener actualizaciones de tu envío.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://wa.me/+584123580995" className="btn-primary"
            style={{ background: "linear-gradient(135deg, #25d366, #128c7e)", fontSize: "0.85rem", padding: "10px 20px" }}>
            <MessageCircle size={15} /> WhatsApp
          </a>
          <button onClick={onClose} className="btn-outline" style={{ fontSize: "0.85rem", padding: "10px 20px" }}>
            Cerrar
          </button>
        </div>
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
    onTrack();
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
        padding: "120px 24px 80px",
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
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(177,30,34,0.15)", border: "1px solid rgba(217,101,104,0.3)",
          borderRadius: 24, padding: "6px 16px", marginBottom: 28,
          animation: "slideUp 0.7s ease both",
        }}>
          <Globe size={13} color={C.cyan} />
          <span style={{ fontSize: "0.75rem", color: C.cyan, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
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
          Soluciones integrales de transporte <strong style={{ color: "white" }}>Marítimo, Aéreo y Terrestre</strong> con gestión aduanera incluida. Especialistas en envíos a Venezuela e Internacional.
        </p>

        {/* Tracking search bar */}
        <form onSubmit={handleSearch} style={{
          display: "flex", alignItems: "stretch", gap: 0,
          maxWidth: 560,
          width: "100%",
          background: "rgba(177,30,34,0.1)",
          border: "1.5px solid rgba(217,101,104,0.3)",
          borderRadius: 12,
          overflow: "hidden",
          margin: "0 auto 40px",
          backdropFilter: "blur(8px)",
          animation: "slideUp 0.7s 0.3s ease both",
        }}>
          <Search size={18} color="rgba(255,255,255,0.9)" style={{ margin: "auto 16px", flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ingresa tu número de seguimiento..."
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "white", fontFamily: "var(--font-sans)", fontSize: "0.9rem",
              padding: "14px 8px",
            }}
            onFocus={e => e.target.placeholder = ""}
            onBlur={e => e.target.placeholder = "Ingresa tu número de seguimiento..."}
          />
          <button type="submit" style={{
            padding: "0 24px",
            background: "linear-gradient(135deg, #B11E22, #d96568)",
            color: "white", border: "none", cursor: "pointer",
            fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.88rem",
            display: "flex", alignItems: "center", gap: 6,
            transition: "opacity 0.2s",
          }}>
            Rastrear <ArrowRight size={14} />
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
          display: "flex", gap: 32, marginTop: 56, flexWrap: "wrap", justifyContent: "center",
          animation: "slideUp 0.7s 0.5s ease both",
        }}>
          {[
            { value: "15+", label: "Años de experiencia" },
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
    features: ["Pago a proveedores", "Búsqueda de proveedores", "Manejo de ordenes","Verificación de proveedores"],
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
    features: ["Vuelos recurrentes", "Seguimiento en tiempo real", "Manejo de documentación","Solo disponible carga comercial"],
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
    <section id="servicios" style={{ padding: "100px 24px", maxWidth: 1380, margin: "0 auto" }}>
      <div ref={ref} className={`fade-up ${visible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: 64 }}>
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
      position: "relative", padding: "100px 0", overflow: "hidden",
      background: "linear-gradient(180deg, transparent, rgba(177,30,34,0.04) 50%, transparent)",
    }}>
      <hr className="h-stripe" style={{ maxWidth: 800, margin: "0 auto 80px" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Stats row */}
        <div ref={ref} className={`fade-up ${visible ? "visible" : ""}`}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 80 }}>
          {stats.map((s, i) => (
            <div key={s.label} className="stat-card">
              <s.icon size={22} color={C.cyan} style={{ marginBottom: 12 }} />
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#000", letterSpacing: "-0.04em", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "0.78rem", color: "#000", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Two column: text + reasons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}
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
            <p style={{ color: C.gray, lineHeight: 1.75, fontSize: "0.93rem", marginBottom: 32 }}>
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
        padding: "80px 0",
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
          maxWidth: 680, margin: "0 auto 32px",
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(217,101,104,0.28)",
          borderRadius: 16, padding: "32px 40px",
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
        padding: "80px 24px",
        background: "#fff",
      }}
    >
      <div ref={ref} className={`fade-up ${visible ? "visible" : ""}`} style={{
        maxWidth: 1200, margin: "0 auto",
        background: "linear-gradient(145deg, #1a0f11 0%, #241416 60%, #2a171a 100%)",
        border: "1px solid rgba(217,101,104,0.35)",
        borderRadius: 24, padding: "64px 48px",
        display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center",
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
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
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

  return (
    <footer style={{
      background: C.navyMid,
      borderTop: "1px solid rgba(177,30,34,0.15)",
      padding: "64px 24px 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 40, marginBottom: 48,
        }}>
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
              {[ Instagram].map((Icon, i) => (
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
        </div>

        <hr style={{ border: "none", borderTop: "1px solid rgba(177,30,34,0.1)", marginBottom: 24 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ color: C.gray, fontSize: "0.8rem" }}>© 2026 TAM Cargo Logistics. Todos los derechos reservados.</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Wind size={12} color={C.electric} />
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
   ROOT APP
───────────────────────────────────────── */
export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <>
      <style>{globalStyles}</style>

      <Navbar onTrack={() => setShowModal(true)} />

      <main>
        <Hero onTrack={() => setShowModal(true)} />
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
      {showModal && <TrackingModal onClose={() => setShowModal(false)} />}
      {showPrivacyModal && <PrivacyPolicyModal onClose={() => setShowPrivacyModal(false)} />}
      {showTermsModal && <TermsOfServiceModal onClose={() => setShowTermsModal(false)} />}
    </>
  );
}


