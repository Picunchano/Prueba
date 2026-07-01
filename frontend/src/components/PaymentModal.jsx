import { useState } from 'react';

const modalStyles = `
.pay-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); display: flex; justify-content: center; align-items: center; z-index: 300; animation: fadeIn 0.2s ease; padding: 20px; }
.pay-modal { background: #ffffff; border-radius: 16px; padding: 36px 32px; width: 100%; max-width: 450px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); animation: fadeInUp 0.3s ease-out; max-height: 90vh; overflow-y: auto; position: relative; }
.pay-close { position: absolute; top: 16px; right: 16px; width: 36px; height: 36px; border-radius: 50%; background: #f1f5f9; border: none; cursor: pointer; font-size: 1.1rem; color: #64748b; display: flex; align-items: center; justify-content: center; transition: background 0.2s ease; }
.pay-close:hover { background: #e2e8f0; color: #0f172a; }
.pay-header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.pay-lock { font-size: 1.2rem; }
.pay-title { font-size: 1.3rem; font-weight: 700; color: #0f172a; }
.pay-subtitle { font-size: 0.9rem; color: #64748b; margin-bottom: 20px; }
.pay-logo { display: inline-block; padding: 8px 18px; background: #ffffff; border: 2px solid #003087; border-radius: 8px; font-size: 1.3rem; font-weight: 800; color: #003087; letter-spacing: -0.5px; margin-bottom: 24px; }
.pay-field { margin-bottom: 16px; }
.pay-label { display: block; font-size: 0.85rem; font-weight: 600; color: #374151; margin-bottom: 6px; }
.pay-input { width: 100%; padding: 12px 14px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 1rem; background: #ffffff; color: #0f172a; box-sizing: border-box; outline: none; transition: border-color 0.3s ease, box-shadow 0.3s ease; }
.pay-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.pay-input::placeholder { color: #94a3b8; }
.pay-row { display: flex; gap: 12px; }
.pay-row .pay-field { flex: 1; }
.pay-btn { width: 100%; padding: 15px; background: linear-gradient(135deg, #6366f1, #ec4899); background-size: 200% 200%; color: #fff; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: transform 0.2s ease, background-position 0.4s ease; min-height: 50px; margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 10px; }
.pay-btn:hover { transform: translateY(-2px); background-position: 100% 50%; }
.pay-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
.pay-spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
.pay-success { text-align: center; padding: 20px 0; }
.pay-success-icon { width: 64px; height: 64px; border-radius: 50%; background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 20px; animation: bounceIn 0.5s ease-out; }
.pay-success-msg { font-size: 1.15rem; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
.pay-success-sub { font-size: 0.9rem; color: #64748b; }
.pay-note { text-align: center; font-size: 0.78rem; color: #94a3b8; margin-top: 20px; padding-top: 16px; border-top: 1px solid #f1f5f9; }
`;

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

export default function PaymentModal({ plan, onClose, onSuccess }) {
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });

  if (!plan) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'number') {
      setCardData({ ...cardData, number: formatCardNumber(value) });
    } else if (name === 'expiry') {
      setCardData({ ...cardData, expiry: formatExpiry(value) });
    } else if (name === 'cvv') {
      setCardData({ ...cardData, cvv: value.replace(/\D/g, '').slice(0, 4) });
    } else {
      setCardData({ ...cardData, [name]: value });
    }
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) return;
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPaySuccess(true);
      setTimeout(() => {
        onSuccess && onSuccess();
      }, 2000);
    }, 2500);
  };

  return (
    <>
      <style>{modalStyles}</style>
      <div className="pay-overlay" onClick={onClose}>
        <div className="pay-modal" onClick={(e) => e.stopPropagation()}>
          <button className="pay-close" onClick={onClose} aria-label="Cerrar">✕</button>

          {paySuccess ? (
            <div className="pay-success">
              <div className="pay-success-icon">✓</div>
              <div className="pay-success-msg">¡Pago exitoso!</div>
              <div className="pay-success-sub">Bienvenido al plan {plan.name}</div>
            </div>
          ) : (
            <>
              <div className="pay-header">
                <span className="pay-lock">🔒</span>
                <span className="pay-title">Pago seguro</span>
              </div>
              <div className="pay-subtitle">{plan.name} — ${plan.price.toLocaleString('es-CL')}/mes</div>
              <div className="pay-logo">Transbank</div>
              <form onSubmit={handlePay}>
                <div className="pay-field">
                  <label className="pay-label">Número de tarjeta</label>
                  <input
                    className="pay-input"
                    name="number"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={cardData.number}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="pay-field">
                  <label className="pay-label">Nombre en la tarjeta</label>
                  <input
                    className="pay-input"
                    name="name"
                    type="text"
                    placeholder="Como aparece en tu tarjeta"
                    value={cardData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="pay-row">
                  <div className="pay-field">
                    <label className="pay-label">Expiración</label>
                    <input
                      className="pay-input"
                      name="expiry"
                      type="text"
                      placeholder="MM/AA"
                      maxLength={5}
                      value={cardData.expiry}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="pay-field">
                    <label className="pay-label">CVV</label>
                    <input
                      className="pay-input"
                      name="cvv"
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      value={cardData.cvv}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <button className="pay-btn" type="submit" disabled={paying}>
                  {paying && <span className="pay-spinner" />}
                  {paying ? 'Procesando...' : `Pagar $${plan.price.toLocaleString('es-CL')}`}
                </button>
              </form>
              <div className="pay-note">
                Simulación de pago con fines demostrativos. En producción se integra con Transbank Webpay Plus.
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}