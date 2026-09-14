import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin, RefreshCw, ShoppingBag, DollarSign } from 'lucide-react';
import { dashboardApi } from '../../api';
import { useToast } from '../../context/ToastContext';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await dashboardApi.getCustomers();
      if (res.data) setCustomers(res.data);
    } catch {
      toast.error('Failed to load customers list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div style={{ maxWidth: '1200px' }}>
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
            Registered Customers
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Customer dining profiles, total order frequency, and cumulative spend.
          </p>
        </div>

        <button onClick={loadCustomers} className="btn btn-secondary btn-sm">
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--primary)' }}>
            <RefreshCw size={28} className="pulse-subtle" style={{ margin: '0 auto 1rem auto' }} />
            <div>Loading customers...</div>
          </div>
        ) : customers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No registered customers found.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem' }}>Customer</th>
                <th style={{ padding: '0.75rem' }}>Contact</th>
                <th style={{ padding: '0.75rem' }}>Delivery Address</th>
                <th style={{ padding: '0.75rem' }}>Total Orders</th>
                <th style={{ padding: '0.75rem' }}>Cumulative Spend</th>
                <th style={{ padding: '0.75rem' }}>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr key={cust.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #f59e0b, #b45309)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: '0.85rem',
                        }}
                      >
                        {cust.fullName ? cust.fullName[0].toUpperCase() : 'C'}
                      </div>
                      <span style={{ fontWeight: '700', color: '#fff' }}>{cust.fullName}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem' }}>
                    <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={13} /> {cust.email}
                    </div>
                    {cust.phone && (
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Phone size={13} /> {cust.phone}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '0.85rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {cust.address || '—'}
                  </td>
                  <td style={{ padding: '0.85rem', fontWeight: '700', color: '#fff' }}>
                    {cust.orderCount}
                  </td>
                  <td style={{ padding: '0.85rem', fontWeight: '800', color: 'var(--primary)' }}>
                    ${Number(cust.totalSpent).toFixed(2)}
                  </td>
                  <td style={{ padding: '0.85rem', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
                    {new Date(cust.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
