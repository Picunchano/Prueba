import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ReviewModal from '../components/ReviewModal';

const API_BASE = 'http://localhost:3000';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const dashStyles = `
.page-wrap { background: #f8faff; min-height: calc(100vh - 64px); padding: 48px 20px 64px; }
.dash-container { max-width: 1000px; margin: 0 auto; animation: fadeIn 0.4s ease; }
.dash-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 36px; flex-wrap: wrap; gap: 16px; animation: fadeInUp 0.5s ease-out; }
.dash-title { font-size: 2.2rem; color: #0f172a; letter-spacing: -0.5px; }
.dash-title-gradient { background: linear-gradient(135deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.dash-subtitle { color: #64748b; font-size: 1rem; margin-top: 4px; }
.dash-section-title { font-size: 1.3rem; color: #0f172a; margin-bottom: 18px; padding-bottom: 10px; border-bottom: 2px solid transparent; border-image: linear-gradient(90deg, #6366f1, #ec4899) 1; display: inline-block; }
.dash-card { background: #ffffff; border: 1px solid #f1f5f9; border-radius: 14px; padding: 22px; margin-bottom: 14px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); transition: transform 0.25s ease, box-shadow 0.25s ease; animation: fadeInUp 0.4s ease-out both; }
.dash-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(99,102,241,0.1); }
.dash-card-title { font-size: 1.15rem; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
.dash-card-meta { display: flex; gap: 18px; font-size: 0.9rem; color: #64748b; margin-bottom: 8px; flex-wrap: wrap; align-items: center; }
.dash-card-desc { color: #475569; font-size: 0.95rem; margin-bottom: 12px; line-height: 1.5; }
.rate { color: #6366f1; font-weight: 800; }
.badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.badge-pending { background: #fef3c7; color: #d97706; border: 1px solid #fde68a; }
.badge-accepted { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; }
.badge-rejected { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; }
.badge-open { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; }
.badge-closed { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; }
.badge-active { background: #ede9fe; color: #6366f1; border: 1px solid #ddd6fe; }
.badge-completed { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; }
.badge-cancelled { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; }
.btn { padding: 9px 16px; border: none; border-radius: 10px; cursor: pointer; font-size: 0.9rem; font-weight: 600; transition: transform 0.2s ease, box-shadow 0.2s ease; }
.btn:hover { transform: translateY(-2px); }
.btn-primary { background: linear-gradient(135deg, #6366f1, #ec4899); background-size: 200% 200%; color: #fff; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25); transition: transform 0.2s ease, box-shadow 0.2s ease, background-position 0.4s ease; }
.btn-primary:hover { background-position: 100% 50%; box-shadow: 0 6px 20px rgba(236, 72, 153, 0.35); }
.btn-success { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; }
.btn-success:hover { background: #bbf7d0; box-shadow: 0 4px 12px rgba(22, 163, 74, 0.2); }
.btn-danger { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; }
.btn-danger:hover { background: #fecaca; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2); }
.btn-outline { background: transparent; border: 1px solid #e2e8f0; color: #64748b; }
.btn-outline:hover { border-color: #dc2626; color: #dc2626; background: #fee2e2; }
.btn-sm { padding: 7px 12px; font-size: 0.82rem; }
.btn-group { display: flex; gap: 10px; margin-top: 14px; flex-wrap: wrap; }
.modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); display: flex; justify-content: center; align-items: center; z-index: 200; animation: fadeIn 0.2s ease; }
.modal { background: #ffffff; border-radius: 16px; padding: 34px; width: 90%; max-width: 480px; border: none; box-shadow: 0 20px 60px rgba(0,0,0,0.15); animation: fadeInUp 0.3s ease-out; max-height: 90vh; overflow-y: auto; }
.modal-title { font-size: 1.5rem; color: #0f172a; margin-bottom: 20px; }
.modal-title-gradient { background: linear-gradient(135deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.modal-input { width: 100%; padding: 11px 14px; margin-bottom: 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem; background: #ffffff; color: #0f172a; box-sizing: border-box; transition: border-color 0.3s ease, box-shadow 0.3s ease; outline: none; }
.modal-input::placeholder { color: #94a3b8; }
.modal-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 22px; }
.btn-cancel { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }
.btn-cancel:hover { background: #e2e8f0; }
.modal-error { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; padding: 12px; border-radius: 10px; margin-bottom: 14px; text-align: center; animation: shake 0.5s ease; font-size: 0.9rem; }
.empty-state { text-align: center; padding: 40px; color: #64748b; animation: fadeIn 0.4s ease; }
.skeleton-dash { display: flex; flex-direction: column; gap: 14px; max-width: 1000px; margin: 0 auto; }
.skel-line { height: 13px; border-radius: 6px; background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite; margin-bottom: 10px; }
.skel-line.w50 { width: 50%; } .skel-line.w30 { width: 30%; } .skel-line.w80 { width: 80%; }
.skel-card { background: #ffffff; border-radius: 14px; padding: 22px; border: 1px solid #f1f5f9; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
.dash-app-row { display: flex; align-items: center; gap: 14px; }
.dash-app-avatar { width: 48px; height: 48px; border-radius: 50%; overflow: hidden; flex-shrink: 0; position: relative; background: linear-gradient(135deg, #6366f1, #ec4899); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 1.05rem; }
.dash-app-avatar img { width: 100%; height: 100%; object-fit: cover; }

@media (max-width: 768px) {
  .page-wrap { padding: 24px 1rem 48px; }
  .dash-container { max-width: 100%; }
  .dash-header { flex-direction: column; align-items: flex-start; gap: 12px; }
  .dash-title { font-size: 1.5rem; }
  .dash-section-title { font-size: 1.1rem; }
  .dash-card { padding: 16px 14px; margin-bottom: 12px; }
  .dash-card-title { font-size: 1rem; }
  .dash-card-meta { gap: 10px; font-size: 0.82rem; flex-direction: column; align-items: flex-start; gap: 4px; }
  .btn-group { flex-direction: column; gap: 8px; }
  .btn-group .btn { width: 100%; }
  .btn { padding: 12px 16px; font-size: 0.88rem; min-height: 44px; }
  .modal { width: 95vw; padding: 22px 18px; border-radius: 14px; }
  .modal-input { padding: 12px 12px; }
  .modal-actions { flex-direction: column-reverse; gap: 10px; }
  .modal-actions .btn { width: 100%; }
}

@media (max-width: 480px) {
  .page-wrap { padding: 20px 1rem 40px; }
  .dash-title { font-size: 1.3rem; }
}
`;

