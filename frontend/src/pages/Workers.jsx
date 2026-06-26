import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CHILE_REGIONS } from '../data/regions';

const workersStyles = `
.page-wrap { background: #0f172a; min-height: calc(100vh - 64px); padding: 48px 20px 64px; }
.workers-container { max-width: 1000px; margin: 0 auto; animation: fadeIn 0.5s ease; }
.page-header { text-align: center; margin-bottom: 36px; animation: fadeInUp 0.5s ease-out; }
.page-title { font-size: 2.2rem; color: #f1f5f9; margin-bottom: 8px; letter-spacing: -0.5px; }
.page-title-gradient { background: linear-gradient(135deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.page-subtitle { color: #94a3b8; font-size: 1.05rem; }
.workers-filters { display: flex; gap: 12px; margin-bottom: 28px; animation: fadeInUp 0.4s ease-out; flex-wrap: wrap; align-items: flex-end; background: #1e293b; padding: 20px; border-radius: 16px; border: 1px solid rgba(99,102,241,0.2); }
.workers-filter-group { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 180px; }
.workers-filter-label { font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
.workers-filter-select { padding: 11px 14px; border: 1px solid #334155; border-radius: 10px; font-size: 0.95rem; background: #0f172a; color: #f1f5f9; outline: none; transition: border-color 0.3s ease, box-shadow 0.3s ease; cursor: pointer; }
.workers-filter-select:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); }
.workers-search-btn { padding: 11px 22px; background: linear-gradient(135deg, #6366f1, #ec4899); background-size: 200% 200%; color: #fff; border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease, background-position 0.4s ease; white-space: nowrap; box-shadow: 0 4px 14px rgba(99,102,241,0.35); }
.workers-search-btn:hover { transform: translateY(-2px); background-position: 100% 50%; box-shadow: 0 6px 20px rgba(236,72,153,0.45); }
.workers-clear-btn { padding: 11px 18px; background: rgba(148, 163, 184, 0.1); color: #cbd5e1; border: 1px solid #334155; border-radius: 10px; font-size: 0.95rem; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; white-space: nowrap; }
.workers-clear-btn:hover { background: rgba(148, 163, 184, 0.2); color: #f1f5f9; }
.workers-count { text-align: center; color: #94a3b8; font-size: 0.9rem; margin-bottom: 22px; }
.worker-card { background: #1e293b; border: 1px solid rgba(99, 102, 241, 0.15); border-radius: 16px; padding: 26px; margin-bottom: 18px; transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease; animation: fadeInUp 0.5s ease-out both; }
.worker-card:hover { transform: translateY(-4px); border-color: rgba(99, 102, 241, 0.5); box-shadow: 0 12px 36px rgba(99, 102, 241, 0.25); }
.worker-card:nth-child(1) { animation-delay: 0.05s; } .worker-card:nth-child(2) { animation-delay: 0.1s; } .worker-card:nth-child(3) { animation-delay: 0.15s; } .worker-card:nth-child(4) { animation-delay: 0.2s; } .worker-card:nth-child(5) { animation-delay: 0.25s; } .worker-card:nth-child(6) { animation-delay: 0.3s; }
.worker-header-row { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; }
.worker-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #ec4899); color: #fff; font-weight: 800; font-size: 1.25rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3); }
.worker-info { flex: 1; min-width: 0; }
.worker-name { font-size: 1.2rem; font-weight: 700; color: #f1f5f9; }
.worker-rate { color: #22d3ee; font-weight: 800; font-size: 1.15rem; letter-spacing: -0.5px; white-space: nowrap; }
.worker-rate-sym { font-size: 1.3rem; margin-right: 1px; }
.worker-meta { display: flex; gap: 16px; font-size: 0.9rem; color: #94a3b8; margin-bottom: 10px; flex-wrap: wrap; }
.worker-bio { color: #cbd5e1; font-size: 0.95rem; margin-bottom: 14px; line-height: 1.6; }
.worker-skills { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.skill-tag { background: rgba(99, 102, 241, 0.2); color: #a5b4fc; padding: 5px 12px; border-radius: 16px; font-size: 0.8rem; border: 1px solid rgba(99, 102, 241, 0.3); transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease; }
.skill-tag:hover { background: #6366f1; color: #fff; border-color: #6366f1; }
.worker-profile-btn { display: inline-block; background: transparent; color: #a5b4fc; border: 1px solid #6366f1; padding: 9px 20px; border-radius: 10px; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease; text-decoration: none; }
.worker-profile-btn:hover { background: #6366f1; color: #fff; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4); }
.workers-empty { text-align: center; padding: 60px 20px; color: #94a3b8; animation: fadeIn 0.4s ease; font-size: 1.05rem; }
.workers-error { text-align: center; padding: 30px; color: #ef4444; animation: shake 0.5s ease; font-size: 1.05rem; }
.workers-skeleton { display: flex; flex-direction: column; gap: 16px; }
.skel-card { background: #1e293b; border-radius: 16px; padding: 26px; border: 1px solid rgba(99,102,241,0.1); }
.skel-line { height: 13px; border-radius: 6px; background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%); background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite; margin-bottom: 10px; }
.skel-line.w40 { width: 40%; } .skel-line.w60 { width: 60%; } .skel-line.w80 { width: 80%; } .skel-line.w30 { width: 30%; }
`;

