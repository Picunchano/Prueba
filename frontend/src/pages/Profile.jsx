import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:3000';

const profileStyles = `
.profile-container { max-width: 600px; margin: 40px auto; padding: 0 20px; animation: fadeIn 0.4s ease; }
.profile-title { font-size: 2rem; color: #1a1a2e; text-align: center; margin-bottom: 32px; }
.profile-card { background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); animation: slideUp 0.5s ease-out; }
.profile-section { margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
.profile-section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.profile-section-title { font-size: 1.1rem; font-weight: bold; color: #e94560; margin-bottom: 16px; }
.profile-input { width: 100%; padding: 10px; margin-bottom: 14px; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem; box-sizing: border-box; transition: border-color 0.3s ease, box-shadow 0.3s ease; outline: none; }
.profile-input:focus { border-color: #e94560; box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.15); }
.profile-input:disabled { background: #f5f5f5; cursor: not-allowed; }
.profile-label { display: block; font-size: 0.85rem; font-weight: bold; color: #555; margin-bottom: 4px; }
.profile-field { margin-bottom: 14px; }
.profile-btn { width: 100%; padding: 12px; background: linear-gradient(135deg, #e94560, #c0392b); color: #fff; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; font-weight: bold; transition: transform 0.2s ease, box-shadow 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
.profile-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(233, 69, 96, 0.4); }
.profile-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }
.profile-success { background: #d4edda; color: #155724; padding: 10px; border-radius: 6px; margin-bottom: 16px; text-align: center; animation: slideDown 0.3s ease; }
.profile-error { background: #ffe0e0; color: #c00; padding: 10px; border-radius: 6px; margin-bottom: 16px; text-align: center; animation: shake 0.5s ease; }
.spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
.avatar-section { display: flex; flex-direction: column; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
.avatar-wrapper { position: relative; width: 80px; height: 80px; border-radius: 50%; overflow: hidden; }
.avatar-circle { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #f1f5f9; box-shadow: 0 4px 14px rgba(0,0,0,0.1); }
.avatar-initials { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #ec4899); color: #fff; font-size: 2rem; font-weight: 700; display: flex; align-items: center; justify-content: center; border: 3px solid transparent; }
.avatar-change-btn { padding: 8px 20px; background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
.avatar-change-btn:hover { background: #e2e8f0; color: #0f172a; }
.avatar-change-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.avatar-uploading { width: 20px; height: 20px; border: 2px solid rgba(99,102,241,0.3); border-top-color: #6366f1; border-radius: 50%; animation: spin 0.6s linear infinite; }
.profile-skeleton { max-width: 600px; margin: 40px auto; padding: 0 20px; }
.skel-line { height: 14px; border-radius: 4px; background: linear-gradient(90deg, #eee 25%, #e0e0e0 50%, #eee 75%); background-size: 200px 100%; animation: skeleton 1.5s ease-in-out infinite; margin-bottom: 12px; }
.skel-line.h28 { height: 28px; width: 40%; margin: 0 auto 24px; }
.skel-card { background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
.skel-line.w100 { width: 100%; }
.skel-line.w60 { width: 60%; }
.skel-line.w80 { width: 80%; }

@media (max-width: 768px) {
  .profile-container { max-width: 100%; padding: 20px 1rem; margin: 20px auto; }
  .profile-title { font-size: 1.4rem; margin-bottom: 20px; }
  .profile-card { padding: 20px 16px; border-radius: 10px; }
  .profile-section { margin-bottom: 18px; padding-bottom: 14px; }
  .profile-section-title { font-size: 1rem; margin-bottom: 12px; }
  .profile-input { padding: 12px 10px; font-size: 0.95rem; }
  .profile-btn { padding: 14px; min-height: 48px; font-size: 1rem; }
  .profile-skeleton { max-width: 100%; padding: 20px 1rem; }
  .skel-card { padding: 20px 16px; }
}

@media (max-width: 480px) {
  .profile-container { padding: 16px 1rem; margin: 16px auto; }
  .profile-title { font-size: 1.2rem; }
  .profile-card { padding: 16px 12px; }
  .profile-section-title { font-size: 0.95rem; }
  .profile-input { padding: 11px 8px; font-size: 0.9rem; }
  .profile-label { font-size: 0.8rem; }
}
`;

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function SkeletonProfile() {
  return (
    <div className="profile-skeleton">
      <div className="skel-line h28" />
      <div className="skel-card">
        <div className="skel-line w80" style={{ height: 18 }} />
        <div className="skel-line w100" />
        <div className="skel-line w100" />
        <div className="skel-line w60" />
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, token, updateAvatar } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', phone: '' });
  const [workerForm, setWorkerForm] = useState({ bio: '', hourlyRate: '', location: '', availability: '', skills: '' });
  const [employerForm, setEmployerForm] = useState({ bio: '', familyName: '', address: '' });
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    api.get('/auth/me')
      .then((res) => {
        const u = res.data.user;
        setForm({ name: u.name || '', phone: u.phone || '' });
        const url = u.avatarUrl ? (u.avatarUrl.startsWith('http') ? u.avatarUrl : `${API_BASE}${u.avatarUrl}`) : null;
        setAvatarUrl(url);
        if (u.role === 'WORKER' && u.workerProfile) {
          setWorkerForm({
            bio: u.workerProfile.bio || '',
            hourlyRate: u.workerProfile.hourlyRate || '',
            location: u.workerProfile.location || '',
            availability: u.workerProfile.availability || '',
            skills: (u.workerProfile.skills || []).join(', '),
          });
        }
        if (u.role === 'EMPLOYER' && u.employerProfile) {
          setEmployerForm({
            bio: u.employerProfile.bio || '',
            familyName: u.employerProfile.familyName || '',
            address: u.employerProfile.address || '',
          });
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (!user) return <Navigate to="/login" replace />;
  if (loading) return <><style>{profileStyles}</style><SkeletonProfile /></>;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleWorkerChange = (e) => setWorkerForm({ ...workerForm, [e.target.name]: e.target.value });
  const handleEmployerChange = (e) => setEmployerForm({ ...employerForm, [e.target.name]: e.target.value });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setUploadingAvatar(true);
    setAvatarError('');

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const fullUrl = `${API_BASE}${res.data.avatarUrl}`;
      setAvatarUrl(fullUrl);
      setAvatarPreview(null);
      updateAvatar(fullUrl);
      setSuccess('Foto actualizada');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setAvatarError(err.response?.data?.error || 'Error al subir foto');
      setAvatarPreview(null);
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      await api.put('/users/profile', form);
      if (user.role === 'WORKER') {
        const payload = {
          ...workerForm,
          hourlyRate: workerForm.hourlyRate ? parseFloat(workerForm.hourlyRate) : null,
          skills: workerForm.skills ? workerForm.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        };
        await api.put('/users/profile/worker', payload);
      }
      if (user.role === 'EMPLOYER') {
        await api.put('/users/profile/employer', employerForm);
      }
      setSuccess('Perfil actualizado correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const displayAvatar = avatarPreview || avatarUrl;

  return (
    <>
      <style>{profileStyles}</style>
      <div className="profile-container">
        <h1 className="profile-title">Mi Perfil</h1>
        <div className="profile-card">
          {success && <div className="profile-success">{success}</div>}
          {error && <div className="profile-error">{error}</div>}
          {avatarError && <div className="profile-error">{avatarError}</div>}

          <div className="avatar-section">
            <div className="avatar-wrapper">
              {displayAvatar ? (
                <img className="avatar-circle" src={displayAvatar} alt="Avatar" />
              ) : (
                <div className="avatar-initials">{getInitials(user.name)}</div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
            <button
              className="avatar-change-btn"
              type="button"
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
            >
              {uploadingAvatar ? <span className="avatar-uploading" /> : 'Cambiar foto'}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="profile-section">
              <div className="profile-section-title">Datos Personales</div>
              <div className="profile-field">
                <label className="profile-label">Nombre</label>
                <input className="profile-input" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="profile-field">
                <label className="profile-label">Email</label>
                <input className="profile-input" value={user.email} disabled />
              </div>
              <div className="profile-field">
                <label className="profile-label">Teléfono</label>
                <input className="profile-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+56912345678" required />
              </div>
              <div className="profile-field">
                <label className="profile-label">Rol</label>
                <input className="profile-input" value={user.role === 'WORKER' ? 'Trabajadora' : 'Empleador'} disabled />
              </div>
            </div>

            {user.role === 'WORKER' && (
              <div className="profile-section">
                <div className="profile-section-title">Perfil de Trabajadora</div>
                <div className="profile-field">
                  <label className="profile-label">Biografía</label>
                  <input className="profile-input" name="bio" value={workerForm.bio} onChange={handleWorkerChange} placeholder="Cuéntanos sobre ti..." />
                </div>
                <div className="profile-field">
                  <label className="profile-label">Tarifa por hora ($)</label>
                  <input className="profile-input" name="hourlyRate" type="number" step="0.01" min="0" value={workerForm.hourlyRate} onChange={handleWorkerChange} placeholder="Ej: 5000" />
                </div>
                <div className="profile-field">
                  <label className="profile-label">Ubicación</label>
                  <input className="profile-input" name="location" value={workerForm.location} onChange={handleWorkerChange} placeholder="Ej: Santiago, Providencia" />
                </div>
                <div className="profile-field">
                  <label className="profile-label">Disponibilidad</label>
                  <input className="profile-input" name="availability" value={workerForm.availability} onChange={handleWorkerChange} placeholder="Ej: Lun-Vie 8am-6pm" />
                </div>
                <div className="profile-field">
                  <label className="profile-label">Habilidades (separadas por coma)</label>
                  <input className="profile-input" name="skills" value={workerForm.skills} onChange={handleWorkerChange} placeholder="Ej: Limpieza, Cocina, Cuidado de niños" />
                </div>
              </div>
            )}

            {user.role === 'EMPLOYER' && (
              <div className="profile-section">
                <div className="profile-section-title">Perfil de Empleador</div>
                <div className="profile-field">
                  <label className="profile-label">Biografía</label>
                  <input className="profile-input" name="bio" value={employerForm.bio} onChange={handleEmployerChange} placeholder="Cuéntanos sobre tu familia..." />
                </div>
                <div className="profile-field">
                  <label className="profile-label">Nombre de la familia</label>
                  <input className="profile-input" name="familyName" value={employerForm.familyName} onChange={handleEmployerChange} placeholder="Ej: Familia García" />
                </div>
                <div className="profile-field">
                  <label className="profile-label">Dirección</label>
                  <input className="profile-input" name="address" value={employerForm.address} onChange={handleEmployerChange} placeholder="Ej: Av. Libertador 1234" />
                </div>
              </div>
            )}

            <button className="profile-btn" type="submit" disabled={saving}>
              {saving && <span className="spinner" />}
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}