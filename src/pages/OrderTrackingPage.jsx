import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  ChefHat,
  Truck,
  PackageCheck,
  AlertCircle,
  MapPin,
  Phone,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { orderApi } from '../api';
import { useToast } from '../context/ToastContext';

const STAGES = [
  { key: 'PENDING', label: 'Order Received', desc: 'Awaiting bistro confirmation', icon: Clock },
  { key: 'CONFIRMED', label: 'Confirmed', desc: 'Order approved by kitchen', icon: CheckCircle2 },
  { key: 'PREPARING', label: 'In the Kitchen', desc: 'Chef Antoine is crafting your dish', icon: ChefHat },
  { key: 'READY', label: 'Dishes Ready', desc: 'Packed in thermal capsule', icon: PackageCheck },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Courier en route to your address', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Bon Appétit!', icon: CheckCircle2 },
];

function getStageIndex(status) {
  if (status === 'SERVED' || status === 'COMPLETED') return 5;
  const index = STAGES.findIndex((s) => s.key === status);
  return index > -1 ? index : 0;
}

export default function OrderTrackingPage() {
  const { orderNumber: urlOrderNumber } = useParams();
  const [searchInput, setSearchInput] = useState(urlOrderNumber || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const fetchOrder = async (num) => {
    if (!num) return;
    setLoading(true);
    setError('');
    try {
      const res = await orderApi.track(num.trim());
      setOrder(res.data);
    } catch (err) {
      setError(err.message || `Could not locate order "${num}".`);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlOrderNumber) {
      fetchOrder(urlOrderNumber);
    } else {
      // Default to sample order for immediate live demonstration
      fetchOrder('ORD-2026-0001');
    }
  }, [urlOrderNumber]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/track/${searchInput.trim()}`);
      fetchOrder(searchInput.trim());
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    if (!window.confirm('Are you sure you want to cancel this pending order?')) return;

    try {
      await orderApi.cancel(order.id);
      toast.success('Order cancelled successfully.');
      fetchOrder(order.orderNumber);
    } catch (err) {
      toast.error(err.message || 'Could not cancel order.');
    }
  };

  const currentStageIndex = order ? getStageIndex(order.status) : 0;
  const isCancelled = order?.status === 'CANCELLED';

  return (
    <div className="section-padding" style={{ minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
            Live Culinary Dispatch
          </span>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              fontFamily: 'var(--font-serif)',
              color: '#fff',
              marginBottom: '0.5rem',
            }}
          >
            Track Your Order
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Follow your order's real-time journey from the chef's wood-fired oven straight to your doorstep.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            style={{
              display: 'flex',
              maxWidth: '480px',
              margin: '2rem auto 0 auto',
              gap: '0.5rem',
            }}
          >
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Enter order reference (e.g. ORD-2026-0001)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px', height: '44px' }}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0 1.25rem' }}>
              Track
            </button>
          </form>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--primary)' }}>
            <RefreshCw size={32} className="pulse-subtle" style={{ margin: '0 auto 1rem auto' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Fetching real-time order status...</div>
          </div>
        )}

        {error && !loading && (
          <div
            className="glass-card"
            style={{
              padding: '2rem',
              textAlign: 'center',
              borderColor: 'rgba(239, 68, 68, 0.4)',
              background: 'rgba(239, 68, 68, 0.05)',
            }}
          >
            <AlertCircle size={36} color="#ef4444" style={{ margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Order Not Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{error}</p>
            <button
              onClick={() => {
                setSearchInput('ORD-2026-0001');
                fetchOrder('ORD-2026-0001');
              }}
              className="btn btn-outline btn-sm"
            >
              Try Demo Order "ORD-2026-0001"
            </button>
          </div>
        )}

        {/* Order Details Display */}
        {order && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Top Status Card */}
            <div
              className="glass-card"
              style={{
                padding: '2rem',
                borderTop: `4px solid ${isCancelled ? '#ef4444' : 'var(--primary)'}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  marginBottom: '1.75rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Order Number
                  </span>
                  <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#fff' }}>
                    {order.orderNumber}
                  </h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    className={`badge ${
                      isCancelled
                        ? 'badge-red'
                        : order.status === 'DELIVERED' || order.status === 'COMPLETED'
                        ? 'badge-green'
                        : 'badge-gold'
                    }`}
                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}
                  >
                    {order.status.replace(/_/g, ' ')}
                  </span>
                  <span
                    className={`badge ${order.paymentStatus === 'PAID' ? 'badge-green' : 'badge-gold'}`}
                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}
                  >
                    Payment: {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Cancelled Banner */}
              {isCancelled ? (
                <div
                  style={{
                    padding: '1.25rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    color: '#fca5a5',
                    fontSize: '0.95rem',
                  }}
                >
                  This order was cancelled. Any authorized charges will be refunded.
                </div>
              ) : (
                /* Stepper Progress Bar */
                <div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${STAGES.length}, 1fr)`,
                      gap: '0.5rem',
                      position: 'relative',
                      marginTop: '1.5rem',
                    }}
                  >
                    {STAGES.map((stage, idx) => {
                      const isDone = idx <= currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      const Icon = stage.icon;

                      return (
                        <div
                          key={stage.key}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            position: 'relative',
                          }}
                        >
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              background: isCurrent
                                ? 'linear-gradient(135deg, #facc15, #ca8a04)'
                                : isDone
                                ? 'rgba(16, 185, 129, 0.2)'
                                : 'var(--bg-surface)',
                              border: `2px solid ${
                                isCurrent
                                  ? 'var(--primary)'
                                  : isDone
                                  ? 'var(--accent-green)'
                                  : 'var(--border-subtle)'
                              }`,
                              color: isCurrent ? '#090d16' : isDone ? 'var(--accent-green)' : 'var(--text-dim)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: '0.5rem',
                              zIndex: 2,
                              transition: 'var(--transition)',
                            }}
                          >
                            <Icon size={20} strokeWidth={isCurrent ? 2.5 : 2} />
                          </div>

                          <div
                            style={{
                              fontSize: '0.82rem',
                              fontWeight: isCurrent ? '700' : '500',
                              color: isCurrent ? '#fff' : isDone ? '#cbd5e1' : 'var(--text-dim)',
                              lineHeight: 1.2,
                              marginBottom: '2px',
                            }}
                          >
                            {stage.label}
                          </div>
                          <div
                            style={{
                              fontSize: '0.72rem',
                              color: 'var(--text-dim)',
                              display: 'none',
                            }}
                            className="stage-desc"
                          >
                            {stage.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary & Customer Details */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {/* Ordered Items Receipt */}
              <div className="glass-card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', marginBottom: '1.25rem' }}>
                  Dishes Prepared
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.92rem',
                      }}
                    >
                      <div>
                        <span style={{ color: 'var(--primary)', fontWeight: '700', marginRight: '8px' }}>
                          {item.quantity}x
                        </span>
                        <span style={{ color: '#fff' }}>{item.menuItem?.name || 'Dish Item'}</span>
                      </div>
                      <span style={{ fontWeight: '600', color: '#cbd5e1' }}>
                        ${(Number(item.price) * item.quantity).toFixed(2)}
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
                    gap: '0.4rem',
                    fontSize: '0.88rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Subtotal</span>
                    <span>${Number(order.subtotal || order.totalPrice).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Delivery Fee</span>
                    <span>${Number(order.deliveryFee || 0).toFixed(2)}</span>
                  </div>
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
                    <span>Total</span>
                    <span style={{ color: 'var(--primary)' }}>${Number(order.totalPrice).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery / Destination Details */}
              <div className="glass-card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', marginBottom: '1.25rem' }}>
                  Delivery & Contact
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                      Customer Name
                    </span>
                    <div style={{ color: '#fff', fontWeight: '600' }}>{order.customerName}</div>
                  </div>

                  {order.customerPhone && (
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        Phone
                      </span>
                      <div style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={14} color="var(--primary)" /> {order.customerPhone}
                      </div>
                    </div>
                  )}

                  {order.deliveryAddress && (
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        Delivery Address
                      </span>
                      <div style={{ color: '#fff', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{order.deliveryAddress}</span>
                      </div>
                    </div>
                  )}

                  {order.deliveryInstructions && (
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        Special Instructions
                      </span>
                      <div style={{ color: '#cbd5e1', fontStyle: 'italic' }}>
                        "{order.deliveryInstructions}"
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                    {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                      <button
                        onClick={handleCancelOrder}
                        className="btn btn-danger btn-sm"
                        style={{ width: '100%' }}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 640px) {
          .stage-desc { display: block !important; }
        }
      `}</style>
    </div>
  );
}
