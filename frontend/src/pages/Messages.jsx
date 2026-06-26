import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const msgStyles = `
.msg-container { display: flex; height: calc(100vh - 65px); background: #f0f2f5; animation: fadeIn 0.3s ease; }
.msg-sidebar { width: 320px; background: #fff; border-right: 1px solid #e0e0e0; display: flex; flex-direction: column; flex-shrink: 0; }
.msg-sidebar-header { padding: 16px 20px; border-bottom: 1px solid #eee; font-size: 1.2rem; font-weight: bold; color: #1a1a2e; }
.msg-contacts { flex: 1; overflow-y: auto; }
.msg-contact { display: flex; align-items: center; gap: 12px; padding: 12px 20px; cursor: pointer; transition: background 0.2s ease; border-bottom: 1px solid #f5f5f5; }
.msg-contact:hover { background: #f8f9fa; }
.msg-contact.active { background: #e9456010; border-left: 3px solid #e94560; }
.msg-contact-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #e94560, #c0392b); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 1.1rem; flex-shrink: 0; }
.msg-contact-info { flex: 1; min-width: 0; }
.msg-contact-name { font-weight: bold; color: #1a1a2e; font-size: 0.95rem; margin-bottom: 2px; }
.msg-contact-last { font-size: 0.8rem; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.msg-contact-unread { background: #e94560; color: #fff; border-radius: 50%; min-width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: bold; flex-shrink: 0; }
.msg-main { flex: 1; display: flex; flex-direction: column; }
.msg-main-header { padding: 12px 20px; background: #fff; border-bottom: 1px solid #eee; font-weight: bold; color: #1a1a2e; display: flex; align-items: center; gap: 10px; }
.msg-main-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #e94560, #c0392b); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 0.9rem; }
.msg-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 8px; }
.msg-bubble { max-width: 70%; padding: 10px 14px; border-radius: 12px; font-size: 0.95rem; line-height: 1.4; animation: slideUp 0.2s ease-out; word-break: break-word; }
.msg-bubble.sent { background: #dcf8c6; align-self: flex-end; border-bottom-right-radius: 4px; }
.msg-bubble.received { background: #fff; align-self: flex-start; border-bottom-left-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.08); }
.msg-bubble-time { font-size: 0.7rem; color: #999; margin-top: 4px; text-align: right; }
.msg-input-area { display: flex; gap: 8px; padding: 12px 20px; background: #f0f2f5; border-top: 1px solid #e0e0e0; }
.msg-input { flex: 1; padding: 10px 16px; border: 1px solid #ddd; border-radius: 20px; font-size: 0.95rem; outline: none; transition: border-color 0.2s ease; }
.msg-input:focus { border-color: #e94560; }
.msg-send-btn { width: 42px; height: 42px; border-radius: 50%; background: #e94560; color: #fff; border: none; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease, background 0.2s ease; flex-shrink: 0; }
.msg-send-btn:hover { background: #c0392b; transform: scale(1.05); }
.msg-send-btn:disabled { background: #ccc; cursor: not-allowed; transform: none; }
.msg-empty { flex: 1; display: flex; align-items: center; justify-content: center; color: #aaa; font-size: 1.1rem; flex-direction: column; gap: 8px; }
.msg-empty-icon { font-size: 3rem; }
.msg-no-sidebar { display: flex; align-items: center; justify-content: center; width: 100%; color: #aaa; font-size: 1rem; }
.msg-typing { font-size: 0.8rem; color: #888; font-style: italic; padding: 0 20px 8px; }
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
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    api.get('/messages/contacts')
      .then((res) => setContacts(res.data.contacts))
      .finally(() => setLoadingContacts(false));
  }, [user]);

  useEffect(() => {
    if (!selectedContact) return;
    setLoadingMessages(true);
    api.get(`/messages/conversation/${selectedContact.id}`)
      .then((res) => setMessages(res.data.messages))
      .finally(() => setLoadingMessages(false));
  }, [selectedContact]);

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
      setContacts((prev) =>
        prev.map((c) =>
          c.id === selectedContact.id
            ? { ...c, lastMessage: { content, createdAt: new Date().toISOString(), senderId: user.id }, unreadCount: 0 }
            : c
        )
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Error al enviar');
      setNewMessage(content);
    }
  };

  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <style>{msgStyles}</style>
      <div className="msg-container">
        <div className="msg-sidebar">
          <div className="msg-sidebar-header">Mensajes</div>
          <div className="msg-contacts">
            {loadingContacts && <div style={{ padding: 20, textAlign: 'center', color: '#888' }}>Cargando...</div>}
            {!loadingContacts && contacts.length === 0 && (
              <div style={{ padding: 20, textAlign: 'center', color: '#888' }}>No tienes conversaciones</div>
            )}
            {contacts.map((c) => (
              <div
                key={c.id}
                className={`msg-contact ${selectedContact?.id === c.id ? 'active' : ''}`}
                onClick={() => setSelectedContact(c)}
              >
                <div className="msg-contact-avatar">{c.name?.charAt(0).toUpperCase()}</div>
                <div className="msg-contact-info">
                  <div className="msg-contact-name">{c.name}</div>
                  <div className="msg-contact-last">
                    {c.lastMessage?.senderId === user.id && 'Tú: '}
                    {c.lastMessage?.content || 'Sin mensajes'}
                  </div>
                </div>
                {c.unreadCount > 0 && <div className="msg-contact-unread">{c.unreadCount}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="msg-main">
          {selectedContact ? (
            <>
              <div className="msg-main-header">
                <div className="msg-main-avatar">{selectedContact.name?.charAt(0).toUpperCase()}</div>
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
