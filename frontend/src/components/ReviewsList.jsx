import { useState, useEffect } from 'react';
import api from '../api/axios';

const rlStyles = `
.rl-container { margin-top: 24px; }
.rl-title { font-size: 1.2rem; color: #1a1a2e; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e94560; display: inline-block; }
.rl-stats { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; background: #fff; padding: 16px 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.rl-avg { font-size: 2rem; font-weight: bold; color: #1a1a2e; }
.rl-stars-display { display: flex; gap: 2px; }
.rl-star { color: #ddd; font-size: 1.3rem; }
.rl-star.filled { color: #f5a623; }
.rl-count { color: #888; font-size: 0.9rem; }
.rl-card { background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 16px 20px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); animation: slideUp 0.4s ease-out both; }
.rl-card:nth-child(1) { animation-delay: 0.05s; }
.rl-card:nth-child(2) { animation-delay: 0.1s; }
.rl-card:nth-child(3) { animation-delay: 0.15s; }
.rl-card:nth-child(4) { animation-delay: 0.2s; }
.rl-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.rl-author { font-weight: bold; color: #1a1a2e; font-size: 0.95rem; }
.rl-date { color: #aaa; font-size: 0.8rem; }
.rl-comment { color: #555; font-size: 0.95rem; line-height: 1.5; }
.rl-empty { text-align: center; padding: 24px; color: #888; font-size: 0.95rem; }
.rl-loading { text-align: center; padding: 20px; color: #888; }
`;

function Stars({ rating, size = '1rem' }) {
  return (
    <div className="rl-stars-display">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`rl-star ${s <= rating ? 'filled' : ''}`} style={{ fontSize: size }}>★</span>
      ))}
    </div>
  );
}

export default function ReviewsList({ userId }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    api.get(`/reviews/user/${userId}`)
      .then((res) => {
        setReviews(res.data.reviews || []);
        setStats(res.data.stats || { averageRating: 0, totalReviews: 0 });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="rl-container"><div className="rl-loading">Cargando reseñas...</div></div>;
  if (reviews.length === 0) return <div className="rl-container"><div className="rl-title">Reseñas</div><div className="rl-empty">Aún no tiene reseñas</div></div>;

  return (
    <>
      <style>{rlStyles}</style>
      <div className="rl-container">
        <div className="rl-title">Reseñas</div>
        <div className="rl-stats">
          <div className="rl-avg">{stats.averageRating ? Number(stats.averageRating).toFixed(1) : '0.0'}</div>
          <div>
            <Stars rating={Math.round(stats.averageRating || 0)} size="1.3rem" />
            <div className="rl-count">{stats.totalReviews} reseña{stats.totalReviews !== 1 ? 's' : ''}</div>
          </div>
        </div>
        {reviews.map((r, i) => (
          <div key={r.id} className="rl-card" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="rl-card-header">
              <span className="rl-author">{r.author?.name || 'Anónimo'}</span>
              <span className="rl-date">{new Date(r.createdAt).toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
            <Stars rating={r.rating} />
            {r.comment && <div className="rl-comment">{r.comment}</div>}
          </div>
        ))}
      </div>
    </>
  );
}
