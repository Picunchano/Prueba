import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ReviewsList from '../components/ReviewsList';
import { useAuth } from '../context/AuthContext';

const wpStyles = `
.wp-container { max-width: 700px; margin: 40px auto; padding: 0 20px; animation: fadeIn 0.4s ease; }
.wp-card { background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); animation: slideUp 0.5s ease-out; }
.wp-header { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; }
.wp-avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #e94560, #c0392b); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 2rem; font-weight: bold; flex-shrink: 0; }
.wp-name { font-size: 1.6rem; font-weight: bold; color: #1a1a2e; margin-bottom: 4px; }
.wp-role { font-size: 0.9rem; color: #888; }
.wp-rate { font-size: 1.4rem; font-weight: bold; color: #e94560; margin-top: 4px; }
.wp-section { margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #eee; }
.wp-section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.wp-label { font-size: 0.8rem; font-weight: bold; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
.wp-value { color: #333; font-size: 0.95rem; line-height: 1.5; }
.wp-meta { display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 20px; }
.wp-meta-item { display: flex; align-items: center; gap: 6px; font-size: 0.9rem; color: #555; }
.wp-skills { display: flex; gap: 8px; flex-wrap: wrap; }
.wp-skill { background: #f0f0f0; color: #555; padding: 5px 12px; border-radius: 16px; font-size: 0.85rem; border: 1px solid #e0e0e0; }
.wp-msg-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: linear-gradient(135deg, #e94560, #c0392b); color: #fff; border: none; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; text-decoration: none; margin-top: 16px; }
.wp-msg-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(233, 69, 96, 0.4); }
.wp-skeleton { max-width: 700px; margin: 40px auto; padding: 0 20px; }
.skel-line { height: 14px; border-radius: 4px; background: linear-gradient(90deg, #eee 25%, #e0e0e0 50%, #eee 75%); background-size: 200px 100%; animation: skeleton 1.5s ease-in-out infinite; margin-bottom: 10px; }
.skel-line.w40 { width: 40%; } .skel-line.w60 { width: 60%; } .skel-line.w80 { width: 80%; } .skel-line.w30 { width: 30%; }
.skel-card { background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
.wp-error { text-align: center; padding: 40px; color: #c00; font-size: 1.1rem; animation: shake 0.5s ease; }
.wp-back { display: inline-block; margin-bottom: 16px; color: #e94560; text-decoration: none; font-weight: bold; font-size: 0.95rem; transition: color 0.2s ease; }
.wp-back:hover { color: #c0392b; }
`;

function SkeletonProfile() {
  return (
    <div className="wp-skeleton">
      <div className="skel-card">
        <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
          <div className="skel-line" style={{ width: 80, height: 80, borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skel-line w60" style={{ height: 22 }} />
            <div className="skel-line w40" />
            <div className="skel-line w30" />
          </div>
        </div>
        <div className="skel-line w80" />
        <div className="skel-line w60" />
        <div className="skel-line w80" />
        <div className="skel-line w40" />
      </div>
    </div>
  );
}

export default function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/workers/${id}`)
      .then((res) => setWorker(res.data.worker))
      .catch(() => setError('Trabajadora no encontrada'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <><style>{wpStyles}</style><SkeletonProfile /></>;
  if (error) return <><style>{wpStyles}</style><div className="wp-container"><a className="wp-back" onClick={() => navigate(-1)}>← Volver</a><div className="wp-error">{error}</div></div></>;
  if (!worker) return null;

  const profile = worker.workerProfile;

  return (
    <>
      <style>{wpStyles}</style>
      <div className="wp-container">
        <a className="wp-back" onClick={() => navigate(-1)}>← Volver</a>
        <div className="wp-card">
          <div className="wp-header">
            <div className="wp-avatar">{worker.name?.charAt(0).toUpperCase()}</div>
            <div>
              <div className="wp-name">{worker.name}</div>
              <div className="wp-role">Trabajadora</div>
              {profile?.hourlyRate && <div className="wp-rate">${profile.hourlyRate}/hr</div>}
            </div>
          </div>

          {profile?.bio && (
            <div className="wp-section">
              <div className="wp-label">Sobre mí</div>
              <div className="wp-value">{profile.bio}</div>
            </div>
          )}

          <div className="wp-meta">
            {profile?.location && <div className="wp-meta-item">📍 {profile.location}</div>}
            {profile?.experience && <div className="wp-meta-item">💼 {profile.experience}</div>}
            {profile?.availability && <div className="wp-meta-item">🕐 {profile.availability}</div>}
          </div>

          {profile?.skills && profile.skills.length > 0 && (
            <div className="wp-section">
              <div className="wp-label">Habilidades</div>
              <div className="wp-skills">
                {profile.skills.map((s, i) => <span key={i} className="wp-skill">{s}</span>)}
              </div>
            </div>
          )}

          {user && user.id !== worker.id && (
            <button className="wp-msg-btn" onClick={() => navigate('/messages')}>💬 Enviar Mensaje</button>
          )}
          {!user && (
            <button className="wp-msg-btn" onClick={() => navigate('/login')}>💬 Inicia sesión para contactar</button>
          )}
        </div>

        <ReviewsList userId={worker.id} />
      </div>
    </>
  );
}
