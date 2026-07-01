import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navStyle = `
.nav-link {
  position: relative;
  color: #1e293b;
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
  color: #dc2626;
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
  background: rgba(239, 68, 68, 0.15);
  color: #b91c1c;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}
.nav-user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid #f1f5f9;
  cursor: pointer;
  transition: border-color 0.2s ease;
}
.nav-user-avatar:hover { border-color: #6366f1; }
.nav-user-initials {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: #fff;
  font-weight: 700;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  text-decoration: none;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.nav-user-initials:hover { transform: scale(1.08); }
.mobile-menu .nav-user-initials {
  width: 40px;
  height: 40px;
  font-size: 0.95rem;
}
.mobile-menu .nav-user-avatar {
  width: 40px;
  height: 40px;
}
.hamburger-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s ease;
  min-height: 44px;
  min-width: 44px;
}
.hamburger-btn:hover { background: rgba(99, 102, 241, 0.1); }
.hamburger-line {
  width: 26px;
  height: 3px;
  background: #1e293b;
  border-radius: 2px;
  transition: all 0.3s ease;
}
.hamburger-btn.active .hamburger-line:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}
.hamburger-btn.active .hamburger-line:nth-child(2) {
  opacity: 0;
}
.hamburger-btn.active .hamburger-line:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}
.mobile-menu {
  display: none;
  flex-direction: column;
  gap: 0;
  padding: 8px 16px 16px;
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  animation: slideDown 0.25s ease-out;
}
.mobile-menu.open {
  display: flex;
}
.mobile-menu .nav-link {
  display: flex;
  align-items: center;
  padding: 14px 8px;
  font-size: 1rem;
  color: #1e293b;
  border-bottom: 1px solid #f1f5f9;
  min-height: 48px;
}
.mobile-menu .nav-register-btn {
  margin-top: 14px;
  text-align: center;
  padding: 13px 18px;
}
.mobile-menu .logout-btn {
  margin-top: 8px;
  padding: 13px 14px;
}

@media (max-width: 768px) {
  .desktop-links {
    display: none !important;
  }
  .hamburger-btn {
    display: flex;
  }
}
`;

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 28px',
    background: '#ffffff',
    color: '#1e293b',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid #f1f5f9',
    boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
    transition: 'box-shadow 0.3s ease',
  },
  navScrolled: {
    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
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
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <style>{navStyle}</style>
      <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
        <Link to="/" className="brand-link">NanaConecta</Link>

        <div className="desktop-links" style={styles.links}>
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/jobs" className="nav-link">Trabajos</Link>
          <Link to="/workers" className="nav-link">Trabajadoras</Link>
          <Link to="/pricing" className="nav-link">Planes</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/messages" className="nav-link">Mensajes</Link>
              <Link to="/profile" className="nav-link">Mi Perfil</Link>
              <div style={styles.user}>
                {user.avatarUrl ? (
                  <Link to="/profile"><img className="nav-user-avatar" src={user.avatarUrl} alt={user.name} /></Link>
                ) : (
                  <Link to="/profile" className="nav-user-initials">{user.name?.charAt(0).toUpperCase()}</Link>
                )}
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

        <button
          className={`hamburger-btn${menuOpen ? ' active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <Link to="/" className="nav-link">Inicio</Link>
        <Link to="/jobs" className="nav-link">Trabajos</Link>
        <Link to="/workers" className="nav-link">Trabajadoras</Link>
        <Link to="/pricing" className="nav-link">Planes</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/messages" className="nav-link">Mensajes</Link>
            <Link to="/profile" className="nav-link">Mi Perfil</Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 8px' }}>
              {user.avatarUrl ? (
                <img className="nav-user-avatar" src={user.avatarUrl} alt={user.name} />
              ) : (
                <span className="nav-user-initials">{user.name?.charAt(0).toUpperCase()}</span>
              )}
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
    </>
  );
}