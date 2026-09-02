import React from 'react';
import { Heart, ShoppingBag, X } from 'lucide-react';
import StarRating from './StarRating';

export default function WishlistModal({ wishlist, onClose, onToggleWishlist, onAddToCart }) {
  return (
    <div className="wishlist-overlay" onClick={onClose}>
      <div
        className="glass-panel wishlist-modal"
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Heart size={20} color="#EF4444" fill="#EF4444" />
            <h2 style={{ fontSize: '1.35rem' }}>My Wishlist</h2>
            <span style={{
              fontSize: '0.75rem', color: 'var(--text-muted)',
              background: 'var(--bg-main)', border: '1px solid var(--border)',
              padding: '0.12rem 0.5rem', borderRadius: 'var(--radius-full)'
            }}>{wishlist.length} saved</span>
          </div>
          <button onClick={onClose} className="cart-close-btn">
            <X size={20} />
          </button>
        </div>

        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <Heart size={44} style={{ marginBottom: '1rem', opacity: 0.2 }} />
            <p style={{ fontWeight: 600 }}>No saved items yet.</p>
            <p style={{ fontSize: '0.82rem', marginTop: '0.4rem' }}>Tap the ♡ on any part in the catalog to save it here.</p>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map(part => (
              <div key={part.id} style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '1.15rem',
                display: 'flex', flexDirection: 'column', gap: '0.6rem', textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{part.category}</span>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.1rem' }}>{part.name}</h4>
                  </div>
                  <button onClick={() => onToggleWishlist(part)} className="cart-close-btn" style={{ width: '24px', height: '24px' }}>
                    <X size={13} />
                  </button>
                </div>
                <StarRating rating={part.rating} />
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{part.desc}</p>
                <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>₹{part.price.toFixed(2)}</span>
                <button
                  onClick={() => onAddToCart(part)}
                  className="btn-primary"
                  style={{ width: '100%', fontSize: '0.82rem', padding: '0.5rem' }}
                >
                  <ShoppingBag size={14} /> Move to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
