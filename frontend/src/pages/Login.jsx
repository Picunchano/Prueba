import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const loginStyles = `
.auth-page { display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 64px); background: radial-gradient(circle at center, #1e1b4b 0%, #0f172a 70%); padding: 40px 20px; }
.auth-card { background: rgba(30, 41, 59, 0.8); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); padding: 44px; border-radius: 20px; border: 1px solid rgba(99, 102, 241, 0.3); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.1); width: 100%; max-width: 420px; animation: fadeInUp 0.6s ease-out; }
.auth-card.error { animation: fadeInUp 0.6s ease-out, shake 0.5s ease; }
.auth-title { font-size: 1.9rem; text-align: center; margin-bottom: 8px; color: #f1f5f9; }
.auth-title-gradient { background: linear-gradient(135deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.auth-subtitle { text-align: center; color: #94a3b8; margin-bottom: 28px; font-size: 0.95rem; }
.auth-input { width: 100%; padding: 13px 14px; margin-bottom: 16px; border: 1px solid #334155; border-radius: 10px; font-size: 1rem; background: #0f172a; color: #f1f5f9; box-sizing: border-box; transition: border-color 0.3s ease, box-shadow 0.3s ease; outline: none; }
.auth-input::placeholder { color: #475569; }
.auth-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); }
.auth-btn { width: 100%; padding: 13px; background: linear-gradient(135deg, #6366f1, #ec4899); background-size: 200% 200%; color: #fff; border: none; border-radius: 10px; font-size: 1rem; cursor: pointer; font-weight: 600; transition: transform 0.2s ease, box-shadow 0.2s ease, background-position 0.4s ease; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 0 30px rgba(99, 102, 241, 0.35); }
.auth-btn:hover:not(:disabled) { transform: translateY(-2px); background-position: 100% 50%; box-shadow: 0 0 45px rgba(236, 72, 153, 0.5); }
.auth-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
.spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
.auth-error { background: rgba(239, 68, 68, 0.12); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); padding: 12px; border-radius: 10px; margin-bottom: 16px; text-align: center; animation: shake 0.5s ease; font-size: 0.9rem; }
.auth-link { text-align: center; margin-top: 20px; font-size: 0.9rem; color: #94a3b8; }
.auth-link a { background: linear-gradient(135deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-decoration: none; font-weight: 700; }
.auth-link a:hover { text-decoration: underline; }
.field-group { display: flex; gap: 12px; }
.field-group > * { flex: 1; }
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