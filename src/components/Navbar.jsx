import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Shield,
  Menu,
  X,
  Compass,
  UtensilsCrossed,
  Clock,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ onOpenAuth }) {
  const { user, logout, isAdmin, isStaff } = useAuth();
  const { cartCount, openDrawer } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #facc15 0%, #ca8a04 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#090d16',
              boxShadow: '0 4px 15px rgba(234, 179, 8, 0.3)',
            }}
          >
            <UtensilsCrossed size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                fontWeight: '700',
                letterSpacing: '0.02em',
                lineHeight: 1.1,
              }}
            >
              L'AURA
            </div>
            <div
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.2em',
                color: 'var(--primary)',
                fontWeight: '600',
                textTransform: 'uppercase',
              }}
            >
              Artisan Bistro
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '2rem',
          }}
          className="desktop-nav"
        >
          <Link to="/" style={{ fontWeight: '500', fontSize: '0.95rem' }} className="nav-link">
            Home
          </Link>
          <Link to="/menu" style={{ fontWeight: '500', fontSize: '0.95rem' }} className="nav-link">
            Culinary Menu
          </Link>
          <Link to="/track" style={{ fontWeight: '500', fontSize: '0.95rem' }} className="nav-link">
            Track Order
          </Link>
          {isStaff && (
            <Link
              to="/admin"
              className="badge badge-gold"
              style={{ textDecoration: 'none', padding: '0.4rem 0.8rem' }}
            >
              <Shield size={14} /> Staff Portal
            </Link>
          )}
        </nav>

        {/* Actions (Favorites, Cart, Auth) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Favorites Link */}
          <Link
            to="/account"
            className="btn btn-secondary btn-sm"
            style={{
              width: '40px',
              height: '40px',
              padding: 0,
              borderRadius: '50%',
              display: 'flex',
            }}
            title="My Saved Dishes"
          >
            <Heart size={18} />
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={openDrawer}
            className="btn btn-primary btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              position: 'relative',
              borderRadius: 'var(--radius-full)',
              padding: '0.5rem 1rem',
            }}
          >
            <ShoppingBag size={18} />
            <span style={{ fontWeight: '700' }}>Cart</span>
            {cartCount > 0 && (
              <span
                style={{
                  background: '#090d16',
                  color: '#facc15',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  marginLeft: '2px',
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile / Login */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen((v) => !v)}
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f59e0b, #b45309)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                  }}
                >
                  {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <span
                  style={{
                    maxWidth: '100px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.fullName.split(' ')[0]}
                </span>
                <ChevronDown size={14} />
              </button>

              {userDropdownOpen && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '120%',
                    width: '200px',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 100,
                  }}
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                    <div style={{ marginTop: '4px' }}>
                      <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/account"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.88rem',
                    }}
                    className="dropdown-item"
                  >
                    <User size={16} /> My Account
                  </Link>

                  {isStaff && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.88rem',
                        color: 'var(--primary)',
                      }}
                      className="dropdown-item"
                    >
                      <Shield size={16} /> Admin Portal
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                      navigate('/');
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.88rem',
                      color: '#f87171',
                      textAlign: 'left',
                    }}
                    className="dropdown-item"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn btn-secondary btn-sm"
              style={{
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <User size={16} />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="mobile-toggle"
            style={{
              display: 'flex',
              padding: '0.5rem',
              color: 'var(--text-main)',
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--bg-card)',
            borderTop: '1px solid var(--border-subtle)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: '500' }}
          >
            Home
          </Link>
          <Link
            to="/menu"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: '500' }}
          >
            Culinary Menu
          </Link>
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: '500' }}
          >
            Track Order
          </Link>
          <Link
            to="/account"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: '500' }}
          >
            My Orders & Saved Dishes
          </Link>
          {isStaff && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="badge badge-gold"
              style={{ padding: '0.5rem 0.8rem', width: 'fit-content' }}
            >
              <Shield size={14} /> Open Admin Portal
            </Link>
          )}
        </div>
      )}

      {/* Embedded CSS for responsive nav visibility */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        .nav-link:hover { color: var(--primary); }
        .dropdown-item:hover { background: rgba(255, 255, 255, 0.06); }
      `}</style>
    </header>
  );
}
