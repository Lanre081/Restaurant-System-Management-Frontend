import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Truck,
  Store,
  Utensils,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderApi, paymentApi, cartApi } from '../api';

export default function CheckoutPage() {
  const { items, subtotal, deliveryFee, promoCode, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState('DELIVERY');
  const [paymentMethod, setPaymentMethod] = useState('PAYSTACK');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customerName: user?.fullName || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    deliveryAddress: user?.address || '',
    deliveryInstructions: '',
    tableNumber: '1',
  });

  const [calculation, setCalculation] = useState({
    subtotal,
    deliveryFee,
    discount: 0,
    total: subtotal + deliveryFee,
  });

  // Calculate cart on mount or changes
  useEffect(() => {
    async function calculate() {
      if (!items || items.length === 0) return;
      try {
        const res = await cartApi.calculate({
          items: items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
          deliveryOption: orderType,
          promoCode,
        });
        if (res.data) setCalculation(res.data);
      } catch (err) {
        console.error('Calculation error:', err);
      }
    }
    calculate();
  }, [items, orderType, promoCode]);

  if (!items || items.length === 0) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center', minHeight: '60vh' }}>
        <div className="glass-card" style={{ maxWidth: '520px', margin: '0 auto', padding: '3.5rem 2rem' }}>
          <ShoppingBag size={48} color="var(--primary)" style={{ margin: '0 auto 1.5rem auto' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff', marginBottom: '0.5rem' }}>
            Your Cart is Empty
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Please add your favorite artisanal dishes to your cart before proceeding to checkout.
          </p>
          <Link to="/menu" className="btn btn-primary">
            Explore Menu
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const orderPayload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        deliveryAddress: orderType === 'DELIVERY' ? formData.deliveryAddress : null,
        deliveryInstructions: orderType === 'DELIVERY' ? formData.deliveryInstructions : null,
        orderType,
        paymentMethod,
        items: items.map((i) => ({
          menuItemId: i.menuItemId,
          quantity: i.quantity,
        })),
        promoCode,
      };

      const res = await orderApi.create(orderPayload);
      const createdOrder = res.data;

      // If Paystack was selected, simulate or verify payment immediately
      if (paymentMethod === 'PAYSTACK') {
        try {
          const payRes = await paymentApi.initialize({
            orderId: createdOrder.id,
            email: formData.customerEmail || 'customer@example.com',
            callbackUrl: `${window.location.origin}/track/${createdOrder.orderNumber}`,
          });

          if (payRes.data?.reference) {
            // Verify payment
            await paymentApi.verify(payRes.data.reference);
          }
        } catch (payErr) {
          console.error('Paystack initialization note:', payErr);
        }
      }

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/track/${createdOrder.orderNumber}`);
    } catch (err) {
      toast.error(err.message || 'Failed to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section-padding" style={{ minHeight: '85vh' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <Link
          to="/menu"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            fontSize: '0.88rem',
            marginBottom: '1.75rem',
          }}
        >
          <ArrowLeft size={16} /> Back to Menu
        </Link>

        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            fontFamily: 'var(--font-serif)',
            color: '#fff',
            marginBottom: '2rem',
          }}
        >
          Secure Dining Checkout
        </h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'flex-start',
          }}
        >
          {/* Left Column: Form Details */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Dining Mode Selection */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', marginBottom: '1rem' }}>
                1. Select Dining Option
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setOrderType('DELIVERY')}
                  style={{
                    padding: '1rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${orderType === 'DELIVERY' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    background: orderType === 'DELIVERY' ? 'rgba(234, 179, 8, 0.12)' : 'var(--bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: orderType === 'DELIVERY' ? 'var(--primary)' : 'var(--text-muted)',
                  }}
                >
                  <Truck size={22} />
                  <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('TAKEOUT')}
                  style={{
                    padding: '1rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${orderType === 'TAKEOUT' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    background: orderType === 'TAKEOUT' ? 'rgba(234, 179, 8, 0.12)' : 'var(--bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: orderType === 'TAKEOUT' ? 'var(--primary)' : 'var(--text-muted)',
                  }}
                >
                  <Store size={22} />
                  <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Pick Up</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('DINE_IN')}
                  style={{
                    padding: '1rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${orderType === 'DINE_IN' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    background: orderType === 'DINE_IN' ? 'rgba(234, 179, 8, 0.12)' : 'var(--bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: orderType === 'DINE_IN' ? 'var(--primary)' : 'var(--text-muted)',
                  }}
                >
                  <Utensils size={22} />
                  <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Dine In</span>
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', marginBottom: '1.25rem' }}>
                2. Contact Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Sophia Sterling"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="+1 (555) 019-2831"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1rem', marginBottom: 0 }}>
                <label className="form-label">Email Address (for Receipt & Order Tracking) *</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="sophia@example.com"
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Delivery Address (if applicable) */}
            {orderType === 'DELIVERY' && (
              <div className="glass-card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', marginBottom: '1.25rem' }}>
                  3. Delivery Address
                </h3>
                <div className="form-group">
                  <label className="form-label">Street Address & Apartment/Unit *</label>
                  <input
                    type="text"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    placeholder="742 Evergreen Terrace, Apt 4B"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Delivery Notes / Gate Code (Optional)</label>
                  <textarea
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleChange}
                    placeholder="e.g. Ring front doorbell, leave in thermal bag"
                    rows={2}
                    className="form-input"
                    style={{ resize: 'none' }}
                  />
                </div>
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', marginBottom: '1.25rem' }}>
                {orderType === 'DELIVERY' ? '4.' : '3.'} Payment Method
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <label
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${paymentMethod === 'PAYSTACK' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    background: paymentMethod === 'PAYSTACK' ? 'rgba(234, 179, 8, 0.12)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CreditCard size={20} color="var(--primary)" />
                      <span style={{ fontWeight: '700', color: '#fff' }}>Paystack / Card</span>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'PAYSTACK'}
                      onChange={() => setPaymentMethod('PAYSTACK')}
                    />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Instant verified gateway (Debit/Credit Card, Bank Transfer)
                  </span>
                </label>

                <label
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${paymentMethod === 'CASH_ON_DELIVERY' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    background: paymentMethod === 'CASH_ON_DELIVERY' ? 'rgba(234, 179, 8, 0.12)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Banknote size={20} color="var(--accent-green)" />
                      <span style={{ fontWeight: '700', color: '#fff' }}>Cash on Delivery</span>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'CASH_ON_DELIVERY'}
                      onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                    />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Pay in cash or card terminal upon receipt
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ padding: '1rem', width: '100%', fontSize: '1.05rem' }}
            >
              <Lock size={18} />
              <span>{submitting ? 'Confirming Order...' : `Place Order • $${Number(calculation.total).toFixed(2)}`}</span>
            </button>
          </form>

          {/* Right Column: Order Summary Review */}
          <div className="glass-card" style={{ padding: '1.75rem', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '1.25rem' }}>
              Order Summary ({items.length} items)
            </h3>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                maxHeight: '300px',
                overflowY: 'auto',
                marginBottom: '1.5rem',
                paddingRight: '4px',
              }}
            >
              {items.map((it) => (
                <div
                  key={it.menuItemId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.9rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{it.quantity}x</span>
                    <span style={{ color: '#fff' }}>{it.name}</span>
                  </div>
                  <span style={{ fontWeight: '600', color: '#cbd5e1' }}>
                    ${(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.9rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span>${Number(calculation.subtotal).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Delivery Fee</span>
                <span>
                  {calculation.deliveryFee === 0 ? (
                    <strong style={{ color: 'var(--accent-green)' }}>FREE</strong>
                  ) : (
                    `$${Number(calculation.deliveryFee).toFixed(2)}`
                  )}
                </span>
              </div>
              {calculation.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-green)' }}>
                  <span>Discount</span>
                  <span>-${Number(calculation.discount).toFixed(2)}</span>
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#fff',
                  fontSize: '1.3rem',
                  fontWeight: '800',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-subtle)',
                  marginTop: '0.5rem',
                }}
              >
                <span>Total Amount</span>
                <span style={{ color: 'var(--primary)' }}>${Number(calculation.total).toFixed(2)}</span>
              </div>
            </div>

            <div
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.03)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: 'var(--text-dim)',
              }}
            >
              <ShieldCheck size={16} color="var(--primary)" />
              <span>SSL 256-bit encrypted checkout. All items made fresh to order.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
