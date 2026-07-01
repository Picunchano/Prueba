import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PricingCards from '../components/PricingCards.jsx';

const homeStyles = `
.home-root {
  background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 50%, #fdf2f8 100%);
  min-height: 100vh;
}

.hero-section {
  position: relative;
  overflow: hidden;
  padding: 80px 40px 60px;
}
.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 48px;
}
.hero-col-left {
  flex: 0 0 55%;
}
.hero-col-right {
  flex: 0 0 45%;
}
.hero-title {
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 18px;
  color: #0f172a;
  line-height: 1.15;
  animation: fadeInUp 0.8s ease-out;
}
.hero-title-gradient {
  background: linear-gradient(135deg, #6366f1, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-subtitle {
  font-size: 1.2rem;
  color: #475569;
  margin-bottom: 32px;
  max-width: 520px;
  animation: fadeInUp 0.8s ease-out 0.15s both;
}
.hero-btns {
  display: flex;
  gap: 16px;
  animation: fadeInUp 0.8s ease-out 0.3s both;
}
.hero-btn {
  display: inline-block;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  background-size: 200% 200%;
  color: #fff;
  border: none;
  padding: 15px 32px;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background-position 0.4s ease;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
}
.hero-btn:hover {
  transform: translateY(-3px);
  background-position: 100% 50%;
  box-shadow: 0 12px 32px rgba(236, 72, 153, 0.4);
}
.hero-btn-outline {
  display: inline-block;
  background: #fff;
  color: #6366f1;
  border: 2px solid #6366f1;
  padding: 13px 30px;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.3s ease;
}
.hero-btn-outline:hover {
  transform: translateY(-3px);
  background: #6366f1;
  color: #fff;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
}
.hero-img {
  width: 100%;
  height: 420px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  animation: fadeInUp 0.8s ease-out 0.3s both;
}

.stats-section {
  padding: 60px 40px;
  max-width: 1200px;
  margin: 0 auto;
}
.stats-row {
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
}
.stat-item {
  text-align: center;
  animation: fadeInUp 0.6s ease-out both;
  flex: 1;
  min-width: 200px;
}
.stat-item:nth-child(1) { animation-delay: 0.1s; }
.stat-item:nth-child(2) { animation-delay: 0.2s; }
.stat-item:nth-child(3) { animation-delay: 0.3s; }
.stat-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 36px 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 36px rgba(99,102,241,0.12);
}
.stat-number {
  font-size: 2.6rem;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: countUp 0.6s ease-out both;
  line-height: 1;
}
.stat-label {
  font-size: 0.95rem;
  color: #475569;
  margin-top: 10px;
}

.verify-section {
  padding: 60px 40px 80px;
  max-width: 1200px;
  margin: 0 auto;
}
.verify-content {
  display: flex;
  align-items: center;
  gap: 48px;
}
.verify-col-left {
  flex: 0 0 45%;
}
.verify-col-right {
  flex: 1;
}
.verify-img {
  width: 100%;
  height: 380px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.1);
  animation: fadeInUp 0.6s ease-out;
}
.verify-title {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 16px;
  line-height: 1.2;
}
.verify-text {
  font-size: 1.05rem;
  color: #475569;
  margin-bottom: 24px;
  line-height: 1.6;
}
.verify-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.verify-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  color: #1e293b;
  font-weight: 500;
}
.verify-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #dcfce7;
  color: #16a34a;
  font-weight: 800;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.features-section {
  padding: 60px 40px 80px;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}
.features-grid {
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
}
.feature-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 36px 28px;
  width: 280px;
  max-width: 100%;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeInUp 0.6s ease-out both;
  text-align: center;
}
.feature-card:nth-child(1) { animation-delay: 0.1s; }
.feature-card:nth-child(2) { animation-delay: 0.2s; }
.feature-card:nth-child(3) { animation-delay: 0.3s; }
.feature-card:nth-child(4) { animation-delay: 0.4s; }
.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 16px 48px rgba(99,102,241,0.12);
}
.feature-icon {
  font-size: 3rem;
  margin-bottom: 18px;
  display: inline-block;
}
.feature-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #0f172a;
}
.feature-desc {
  color: #475569;
  font-size: 0.95rem;
}
.section-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 40px;
  color: #0f172a;
  text-align: center;
  animation: fadeInUp 0.6s ease-out;
}

@media (max-width: 768px) {
  .hero-section { padding: 40px 1rem 32px; }
  .hero-content { flex-direction: column; gap: 0; }
  .hero-col-left { flex: none; width: 100%; }
  .hero-col-right { display: none; }
  .hero-title { font-size: 1.8rem; }
  .hero-subtitle { font-size: 1rem; margin-bottom: 24px; }
  .hero-btns { flex-direction: column; gap: 12px; }
  .hero-btn, .hero-btn-outline { width: 100%; text-align: center; }
  .stats-section { padding: 40px 1rem; }
  .stats-row { flex-direction: column; align-items: center; gap: 20px; }
  .stat-card { width: 100%; max-width: 320px; padding: 24px 20px; }
  .stat-number { font-size: 2rem; }
  .verify-section { padding: 40px 1rem 60px; }
  .verify-content { flex-direction: column; gap: 24px; }
  .verify-col-left, .verify-col-right { flex: none; width: 100%; }
  .verify-img { height: 260px; }
  .verify-title { font-size: 1.5rem; }
  .features-section { padding: 40px 1rem 60px; }
  .features-grid { flex-direction: column; align-items: center; gap: 20px; }
  .feature-card { width: 100%; max-width: 320px; padding: 24px 20px; }
  .section-title { font-size: 1.5rem; margin-bottom: 24px; }
}

@media (max-width: 480px) {
  .hero-title { font-size: 1.5rem; }
  .hero-subtitle { font-size: 0.9rem; }
  .stat-number { font-size: 1.7rem; }
  .verify-title { font-size: 1.3rem; }
  .feature-icon { font-size: 2.2rem; }
  .section-title { font-size: 1.3rem; }
}
`;

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

