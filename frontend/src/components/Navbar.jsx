import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navStyle = `
.nav-link {
  position: relative;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 6px 0;
  transition: color 0.3s ease;
  white-space: nowrap;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #6366f1, #ec4899);
  border-radius: 2px;
  transition: width 0.3s ease;
}
.nav-link:hover { color: #6366f1; }
.nav-link:hover::after { width: 100%; }
.brand-link {
  font-size: 1.5rem;
  font-weight: 800;
  text-decoration: none;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease infinite;
  letter-spacing: -0.5px;
}
.nav-register-btn {
  display: inline-block;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  background-size: 200% 200%;
  color: #fff;
  text-decoration: none;
  padding: 8px 18px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-position 0.4s ease;
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
}
.nav-register-btn:hover {
  transform: translateY(-2px);
  background-position: 100% 50%;
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.45);
}
.logout-btn {
  background: rgba(239, 68, 68, 0.12);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 7px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  white-space: nowrap;
}
.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);
}
.nav-user-name {
  background: linear-gradient(135deg, #6366f1, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 0.9rem;
  white-space: nowrap;
}
`;

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 28px',
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    color: '#f1f5f9',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid rgba(99, 102, 241, 0.3)',
    transition: 'background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
  },
  navScrolled: {
    background: 'rgba(15, 23, 42, 0.92)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
    borderBottom: '1px solid rgba(99, 102, 241, 0.5)',
  },
  links: {
    display: 'flex',
    gap: '22px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  user: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{navStyle}</style>
      <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
        <Link to="/" className="brand-link">NanaConecta</Link>
        <div style={styles.links}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/jobs" className="nav-link">Trabajos</Link>
          <Link to="/workers" className="nav-link">Trabajadoras</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/messages" className="nav-link">Mensajes</Link>
              <Link to="/profile" className="nav-link">Mi Perfil</Link>
              <div style={styles.user}>
                <span className="nav-user-name">{user.name}</span>
                <button onClick={logout} className="logout-btn">Cerrar sesión</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Iniciar sesión</Link>
              <Link to="/register" className="nav-register-btn">Registrarse</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}