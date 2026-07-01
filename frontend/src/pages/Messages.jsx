import { useState, useEffect, useRef } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:3000';

const msgStyles = `
.msg-container { display: flex; height: calc(100vh - 65px); background: #f0f2f5; animation: fadeIn 0.3s ease; }
.msg-sidebar { width: 320px; background: #fff; border-right: 1px solid #e0e0e0; display: flex; flex-direction: column; flex-shrink: 0; }
.msg-sidebar-header { padding: 16px 20px; border-bottom: 1px solid #eee; font-size: 1.2rem; font-weight: bold; color: #1a1a2e; }
.msg-contacts { flex: 1; overflow-y: auto; }
.msg-contact { display: flex; align-items: center; gap: 12px; padding: 12px 20px; cursor: pointer; transition: background 0.2s ease; border-bottom: 1px solid #f5f5f5; }
.msg-contact:hover { background: #f8f9fa; }
.msg-contact.active { background: rgba(99,102,241,0.08); border-left: 3px solid #6366f1; }
.msg-contact-avatar { width: 44px; height: 44px; border-radius: 50%; overflow: hidden; flex-shrink: 0; position: relative; background: linear-gradient(135deg, #6366f1, #ec4899); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 1.1rem; }
.msg-contact-avatar img { width: 100%; height: 100%; object-fit: cover; }
.msg-contact-info { flex: 1; min-width: 0; }
.msg-contact-name { font-weight: bold; color: #1a1a2e; font-size: 0.95rem; margin-bottom: 2px; }
.msg-contact-last { font-size: 0.8rem; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.msg-contact-unread { background: #ec4899; color: #fff; border-radius: 50%; min-width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: bold; flex-shrink: 0; }
.msg-main { flex: 1; display: flex; flex-direction: column; }
.msg-main-header { padding: 12px 20px; background: #fff; border-bottom: 1px solid #eee; font-weight: bold; color: #1a1a2e; display: flex; align-items: center; gap: 10px; }
.msg-back-btn { display: none; align-items: center; justify-content: center; background: none; border: none; cursor: pointer; font-size: 1.3rem; color: #1a1a2e; min-height: 40px; min-width: 40px; border-radius: 8px; transition: background 0.2s ease; }
.msg-back-btn:hover { background: #f0f2f5; }
.msg-main-avatar { width: 36px; height: 36px; border-radius: 50%; overflow: hidden; flex-shrink: 0; position: relative; background: linear-gradient(135deg, #6366f1, #ec4899); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 0.9rem; }
.msg-main-avatar img { width: 100%; height: 100%; object-fit: cover; }
.msg-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 8px; }
.msg-bubble { max-width: 70%; padding: 10px 14px; border-radius: 12px; font-size: 0.95rem; line-height: 1.4; animation: slideUp 0.2s ease-out; word-break: break-word; }
.msg-bubble.sent { background: #dcf8c6; align-self: flex-end; border-bottom-right-radius: 4px; }
.msg-bubble.received { background: #fff; align-self: flex-start; border-bottom-left-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.08); }
.msg-bubble-time { font-size: 0.7rem; color: #999; margin-top: 4px; text-align: right; }
.msg-input-area { display: flex; gap: 8px; padding: 12px 20px; background: #f0f2f5; border-top: 1px solid #e0e0e0; }
.msg-input { flex: 1; padding: 10px 16px; border: 1px solid #ddd; border-radius: 20px; font-size: 0.95rem; outline: none; transition: border-color 0.2s ease; }
.msg-input:focus { border-color: #6366f1; }
.msg-send-btn { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #ec4899); color: #fff; border: none; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease, background 0.2s ease; flex-shrink: 0; }
.msg-send-btn:hover { transform: scale(1.05); }
.msg-send-btn:disabled { background: #ccc; cursor: not-allowed; transform: none; }
.msg-empty { flex: 1; display: flex; align-items: center; justify-content: center; color: #aaa; font-size: 1.1rem; flex-direction: column; gap: 8px; }
.msg-empty-icon { font-size: 3rem; }
.msg-no-sidebar { display: flex; align-items: center; justify-content: center; width: 100%; color: #aaa; font-size: 1rem; }

@media (max-width: 768px) {
  .msg-container { height: calc(100vh - 57px); flex-direction: column; }
  .msg-sidebar { width: 100%; max-width: 100%; }
  .msg-main { width: 100%; }
  .msg-back-btn { display: inline-flex; }
  .msg-sidebar { display: flex; }
  .msg-main { display: none; }
  .msg-container.show-chat .msg-sidebar { display: none; }
  .msg-container.show-chat .msg-main { display: flex; }
  .msg-messages { padding: 16px 12px; }
  .msg-input-area { padding: 10px 12px; }
  .msg-bubble { max-width: 80%; font-size: 0.9rem; }
  .msg-contact { padding: 14px 16px; min-height: 56px; }
}

@media (max-width: 480px) {
  .msg-sidebar-header { padding: 14px 16px; font-size: 1.05rem; }
  .msg-bubble { max-width: 85%; }
}
`;

function formatTime(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const time = d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 0) return time;
  if (diffDays === 1) return `Ayer ${time}`;
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' }) + ' ' + time;
}

