import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ReviewModal from '../components/ReviewModal';

const dashStyles = `
.page-wrap { background: #0f172a; min-height: calc(100vh - 64px); padding: 48px 20px 64px; }
.dash-container { max-width: 1000px; margin: 0 auto; animation: fadeIn 0.4s ease; }
.dash-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 36px; flex-wrap: wrap; gap: 16px; animation: fadeInUp 0.5s ease-out; }
.dash-title { font-size: 2.2rem; color: #f1f5f9; letter-spacing: -0.5px; }
.dash-title-gradient { background: linear-gradient(135deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.dash-subtitle { color: #94a3b8; font-size: 1rem; margin-top: 4px; }
.dash-section-title { font-size: 1.3rem; color: #f1f5f9; margin-bottom: 18px; padding-bottom: 10px; border-bottom: 2px solid transparent; border-image: linear-gradient(90deg, #6366f1, #ec4899) 1; display: inline-block; }
.dash-card { background: #1e293b; border: 1px solid rgba(99, 102, 241, 0.15); border-radius: 14px; padding: 22px; margin-bottom: 14px; transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; animation: fadeInUp 0.4s ease-out both; }
.dash-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.35); }
.dash-card-title { font-size: 1.15rem; font-weight: 700; color: #f1f5f9; margin-bottom: 6px; }
.dash-card-meta { display: flex; gap: 18px; font-size: 0.9rem; color: #94a3b8; margin-bottom: 8px; flex-wrap: wrap; align-items: center; }
.dash-card-desc { color: #cbd5e1; font-size: 0.95rem; margin-bottom: 12px; line-height: 1.5; }
.rate { color: #22d3ee; font-weight: 800; }
.badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.badge-pending { background: rgba(245, 158, 11, 0.2); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.4); }
.badge-accepted { background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); }
.badge-rejected { background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); }
.badge-open { background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); }
.badge-closed { background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); }
.badge-active { background: rgba(99, 102, 241, 0.2); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.4); }
.badge-completed { background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); }
.badge-cancelled { background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); }
.btn { padding: 9px 16px; border: none; border-radius: 10px; cursor: pointer; font-size: 0.9rem; font-weight: 600; transition: transform 0.2s ease, box-shadow 0.2s ease; }
.btn:hover { transform: translateY(-2px); }
.btn-primary { background: linear-gradient(135deg, #6366f1, #ec4899); background-size: 200% 200%; color: #fff; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35); transition: transform 0.2s ease, box-shadow 0.2s ease, background-position 0.4s ease; }
.btn-primary:hover { background-position: 100% 50%; box-shadow: 0 6px 20px rgba(236, 72, 153, 0.45); }
.btn-success { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); }
.btn-success:hover { background: rgba(16, 185, 129, 0.25); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35); }
.btn-danger { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); }
.btn-danger:hover { background: rgba(239, 68, 68, 0.25); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35); }
.btn-outline { background: transparent; border: 1px solid #334155; color: #cbd5e1; }
.btn-outline:hover { border-color: #ef4444; color: #ef4444; background: rgba(239, 68, 68, 0.1); }
.btn-sm { padding: 7px 12px; font-size: 0.82rem; }
.btn-group { display: flex; gap: 10px; margin-top: 14px; flex-wrap: wrap; }
.modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); display: flex; justify-content: center; align-items: center; z-index: 200; animation: fadeIn 0.2s ease; }
.modal { background: #1e293b; border-radius: 16px; padding: 34px; width: 90%; max-width: 480px; border: 1px solid rgba(99, 102, 241, 0.3); box-shadow: 0 20px 60px rgba(0,0,0,0.6); animation: fadeInUp 0.3s ease-out; max-height: 90vh; overflow-y: auto; }
.modal-title { font-size: 1.5rem; color: #f1f5f9; margin-bottom: 20px; }
.modal-title-gradient { background: linear-gradient(135deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.modal-input { width: 100%; padding: 11px 14px; margin-bottom: 14px; border: 1px solid #334155; border-radius: 10px; font-size: 1rem; background: #0f172a; color: #f1f5f9; box-sizing: border-box; transition: border-color 0.3s ease, box-shadow 0.3s ease; outline: none; }
.modal-input::placeholder { color: #475569; }
.modal-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); }
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 22px; }
.btn-cancel { background: rgba(148, 163, 184, 0.1); color: #cbd5e1; border: 1px solid #334155; }
.btn-cancel:hover { background: rgba(148, 163, 184, 0.2); }
.modal-error { background: rgba(239, 68, 68, 0.12); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); padding: 12px; border-radius: 10px; margin-bottom: 14px; text-align: center; animation: shake 0.5s ease; font-size: 0.9rem; }
.empty-state { text-align: center; padding: 40px; color: #94a3b8; animation: fadeIn 0.4s ease; }
.skeleton-dash { display: flex; flex-direction: column; gap: 14px; max-width: 1000px; margin: 0 auto; }
.skel-line { height: 13px; border-radius: 6px; background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%); background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite; margin-bottom: 10px; }
.skel-line.w50 { width: 50%; } .skel-line.w30 { width: 30%; } .skel-line.w80 { width: 80%; }
.skel-card { background: #1e293b; border-radius: 14px; padding: 22px; border: 1px solid rgba(99,102,241,0.1); }
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
              <div>
                <div className="dash-card-title">{app.worker?.name}</div>
                <div className="dash-card-meta">
                  <span>Trabajo: {app.job?.title}</span>
                  <span className={`badge badge-${(app.status || 'pending').toLowerCase()}`}>{app.status}</span>
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