import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CHILE_REGIONS } from '../data/regions';
import PricingCards from '../components/PricingCards.jsx';

const registerStyles = `
.auth-page { display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 64px); background: linear-gradient(135deg, #f8faff, #fdf2f8); padding: 40px 20px; }
.auth-card { background: #ffffff; padding: 44px; border-radius: 20px; border: none; box-shadow: 0 20px 60px rgba(0,0,0,0.1); width: 100%; max-width: 460px; animation: fadeInUp 0.6s ease-out; }
.auth-card.error { animation: fadeInUp 0.6s ease-out, shake 0.5s ease; }
.auth-title { font-size: 1.9rem; text-align: center; margin-bottom: 8px; color: #0f172a; }
.auth-title-gradient { background: linear-gradient(135deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.auth-subtitle { text-align: center; color: #64748b; margin-bottom: 28px; font-size: 0.95rem; }
.auth-input { width: 100%; padding: 13px 14px; margin-bottom: 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem; background: #ffffff; color: #0f172a; box-sizing: border-box; transition: border-color 0.3s ease, box-shadow 0.3s ease; outline: none; }
.auth-input::placeholder { color: #94a3b8; }
.auth-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.auth-select { width: 100%; padding: 13px 14px; margin-bottom: 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem; background: #ffffff; color: #0f172a; box-sizing: border-box; transition: border-color 0.3s ease, box-shadow 0.3s ease; outline: none; cursor: pointer; }
.auth-select:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.auth-btn { width: 100%; padding: 13px; background: linear-gradient(135deg, #6366f1, #ec4899); background-size: 200% 200%; color: #fff; border: none; border-radius: 10px; font-size: 1rem; cursor: pointer; font-weight: 600; transition: transform 0.2s ease, box-shadow 0.2s ease, background-position 0.4s ease; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25); }
.auth-btn:hover:not(:disabled) { transform: translateY(-2px); background-position: 100% 50%; box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4); }
.auth-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
.spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
.auth-error { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; padding: 12px; border-radius: 10px; margin-bottom: 16px; text-align: center; animation: shake 0.5s ease; font-size: 0.9rem; }
.auth-link { text-align: center; margin-top: 20px; font-size: 0.9rem; color: #64748b; }
.auth-link a { background: linear-gradient(135deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-decoration: none; font-weight: 700; }
.auth-link a:hover { text-decoration: underline; }
.field-group { display: flex; gap: 12px; }
.field-group > * { flex: 1; }

.step2-page { min-height: calc(100vh - 64px); background: linear-gradient(135deg, #f8faff, #fdf2f8); padding: 60px 20px 80px; }
.step2-container { max-width: 1100px; margin: 0 auto; animation: fadeIn 0.5s ease; }
.step2-header { text-align: center; margin-bottom: 48px; animation: fadeInUp 0.5s ease-out; }
.step2-title { font-size: 2.2rem; font-weight: 800; color: #0f172a; margin-bottom: 10px; }
.step2-title-gradient { background: linear-gradient(135deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.step2-subtitle { color: #64748b; font-size: 1.05rem; }
`;

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('WORKER');
  const [regionId, setRegionId] = useState('');
  const [commune, setCommune] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { register } = useAuth();
  const navigate = useNavigate();

  const selectedRegion = CHILE_REGIONS.find((r) => r.id === parseInt(regionId));
  const communes = selectedRegion ? selectedRegion.communes : [];

  const handleRegionChange = (e) => {
    setRegionId(e.target.value);
    setCommune('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    try {
      const payload = { name, email, password, phone, role };
      if (regionId) payload.regionId = parseInt(regionId);
      if (commune) payload.commune = commune;
      await register(payload);
      setStep(2);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        setErrors(data.errors.map((e) => e.msg));
      } else {
        setErrors([data?.error || 'Error al registrar']);
      }
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <>
        <style>{registerStyles}</style>
        <div className="step2-page">
          <div className="step2-container">
            <div className="step2-header">
              <h1 className="step2-title">Elige tu plan para <span className="step2-title-gradient">comenzar</span></h1>
              <p className="step2-subtitle">Puedes cambiar de plan en cualquier momento</p>
            </div>
            <PricingCards
              layout="col"
              onFree={() => navigate('/')}
              onPaid={() => navigate('/')}
              freeTextOverride="Continuar gratis"
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{registerStyles}</style>
      <div className="auth-page">
        <form className={`auth-card${errors.length > 0 ? ' error' : ''}`} onSubmit={handleSubmit}>
          <h2 className="auth-title">Crear <span className="auth-title-gradient">Cuenta</span></h2>
          <p className="auth-subtitle">Únete a la comunidad NanaConecta</p>
          {errors.length > 0 && (
            <div className="auth-error">
              {errors.map((msg, i) => <div key={i}>{msg}</div>)}
            </div>
          )}
          <input className="auth-input" type="text" placeholder="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="auth-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="auth-input" type="password" placeholder="Contraseña (mínimo 6 caracteres)" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          <input className="auth-input" type="tel" placeholder="+56912345678" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <select className="auth-select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="WORKER">Trabajadora</option>
            <option value="EMPLOYER">Empleador</option>
          </select>
          <div className="field-group">
            <select className="auth-select" value={regionId} onChange={handleRegionChange}>
              <option value="">Seleccionar región</option>
              {CHILE_REGIONS.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <select className="auth-select" value={commune} onChange={(e) => setCommune(e.target.value)} disabled={!regionId}>
              <option value="">{regionId ? 'Seleccionar comuna' : 'Primero seleccione región'}</option>
              {communes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
          <p className="auth-link">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </>
  );
}