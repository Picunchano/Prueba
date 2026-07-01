import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const pricingStyles = `
.pricing-wrap { background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 50%, #fdf2f8 100%); min-height: calc(100vh - 64px); padding: 60px 20px 80px; }
.pricing-container { max-width: 1100px; margin: 0 auto; animation: fadeIn 0.5s ease; }
.pricing-header { text-align: center; margin-bottom: 48px; animation: fadeInUp 0.5s ease-out; }
.pricing-title { font-size: 2.5rem; font-weight: 800; color: #0f172a; margin-bottom: 12px; letter-spacing: -0.5px; }
.pricing-title-gradient { background: linear-gradient(135deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.pricing-subtitle { color: #64748b; font-size: 1.1rem; }
.pricing-grid { display: flex; gap: 28px; justify-content: center; flex-wrap: wrap; }
.plan-card { background: #ffffff; border-radius: 20px; padding: 40px 32px; width: 320px; max-width: 100%; box-shadow: 0 4px 24px rgba(0,0,0,0.06); transition: transform 0.3s ease, box-shadow 0.3s ease; display: flex; flex-direction: column; animation: fadeInUp 0.5s ease-out both; position: relative; }
.plan-card:hover { transform: translateY(-8px); box-shadow: 0 16px 48px rgba(99,102,241,0.12); }
.plan-card:nth-child(1) { animation-delay: 0.1s; }
.plan-card:nth-child(2) { animation-delay: 0.2s; }
.plan-card:nth-child(3) { animation-delay: 0.3s; }
.plan-card.popular { border: 2px solid transparent; background-image: linear-gradient(#ffffff, #ffffff), linear-gradient(135deg, #6366f1, #ec4899); background-origin: border-box; background-clip: padding-box, border-box; }
.plan-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); padding: 6px 18px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
.plan-badge-free { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }
.plan-badge-popular { background: linear-gradient(135deg, #6366f1, #ec4899); color: #fff; box-shadow: 0 4px 14px rgba(99,102,241,0.3); }
.plan-badge-premium { background: #fef3c7; color: #d97706; border: 1px solid #fde68a; }
.plan-name { font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 8px; text-align: center; }
.plan-price { text-align: center; margin-bottom: 28px; }
.plan-price-amount { font-size: 2.5rem; font-weight: 800; color: #0f172a; }
.plan-price-period { font-size: 0.9rem; color: #64748b; }
.plan-features { list-style: none; padding: 0; margin: 0 0 32px; flex: 1; }
.plan-feature { display: flex; align-items: center; gap: 10px; padding: 10px 0; font-size: 0.95rem; color: #475569; border-bottom: 1px solid #f1f5f9; }
.plan-feature:last-child { border-bottom: none; }
.plan-check { width: 22px; height: 22px; border-radius: 50%; background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800; flex-shrink: 0; }
.plan-btn { width: 100%; padding: 14px; border: none; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; min-height: 48px; }
.plan-btn:hover { transform: translateY(-2px); }
.plan-btn-free { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
.plan-btn-free:hover { background: #e2e8f0; }
.plan-btn-gradient { background: linear-gradient(135deg, #6366f1, #ec4899); background-size: 200% 200%; color: #fff; box-shadow: 0 4px 14px rgba(99,102,241,0.25); transition: transform 0.2s ease, box-shadow 0.2s ease, background-position 0.4s ease; }
.plan-btn-gradient:hover { background-position: 100% 50%; box-shadow: 0 6px 20px rgba(236,72,153,0.4); }

/* Modal de pago */
.pay-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); display: flex; justify-content: center; align-items: center; z-index: 300; animation: fadeIn 0.2s ease; padding: 20px; }
.pay-modal { background: #ffffff; border-radius: 20px; padding: 36px 32px; width: 100%; max-width: 440px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); animation: fadeInUp 0.3s ease-out; max-height: 90vh; overflow-y: auto; position: relative; }
.pay-close { position: absolute; top: 16px; right: 16px; width: 36px; height: 36px; border-radius: 50%; background: #f1f5f9; border: none; cursor: pointer; font-size: 1.1rem; color: #64748b; display: flex; align-items: center; justify-content: center; transition: background 0.2s ease; }
.pay-close:hover { background: #e2e8f0; color: #0f172a; }
.pay-logo { text-align: center; margin-bottom: 24px; }
.pay-logo-text { font-size: 1.6rem; font-weight: 800; color: #0066cc; letter-spacing: -0.5px; }
.pay-logo-sub { font-size: 0.75rem; color: #64748b; margin-top: 4px; }
.pay-title { font-size: 1.3rem; font-weight: 700; color: #0f172a; text-align: center; margin-bottom: 24px; }
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
.pay-success-msg { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
.pay-success-sub { font-size: 0.9rem; color: #64748b; }
.pay-note { text-align: center; font-size: 0.78rem; color: #94a3b8; margin-top: 20px; padding-top: 16px; border-top: 1px solid #f1f5f9; }

@media (max-width: 768px) {
  .pricing-wrap { padding: 40px 1rem 60px; }
  .pricing-title { font-size: 1.8rem; }
  .pricing-subtitle { font-size: 1rem; }
  .pricing-grid { flex-direction: column; align-items: center; gap: 24px; }
  .plan-card { width: 100%; max-width: 360px; padding: 32px 24px; }
}

@media (max-width: 480px) {
  .pricing-title { font-size: 1.5rem; }
  .plan-card { padding: 28px 20px; }
  .plan-price-amount { font-size: 2rem; }
  .pay-modal { padding: 28px 20px; }
}
`;

