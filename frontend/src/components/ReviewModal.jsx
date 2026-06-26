import { useState } from 'react';
import api from '../api/axios';

const modalStyles = `
.rm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 200; animation: fadeIn 0.2s ease; }
.rm-modal { background: #fff; border-radius: 12px; padding: 32px; width: 90%; max-width: 440px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); animation: slideUp 0.3s ease-out; }
.rm-title { font-size: 1.4rem; color: #1a1a2e; margin-bottom: 20px; text-align: center; }
.rm-stars { display: flex; justify-content: center; gap: 8px; margin-bottom: 20px; }
.rm-star { font-size: 2.2rem; cursor: pointer; transition: transform 0.15s ease, color 0.15s ease; color: #ddd; user-select: none; }
.rm-star:hover { transform: scale(1.2); }
.rm-star.active { color: #f5a623; }
.rm-textarea { width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem; font-family: inherit; resize: vertical; min-height: 80px; box-sizing: border-box; outline: none; transition: border-color 0.3s ease, box-shadow 0.3s ease; }
.rm-textarea:focus { border-color: #e94560; box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.15); }
.rm-label { display: block; font-size: 0.85rem; font-weight: bold; color: #555; margin-bottom: 6px; }
.rm-field { margin-bottom: 16px; }
.rm-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; }
.rm-btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.95rem; font-weight: bold; transition: transform 0.2s ease, box-shadow 0.2s ease; }
.rm-btn:hover { transform: translateY(-1px); }
.rm-btn-primary { background: linear-gradient(135deg, #e94560, #c0392b); color: #fff; }
.rm-btn-primary:hover { box-shadow: 0 4px 12px rgba(233, 69, 96, 0.4); }
.rm-btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }
.rm-btn-cancel { background: #eee; color: #555; }
.rm-btn-cancel:hover { background: #ddd; }
.rm-error { background: #ffe0e0; color: #c00; padding: 10px; border-radius: 6px; margin-bottom: 14px; text-align: center; animation: shake 0.5s ease; }
.rm-success { background: #d4edda; color: #155724; padding: 10px; border-radius: 6px; margin-bottom: 14px; text-align: center; animation: slideDown 0.3s ease; }
.rm-hint { text-align: center; font-size: 0.8rem; color: #888; margin-top: 8px; }
`;

export default function ReviewModal({ contractId, onClose, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Selecciona una calificación'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/reviews', { contractId, rating, comment: comment.trim() || undefined });
      setSuccess(true);
      setTimeout(() => { onSubmitted(); onClose(); }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Error al enviar reseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{modalStyles}</style>
      <div className="rm-overlay" onClick={onClose}>
        <div className="rm-modal" onClick={(e) => e.stopPropagation()}>
          <h3 className="rm-title">Dejar Reseña</h3>
          {error && <div className="rm-error">{error}</div>}
          {success && <div className="rm-success">Reseña enviada correctamente</div>}
          <form onSubmit={handleSubmit}>
            <div className="rm-field">
              <label className="rm-label">Calificación</label>
              <div className="rm-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={`rm-star ${(hovered || rating) >= s ? 'active' : ''}`}
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHovered(s)}
                    onMouseLeave={() => setHovered(0)}
                  >★</span>
                ))}
              </div>
              <div className="rm-hint">{rating > 0 ? `${rating} de 5 estrellas` : 'Haz clic en una estrella'}</div>
            </div>
            <div className="rm-field">
              <label className="rm-label">Comentario (opcional)</label>
              <textarea
                className="rm-textarea"
                placeholder="Cuéntanos tu experiencia..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
              />
            </div>
            <div className="rm-actions">
              <button type="button" className="rm-btn rm-btn-cancel" onClick={onClose}>Cancelar</button>
              <button type="submit" className="rm-btn rm-btn-primary" disabled={loading || success}>
                {loading ? 'Enviando...' : success ? 'Enviado' : 'Enviar Reseña'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
