import React, { useState } from 'react';
import { Plus, Minus, Star, Clock, Heart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { favoriteApi } from '../api';
import { useToast } from '../context/ToastContext';

export default function FoodCard({ item, onQuickView, isFavoriteInitial = false }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const [qty, setQty] = useState(1);
  const [isFav, setIsFav] = useState(isFavoriteInitial);
  const [imgSrc, setImgSrc] = useState(
    item.image ||
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
  );

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.info('Please sign in to save your favorite dishes.');
      return;
    }
    try {
      const res = await favoriteApi.toggle(item.id);
      setIsFav(res.data.isFavorite);
      toast.success(res.message);
    } catch (err) {
      toast.error('Failed to update favorite.');
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!item.available) return;
    addItem(item, qty);
    setQty(1);
  };

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
      }}
      onClick={() => onQuickView && onQuickView(item)}
    >
      {/* Top Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '210px',
          overflow: 'hidden',
          background: '#0e1422',
        }}
      >
        <img
          src={imgSrc}
          alt={item.name}
          onError={() =>
            setImgSrc(
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
            )
          }
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          className="food-img"
        />

        {/* Status / Featured Badges */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {item.isFeatured && <span className="badge badge-gold">Chef Special</span>}
          {item.isPopular && <span className="badge badge-gold" style={{ background: 'rgba(249, 115, 22, 0.2)', color: '#fb923c', borderColor: 'rgba(249, 115, 22, 0.4)' }}>Popular</span>}
          {!item.available && <span className="badge badge-red">Sold Out</span>}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(9, 13, 22, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isFav ? '#ef4444' : '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 5,
          }}
          title={isFav ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart size={18} fill={isFav ? '#ef4444' : 'none'} />
        </button>

        {/* Prep Time pill */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '12px',
            background: 'rgba(9, 13, 22, 0.8)',
            backdropFilter: 'blur(6px)',
            borderRadius: 'var(--radius-full)',
            padding: '3px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}
        >
          <Clock size={12} />
          <span>{item.preparationTime || 15} min</span>
        </div>
      </div>

      {/* Card Body */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Category & Rating */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
            fontSize: '0.82rem',
          }}
        >
          <span style={{ color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {item.categoryRel?.name || item.category}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#facc15' }}>
            <Star size={14} fill="#facc15" />
            <span style={{ fontWeight: '700', color: '#fff' }}>{Number(item.rating || 4.8).toFixed(1)}</span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>({item.reviewCount || 0})</span>
          </div>
        </div>

        {/* Dish Name */}
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: '700',
            color: '#fff',
            marginBottom: '0.5rem',
            lineHeight: 1.3,
          }}
        >
          {item.name}
        </h3>

        {/* Description */}
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.88rem',
            lineHeight: 1.5,
            marginBottom: '1.25rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {item.description || 'Artisanal dish prepared with fresh seasonal ingredients.'}
        </p>

        {/* Price & Action Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block' }}>Price</span>
            <span style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--primary)', lineHeight: 1 }}>
              ${Number(item.price).toFixed(2)}
            </span>
          </div>

          {/* Quantity Controls & Add Button */}
          {item.available ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)',
                  padding: '2px',
                }}
              >
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
                  aria-label="Decrease quantity"
                >
                  <Minus size={13} />
                </button>
                <span style={{ minWidth: '22px', textAlign: 'center', fontWeight: '700', fontSize: '0.88rem' }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
                  aria-label="Increase quantity"
                >
                  <Plus size={13} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn btn-primary btn-sm"
                style={{
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                Add
              </button>
            </div>
          ) : (
            <span className="badge badge-red" style={{ fontSize: '0.8rem' }}>
              Unavailable
            </span>
          )}
        </div>
      </div>

      <style>{`
        .glass-card:hover .food-img {
          transform: scale(1.06);
        }
      `}</style>
    </div>
  );
}
