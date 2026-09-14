import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Phone,
  MapPin,
  X,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { orderApi } from '../../api';
import { useToast } from '../../context/ToastContext';

const STATUS_OPTIONS = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const toast = useToast();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await orderApi.list(params);
      if (res.data) setOrders(res.data);
    } catch {
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadOrders();
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await orderApi.update(orderId, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(res.data);
      }
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.message || 'Status update failed.');
    }
  };

  const handleUpdatePayment = async (orderId, newPaymentStatus) => {
    try {
      const res = await orderApi.update(orderId, { paymentStatus: newPaymentStatus });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(res.data);
      }
      toast.success(`Payment updated to ${newPaymentStatus}`);
    } catch (err) {
      toast.error(err.message || 'Payment update failed.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
            Orders & Kitchen Dispatch
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Monitor real-time kitchen preparation, courier assignments, and payment statuses.
          </p>
        </div>

        <button onClick={loadOrders} className="btn btn-secondary btn-sm">
          <RefreshCw size={16} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', flex: '1 1 280px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search order reference, customer, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '38px', height: '40px' }}
          />
        </form>

        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '2px' }}>
          {['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map(
            (st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', fontSize: '0.78rem' }}
              >
                {st.replace(/_/g, ' ')}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--primary)' }}>
            <RefreshCw size={28} className="pulse-subtle" style={{ margin: '0 auto 1rem auto' }} />
            <div>Loading live orders...</div>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No orders found matching filter.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem' }}>Reference</th>
                <th style={{ padding: '0.75rem' }}>Customer</th>
                <th style={{ padding: '0.75rem' }}>Amount</th>
                <th style={{ padding: '0.75rem' }}>Order Type</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Payment</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.85rem', fontWeight: '700', color: '#fff' }}>
                    {ord.orderNumber}
                  </td>
                  <td style={{ padding: '0.85rem' }}>
                    <div style={{ color: '#fff', fontWeight: '500' }}>{ord.customerName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      {ord.customerPhone || ord.customerEmail || 'Guest'}
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem', fontWeight: '800', color: 'var(--primary)' }}>
                    ${Number(ord.totalPrice).toFixed(2)}
                  </td>
                  <td style={{ padding: '0.85rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                    {ord.orderType}
                  </td>
                  <td style={{ padding: '0.85rem' }}>
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                      className="form-input"
                      style={{
                        padding: '4px 8px',
                        height: '32px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        width: 'auto',
                        borderColor: ord.status === 'DELIVERED' ? 'var(--accent-green)' : 'var(--primary)',
                      }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '0.85rem' }}>
                    <select
                      value={ord.paymentStatus}
                      onChange={(e) => handleUpdatePayment(ord.id, e.target.value)}
                      className="form-input"
                      style={{
                        padding: '4px 8px',
                        height: '32px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        width: 'auto',
                        borderColor: ord.paymentStatus === 'PAID' ? 'var(--accent-green)' : '#eab308',
                      }}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PAID">PAID</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                  </td>
                  <td style={{ padding: '0.85rem', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '6px 10px' }}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '620px', padding: '2rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Order Details
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>
                  {selectedOrder.orderNumber}
                </h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ color: 'var(--text-dim)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Status & Payment Row */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Status
                </span>
                <div style={{ fontWeight: '700', color: 'var(--primary)' }}>
                  {selectedOrder.status.replace(/_/g, ' ')}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Payment
                </span>
                <div style={{ fontWeight: '700', color: selectedOrder.paymentStatus === 'PAID' ? 'var(--accent-green)' : '#facc15' }}>
                  {selectedOrder.paymentStatus} ({selectedOrder.paymentMethod})
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Dining Mode
                </span>
                <div style={{ fontWeight: '700', color: '#fff' }}>
                  {selectedOrder.orderType}
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Customer & Destination
              </h4>
              <div style={{ color: '#fff', fontWeight: '600' }}>{selectedOrder.customerName}</div>
              {selectedOrder.customerPhone && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Phone: {selectedOrder.customerPhone}
                </div>
              )}
              {selectedOrder.deliveryAddress && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
                  Address: {selectedOrder.deliveryAddress}
                </div>
              )}
              {selectedOrder.deliveryInstructions && (
                <div style={{ color: '#fef08a', fontSize: '0.85rem', fontStyle: 'italic', marginTop: '4px' }}>
                  Notes: "{selectedOrder.deliveryInstructions}"
                </div>
              )}
            </div>

            {/* Items Breakdown */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Dishes Prepared ({selectedOrder.items?.length || 0})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedOrder.items?.map((it) => (
                  <div
                    key={it.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                    }}
                  >
                    <span>
                      <strong style={{ color: 'var(--primary)' }}>{it.quantity}x</strong>{' '}
                      {it.menuItem?.name || 'Dish Item'}
                    </span>
                    <span style={{ fontWeight: '700', color: '#fff' }}>
                      ${(Number(it.price) * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '1.25rem',
                fontWeight: '800',
                color: '#fff',
              }}
            >
              <span>Total Bill</span>
              <span style={{ color: 'var(--primary)' }}>${Number(selectedOrder.totalPrice).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
