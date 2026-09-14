import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    deliveryFee,
    deliveryOption,
    setDeliveryOption,
    promoCode,
    setPromoCode,
    isDrawerOpen,
    closeDrawer,
    clearCart,
  } = useCart();
  const navigate = useNavigate();
  const toast = useToast();
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  if (!isDrawerOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (code === 'TASTY20') {
      if (subtotal < 20) {
        toast.error('Promo code TASTY20 requires a minimum subtotal of $20.');
        return;
      }
      const disc = Number(((subtotal * 20) / 100).toFixed(2));
      setAppliedPromo({ code, discount: disc });
      setPromoCode(code);
      toast.success('20% discount applied to your order!');
    } else if (code === 'WELCOME10') {
      if (subtotal < 15) {
        toast.error('Promo code WELCOME10 requires a minimum subtotal of $15.');
        return;
      }
      const disc = Number(((subtotal * 10) / 100).toFixed(2));
      setAppliedPromo({ code, discount: disc });
      setPromoCode(code);
      toast.success('10% discount applied!');
    } else {
      toast.error('Invalid promo code. Try "TASTY20".');
    }
  };

  const discountAmount = appliedPromo ? appliedPromo.discount : 0;
  const finalTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleCheckoutClick = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 8, 15, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={closeDrawer}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          background: 'var(--bg-card)',
          borderLeft: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>Your Cart</h3>
            <span
              style={{
                background: 'rgba(234, 179, 8, 0.15)',
                color: 'var(--primary)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: '700',
              }}
            >
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button
            onClick={closeDrawer}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div
          style={{
            padding: '0.75rem 1.5rem',
            background: 'rgba(234, 179, 8, 0.08)',
            borderBottom: '1px solid rgba(234, 179, 8, 0.2)',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#fef08a',
          }}
        >
          <Sparkles size={16} color="var(--primary)" />
          {subtotal >= 50 ? (
            <span>You unlocked <strong>FREE Delivery!</strong></span>
          ) : (
            <span>Add <strong>${(50 - subtotal).toFixed(2)}</strong> more for FREE delivery!</span>
          )}
        </div>

        {/* Items List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--text-dim)',
                textAlign: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShoppingBag size={32} color="#475569" />
              </div>
              <div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '4px' }}>Your cart is empty</h4>
                <p style={{ fontSize: '0.88rem' }}>Explore our menu and add something delicious!</p>
              </div>
              <button
                onClick={() => {
                  closeDrawer();
                  navigate('/menu');
                }}
                className="btn btn-outline btn-sm"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.menuItemId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.85rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}
                  alt={item.name}
                  style={{
                    width: '65px',
                    height: '65px',
                    borderRadius: 'var(--radius-sm)',
                    objectFit: 'cover',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: '700',
                      color: '#fff',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.name}
                  </h4>
                  <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: '700' }}>
                    ${item.price.toFixed(2)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(0, 0, 0, 0.4)',
                        borderRadius: 'var(--radius-full)',
                        padding: '2px',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                        style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ minWidth: '20px', textAlign: 'center', fontSize: '0.8rem', fontWeight: '700' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                        style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.menuItemId)}
                  style={{
                    color: '#94a3b8',
                    padding: '6px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {items.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              background: 'rgba(9, 13, 22, 0.95)',
            }}
          >
            {/* Promo Input */}
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Tag size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  placeholder="Promo code (e.g. TASTY20)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '32px', height: '40px', fontSize: '0.85rem' }}
                />
              </div>
              <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '0 1rem' }}>
                Apply
              </button>
            </form>

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <strong style={{ color: 'var(--accent-green)' }}>FREE</strong> : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-green)' }}>
                  <span>Discount ({appliedPromo?.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#fff',
                  fontSize: '1.15rem',
                  fontWeight: '800',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid var(--border-subtle)',
                  marginTop: '0.25rem',
                }}
              >
                <span>Estimated Total</span>
                <span style={{ color: 'var(--primary)' }}>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              onClick={handleCheckoutClick}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