function SkeletonDash() {
  return (
    <div className="skeleton-dash">
      <div className="skel-line w50" style={{ height: 28 }} />
      {[1, 2, 3].map((i) => (
        <div key={i} className="skel-card">
          <div className="skel-line w80" style={{ height: 18 }} />
          <div className="skel-line w50" />
          <div className="skel-line w30" />
        </div>
      ))}
    </div>
  );
}

function CreateJobModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', location: '', hourlyRate: '', schedule: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/jobs', form);
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear trabajo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Publicar <span className="modal-title-gradient">Nuevo Trabajo</span></h3>
        {error && <div className="modal-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input className="modal-input" name="title" placeholder="Título del trabajo" value={form.title} onChange={handleChange} required />
          <input className="modal-input" name="description" placeholder="Descripción" value={form.description} onChange={handleChange} required />
          <input className="modal-input" name="location" placeholder="Ubicación" value={form.location} onChange={handleChange} required />
          <input className="modal-input" name="hourlyRate" type="number" step="0.01" min="0" placeholder="Tarifa por hora (opcional)" value={form.hourlyRate} onChange={handleChange} />
          <input className="modal-input" name="schedule" placeholder="Horario (ej: Lun-Vie 9am-5pm)" value={form.schedule} onChange={handleChange} />
          <div className="modal-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Publicando...' : 'Publicar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get('/jobs/my'),
        api.get('/applications/employer'),
      ]);
      setJobs(jobsRes.data.jobs);
      setApplications(appsRes.data.applications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm('¿Eliminar este trabajo?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar');
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.put(`/applications/${id}/${action}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  if (loading) return <SkeletonDash />;

  return (
    <div className="dash-container">
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Hola, <span className="dash-title-gradient">{user?.name || 'Empleador'}</span></h1>
          <p className="dash-subtitle">Gestiona tus trabajos y postulaciones recibidas</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Publicar Nuevo Trabajo</button>
      </div>

      {showModal && <CreateJobModal onClose={() => setShowModal(false)} onCreated={fetchData} />}

      <h2 className="dash-section-title">Mis Trabajos ({jobs.length})</h2>
      {jobs.length === 0 ? (
        <div className="empty-state">No tienes trabajos publicados</div>
      ) : (
        jobs.map((job, i) => (
          <div key={job.id} className="dash-card" style={{ animationDelay: `${i * 0.05}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="dash-card-title">{job.title}</div>
              <span className={`badge badge-${(job.status || 'open').toLowerCase()}`}>{job.status}</span>
            </div>
            <div className="dash-card-desc">{job.description}</div>
            <div className="dash-card-meta">
              <span>📍 {job.location}</span>
              {job.hourlyRate && <span className="rate">${job.hourlyRate}/hr</span>}
              {job._count && <span>{job._count.applications} postulaciones</span>}
            </div>
            <div className="btn-group">
              <button className="btn btn-outline btn-sm" onClick={() => handleDelete(job.id)}>Eliminar</button>
            </div>
          </div>
        ))
      )}

      <h2 className="dash-section-title" style={{ marginTop: 36 }}>Postulaciones Recibidas ({applications.length})</h2>
      {applications.length === 0 ? (
        <div className="empty-state">No tienes postulaciones recibidas</div>
      ) : (
        applications.map((app, i) => (
          <div key={app.id} className="dash-card" style={{ animationDelay: `${i * 0.05}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="dash-app-row">
                <div className="dash-app-avatar">
                  {app.worker?.avatarUrl ? (
                    <img
                      src={app.worker.avatarUrl.startsWith('http') ? app.worker.avatarUrl : `${API_BASE}${app.worker.avatarUrl}`}
                      alt={app.worker?.name}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : null}
                  <span style={{ display: app.worker?.avatarUrl ? 'none' : 'flex' }}>{getInitials(app.worker?.name)}</span>
                </div>
                <div>
                  <div className="dash-card-title">{app.worker?.name}</div>
                  <div className="dash-card-meta">
                    <span>Trabajo: {app.job?.title}</span>
                    <span className={`badge badge-${(app.status || 'pending').toLowerCase()}`}>{app.status}</span>
                  </div>
                </div>
              </div>
            </div>
            {app.message && <div className="dash-card-desc">"{app.message}"</div>}
            {app.status === 'PENDING' && (
              <div className="btn-group">
                <button className="btn btn-success btn-sm" onClick={() => handleAction(app.id, 'accept')}>Aceptar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleAction(app.id, 'reject')}>Rechazar</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function WorkerDashboard() {
  const [applications, setApplications] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewContractId, setReviewContractId] = useState(null);
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const [appsRes, contractsRes] = await Promise.all([
        api.get('/applications/my'),
        api.get('/contracts/my'),
      ]);
      setApplications(appsRes.data.applications);
      setContracts(contractsRes.data.contracts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <SkeletonDash />;

  return (
    <div className="dash-container">
      {reviewContractId && (
        <ReviewModal contractId={reviewContractId} onClose={() => setReviewContractId(null)} onCreated={fetchData} />
      )}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Hola, <span className="dash-title-gradient">{user?.name || 'Trabajadora'}</span></h1>
          <p className="dash-subtitle">Revisa tus postulaciones y contratos activos</p>
        </div>
      </div>

      <h2 className="dash-section-title" style={{ marginTop: 24 }}>Mis Postulaciones ({applications.length})</h2>
      {applications.length === 0 ? (
        <div className="empty-state">No tienes postulaciones aún</div>
      ) : (
        applications.map((app, i) => (
          <div key={app.id} className="dash-card" style={{ animationDelay: `${i * 0.05}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="dash-card-title">{app.job?.title}</div>
              <span className={`badge badge-${(app.status || 'pending').toLowerCase()}`}>{app.status}</span>
            </div>
            <div className="dash-card-meta">
              <span>Empleador: {app.job?.employer?.name}</span>
              {app.job?.location && <span>📍 {app.job.location}</span>}
              {app.job?.hourlyRate && <span className="rate">${app.job.hourlyRate}/hr</span>}
            </div>
            {app.message && <div className="dash-card-desc">Tu mensaje: "{app.message}"</div>}
          </div>
        ))
      )}

      <h2 className="dash-section-title" style={{ marginTop: 36 }}>Mis Contratos ({contracts.length})</h2>
      {contracts.length === 0 ? (
        <div className="empty-state">No tienes contratos</div>
      ) : (
        contracts.map((c, i) => (
          <div key={c.id} className="dash-card" style={{ animationDelay: `${i * 0.05}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="dash-card-title">{c.job?.title}</div>
              <span className={`badge badge-${(c.status || 'active').toLowerCase()}`}>{c.status}</span>
            </div>
            <div className="dash-card-meta">
              <span>Empleador: {c.employer?.name}</span>
              {c.agreedRate && <span className="rate">${c.agreedRate}/hr</span>}
              <span>Inicio: {new Date(c.startDate).toLocaleDateString('es-CL')}</span>
              {c.endDate && <span>Fin: {new Date(c.endDate).toLocaleDateString('es-CL')}</span>}
            </div>
            {c.status === 'COMPLETED' && (
              <div className="btn-group">
                <button className="btn btn-primary btn-sm" onClick={() => setReviewContractId(c.id)}>⭐ Dejar Reseña</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <>
      <style>{dashStyles}</style>
      <div className="page-wrap">
        {user.role === 'EMPLOYER' ? <EmployerDashboard /> : <WorkerDashboard />}
      </div>
    </>
  );
}