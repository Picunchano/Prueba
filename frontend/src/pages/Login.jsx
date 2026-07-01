import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const loginStyles = `
.auth-page { display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 64px); background: linear-gradient(135deg, #f8faff, #fdf2f8); padding: 40px 20px; }
.auth-card { background: #ffffff; padding: 44px; border-radius: 20px; border: none; box-shadow: 0 20px 60px rgba(0,0,0,0.1); width: 100%; max-width: 420px; animation: fadeInUp 0.6s ease-out; }
.auth-card.error { animation: fadeInUp 0.6s ease-out, shake 0.5s ease; }
.auth-title { font-size: 1.9rem; text-align: center; margin-bottom: 8px; color: #0f172a; }
.auth-title-gradient { background: linear-gradient(135deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.auth-subtitle { text-align: center; color: #64748b; margin-bottom: 28px; font-size: 0.95rem; }
.auth-input { width: 100%; padding: 13px 14px; margin-bottom: 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem; background: #ffffff; color: #0f172a; box-sizing: border-box; transition: border-color 0.3s ease, box-shadow 0.3s ease; outline: none; }
.auth-input::placeholder { color: #94a3b8; }
.auth-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.auth-btn { width: 100%; padding: 13px; background: linear-gradient(135deg, #6366f1, #ec4899); background-size: 200% 200%; color: #fff; border: none; border-radius: 10px; font-size: 1rem; cursor: pointer; font-weight: 600; transition: transform 0.2s ease, box-shadow 0.2s ease, background-position 0.4s ease; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25); }
.auth-btn:hover:not(:disabled) { transform: translateY(-2px); background-position: 100% 50%; box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4); }
.auth-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
.spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
.auth-error { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; padding: 12px; border-radius: 10px; margin-bottom: 16px; text-align: center; animation: shake 0.5s ease; font-size: 0.9rem; }
.auth-link { text-align: center; margin-top: 20px; font-size: 0.9rem; color: #64748b; }
.auth-link a { background: linear-gradient(135deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-decoration: none; font-weight: 700; }
.auth-link a:hover { text-decoration: underline; }
`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{loginStyles}</style>
      <div className="auth-page">
        <form className={`auth-card${error ? ' error' : ''}`} onSubmit={handleSubmit}>
          <h2 className="auth-title">Iniciar <span className="auth-title-gradient">Sesión</span></h2>
          <p className="auth-subtitle">Bienvenida de vuelta a NanaConecta</p>
          {error && <div className="auth-error">{error}</div>}
          <input className="auth-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="auth-input" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <p className="auth-link">
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </form>
      </div>
    </>
  );
}