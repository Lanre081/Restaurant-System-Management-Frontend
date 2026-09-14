import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Phone, Mail, MapPin, Clock, Heart, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'rgba(5, 8, 14, 0.95)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '4.5rem 0 2rem 0',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Col 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #facc15 0%, #ca8a04 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#090d16',
                }}
              >
                <UtensilsCrossed size={20} strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: '700' }}>
                  L'AURA
                </div>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--primary)', fontWeight: '600' }}>
                  ARTISAN BISTRO
                </div>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.7', marginBottom: '1.25rem' }}>
              Celebrating culinary mastery with heritage wood-fired ovens, prime aged cuts, and fresh farm-to-table organics. Handcrafted daily for discerning palates.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600' }}>
              <Award size={18} /> Michelin Guide Recommended 2025
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.25rem', color: '#fff' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
              <li><Link to="/menu" className="footer-link">Artisanal Menu</Link></li>
              <li><Link to="/menu?featured=true" className="footer-link">Chef's Signature Selections</Link></li>
              <li><Link to="/track" className="footer-link">Live Order Tracking</Link></li>
              <li><Link to="/account" className="footer-link">Customer Portal & Rewards</Link></li>
              <li><Link to="/admin" className="footer-link">Staff Administration</Link></li>
            </ul>
          </div>

          {/* Col 3: Hours & Dining */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.25rem', color: '#fff' }}>
              Dining & Delivery Hours
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <Clock size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ color: '#fff', fontWeight: '500' }}>Monday - Friday</div>
                  <div>11:30 AM – 11:00 PM</div>
                </div>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <Clock size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ color: '#fff', fontWeight: '500' }}>Saturday - Sunday</div>
                  <div>10:00 AM – 11:30 PM (Brunch & Dinner)</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Location & Contact */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.25rem', color: '#fff' }}>
              Bistro Location
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>100 Culinary Way, Gourmet District, NY</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>+1 (555) 019-2831</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>reservations@laura-bistro.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-dim)',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} L'AURA Artisan Bistro. All rights reserved. Handcrafted for gastronomy lovers.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Dining</span>
            <span>Safety & Hygiene</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: var(--primary); transform: translateX(3px); display: inline-block; }
      `}</style>
    </footer>
  );
}
