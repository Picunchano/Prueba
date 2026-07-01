import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CHILE_REGIONS } from '../data/regions';

const jobsStyles = `
.page-wrap { background: #f8faff; min-height: calc(100vh - 64px); padding: 48px 20px 64px; }
.jobs-container { max-width: 900px; margin: 0 auto; animation: fadeIn 0.5s ease; }
.page-header { text-align: center; margin-bottom: 36px; animation: fadeInUp 0.5s ease-out; }
.page-title { font-size: 2.2rem; color: #0f172a; margin-bottom: 8px; letter-spacing: -0.5px; }
.page-title-gradient { background: linear-gradient(135deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.page-subtitle { color: #64748b; font-size: 1.05rem; }
.job-filters { display: flex; gap: 12px; margin-bottom: 28px; animation: fadeInUp 0.4s ease-out; flex-wrap: wrap; align-items: flex-end; background: #ffffff; padding: 20px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
.job-filter-group { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 180px; }
.job-filter-label { font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
.job-filter-select { padding: 11px 14px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.95rem; background: #ffffff; color: #0f172a; outline: none; transition: border-color 0.3s ease, box-shadow 0.3s ease; cursor: pointer; }
.job-filter-select:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
.job-search-btn { padding: 11px 22px; background: linear-gradient(135deg, #6366f1, #ec4899); background-size: 200% 200%; color: #fff; border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease, background-position 0.4s ease; white-space: nowrap; box-shadow: 0 4px 14px rgba(99,102,241,0.25); }
.job-search-btn:hover { transform: translateY(-2px); background-position: 100% 50%; box-shadow: 0 6px 20px rgba(236,72,153,0.35); }
.job-clear-btn { padding: 11px 18px; background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.95rem; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; white-space: nowrap; }
.job-clear-btn:hover { background: #e2e8f0; color: #0f172a; }
.job-card { background: #ffffff; border: 1px solid #f1f5f9; border-radius: 16px; padding: 26px; margin-bottom: 18px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: transform 0.3s ease, box-shadow 0.3s ease; animation: fadeInUp 0.5s ease-out both; cursor: pointer; }
.job-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.1); }
.job-card:nth-child(1) { animation-delay: 0.05s; } .job-card:nth-child(2) { animation-delay: 0.1s; } .job-card:nth-child(3) { animation-delay: 0.15s; } .job-card:nth-child(4) { animation-delay: 0.2s; } .job-card:nth-child(5) { animation-delay: 0.25s; } .job-card:nth-child(6) { animation-delay: 0.3s; }
.job-card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
.job-card-title { font-size: 1.3rem; font-weight: 700; color: #0f172a; }
.job-card-desc { color: #64748b; margin-bottom: 14px; line-height: 1.6; }
.job-card-meta { display: flex; gap: 20px; margin-bottom: 16px; font-size: 0.9rem; color: #64748b; flex-wrap: wrap; align-items: center; }
.status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; font-size: 0.72rem; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
.status-open { background: #dcfce7; color: #16a34a; }
.status-closed { background: #fee2e2; color: #dc2626; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; background: #16a34a; animation: pulseDot 2s ease-in-out infinite; }
.rate { color: #6366f1; font-weight: 800; font-size: 1.15rem; letter-spacing: -0.5px; }
.rate-sym { font-size: 1.3rem; margin-right: 1px; }
.apply-btn { position: relative; overflow: hidden; background: linear-gradient(135deg, #6366f1, #ec4899); background-size: 200% 200%; color: #fff; border: none; padding: 11px 22px; border-radius: 10px; cursor: pointer; font-size: 0.95rem; font-weight: 600; transition: transform 0.2s ease, box-shadow 0.2s ease, background-position 0.4s ease; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25); }
.apply-btn:hover { transform: translateY(-2px); background-position: 100% 50%; box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4); }
.apply-btn .ripple { position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.5); width: 20px; height: 20px; margin-top: -10px; margin-left: -10px; animation: ripple 0.6s linear; pointer-events: none; }
.applied-btn { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 11px 22px; border-radius: 10px; font-size: 0.95rem; font-weight: 600; cursor: default; }
.skeleton-container { max-width: 900px; margin: 0 auto; padding: 48px 20px; }
.skeleton-card { background: #ffffff; border-radius: 16px; padding: 26px; margin-bottom: 18px; border: 1px solid #f1f5f9; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
.skeleton-line { height: 14px; border-radius: 6px; background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite; margin-bottom: 12px; }
.skeleton-line-title { width: 50%; height: 22px; margin-bottom: 16px; }
.skeleton-line-short { width: 30%; } .skeleton-line-medium { width: 65%; } .skeleton-line-full { width: 100%; }
.empty { text-align: center; padding: 60px 20px; color: #64748b; animation: fadeIn 0.5s ease; font-size: 1.05rem; }
.error { text-align: center; padding: 30px; color: #dc2626; animation: shake 0.5s ease; font-size: 1.05rem; }

@media (max-width: 768px) {
  .page-wrap { padding: 32px 1rem 48px; }
  .jobs-container { max-width: 100%; }
  .page-title { font-size: 1.5rem; }
  .page-subtitle { font-size: 0.95rem; }
  .job-filters { flex-direction: column; padding: 16px; gap: 12px; align-items: stretch; }
  .job-filter-group { min-width: 0; width: 100%; }
  .job-search-btn, .job-clear-btn { width: 100%; min-height: 44px; }
  .job-card { padding: 18px 16px; margin-bottom: 14px; }
  .job-card-title { font-size: 1.1rem; }
  .job-card-desc { font-size: 0.88rem; }
  .job-card-meta { gap: 10px; font-size: 0.82rem; flex-direction: column; align-items: flex-start; gap: 4px; }
  .apply-btn, .applied-btn { width: 100%; min-height: 44px; }
  .skeleton-container { padding: 32px 1rem; }
  .skeleton-card { padding: 18px 16px; }
}

@media (max-width: 480px) {
  .page-wrap { padding: 24px 1rem 40px; }
  .page-title { font-size: 1.3rem; }
  .job-card { padding: 16px 14px; }
  .job-card-top { flex-direction: column; gap: 8px; }
}
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
  const [regionId, setRegionId] = useState('');
  const [commune, setCommune] = useState('');
  const navigate = useNavigate();

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
                  <div key={job.id} className="job-card" onClick={() => navigate(`/jobs/${job.id}`)}>
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