function SkeletonWorkers() {
  return (
    <div className="workers-skeleton">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skel-card">
          <div className="skel-line w60" style={{ height: 18 }} />
          <div className="skel-line w80" />
          <div className="skel-line w40" />
          <div className="skel-line w30" />
        </div>
      ))}
    </div>
  );
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Workers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [regionId, setRegionId] = useState('');
  const [commune, setCommune] = useState('');
  const navigate = useNavigate();

  const selectedRegion = CHILE_REGIONS.find((r) => r.id === parseInt(regionId));
  const communes = selectedRegion ? selectedRegion.communes : [];

  const fetchWorkers = (location) => {
    setLoading(true);
    setError('');
    const params = {};
    if (location) params.location = location;
    api.get('/workers', { params })
      .then((res) => setWorkers(res.data.workers))
      .catch(() => setError('Error al cargar trabajadoras'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchWorkers(''); }, []);

  const handleRegionChange = (e) => {
    setRegionId(e.target.value);
    setCommune('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWorkers(commune);
  };

  const handleClear = () => {
    setRegionId('');
    setCommune('');
    fetchWorkers('');
  };

  return (
    <>
      <style>{workersStyles}</style>
      <div className="page-wrap">
        <div className="workers-container">
          <div className="page-header">
            <h1 className="page-title">Trabajadoras <span className="page-title-gradient">Disponibles</span></h1>
            <p className="page-subtitle">Conoce a las mejores profesionales del hogar</p>
          </div>

          <form className="workers-filters" onSubmit={handleSearch}>
            <div className="workers-filter-group">
              <label className="workers-filter-label">Región</label>
              <select className="workers-filter-select" value={regionId} onChange={handleRegionChange}>
                <option value="">Todas las regiones</option>
                {CHILE_REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="workers-filter-group">
              <label className="workers-filter-label">Comuna</label>
              <select className="workers-filter-select" value={commune} onChange={(e) => setCommune(e.target.value)} disabled={!regionId}>
                <option value="">{regionId ? 'Todas las comunas' : 'Primero seleccione región'}</option>
                {communes.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button className="workers-search-btn" type="submit">Buscar</button>
            {(regionId || commune) && (
              <button className="workers-clear-btn" type="button" onClick={handleClear}>Limpiar</button>
            )}
          </form>

          {loading && <SkeletonWorkers />}
          {!loading && error && <div className="workers-error">{error}</div>}
          {!loading && !error && workers.length === 0 && (
            <div className="workers-empty">No hay trabajadoras disponibles{commune ? ` en ${commune}` : ''}</div>
          )}
          {!loading && !error && workers.length > 0 && (
            <>
              <div className="workers-count">{workers.length} trabajadora{workers.length !== 1 ? 's' : ''} encontrada{workers.length !== 1 ? 's' : ''}</div>
              {workers.map((w) => (
                <div key={w.id} className="worker-card">
                  <div className="worker-header-row">
                    <div className="worker-avatar">{getInitials(w.name)}</div>
                    <div className="worker-info">
                      <div className="worker-name">{w.name}</div>
                      {w.workerProfile?.hourlyRate && (
                        <div className="worker-rate"><span className="worker-rate-sym">$</span>{w.workerProfile.hourlyRate}/hr</div>
                      )}
                    </div>
                  </div>
                  {w.workerProfile?.location && (
                    <div className="worker-meta">
                      <span>📍 {w.workerProfile.location}</span>
                      {w.workerProfile?.experience && <span>💼 {w.workerProfile.experience}</span>}
                      {w.workerProfile?.availability && <span>🕐 {w.workerProfile.availability}</span>}
                    </div>
                  )}
                  {w.workerProfile?.bio && (
                    <div className="worker-bio">{w.workerProfile.bio}</div>
                  )}
                  {w.workerProfile?.skills && w.workerProfile.skills.length > 0 && (
                    <div className="worker-skills">
                      {w.workerProfile.skills.map((skill, i) => (
                        <span key={i} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  )}
                  <button className="worker-profile-btn" onClick={() => navigate(`/workers/${w.id}`)}>Ver Perfil</button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}