export default function Pricing() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });

  const plans = [
    {
      id: 'basico',
      name: 'Básico',
      price: 0,
      badge: 'Gratis',
      badgeClass: 'plan-badge-free',
      features: ['Perfil básico', 'Búsqueda limitada (3 resultados)', '5 mensajes por mes'],
      btnClass: 'plan-btn-free',
      btnText: 'Comenzar gratis',
      action: () => navigate('/register'),
    },
    {
      id: 'familiar',
      name: 'Familiar',
      price: 9990,
      badge: 'Más popular',
      badgeClass: 'plan-badge-popular',
      popular: true,
      features: ['Búsqueda ilimitada', 'Mensajes ilimitados', 'Generación de contratos', '2 verificaciones/mes', 'Soporte prioritario'],
      btnClass: 'plan-btn-gradient',
      btnText: 'Suscribirse',
      action: () => openModal('familiar'),
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 14990,
      badge: 'Para familias activas',
      badgeClass: 'plan-badge-premium',
      features: ['Todo del plan Familiar', 'Verificaciones ilimitadas', 'Soporte telefónico', 'Reportes mensuales'],
      btnClass: 'plan-btn-gradient',
      btnText: 'Suscribirse',
      action: () => openModal('premium'),
    },
  ];

  const openModal = (planId) => {
    const plan = plans.find((p) => p.id === planId);
    setSelectedPlan(plan);
    setPaySuccess(false);
    setCardData({ number: '', name: '', expiry: '', cvv: '' });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setPaySuccess(false);
    setPaying(false);
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const handleCardChange = (e) => {
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
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPaySuccess(true);
    }, 2000);
  };

  return (
    <>
      <style>{pricingStyles}</style>
      <div className="pricing-wrap">
        <div className="pricing-container">
          <div className="pricing-header">
            <h1 className="pricing-title">Planes y <span className="pricing-title-gradient">Precios</span></h1>
            <p className="pricing-subtitle">Elige el plan que mejor se adapte a tus necesidades</p>
          </div>

          <div className="pricing-grid">
            {plans.map((plan) => (
              <div key={plan.id} className={`plan-card${plan.popular ? ' popular' : ''}`}>
                <span className={`plan-badge ${plan.badgeClass}`}>{plan.badge}</span>
                <div className="plan-name">{plan.name}</div>
                <div className="plan-price">
                  <span className="plan-price-amount">{plan.price === 0 ? 'Gratis' : `$${plan.price.toLocaleString('es-CL')}`}</span>
                  {plan.price > 0 && <span className="plan-price-period"> /mes</span>}
                </div>
                <ul className="plan-features">
                  {plan.features.map((f, i) => (
                    <li key={i} className="plan-feature">
                      <span className="plan-check">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button className={`plan-btn ${plan.btnClass}`} onClick={plan.action}>
                  {plan.btnText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de pago Transbank */}
      {modalOpen && selectedPlan && (
        <div className="pay-overlay" onClick={closeModal}>
          <div className="pay-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pay-close" onClick={closeModal} aria-label="Cerrar">✕</button>

            {paySuccess ? (
              <div className="pay-success">
                <div className="pay-success-icon">✓</div>
                <div className="pay-success-msg">¡Suscripción activada!</div>
                <div className="pay-success-sub">Bienvenido al plan {selectedPlan.name}</div>
              </div>
            ) : (
              <>
                <div className="pay-logo">
                  <div className="pay-logo-text">Transbank</div>
                  <div className="pay-logo-sub">Webpay</div>
                </div>
                <div className="pay-title">Pago seguro con Transbank</div>
                <form onSubmit={handlePay}>
                  <div className="pay-field">
                    <label className="pay-label">Número de tarjeta</label>
                    <input
                      className="pay-input"
                      name="number"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.number}
                      onChange={handleCardChange}
                      required
                    />
                  </div>
                  <div className="pay-field">
                    <label className="pay-label">Nombre en la tarjeta</label>
                    <input
                      className="pay-input"
                      name="name"
                      type="text"
                      placeholder="JUAN PEREZ"
                      value={cardData.name}
                      onChange={handleCardChange}
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
                        value={cardData.expiry}
                        onChange={handleCardChange}
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
                        value={cardData.cvv}
                        onChange={handleCardChange}
                        required
                      />
                    </div>
                  </div>
                  <button className="pay-btn" type="submit" disabled={paying}>
                    {paying && <span className="pay-spinner" />}
                    {paying ? 'Procesando...' : `Pagar $${selectedPlan.price.toLocaleString('es-CL')}`}
                  </button>
                </form>
                <div className="pay-note">
                  Pago simulado con fines demostrativos. En producción se integraría con Transbank Webpay.
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}