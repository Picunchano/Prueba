import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const homeStyles = `
.hero-section {
  position: relative;
  overflow: hidden;
  color: #f1f5f9;
  text-align: center;
  padding: 120px 20px 110px;
  background: #0f172a;
}
.hero-bg-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.hero-content {
  position: relative;
  z-index: 1;
  max-width: 820px;
  margin: 0 auto;
}
.hero-title {
  font-size: 3.4rem;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 18px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeInUp 0.8s ease-out, gradientShift 6s ease infinite;
  line-height: 1.1;
}
.hero-subtitle {
  font-size: 1.25rem;
  color: #94a3b8;
  margin-bottom: 36px;
  max-width: 620px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeInUp 0.8s ease-out 0.15s both;
}
.cta-btn {
  display: inline-block;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  background-size: 200% 200%;
  color: #fff;
  border: none;
  padding: 16px 36px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background-position 0.4s ease;
  animation: fadeInUp 0.8s ease-out 0.3s both;
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.5);
}
.cta-btn:hover {
  transform: scale(1.05);
  background-position: 100% 50%;
  box-shadow: 0 0 45px rgba(236, 72, 153, 0.6);
}
.stat-item {
  text-align: center;
  animation: fadeInUp 0.6s ease-out both;
}
.stat-item:nth-child(1) { animation-delay: 0.1s; }
.stat-item:nth-child(2) { animation-delay: 0.2s; }
.stat-item:nth-child(3) { animation-delay: 0.3s; }
.stat-card {
  background: #1e293b;
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 18px;
  padding: 32px 24px;
  width: 240px;
  transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
}
.stat-card:hover {
  border-color: #6366f1;
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.25);
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
  color: #94a3b8;
  margin-top: 10px;
}
.feature-card {
  background: #1e293b;
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px;
  padding: 32px 24px;
  width: 280px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  animation: fadeInUp 0.6s ease-out both;
  text-align: center;
}
.feature-card:nth-child(1) { animation-delay: 0.1s; }
.feature-card:nth-child(2) { animation-delay: 0.2s; }
.feature-card:nth-child(3) { animation-delay: 0.3s; }
.feature-card:nth-child(4) { animation-delay: 0.4s; }
.feature-card:hover {
  transform: translateY(-10px);
  border-color: #6366f1;
  box-shadow: 0 16px 40px rgba(99, 102, 241, 0.25);
}
.feature-icon {
  font-size: 3rem;
  margin-bottom: 18px;
  display: inline-block;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.section-title {
  font-size: 2.2rem;
  margin-bottom: 40px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  animation: fadeInUp 0.6s ease-out;
}
`;

const styles = {
  stats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    padding: '70px 20px',
    background: '#0f172a',
    flexWrap: 'wrap',
  },
  features: {
    padding: '70px 20px 90px',
    textAlign: 'center',
    background: '#0f172a',
  },
  featuresGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    flexWrap: 'wrap',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '10px',
    color: '#f1f5f9',
  },
  featureDesc: {
    color: '#94a3b8',
    fontSize: '0.95rem',
  },
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

const particles = [
  { cx: 100, cy: 80, r: 60, color: '#6366f1', delay: '0s', dur: '8s' },
  { cx: 280, cy: 160, r: 90, color: '#ec4899', delay: '1s', dur: '10s' },
  { cx: 480, cy: 60, r: 50, color: '#22d3ee', delay: '2s', dur: '9s' },
  { cx: 680, cy: 140, r: 70, color: '#6366f1', delay: '1.5s', dur: '11s' },
  { cx: 880, cy: 90, r: 55, color: '#ec4899', delay: '0.5s', dur: '12s' },
  { cx: 1080, cy: 170, r: 80, color: '#22d3ee', delay: '2.5s', dur: '10s' },
  { cx: 1200, cy: 60, r: 45, color: '#6366f1', delay: '1.2s', dur: '9s' },
];

export default function Home() {
  const workers = useCounter(260000, 2000);
  const noContract = useCounter(48, 1500);
  const verified = useCounter(100, 1500);

  return (
    <>
      <style>{homeStyles}</style>
      <div>
        <section className="hero-section">
          <svg className="hero-bg-particles" viewBox="0 0 1280 250" preserveAspectRatio="none">
            {particles.map((p, i) => (
              <circle
                key={i}
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                fill={p.color}
                opacity="0.12"
                style={{ animation: `float ${p.dur} ease-in-out ${p.delay} infinite` }}
              />
            ))}
          </svg>
          <div className="hero-content">
            <h1 className="hero-title">Conectamos hogares con trabajadoras confiables</h1>
            <p className="hero-subtitle">
              La plataforma que busca el equilibrio entre hogares y personas que necesitan empleo digno
            </p>
            <Link to="/jobs" className="cta-btn">Ver trabajos disponibles</Link>
          </div>
        </section>

        <section style={styles.stats}>
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
        </section>

        <section style={styles.features}>
          <h2 className="section-title">¿Por qué NanaConecta?</h2>
          <div style={styles.featuresGrid}>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <div style={styles.featureTitle}>Búsqueda Fácil</div>
              <div style={styles.featureDesc}>Encuentra trabajadoras por ubicación, habilidades y tarifa horaria</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <div style={styles.featureTitle}>100% Verificadas</div>
              <div style={styles.featureDesc}>Todas las trabajadoras pasan por un proceso de verificación</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <div style={styles.featureTitle}>Contratos Seguros</div>
              <div style={styles.featureDesc}>Formaliza acuerdos con contratos claros para ambas partes</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <div style={styles.featureTitle}>Reseñas Confiables</div>
              <div style={styles.featureDesc}>Sistema de calificaciones y reseñas de trabajos anteriores</div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}