export default function Messages() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('userId');
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const autoMessageSent = useRef(false);

  const handleSelectContact = (c) => {
    setSelectedContact(c);
    setLoadingMessages(true);
    api.get(`/messages/conversation/${c.id}`)
      .then((res) => setMessages(res.data.messages))
      .finally(() => setLoadingMessages(false));
  };

  const handleBack = () => {
    setSelectedContact(null);
    setMessages([]);
  };

  useEffect(() => {
    if (!user) return;
    api.get('/messages/contacts')
      .then((res) => setContacts(res.data.contacts))
      .finally(() => setLoadingContacts(false));
  }, [user]);

  // Auto-mensaje cuando llega desde perfil/trabajo con ?userId=
  useEffect(() => {
    if (!user || !targetUserId || autoMessageSent.current) return;
    autoMessageSent.current = true;

    const sendInitialMessage = async () => {
      try {
        await api.post('/messages', {
          receiverId: parseInt(targetUserId),
          content: 'Hola, me interesa conectar contigo en NanaConecta',
        });
        // Recargar contactos y seleccionar la conversación
        const contactsRes = await api.get('/messages/contacts');
        setContacts(contactsRes.data.contacts);
        const contact = contactsRes.data.contacts.find((c) => c.id === parseInt(targetUserId));
        if (contact) {
          handleSelectContact(contact);
        } else {
          // Si no está en contactos, crear un contacto temporal
          setSelectedContact({ id: parseInt(targetUserId), name: 'Usuario', role: '' });
          const convRes = await api.get(`/messages/conversation/${targetUserId}`);
          setMessages(convRes.data.messages);
        }
      } catch (err) {
        console.error('Auto-mensaje error:', err);
      }
    };
    sendInitialMessage();
  }, [user, targetUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (selectedContact) inputRef.current?.focus();
  }, [selectedContact]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;
    const content = newMessage.trim();
    setNewMessage('');
    try {
      const res = await api.post('/messages', { receiverId: selectedContact.id, content });
      setMessages((prev) => [...prev, res.data.message]);
      setContacts((prev) => {
        const exists = prev.find((c) => c.id === selectedContact.id);
        if (exists) {
          return prev.map((c) =>
            c.id === selectedContact.id
              ? { ...c, lastMessage: { content, createdAt: new Date().toISOString(), senderId: user.id }, unreadCount: 0 }
              : c
          );
        }
        return prev;
      });
    } catch (err) {
      alert(err.response?.data?.error || 'Error al enviar');
      setNewMessage(content);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  if (!user) return <Navigate to="/login" replace />;

  const getAvatarSrc = (c) => {
    if (!c.avatarUrl) return null;
    return c.avatarUrl.startsWith('http') ? c.avatarUrl : `${API_BASE}${c.avatarUrl}`;
  };

  return (
    <>
      <style>{msgStyles}</style>
      <div className={`msg-container${selectedContact ? ' show-chat' : ''}`}>
        <div className="msg-sidebar">
          <div className="msg-sidebar-header">Mensajes</div>
          <div className="msg-contacts">
            {loadingContacts && <div style={{ padding: 20, textAlign: 'center', color: '#888' }}>Cargando...</div>}
            {!loadingContacts && contacts.length === 0 && (
              <div style={{ padding: 20, textAlign: 'center', color: '#888' }}>No tienes conversaciones</div>
            )}
            {contacts.map((c) => {
              const avatarSrc = getAvatarSrc(c);
              return (
                <div
                  key={c.id}
                  className={`msg-contact ${selectedContact?.id === c.id ? 'active' : ''}`}
                  onClick={() => handleSelectContact(c)}
                >
                  <div className="msg-contact-avatar">
                    {avatarSrc ? (
                      <img src={avatarSrc} alt={c.name} onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : null}
                    <span style={{ display: avatarSrc ? 'none' : 'flex' }}>{c.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="msg-contact-info">
                    <div className="msg-contact-name">{c.name}</div>
                    <div className="msg-contact-last">
                      {c.lastMessage?.senderId === user.id && 'Tú: '}
                      {c.lastMessage?.content || 'Sin mensajes'}
                    </div>
                  </div>
                  {c.unreadCount > 0 && <div className="msg-contact-unread">{c.unreadCount}</div>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="msg-main">
          {selectedContact ? (
            <>
              <div className="msg-main-header">
                <button className="msg-back-btn" onClick={handleBack} aria-label="Volver">{"\u2190"}</button>
                <div className="msg-main-avatar">
                  {getAvatarSrc(selectedContact) ? (
                    <img src={getAvatarSrc(selectedContact)} alt={selectedContact.name} onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : null}
                  <span style={{ display: getAvatarSrc(selectedContact) ? 'none' : 'flex' }}>{selectedContact.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <div>{selectedContact.name}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#888' }}>{selectedContact.role === 'WORKER' ? 'Trabajadora' : 'Empleador'}</div>
                </div>
              </div>
              <div className="msg-messages">
                {loadingMessages && <div style={{ textAlign: 'center', color: '#888', padding: 20 }}>Cargando mensajes...</div>}
                {!loadingMessages && messages.length === 0 && (
                  <div className="msg-empty">
                    <div className="msg-empty-icon">💬</div>
                    <div>Inicia la conversación</div>
                  </div>
                )}
                {messages.map((m) => (
                  <div key={m.id} className={`msg-bubble ${m.senderId === user.id ? 'sent' : 'received'}`}>
                    <div>{m.content}</div>
                    <div className="msg-bubble-time">{formatTime(m.createdAt)}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form className="msg-input-area" onSubmit={handleSend}>
                <input
                  ref={inputRef}
                  className="msg-input"
                  placeholder="Escribe un mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button className="msg-send-btn" type="submit" disabled={!newMessage.trim()}>➤</button>
              </form>
            </>
          ) : (
            <div className="msg-no-sidebar">
              <div className="msg-empty">
                <div className="msg-empty-icon">💬</div>
                <div>Selecciona una conversación</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}