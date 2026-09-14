import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Flame,
  Award,
  Clock,
  Truck,
  ShieldCheck,
  Star,
  ChefHat,
  Tag,
} from 'lucide-react';
import { menuApi } from '../api';
import FoodCard from '../components/FoodCard';
import FoodDetailsModal from '../components/FoodDetailsModal';

export default function HomePage({ onOpenAuth }) {
  const [categories, setCategories] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [catsRes, featRes, popRes] = await Promise.all([
          menuApi.getCategories(),
          menuApi.getMenuItems({ featured: true }),
          menuApi.getMenuItems({ popular: true }),
        ]);
        if (catsRes.data) setCategories(catsRes.data);
        if (featRes.data) setFeaturedItems(featRes.data);
        if (popRes.data) setPopularItems(popRes.data);
      } catch (e) {
        console.error('Home data load error:', e);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section
        style={{
          position: 'relative',
          padding: '6rem 0 7rem 0',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at top, rgba(234, 179, 8, 0.12) 0%, #090d16 70%)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              alignItems: 'center',
              gap: '4rem',
            }}
          >
            {/* Left Content */}
            <div>
              {/* Highlight Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(234, 179, 8, 0.12)',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  color: 'var(--primary)',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  marginBottom: '1.5rem',
                }}
              >
                <Sparkles size={16} />
                <span>Michelin-Crafted Gastronomy</span>
              </div>

              {/* Main Headline */}
              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                  fontWeight: '800',
                  lineHeight: 1.1,
                  marginBottom: '1.5rem',
                  fontFamily: 'var(--font-serif)',
                }}
              >
                Where Passion Meets the <span className="text-gradient">Art of Flavor</span>
              </h1>

              {/* Subheading */}
              <p
                style={{
                  fontSize: '1.15rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.7,
                  marginBottom: '2.5rem',
                  maxWidth: '540px',
                }}
              >
                Experience charred wood-fired sourdough pizzas, dry-aged Wagyu cuts, and velvety desserts prepared by world-class chefs. Delivered hot in 30 minutes.
              </p>

              {/* CTA Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <Link to="/menu" className="btn btn-primary btn-lg">
                  <span>Explore Menu</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/track" className="btn btn-secondary btn-lg">
                  <Clock size={18} />
                  <span>Track Live Order</span>
                </Link>
              </div>

              {/* Trust Metrics */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1.5rem',
                  marginTop: '3.5rem',
                  paddingTop: '2rem',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)' }}>
                    30<span style={{ fontSize: '1rem' }}>MIN</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Average Delivery</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff' }}>
                    4.9<span style={{ fontSize: '1rem', color: '#facc15' }}> ★</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Over 2,400+ Reviews</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--accent-green)' }}>
                    100%
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Farm-Fresh Organics</div>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(234, 179, 8, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85"
                  alt="Prime Dry-Aged Ribeye Steak"
                  style={{ width: '100%', height: '480px', objectFit: 'cover' }}
                />

                {/* Floating Dish Pill */}
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '24px',
                    right: '24px',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span className="badge badge-gold" style={{ marginBottom: '4px' }}>
                      Today's Feature
                    </span>
                    <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#fff' }}>
                      Prime Dry-Aged Ribeye Steak
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Truffled parmesan fingerlings & bone marrow jus
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--primary)' }}>
                      $38.50
                    </div>
                    <Link
                      to="/menu"
                      style={{ fontSize: '0.78rem', color: '#fff', textDecoration: 'underline' }}
                    >
                      Order Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--primary)',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Artisanal Selections
            </span>
            <h2
              style={{
                fontSize: '2.4rem',
                fontWeight: '800',
                fontFamily: 'var(--font-serif)',
                color: '#fff',
              }}
            >
              Browse by Culinary Category
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/menu?category=${encodeURIComponent(cat.name)}`}
                className="glass-card"
                style={{
                  padding: '1.5rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  textDecoration: 'none',
                }}
              >
                <div
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                    border: '2px solid rgba(234, 179, 8, 0.4)',
                  }}
                >
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'}
                    alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h4 style={{ fontWeight: '700', fontSize: '1rem', color: '#fff', marginBottom: '4px' }}>
                  {cat.name}
                </h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  {cat._count?.menuItems || 0} Specialties
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CHEF'S FEATURED CREATIONS */}
      <section
        className="section-padding"
        style={{
          background: 'rgba(17, 23, 38, 0.4)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '3rem',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', marginBottom: '0.4rem' }}>
                <Flame size={18} />
                <span style={{ fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Chef Antoine Laurent's Signatures
                </span>
              </div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: '800', fontFamily: 'var(--font-serif)', color: '#fff' }}>
                Featured Signature Dishes
              </h2>
            </div>
            <Link to="/menu" className="btn btn-outline btn-sm">
              <span>View Full Menu</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {featuredItems.slice(0, 4).map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onQuickView={(it) => setSelectedItem(it)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. PROMOTIONAL BANNER */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">
          <div
            style={{
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #1e1b4b 0%, #1e293b 50%, #0f172a 100%)',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              padding: '3rem 2.5rem',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div
              style={{
                position: 'relative',
                zIndex: 5,
                maxWidth: '620px',
              }}
            >
              <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>
                Limited Gourmet Promotion
              </span>
              <h3
                style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                  fontWeight: '800',
                  color: '#fff',
                  fontFamily: 'var(--font-serif)',
                  lineHeight: 1.2,
                  marginBottom: '1rem',
                }}
              >
                Enjoy 20% Off Your Weekend Artisan Feast
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
                Apply code <strong style={{ color: 'var(--primary)', letterSpacing: '0.05em' }}>TASTY20</strong> at checkout for any order over $20. Complimentary truffle bread with every wood-fired pizza order.
              </p>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link to="/menu" className="btn btn-primary">
                  <span>Order Now with TASTY20</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. POPULAR DISHES */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--primary)',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Customer Favorites
            </span>
            <h2
              style={{
                fontSize: '2.4rem',
                fontWeight: '800',
                fontFamily: 'var(--font-serif)',
                color: '#fff',
              }}
            >
              Most Loved by Food Lovers
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {popularItems.slice(0, 4).map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onQuickView={(it) => setSelectedItem(it)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section
        className="section-padding"
        style={{
          background: 'rgba(15, 23, 42, 0.6)',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2
              style={{
                fontSize: '2.4rem',
                fontWeight: '800',
                fontFamily: 'var(--font-serif)',
                color: '#fff',
                marginBottom: '0.5rem',
              }}
            >
              The L'AURA Commitment
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto' }}>
              We set the benchmark for modern culinary craftsmanship, sustainable sourcing, and swift white-glove delivery.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
            }}
          >
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'rgba(234, 179, 8, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  marginBottom: '1.25rem',
                }}
              >
                <ChefHat size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>
                Master Culinary Chefs
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Every plate is conceived and crafted under the guidance of Michelin-trained culinary artisans using time-honored recipes.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-green)',
                  marginBottom: '1.25rem',
                }}
              >
                <Award size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>
                100% Pure Organic
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Directly partnered with local regenerative farms, ensuring antibiotic-free meats, non-GMO grains, and heirloom produce.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-blue)',
                  marginBottom: '1.25rem',
                }}
              >
                <Truck size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>
                Thermal Temperature Control
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Proprietary heated delivery capsules keep wood-fired crusts crisp and steaks sizzling at optimal serving temperature.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-red)',
                  marginBottom: '1.25rem',
                }}
              >
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>
                Live Digital Tracking
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Track every stage from prep to delivery with live stage tracking and notifications directly in your browser.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Food Details Modal */}
      {selectedItem && (
        <FoodDetailsModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onOpenAuth={onOpenAuth}
        />
      )}
    </div>
  );
}
