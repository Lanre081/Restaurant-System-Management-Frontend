import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { dashboardApi, orderApi } from '../../api';
import { useToast } from '../../context/ToastContext';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadStats = async () => {
    try {
      const res = await dashboardApi.getStats();
      if (res.data) setStats(res.data);
    } catch (err) {
      toast.error('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleQuickStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderApi.update(orderId, { status: newStatus });
      toast.success(`Order advanced to ${newStatus}`);
      loadStats();
    } catch (err) {
      toast.error(err.message || 'Status transition failed.');
    }
  };

  if (loading || !stats) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--primary)' }}>
        Loading management analytics...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
          Operations Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Real-time metrics, live revenue performance, and recent dining orders.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {/* Card 1: Revenue */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total Revenue</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(234, 179, 8, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#fff' }}>
            ${Number(stats.totalRevenue).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <TrendingUp size={14} /> Active order revenue
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total Orders</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-blue)',
              }}
            >
              <ShoppingBag size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#fff' }}>
            {stats.totalOrders}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {stats.completedOrders} completed • {stats.cancelledOrders} cancelled
          </div>
        </div>

        {/* Card 3: Pending Orders */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Pending Orders</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-red)',
              }}
            >
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: stats.pendingOrders > 0 ? '#facc15' : '#fff' }}>
            {stats.pendingOrders}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Awaiting preparation or dispatch
          </div>
        </div>

        {/* Card 4: Registered Customers */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Customers</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-green)',
              }}
            >
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#fff' }}>
            {stats.totalUsers}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Registered dining accounts
          </div>
        </div>
      </div>

      {/* Row 2: Revenue Chart & Popular Dishes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* 7-Day Revenue Trend */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', marginBottom: '1.5rem' }}>
            7-Day Revenue Trend ($)
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: '180px',
              paddingTop: '20px',
              borderBottom: '1px solid var(--border-subtle)',
              gap: '0.75rem',
            }}
          >
            {stats.revenueChart?.map((day) => {
              const maxRev = Math.max(...stats.revenueChart.map((d) => d.revenue), 100);
              const heightPercent = Math.max(15, Math.round((day.revenue / maxRev) * 100));

              return (
                <div
                  key={day.date}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: '700' }}>
                    ${day.revenue}
                  </span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '36px',
                      height: `${heightPercent}%`,
                      background: 'linear-gradient(to top, #ca8a04, #facc15)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.3s ease',
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 Popular Dishes */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1.25rem' }}>
            <Flame size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff' }}>
              Top Ordered Specialties
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {stats.popularDishes?.length === 0 ? (
              <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem' }}>
                No dishes ordered yet.
              </div>
            ) : (
              stats.popularDishes.map((dish, i) => (
                <div
                  key={dish.id || i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.9rem' }}>
                      #{i + 1}
                    </span>
                    <span style={{ fontWeight: '600', color: '#fff', fontSize: '0.9rem' }}>
                      {dish.name}
                    </span>
                  </div>
                  <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                    {dish.totalOrdered} ordered
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Recent Orders Table */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
          }}
        >
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>
            Live Dispatch Orders
          </h3>
          <Link to="/admin/orders" className="btn btn-outline btn-sm">
            <span>Manage All Orders</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem' }}>Order #</th>
                <th style={{ padding: '0.75rem' }}>Customer</th>
                <th style={{ padding: '0.75rem' }}>Amount</th>
                <th style={{ padding: '0.75rem' }}>Type</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Quick Advance</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders?.map((ord) => (
                <tr key={ord.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.85rem', fontWeight: '700', color: '#fff' }}>
                    {ord.orderNumber}
                  </td>
                  <td style={{ padding: '0.85rem', color: 'var(--text-muted)' }}>
                    {ord.customerName}
                  </td>
                  <td style={{ padding: '0.85rem', fontWeight: '700', color: 'var(--primary)' }}>
                    ${Number(ord.totalPrice).toFixed(2)}
                  </td>
                  <td style={{ padding: '0.85rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{ord.orderType}</span>
                  </td>
                  <td style={{ padding: '0.85rem' }}>
                    <span
                      className={`badge ${
                        ord.status === 'DELIVERED'
                          ? 'badge-green'
                          : ord.status === 'CANCELLED'
                          ? 'badge-red'
                          : 'badge-gold'
                      }`}
                    >
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem', textAlign: 'right' }}>
                    {ord.status === 'PENDING' && (
                      <button
                        onClick={() => handleQuickStatusUpdate(ord.id, 'CONFIRMED')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      >
                        Confirm
                      </button>
                    )}
                    {ord.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleQuickStatusUpdate(ord.id, 'PREPARING')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      >
                        Kitchen Prep
                      </button>
                    )}
                    {ord.status === 'PREPARING' && (
                      <button
                        onClick={() => handleQuickStatusUpdate(ord.id, 'READY')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      >
                        Ready
                      </button>
                    )}
                    {ord.status === 'READY' && (
                      <button
                        onClick={() => handleQuickStatusUpdate(ord.id, 'OUT_FOR_DELIVERY')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      >
                        Dispatch
                      </button>
                    )}
                    {ord.status === 'OUT_FOR_DELIVERY' && (
                      <button
                        onClick={() => handleQuickStatusUpdate(ord.id, 'DELIVERED')}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      >
                        Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
