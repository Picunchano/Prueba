import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentModal from './PaymentModal.jsx';

const cardsStyles = `
.pc-grid { display: flex; gap: 28px; justify-content: center; flex-wrap: wrap; }
.pc-grid.col { flex-direction: column; align-items: center; }
.pc-card { background: #ffffff; border-radius: 20px; padding: 40px 32px; width: 320px; max-width: 100%; box-shadow: 0 4px 24px rgba(0,0,0,0.06); transition: transform 0.3s ease, box-shadow 0.3s ease; display: flex; flex-direction: column; animation: fadeInUp 0.5s ease-out both; position: relative; }
.pc-card:hover { transform: translateY(-8px); box-shadow: 0 16px 48px rgba(99,102,241,0.12); }
.pc-card:nth-child(1) { animation-delay: 0.1s; }
.pc-card:nth-child(2) { animation-delay: 0.2s; }
.pc-card:nth-child(3) { animation-delay: 0.3s; }
.pc-card.popular { border: 2px solid transparent; background-image: linear-gradient(#ffffff, #ffffff), linear-gradient(135deg, #6366f1, #ec4899); background-origin: border-box; background-clip: padding-box, border-box; }
.pc-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); padding: 6px 18px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
.pc-badge-free { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; }
.pc-badge-popular { background: linear-gradient(135deg, #6366f1, #ec4899); color: #fff; box-shadow: 0 4px 14px rgba(99,102,241,0.3); }
.pc-badge-premium { background: #fef3c7; color: #d97706; border: 1px solid #fde68a; }
.pc-name { font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 8px; text-align: center; }
.pc-price { text-align: center; margin-bottom: 28px; }
.pc-price-amount { font-size: 2.5rem; font-weight: 800; color: #0f172a; }
.pc-price-period { font-size: 0.9rem; color: #64748b; }
.pc-features { list-style: none; padding: 0; margin: 0 0 32px; flex: 1; }
.pc-feature { display: flex; align-items: center; gap: 10px; padding: 10px 0; font-size: 0.95rem; color: #475569; border-bottom: 1px solid #f1f5f9; }
.pc-feature:last-child { border-bottom: none; }
.pc-check { width: 22px; height: 22px; border-radius: 50%; background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800; flex-shrink: 0; }
.pc-btn { width: 100%; padding: 14px; border: none; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; min-height: 48px; }
.pc-btn:hover { transform: translateY(-2px); }
.pc-btn-free { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
.pc-btn-free:hover { background: #e2e8f0; }
.pc-btn-gradient { background: linear-gradient(135deg, #6366f1, #ec4899); background-size: 200% 200%; color: #fff; box-shadow: 0 4px 14px rgba(99,102,241,0.25); transition: transform 0.2s ease, box-shadow 0.2s ease, background-position 0.4s ease; }
.pc-btn-gradient:hover { background-position: 100% 50%; box-shadow: 0 6px 20px rgba(236,72,153,0.4); }

@media (max-width: 768px) {
  .pc-grid { flex-direction: column; align-items: center; gap: 24px; }
  .pc-card { width: 100%; max-width: 360px; padding: 32px 24px; }
}
`;

const PLANS = [
  {
    id: 'basico',
    name: 'Básico',
    price: 0,
    badge: 'Gratis',
    badgeClass: 'pc-badge-free',
    features: ['Perfil básico visible', 'Búsqueda de trabajos (3 por día)', '5 mensajes por mes'],
    btnClass: 'pc-btn-free',
    btnText: 'Continuar gratis',
  },
  {
    id: 'familiar',
    name: 'Familiar',
    price: 9990,
    badge: 'Más popular',
    badgeClass: 'pc-badge-popular',
    popular: true,
    features: ['Todo del plan básico', 'Búsqueda ilimitada', 'Mensajes ilimitados', 'Generación de contratos PDF', '2 verificaciones de antecedentes/mes', 'Soporte prioritario por chat'],
    btnClass: 'pc-btn-gradient',
    btnText: 'Elegir plan Familiar',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 14990,
    badge: 'Para familias activas',
    badgeClass: 'pc-badge-premium',
    features: ['Todo del plan Familiar', 'Verificaciones ilimitadas', 'Soporte telefónico directo', 'Reportes mensuales de actividad', 'Acceso anticipado a nuevas funciones'],
    btnClass: 'pc-btn-gradient',
    btnText: 'Elegir plan Premium',
  },
];

export { PLANS };

export default function PricingCards({ layout = 'row', onFree, onPaid, freeTextOverride }) {
  const navigate = useNavigate();
  const [modalPlan, setModalPlan] = useState(null);

  const handleClick = (plan) => {
    if (plan.price === 0) {
      if (onFree) {
        onFree();
      } else {
        navigate('/register');
      }
    } else {
      setModalPlan(plan);
    }
  };

  return (
    <>
      <style>{cardsStyles}</style>
      <div className={`pc-grid${layout === 'col' ? ' col' : ''}`}>
        {PLANS.map((plan) => (
          <div key={plan.id} className={`pc-card${plan.popular ? ' popular' : ''}`}>
            <span className={`pc-badge ${plan.badgeClass}`}>{plan.badge}</span>
            <div className="pc-name">{plan.name}</div>
            <div className="pc-price">
              <span className="pc-price-amount">{plan.price === 0 ? 'Gratis' : `$${plan.price.toLocaleString('es-CL')}`}</span>
              {plan.price > 0 && <span className="pc-price-period"> /mes</span>}
            </div>
            <ul className="pc-features">
              {plan.features.map((f, i) => (
                <li key={i} className="pc-feature">
                  <span className="pc-check">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button className={`pc-btn ${plan.btnClass}`} onClick={() => handleClick(plan)}>
              {plan.price === 0 && freeTextOverride ? freeTextOverride : plan.btnText}
            </button>
          </div>
        ))}
      </div>

      {modalPlan && (
        <PaymentModal
          plan={modalPlan}
          onClose={() => setModalPlan(null)}
          onSuccess={() => {
            setModalPlan(null);
            if (onPaid) onPaid();
            else navigate('/');
          }}
        />
      )}
    </>
  );
}