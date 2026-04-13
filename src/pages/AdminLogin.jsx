import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, ShieldCheck, Globe, Zap } from 'lucide-react';
import Logo from '../assets/TAM CARGO.png';

const C = {
  electric: "#B11E22",
  electricGrad: "linear-gradient(135deg, #B11E22 0%, #D32F2F 100%)",
  dark: "#0f172a",
  text: "#1e293b",
  textMuted: "#64748b",
  border: "#e2e8f0",
  glass: "rgba(255, 255, 255, 0.9)"
};

const fontStyles = {
  fontFamily: "'Plus Jakarta Sans', sans-serif"
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ user: '', pass: '' });
  const [error, setError] = useState('');
  const [isFocus, setIsFocus] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.user === 'admin' && credentials.pass === 'tamcargo2026') {
      localStorage.setItem('isAuth', 'true');
      navigate('/admin');
    } else {
      setError('Credenciales de acceso no válidas');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `radial-gradient(circle at top right, #1e293b 0%, #0f172a 100%)`,
      padding: '20px', ...fontStyles, position: 'relative', overflow: 'hidden'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Decorative background elements */}
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: `${C.electric}15`, borderRadius: '50%', filter: 'blur(100px)' }} />
      <div style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '500px', height: '500px', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '50%', filter: 'blur(120px)' }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10 }}>

        {/* Logo Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src={Logo} alt="TAM Cargo" style={{ height: '50px', objectFit: 'contain', marginBottom: '12px' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 700 }}>
            ADMIN PANEL
          </div>
        </div>

        {/* Login Card */}
        <div style={{
          background: C.glass, padding: '48px 40px', borderRadius: '32px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: C.dark, letterSpacing: '-0.5px' }}>Bienvenido</h1>
            <p style={{ color: C.textMuted, fontSize: '0.95rem', marginTop: '8px' }}>Ingrese sus credenciales de administrador.</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ position: 'relative' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: C.dark, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Usuario</label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', border: `2px solid ${isFocus === 'user' ? C.electric : '#f1f5f9'}`,
                borderRadius: '16px', padding: '4px 16px', transition: 'all 0.2s'
              }}>
                <User size={18} color={isFocus === 'user' ? C.electric : C.textMuted} />
                <input
                  type="text"
                  placeholder="admin"
                  onFocus={() => setIsFocus('user')}
                  onBlur={() => setIsFocus(null)}
                  value={credentials.user}
                  onChange={e => setCredentials({ ...credentials, user: e.target.value })}
                  style={{ flex: 1, padding: '12px 0', background: 'transparent', border: 'none', fontSize: '1rem', outline: 'none', color: C.dark, fontWeight: 500 }}
                />
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: C.dark, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Contraseña</label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', border: `2px solid ${isFocus === 'pass' ? C.electric : '#f1f5f9'}`,
                borderRadius: '16px', padding: '4px 16px', transition: 'all 0.2s'
              }}>
                <Lock size={18} color={isFocus === 'pass' ? C.electric : C.textMuted} />
                <input
                  type="password"
                  placeholder="••••••••"
                  onFocus={() => setIsFocus('pass')}
                  onBlur={() => setIsFocus(null)}
                  value={credentials.pass}
                  onChange={e => setCredentials({ ...credentials, pass: e.target.value })}
                  style={{ flex: 1, padding: '12px 0', background: 'transparent', border: 'none', fontSize: '1rem', outline: 'none', color: C.dark, fontWeight: 500 }}
                />
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: C.electric, fontSize: '0.85rem', fontWeight: 600 }}>
                <Zap size={14} /> {error}
              </div>
            )}

            <button type="submit" style={{
              background: C.electricGrad, color: '#fff', border: 'none', borderRadius: '16px', padding: '16px',
              fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '12px', cursor: 'pointer', marginTop: '8px', boxShadow: `0 10px 20px rgba(177,30,34,0.3)`,
              transition: 'all 0.2s'
            }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              INGRESAR AL PANEL <ArrowRight size={20} />
            </button>
          </form>

        </div>

        <button
          onClick={() => navigate('/')}
          style={{ width: '100%', marginTop: '32px', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          Volver a la página principal
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
