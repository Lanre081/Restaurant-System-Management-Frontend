import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Sparkles, X, RefreshCw } from 'lucide-react';
import { menuApi } from '../api';
import FoodCard from '../components/FoodCard';
import FoodDetailsModal from '../components/FoodDetailsModal';

export default function MenuPage({ onOpenAuth }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filters State
  const activeCategory = searchParams.get('category') || 'All';
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get('featured') === 'true');
  const [priceTier, setPriceTier] = useState('all');

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await menuApi.getCategories();
        if (res.data) setCategories(res.data);
      } catch (e) {
        console.error('Error fetching categories:', e);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function fetchMenuItems() {
      setLoading(true);
      try {
        const params = {
          sortBy,
          sortOrder,
        };

        if (activeCategory && activeCategory !== 'All') {
          params.category = activeCategory;
        }

        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }

        if (featuredOnly) {
          params.featured = true;
        }

        if (priceTier === 'under15') {
          params.maxPrice = 15;
        } else if (priceTier === '15to25') {
          params.minPrice = 15;
          params.maxPrice = 25;
        } else if (priceTier === 'over25') {
          params.minPrice = 25;
        }

        const res = await menuApi.getMenuItems(params);
        if (res.data) setItems(res.data);
      } catch (err) {
        console.error('Error loading menu:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchMenuItems, 250);
    return () => clearTimeout(timer);
  }, [activeCategory, searchTerm, sortBy, sortOrder, featuredOnly, priceTier]);

  const handleCategorySelect = (catName) => {
    if (catName === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catName);
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFeaturedOnly(false);
    setPriceTier('all');
    setSortBy('createdAt');
    searchParams.delete('category');
    searchParams.delete('featured');
    searchParams.delete('search');
    setSearchParams(searchParams);
  };

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Top Header Banner */}
      <div
        style={{
          background: 'radial-gradient(ellipse at top, rgba(234, 179, 8, 0.1) 0%, #090d16 80%)',
          padding: '4rem 0 2.5rem 0',
          borderBottom: '1px solid var(--border-subtle)',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
            Artisanal Dining Experience
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: '800',
              fontFamily: 'var(--font-serif)',
              color: '#fff',
              marginBottom: '0.75rem',
            }}
          >
            Our Master Culinary Menu
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto' }}>
            Handcrafted with sustainably raised Wagyu, organic garden greens, and San Marzano heritage tomatoes.
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '2.5rem' }}>
        {/* Category Pills Slider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            overflowX: 'auto',
            paddingBottom: '1rem',
            marginBottom: '2rem',
            scrollbarWidth: 'none',
          }}
        >
          <button
            onClick={() => handleCategorySelect('All')}
            className={`btn btn-sm ${activeCategory === 'All' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}
          >
            All Selections
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCategorySelect(c.name)}
              className={`btn btn-sm ${activeCategory === c.name ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Filter Bar Controls */}
        <div
          className="glass-card"
          style={{
            padding: '1.25rem',
            marginBottom: '2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }}
            />
            <input
              type="text"
              placeholder="Search dishes, ingredients, or flavors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px', height: '42px', fontSize: '0.92rem' }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '12px',
                  color: 'var(--text-dim)',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
            {/* Price Tier Preset */}
            <select
              value={priceTier}
              onChange={(e) => setPriceTier(e.target.value)}
              className="form-input"
              style={{ width: 'auto', height: '42px', padding: '0 0.85rem', fontSize: '0.88rem' }}
            >
              <option value="all">All Prices</option>
              <option value="under15">Under $15</option>
              <option value="15to25">$15 – $25</option>
              <option value="over25">$25 & Above</option>
            </select>

            {/* Sorting Select */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb);
                setSortOrder(so);
              }}
              className="form-input"
              style={{ width: 'auto', height: '42px', padding: '0 0.85rem', fontSize: '0.88rem' }}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
            </select>

            {/* Featured Only Toggle Button */}
            <button
              onClick={() => setFeaturedOnly((v) => !v)}
              className={`btn btn-sm ${featuredOnly ? 'btn-primary' : 'btn-secondary'}`}
              style={{ height: '42px', borderRadius: 'var(--radius-md)' }}
            >
              <Sparkles size={16} />
              <span>Chef Specials</span>
            </button>
          </div>
        </div>

        {/* Results Counter & Active Filter Tags */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            Showing <strong style={{ color: '#fff' }}>{items.length}</strong> culinary dishes
            {activeCategory !== 'All' && ` in "${activeCategory}"`}
          </div>
          {(activeCategory !== 'All' || searchTerm || featuredOnly || priceTier !== 'all') && (
            <button
              onClick={handleClearFilters}
              style={{
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.85rem',
                fontWeight: '600',
              }}
            >
              <RefreshCw size={14} /> Clear all filters
            </button>
          )}
        </div>

        {/* Food Items Grid */}
        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="glass-card"
                style={{ height: '380px', animation: 'pulse 1.5s infinite ease-in-out' }}
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div
            className="glass-card"
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <SlidersHorizontal size={30} />
            </div>
            <h3 style={{ color: '#fff', fontSize: '1.35rem', fontWeight: '700' }}>No dishes match your filters</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px', fontSize: '0.92rem' }}>
              We couldn't find any dishes matching your current search or price selection. Try resetting filters to explore our full menu.
            </p>
            <button onClick={handleClearFilters} className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>
              Reset All Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {items.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onQuickView={(it) => setSelectedItem(it)}
              />
            ))}
          </div>
        )}
      </div>

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
