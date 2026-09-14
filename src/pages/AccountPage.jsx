import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  ShoppingBag,
  Heart,
  Lock,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Shield,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authApi, orderApi, favoriteApi } from '../api';
import FoodCard from '../components/FoodCard';

export default function AccountPage({ onOpenAuth }) {
  const { user, logout, updateUser, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);

  // Orders and Favorites state
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) {
      setLoadingOrders(true);
      orderApi
        .getMyOrders()
        .then((res) => {
          if (res.data) setOrders(res.data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingOrders(false));
    } else if (activeTab === 'favorites' && isAuthenticated) {
      setLoadingFavorites(true);
      favoriteApi
        .list()
        .then((res) => {
          if (res.data) setFavorites(res.data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingFavorites(false));
    }
  }, [activeTab, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center', minHeight: '60vh' }}>
        <div className="glass-card" style={{ maxWidth: '480px', margin: '0 auto', padding: '3.5rem 2rem' }}>
          <User size={48} color="var(--primary)" style={{ margin: '0 auto 1.5rem auto' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff', marginBottom: '0.5rem' }}>
            Customer Account Required
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Please sign in to view your order history, manage saved delivery addresses, and view your favorite dishes.
          </p>
          <button onClick={onOpenAuth} className="btn btn-primary">
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await authApi.updateProfile(profileData);
      updateUser(res.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    setSavingPassword(true);
    try {
      await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="section-padding" style={{ minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* User Header Profile */}
        <div
          className="glass-card"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b, #b45309)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.75rem',
                fontWeight: '800',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
              }}
            >
              {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
                {user.fullName}
              </h2>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Mail size={14} /> {user.email}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="btn btn-secondary btn-sm"
            style={{ color: '#f87171' }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '2rem',
            overflowX: 'auto',
            paddingBottom: '2px',
          }}
        >
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '0.75rem 1.25rem',
              fontWeight: '600',
              fontSize: '0.92rem',
              color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: `2px solid ${activeTab === 'profile' ? 'var(--primary)' : 'transparent'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <User size={16} /> Profile Details
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '0.75rem 1.25rem',
              fontWeight: '600',
              fontSize: '0.92rem',
              color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: `2px solid ${activeTab === 'orders' ? 'var(--primary)' : 'transparent'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShoppingBag size={16} /> Order History
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            style={{
              padding: '0.75rem 1.25rem',
              fontWeight: '600',
              fontSize: '0.92rem',
              color: activeTab === 'favorites' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: `2px solid ${activeTab === 'favorites' ? 'var(--primary)' : 'transparent'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Heart size={16} /> Saved Dishes
          </button>

          <button
            onClick={() => setActiveTab('security')}
            style={{
              padding: '0.75rem 1.25rem',
              fontWeight: '600',
              fontSize: '0.92rem',
              color: activeTab === 'security' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: `2px solid ${activeTab === 'security' ? 'var(--primary)' : 'transparent'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Lock size={16} /> Security
          </button>
        </div>

        {/* Tab 1: Profile Details */}
        {activeTab === 'profile' && (
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', marginBottom: '1.5rem' }}>
              Personal Information & Default Delivery Address
            </h3>
            <form onSubmit={handleProfileSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Default Delivery Address</label>
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  placeholder="Street, Apartment / Suite, City, Zip Code"
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
              >
                {savingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Order History */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {loadingOrders ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--primary)' }}>
                Loading your order history...
              </div>
            ) : orders.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                <ShoppingBag size={40} color="var(--text-dim)" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '0.4rem' }}>No orders found</h4>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
                  You have not placed any orders yet.
                </p>
                <Link to="/menu" className="btn btn-primary btn-sm">
                  Explore Menu & Order
                </Link>
              </div>
            ) : (
              orders.map((o) => (
                <div
                  key={o.id}
                  className="glass-card"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.25rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: '800', color: '#fff', fontSize: '1.1rem' }}>
                        {o.orderNumber}
                      </span>
                      <span className={`badge ${o.status === 'DELIVERED' ? 'badge-green' : 'badge-gold'}`}>
                        {o.status.replace(/_/g, ' ')}
                      </span>
                      <span className={`badge ${o.paymentStatus === 'PAID' ? 'badge-green' : 'badge-gold'}`}>
                        {o.paymentStatus}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Placed on {new Date(o.createdAt).toLocaleDateString()} • {o.items?.length || 0} items
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>
                        ${Number(o.totalPrice).toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                        {o.orderType}
                      </div>
                    </div>

                    <Link to={`/track/${o.orderNumber}`} className="btn btn-outline btn-sm">
                      <span>Track Order</span>
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Saved Favorites */}
        {activeTab === 'favorites' && (
          <div>
            {loadingFavorites ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--primary)' }}>
                Loading saved dishes...
              </div>
            ) : favorites.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                <Heart size={40} color="var(--text-dim)" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '0.4rem' }}>No favorites yet</h4>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
                  Click the heart icon on any dish card to save it for quick reordering.
                </p>
                <Link to="/menu" className="btn btn-primary btn-sm">
                  Browse Menu
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {favorites.map((item) => (
                  <FoodCard key={item.id} item={item} isFavoriteInitial={true} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Security */}
        {activeTab === 'security' && (
          <div className="glass-card" style={{ padding: '2rem', maxWidth: '500px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', marginBottom: '1.5rem' }}>
              Change Password
            </h3>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password (min 6 characters)</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
              >
                {savingPassword ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
