import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { CHILE_REGIONS } from '../data/regions';

const jobsStyles = `
.page-wrap { background: #0f172a; min-height: calc(100vh - 64px); padding: 48px 20px 64px; }
.jobs-container { max-width: 900px; margin: 0 auto; animation: fadeIn 0.5s ease; }
.page-header { text-align: center; margin-bottom: 36px; animation: fadeInUp 0.5s ease-out; }
.page-title { font-size: 2.2rem; color: #f1f5f9; margin-bottom: 8px; letter-spacing: -0.5px; }
.page-title-gradient { background: linear-gradient(135deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.page-subtitle { color: #94a3b8; font-size: 1.05rem; }
.job-filters { display: flex; gap: 12px; margin-bottom: 28px; animation: fadeInUp 0.4s ease-out; flex-wrap: wrap; align-items: flex-end; background: #1e293b; padding: 20px; border-radius: 16px; border: 1px solid rgba(99,102,241,0.2); }
.job-filter-group { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 180px; }
.job-filter-label { font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
.job-filter-select { padding: 11px 14px; border: 1px solid #334155; border-radius: 10px; font-size: 0.95rem; background: #0f172a; color: #f1f5f9; outline: none; transition: border-color 0.3s ease, box-shadow 0.3s ease; cursor: pointer; }
.job-filter-select:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); }
.job-search-btn { padding: 11px 22px; background: linear-gradient(135deg, #6366f1, #ec4899); background-size: 200% 200%; color: #fff; border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease, background-position 0.4s ease; white-space: nowrap; box-shadow: 0 4px 14px rgba(99,102,241,0.35); }
.job-search-btn:hover { transform: translateY(-2px); background-position: 100% 50%; box-shadow: 0 6px 20px rgba(236,72,153,0.45); }
.job-clear-btn { padding: 11px 18px; background: rgba(148, 163, 184, 0.1); color: #cbd5e1; border: 1px solid #334155; border-radius: 10px; font-size: 0.95rem; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; white-space: nowrap; }
.job-clear-btn:hover { background: rgba(148, 163, 184, 0.2); color: #f1f5f9; }
.job-card { background: #1e293b; border: 1px solid rgba(99, 102, 241, 0.15); border-radius: 16px; padding: 26px; margin-bottom: 18px; transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease; animation: fadeInUp 0.5s ease-out both; }
.job-card:hover { transform: translateY(-4px); border-color: rgba(99, 102, 241, 0.5); box-shadow: 0 12px 36px rgba(99, 102, 241, 0.25); }
.job-card:nth-child(1) { animation-delay: 0.05s; } .job-card:nth-child(2) { animation-delay: 0.1s; } .job-card:nth-child(3) { animation-delay: 0.15s; } .job-card:nth-child(4) { animation-delay: 0.2s; } .job-card:nth-child(5) { animation-delay: 0.25s; } .job-card:nth-child(6) { animation-delay: 0.3s; }
.job-card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
.job-card-title { font-size: 1.3rem; font-weight: 700; color: #f1f5f9; }
.job-card-desc { color: #94a3b8; margin-bottom: 14px; line-height: 1.6; }
.job-card-meta { display: flex; gap: 20px; margin-bottom: 16px; font-size: 0.9rem; color: #94a3b8; flex-wrap: wrap; align-items: center; }
.status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.status-open { background: rgba(16, 185, 129, 0.2); color: #10b981; }
.status-closed { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; animation: pulseDot 2s ease-in-out infinite; }
.rate { color: #22d3ee; font-weight: 800; font-size: 1.15rem; letter-spacing: -0.5px; }
.rate-sym { font-size: 1.3rem; margin-right: 1px; }
.apply-btn { position: relative; overflow: hidden; background: linear-gradient(135deg, #6366f1, #ec4899); background-size: 200% 200%; color: #fff; border: none; padding: 11px 22px; border-radius: 10px; cursor: pointer; font-size: 0.95rem; font-weight: 600; transition: transform 0.2s ease, box-shadow 0.2s ease, background-position 0.4s ease; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35); }
.apply-btn:hover { transform: translateY(-2px); background-position: 100% 50%; box-shadow: 0 6px 20px rgba(236, 72, 153, 0.5); }
.apply-btn .ripple { position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.5); width: 20px; height: 20px; margin-top: -10px; margin-left: -10px; animation: ripple 0.6s linear; pointer-events: none; }
.applied-btn { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); padding: 11px 22px; border-radius: 10px; font-size: 0.95rem; font-weight: 600; cursor: default; }
.skeleton-container { max-width: 900px; margin: 0 auto; padding: 48px 20px; }
.skeleton-card { background: #1e293b; border-radius: 16px; padding: 26px; margin-bottom: 18px; border: 1px solid rgba(99,102,241,0.1); }
.skeleton-line { height: 14px; border-radius: 6px; background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%); background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite; margin-bottom: 12px; }
.skeleton-line-title { width: 50%; height: 22px; margin-bottom: 16px; }
.skeleton-line-short { width: 30%; } .skeleton-line-medium { width: 65%; } .skeleton-line-full { width: 100%; }
.empty { text-align: center; padding: 60px 20px; color: #94a3b8; animation: fadeIn 0.5s ease; font-size: 1.05rem; }
.error { text-align: center; padding: 30px; color: #ef4444; animation: shake 0.5s ease; font-size: 1.05rem; }
`;

