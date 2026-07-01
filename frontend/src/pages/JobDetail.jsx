import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:3000';

const detailStyles = `
.page-wrap { background: #f8faff; min-height: calc(100vh - 64px); padding: 48px 20px 64px; }
.jd-container { max-width: 1000px; margin: 0 auto; animation: fadeIn 0.5s ease; }
.jd-back { display: inline-flex; align-items: center; gap: 6px; margin-bottom: 24px; color: #6366f1; text-decoration: none; font-weight: 600; font-size: 0.95rem; cursor: pointer; background: none; border: none; transition: color 0.2s ease; }
.jd-back:hover { color: #ec4899; }
.jd-layout { display: flex; gap: 32px; align-items: flex-start; }
.jd-col-left { flex: 0 0 65%; min-width: 0; }
.jd-col-right { flex: 0 0 35%; min-width: 0; display: flex; flex-direction: column; gap: 20px; }
.jd-card { background: #ffffff; border: 1px solid #f1f5f9; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); animation: fadeInUp 0.5s ease-out; }
.jd-title { font-size: 2rem; font-weight: 800; color: #0f172a; margin-bottom: 12px; line-height: 1.2; }
.jd-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 24px; }
.jd-badge-open { background: #dcfce7; color: #16a34a; }
.jd-badge-closed { background: #f1f5f9; color: #64748b; }
.jd-dot { width: 8px; height: 8px; border-radius: 50%; background: #16a34a; animation: pulseDot 2s ease-in-out infinite; }
.jd-desc-title { font-size: 1.3rem; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
.jd-desc { color: #475569; font-size: 1.05rem; line-height: 1.7; margin-bottom: 32px; }
.jd-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
.jd-detail-item { background: #f8faff; border: 1px solid #f1f5f9; border-radius: 12px; padding: 18px 16px; display: flex; align-items: center; gap: 14px; }
.jd-detail-icon { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #6366f1, #ec4899); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }
.jd-detail-text { min-width: 0; }
.jd-detail-label { font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
.jd-detail-value { font-size: 0.95rem; color: #0f172a; font-weight: 600; margin-top: 2px; }
.jd-apply-section { background: #f8faff; border: 1px solid #ede9fe; border-radius: 14px; padding: 24px; }
.jd-apply-title { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-bottom: 14px; }
.jd-apply-textarea { width: 100%; padding: 12px 14px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.95rem; background: #ffffff; color: #0f172a; box-sizing: border-box; outline: none; transition: border-color 0.3s ease, box-shadow 0.3s ease; resize: vertical; min-height: 100px; font-family: inherit; margin-bottom: 16px; }
.jd-apply-textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.jd-apply-textarea::placeholder { color: #94a3b8; }
.jd-apply-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #6366f1, #ec4899); background-size: 200% 200%; color: #fff; border: none; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease, background-position 0.4s ease; box-shadow: 0 4px 14px rgba(99,102,241,0.25); min-height: 48px; }
.jd-apply-btn:hover:not(:disabled) { transform: translateY(-2px); background-position: 100% 50%; box-shadow: 0 6px 20px rgba(236,72,153,0.4); }
.jd-apply-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.jd-applied-msg { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 14px; border-radius: 10px; text-align: center; font-weight: 600; font-size: 0.95rem; }
.jd-login-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #6366f1, #ec4899); color: #fff; border: none; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: transform 0.2s ease; min-height: 48px; }
.jd-login-btn:hover { transform: translateY(-2px); }
.jd-success { background: #dcfce7; color: #16a34a; padding: 12px; border-radius: 10px; margin-bottom: 14px; text-align: center; font-weight: 600; font-size: 0.9rem; animation: slideDown 0.3s ease; }
.jd-error { background: #fee2e2; color: #dc2626; padding: 12px; border-radius: 10px; margin-bottom: 14px; text-align: center; font-weight: 600; font-size: 0.9rem; animation: shake 0.5s ease; }
.jd-employer-card { background: #ffffff; border: 1px solid #f1f5f9; border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); animation: fadeInUp 0.5s ease-out 0.1s both; }
.jd-employer-title { font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 18px; }
.jd-employer-row { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
.jd-employer-avatar { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #ec4899); color: #fff; font-weight: 800; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 14px rgba(99,102,241,0.2); }
.jd-employer-avatar-img { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; flex-shrink: 0; border: 2px solid #f1f5f9; }
.jd-employer-name { font-size: 1.1rem; font-weight: 700; color: #0f172a; }
.jd-employer-sub { font-size: 0.85rem; color: #64748b; margin-top: 2px; }
.jd-stat-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-top: 1px solid #f1f5f9; }
.jd-stat-label { font-size: 0.9rem; color: #64748b; }
.jd-stat-value { font-size: 0.95rem; font-weight: 700; color: #0f172a; }
.jd-share-btn { width: 100%; padding: 12px; background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
.jd-share-btn:hover { background: #e2e8f0; color: #0f172a; }
.jd-share-copied { text-align: center; font-size: 0.85rem; color: #16a34a; margin-top: 10px; font-weight: 600; animation: fadeIn 0.3s ease; }
.jd-notfound { text-align: center; padding: 80px 20px; }
.jd-notfound-icon { font-size: 3rem; margin-bottom: 16px; }
.jd-notfound-text { font-size: 1.2rem; color: #64748b; margin-bottom: 24px; }
.jd-skeleton { display: flex; gap: 32px; }
.jd-skel-left { flex: 0 0 65%; }
.jd-skel-right { flex: 0 0 35%; display: flex; flex-direction: column; gap: 20px; }
.jd-skel-card { background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #f1f5f9; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
.skel-line { height: 14px; border-radius: 6px; background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite; margin-bottom: 12px; }
.skel-line.w30 { width: 30%; } .skel-line.w50 { width: 50%; } .skel-line.w70 { width: 70%; } .skel-line.w100 { width: 100%; }
.skel-line.h28 { height: 28px; }

@media (max-width: 768px) {
  .page-wrap { padding: 24px 1rem 48px; }
  .jd-container { max-width: 100%; }
  .jd-layout { flex-direction: column; gap: 24px; }
  .jd-col-left, .jd-col-right { flex: none; width: 100%; }
  .jd-card { padding: 22px 18px; }
  .jd-title { font-size: 1.5rem; }
  .jd-details-grid { grid-template-columns: 1fr; gap: 12px; }
  .jd-skeleton { flex-direction: column; gap: 24px; }
  .jd-skel-left, .jd-skel-right { flex: none; width: 100%; }
}

@media (max-width: 480px) {
  .jd-title { font-size: 1.3rem; }
  .jd-card { padding: 18px 16px; }
  .jd-detail-item { padding: 14px 12px; }
}
`;

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function SkeletonDetail() {
  return (
    <div className="jd-skeleton">
      <div className="jd-skel-left">
        <div className="jd-skel-card">
          <div className="skel-line h28 w50" style={{ marginBottom: 24 }} />
          <div className="skel-line w100" />
          <div className="skel-line w100" />
          <div className="skel-line w70" />
        </div>
      </div>
      <div className="jd-skel-right">
        <div className="jd-skel-card">
          <div className="skel-line w50" />
          <div className="skel-line w30" />
        </div>
      </div>
    </div>
  );
}

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyMessage, setApplyMessage] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');
  const [applyError, setApplyError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/jobs/${id}`)
      .then((res) => {
        setJob(res.data.job);
        if (user && user.role === 'WORKER') {
          const alreadyApplied = res.data.job.applications?.some(
            (app) => app.worker?.id === user.id
          );
          setApplied(alreadyApplied);
        }
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setError('not_found');
        } else {
          setError('Error al cargar el trabajo');
        }
      })
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setApplyError('');
    setApplySuccess('');
    try {
      await api.post(`/applications/${id}/apply`, { message: applyMessage || undefined });
      setApplied(true);
      setApplySuccess('Postulación enviada correctamente');
      setApplyMessage('');
      setTimeout(() => setApplySuccess(''), 4000);
    } catch (err) {
      setApplyError(err.response?.data?.error || 'Error al postularse');
    } finally {
      setApplying(false);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (loading) {
    return (
      <>
        <style>{detailStyles}</style>
        <div className="page-wrap">
          <div className="jd-container">
            <SkeletonDetail />
          </div>
        </div>
      </>
    );
  }

  if (error === 'not_found') {
    return (
      <>
        <style>{detailStyles}</style>
        <div className="page-wrap">
          <div className="jd-container">
            <div className="jd-notfound">
              <div className="jd-notfound-icon">🔍</div>
              <div className="jd-notfound-text">Trabajo no encontrado</div>
              <button className="jd-back" onClick={() => navigate('/jobs')}>← Volver a trabajos</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !job) {
    return (
      <>
        <style>{detailStyles}</style>
        <div className="page-wrap">
          <div className="jd-container">
            <div className="jd-notfound">
              <div className="jd-notfound-text">{error || 'Error desconocido'}</div>
              <button className="jd-back" onClick={() => navigate('/jobs')}>← Volver a trabajos</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const isOpen = (job.status || 'OPEN') === 'OPEN';
  const appCount = job.applications?.length || 0;
  const employerAvatar = job.employer?.avatarUrl
    ? (job.employer.avatarUrl.startsWith('http') ? job.employer.avatarUrl : `${API_BASE}${job.employer.avatarUrl}`)
    : null;

  return (
    <>
      <style>{detailStyles}</style>
      <div className="page-wrap">
        <div className="jd-container">
          <button className="jd-back" onClick={() => navigate(-1)}>← Volver a trabajos</button>

          <div className="jd-layout">
            {/* COLUMNA IZQUIERDA */}
            <div className="jd-col-left">
              <div className="jd-card">
                <h1 className="jd-title">{job.title}</h1>
                <span className={`jd-badge ${isOpen ? 'jd-badge-open' : 'jd-badge-closed'}`}>
                  {isOpen && <span className="jd-dot" />}
                  {job.status || 'OPEN'}
                </span>

                <div className="jd-desc-title">Descripción del trabajo</div>
                <p className="jd-desc">{job.description}</p>

                <div className="jd-desc-title">Detalles del trabajo</div>
                <div className="jd-details-grid">
                  <div className="jd-detail-item">
                    <div className="jd-detail-icon">📍</div>
                    <div className="jd-detail-text">
                      <div className="jd-detail-label">Ubicación</div>
                      <div className="jd-detail-value">{job.location}</div>
                    </div>
                  </div>
                  <div className="jd-detail-item">
                    <div className="jd-detail-icon">💰</div>
                    <div className="jd-detail-text">
                      <div className="jd-detail-label">Tarifa por hora</div>
                      <div className="jd-detail-value">{job.hourlyRate ? `$${job.hourlyRate}/hr` : 'A convenir'}</div>
                    </div>
                  </div>
                  <div className="jd-detail-item">
                    <div className="jd-detail-icon">🕐</div>
                    <div className="jd-detail-text">
                      <div className="jd-detail-label">Horario</div>
                      <div className="jd-detail-value">{job.schedule || 'No especificado'}</div>
                    </div>
                  </div>
                  <div className="jd-detail-item">
                    <div className="jd-detail-icon">🏠</div>
                    <div className="jd-detail-text">
                      <div className="jd-detail-label">Modalidad</div>
                      <div className="jd-detail-value">Puertas adentro / afuera</div>
                    </div>
                  </div>
                </div>

                {/* Área de postulación */}
                {user && user.role === 'WORKER' && isOpen && (
                  <div className="jd-apply-section">
                    {applySuccess && <div className="jd-success">{applySuccess}</div>}
                    {applyError && <div className="jd-error">{applyError}</div>}
                    {applied ? (
                      <div className="jd-applied-msg">Ya te postulaste a este trabajo ✓</div>
                    ) : (
                      <form onSubmit={handleApply}>
                        <div className="jd-apply-title">Postular a este trabajo</div>
                        <textarea
                          className="jd-apply-textarea"
                          placeholder="Escribe un mensaje opcional para el empleador..."
                          value={applyMessage}
                          onChange={(e) => setApplyMessage(e.target.value)}
                        />
                        <button className="jd-apply-btn" type="submit" disabled={applying}>
                          {applying ? 'Enviando...' : 'Postularme a este trabajo'}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* Botón contactar empleador */}
                {user && user.role === 'WORKER' && (
                  <div style={{ marginTop: 20 }}>
                    <button
                      className="jd-share-btn"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)', color: '#fff', border: 'none', boxShadow: '0 4px 14px rgba(99,102,241,0.2)' }}
                      onClick={() => navigate(`/messages?userId=${job.employer?.id}`)}
                    >
                      💬 Contactar empleador
                    </button>
                  </div>
                )}

                {user && user.role === 'WORKER' && !isOpen && (
                  <div className="jd-apply-section">
                    <div className="jd-applied-msg" style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}>
                      Este trabajo ya no está disponible
                    </div>
                  </div>
                )}

                {!user && isOpen && (
                  <div className="jd-apply-section">
                    <div className="jd-apply-title" style={{ textAlign: 'center', marginBottom: 16 }}>Para postular necesitas una cuenta</div>
                    <button className="jd-login-btn" onClick={() => navigate('/login')}>Inicia sesión para postularte</button>
                  </div>
                )}
              </div>
            </div>

            {/* COLUMNA DERECHA */}
            <div className="jd-col-right">
              <div className="jd-employer-card">
                <div className="jd-employer-title">Sobre el empleador</div>
                <div className="jd-employer-row">
                  {employerAvatar ? (
                    <img className="jd-employer-avatar-img" src={employerAvatar} alt={job.employer?.name} />
                  ) : (
                    <div className="jd-employer-avatar">{getInitials(job.employer?.name)}</div>
                  )}
                  <div>
                    <div className="jd-employer-name">{job.employer?.name}</div>
                    <div className="jd-employer-sub">Empleador</div>
                  </div>
                </div>
                <div className="jd-stat-row">
                  <span className="jd-stat-label">📅 Publicado</span>
                  <span className="jd-stat-value">{formatDate(job.createdAt)}</span>
                </div>
                <div className="jd-stat-row">
                  <span className="jd-stat-label">📋 Postulaciones</span>
                  <span className="jd-stat-value">{appCount}</span>
                </div>
              </div>

              <div className="jd-employer-card">
                <div className="jd-employer-title">Compartir</div>
                <button className="jd-share-btn" onClick={handleCopyLink}>
                  🔗 Copiar enlace
                </button>
                {copied && <div className="jd-share-copied">¡Enlace copiado al portapapeles!</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}