function useCounter(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

export default function Home() {
  const workers = useCounter(260000, 2000);
  const noContract = useCounter(48, 1500);
  const verified = useCounter(100, 1500);

  return (
    <>
      <style>{homeStyles}</style>
      <div className="home-root">
        {/* Hero con dos columnas */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-col-left">
              <h1 className="hero-title">
                Conectamos hogares con <span className="hero-title-gradient">trabajadoras de confianza</span>
              </h1>
              <p className="hero-subtitle">
                La plataforma que busca el equilibrio entre hogares y personas que necesitan empleo digno
              </p>
              <div className="hero-btns">
                <Link to="/jobs" className="hero-btn">Ver trabajos disponibles</Link>
                <Link to="/register" className="hero-btn-outline">Crear cuenta</Link>
              </div>
            </div>
            <div className="hero-col-right">
              <img className="hero-img" src="/pictures/familia.jpg" alt="Familia empleadora" />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="stats-section">
          <div className="stats-row">
            <div className="stat-item" ref={workers.ref}>
              <div className="stat-card">
                <div className="stat-number">{workers.count.toLocaleString('es-CL')}</div>
                <div className="stat-label">Trabajadoras registradas</div>
              </div>
            </div>
            <div className="stat-item" ref={noContract.ref}>
              <div className="stat-card">
                <div className="stat-number">{noContract.count}%</div>
                <div className="stat-label">Sin contrato formal</div>
              </div>
            </div>
            <div className="stat-item" ref={verified.ref}>
              <div className="stat-card">
                <div className="stat-number">{verified.count}%</div>
                <div className="stat-label">Trabajadoras verificadas</div>
              </div>
            </div>
          </div>
        </section>

        {/* Trabajadoras verificadas */}
        <section className="verify-section">
          <div className="verify-content">
            <div className="verify-col-left">
              <img className="verify-img" src="/pictures/nana.jpg" alt="Trabajadora verificada" />
            </div>
            <div className="verify-col-right">
              <h2 className="verify-title">Trabajadoras verificadas y de confianza</h2>
              <p className="verify-text">
                En NanaConecta nos preocupamos por la seguridad de tu hogar. Cada trabajadora pasa por un proceso de verificación riguroso.
              </p>
              <div className="verify-list">
                <div className="verify-item">
                  <span className="verify-check">✓</span>
                  <span>Identidad verificada</span>
                </div>
                <div className="verify-item">
                  <span className="verify-check">✓</span>
                  <span>Referencias comprobadas</span>
                </div>
                <div className="verify-item">
                  <span className="verify-check">✓</span>
                  <span>Contratos según Ley 20.786</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="features-section">
          <h2 className="section-title">¿Por qué NanaConecta?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <div className="feature-title">Búsqueda Fácil</div>
              <div className="feature-desc">Encuentra trabajadoras por ubicación, habilidades y tarifa horaria</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <div className="feature-title">100% Verificadas</div>
              <div className="feature-desc">Todas las trabajadoras pasan por un proceso de verificación</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <div className="feature-title">Contratos Seguros</div>
              <div className="feature-desc">Formaliza acuerdos con contratos claros para ambas partes</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <div className="feature-title">Reseñas Confiables</div>
              <div className="feature-desc">Sistema de calificaciones y reseñas de trabajos anteriores</div>
            </div>
          </div>
        </section>

        {/* Sección de planes y precios */}
        <section id="pricing" className="features-section" style={{ scrollMarginTop: '80px' }}>
          <h2 className="section-title">Planes y Precios</h2>
          <p className="page-subtitle" style={{ textAlign: 'center', color: '#64748b', fontSize: '1.05rem', marginBottom: 40 }}>
            Comienza gratis, escala cuando lo necesites
          </p>
          <PricingCards />
        </section>
      </div>
    </>
  );
}