function SkeletonLoader() {
  return (
    <div className="skeleton-container">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-line skeleton-line-title" />
          <div className="skeleton-line skeleton-line-full" />
          <div className="skeleton-line skeleton-line-medium" />
          <div className="skeleton-line skeleton-line-short" />
        </div>
      ))}
    </div>
  );
}

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState({});
  const [regionId, setRegionId] = useState('');
  const [commune, setCommune] = useState('');
  const { user } = useAuth();

  const selectedRegion = CHILE_REGIONS.find((r) => r.id === parseInt(regionId));
  const communes = selectedRegion ? selectedRegion.communes : [];

  const fetchJobs = (location) => {
    setLoading(true);
    setError('');
    const params = {};
    if (location) params.location = location;
    api.get('/jobs', { params })
      .then((res) => setJobs(res.data.jobs))
      .catch(() => setError('Error al cargar trabajos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(''); }, []);

  const handleRegionChange = (e) => {
    setRegionId(e.target.value);
    setCommune('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(commune);
  };

  const handleClear = () => {
    setRegionId('');
    setCommune('');
    fetchJobs('');
  };

  const handleApply = async (jobId, e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    try {
      await api.post(`/applications/${jobId}/apply`, {});
      setApplied((prev) => ({ ...prev, [jobId]: true }));
    } catch (err) {
      alert(err.response?.data?.error || 'Error al postularse');
    }
  };

  return (
    <>
      <style>{jobsStyles}</style>
      <div className="page-wrap">
        <div className="jobs-container">
          <div className="page-header">
            <h1 className="page-title">Trabajos <span className="page-title-gradient">Disponibles</span></h1>
            <p className="page-subtitle">Encuentra la oportunidad ideal para ti</p>
          </div>

          {loading ? (
            <SkeletonLoader />
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <>
              <form className="job-filters" onSubmit={handleSearch}>
                <div className="job-filter-group">
                  <label className="job-filter-label">Región</label>
                  <select className="job-filter-select" value={regionId} onChange={handleRegionChange}>
                    <option value="">Todas las regiones</option>
                    {CHILE_REGIONS.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div className="job-filter-group">
                  <label className="job-filter-label">Comuna</label>
                  <select className="job-filter-select" value={commune} onChange={(e) => setCommune(e.target.value)} disabled={!regionId}>
                    <option value="">{regionId ? 'Todas las comunas' : 'Primero seleccione región'}</option>
                    {communes.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <button className="job-search-btn" type="submit">Buscar</button>
                {(regionId || commune) && (
                  <button className="job-clear-btn" type="button" onClick={handleClear}>Limpiar</button>
                )}
              </form>

              {jobs.length === 0 ? (
                <div className="empty">No hay trabajos disponibles{commune ? ` en ${commune}` : ''}</div>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="job-card">
                    <div className="job-card-top">
                      <div className="job-card-title">{job.title}</div>
                      <span className={`status-badge status-${(job.status || 'OPEN').toLowerCase()}`}>
                        {(job.status || 'OPEN') === 'OPEN' && <span className="status-dot" />}
                        {job.status || 'OPEN'}
                      </span>
                    </div>
                    <div className="job-card-desc">{job.description}</div>
                    <div className="job-card-meta">
                      <span>📍 {job.location}</span>
                      {job.hourlyRate && <span className="rate"><span className="rate-sym">$</span>{job.hourlyRate}/hr</span>}
                      {job.employer && <span>👤 {job.employer.name}</span>}
                      {job.schedule && <span>🕐 {job.schedule}</span>}
                    </div>
                    {user && user.role === 'WORKER' && (
                      applied[job.id] ? (
                        <button className="applied-btn" disabled>Postulada ✓</button>
                      ) : (
                        <button className="apply-btn" onClick={(e) => handleApply(job.id, e)}>Postularme</button>
                      )
                    )}
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}