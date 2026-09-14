import React, { useState, useEffect } from 'react';
import { X, Star, Clock, Heart, ShoppingBag, Plus, Minus, ChefHat, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { reviewApi, favoriteApi } from '../api';
import { useToast } from '../context/ToastContext';

export default function FoodDetailsModal({ item, onClose, onOpenAuth }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const [qty, setQty] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const [reviews, setReviews] = useState(item.reviews || []);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await reviewApi.getByMenuItem(item.id);
        if (res.data) setReviews(res.data);
      } catch (e) {
        // use item.reviews if available
      }
    }
    loadReviews();
  }, [item.id]);

  const handleAddToCart = () => {
    if (!item.available) return;
    addItem(item, qty);
    onClose();
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.info('Please sign in to save your favorite dishes.');
      if (onOpenAuth) onOpenAuth();
      return;
    }
    try {
      const res = await favoriteApi.toggle(item.id);
      setIsFav(res.data.isFavorite);
      toast.success(res.message);
    } catch {
      toast.error('Could not update favorite.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please sign in to leave a review.');
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (!commentInput.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await reviewApi.create({
        menuItemId: item.id,
        rating: ratingInput,
        comment: commentInput.trim(),
      });
      setReviews((prev) => [res.data, ...prev]);
      setCommentInput('');
      toast.success('Thank you! Your review has been posted.');
    } catch (err) {
      toast.error(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '680px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(9, 13, 22, 0.8)',
            border: '1px solid var(--border-subtle)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <X size={20} />
        </button>

        {/* Hero Image */}
        <div style={{ position: 'relative', width: '100%', height: '280px' }}>
          <img
            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
            alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, #111726 0%, transparent 60%)',
            }}
          />
          <div style={{ position: 'absolute', bottom: '16px', left: '24px' }}>
            <span className="badge badge-gold" style={{ marginBottom: '8px' }}>
              {item.categoryRel?.name || item.category}
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff', lineHeight: 1.2 }}>
              {item.name}
            </h2>
          </div>
        </div>

        {/* Body Content */}
        <div style={{ padding: '1.5rem 1.75rem' }}>
          {/* Metadata Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#facc15' }}>
                <Star size={18} fill="#facc15" />
                <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#fff' }}>
                  {Number(item.rating || 4.8).toFixed(1)}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  ({reviews.length} reviews)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <Clock size={16} />
                <span>Prep: {item.preparationTime || 15} mins</span>
              </div>
            </div>

            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)' }}>
              ${Number(item.price).toFixed(2)}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Description
            </h4>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.6' }}>
              {item.description || 'Crafted with premium cuts, fresh artisanal herbs, and authentic cooking traditions.'}
            </p>
          </div>

          {/* Recipe / Ingredients highlight if available */}
          {item.recipes && item.recipes.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
                <ChefHat size={16} color="var(--primary)" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Featured Ingredients
                </h4>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {item.recipes.map((r) => (
                  <span
                    key={r.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {r.inventory?.ingredientName || 'Fresh Ingredient'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Row: Quantity & Add to Cart */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1.25rem',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(15, 23, 42, 0.7)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                padding: '4px',
              }}
            >
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
              >
                <Minus size={16} />
              </button>
              <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: '700', fontSize: '1.05rem' }}>
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!item.available}
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.85rem' }}
            >
              <ShoppingBag size={18} />
              <span>
                {item.available
                  ? `Add to Cart • $${(Number(item.price) * qty).toFixed(2)}`
                  : 'Currently Unavailable'}
              </span>
            </button>

            <button
              onClick={handleFavoriteToggle}
              className="btn btn-secondary"
              style={{
                width: '46px',
                height: '46px',
                padding: 0,
                borderRadius: '50%',
                display: 'flex',
                color: isFav ? '#ef4444' : '#fff',
              }}
              title="Save to favorites"
            >
              <Heart size={20} fill={isFav ? '#ef4444' : 'none'} />
            </button>
          </div>

          {/* Customer Reviews Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <MessageSquare size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff' }}>
                Guest Reviews ({reviews.length})
              </h3>
            </div>

            {/* Leave Review Form */}
            <form
              onSubmit={handleReviewSubmit}
              style={{
                background: 'rgba(15, 23, 42, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Your Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingInput(star)}
                    style={{ color: star <= ratingInput ? '#facc15' : '#475569', padding: '2px' }}
                  >
                    <Star size={18} fill={star <= ratingInput ? '#facc15' : 'none'} />
                  </button>
                ))}
              </div>

              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder={user ? 'Share your dining experience with this dish...' : 'Please sign in to write a review.'}
                disabled={!user}
                rows={2}
                className="form-input"
                style={{ resize: 'none', marginBottom: '0.75rem' }}
                required
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {user ? (
                  <button
                    type="submit"
                    disabled={submittingReview || !commentInput.trim()}
                    className="btn btn-primary btn-sm"
                  >
                    {submittingReview ? 'Posting...' : 'Submit Review'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="btn btn-outline btn-sm"
                  >
                    Sign In to Review
                  </button>
                )}
              </div>
            </form>

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                  No reviews yet. Be the first to taste and review this chef special!
                </div>
              ) : (
                reviews.map((r, idx) => (
                  <div
                    key={r.id || idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1rem',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#fff' }}>
                        {r.user?.fullName || 'Verified Diner'}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#facc15' }}>
                        {Array.from({ length: r.rating || 5 }).map((_, i) => (
                          <Star key={i} size={13} fill="#facc15" />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                      {r.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
