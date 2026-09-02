import React from 'react';
import { ShoppingBag, Heart, Plus } from 'lucide-react';
import StarRating from './StarRating';

export default function ProductCard({ part, onViewProduct, onAddToCart, onToggleWishlist, isWishlisted }) {
  return (
    <div
      className="product-card"
      onClick={() => onViewProduct(part)}
    >
      <span className="product-card-badge">{part.category}</span>

      {part.images && part.images.length > 0 ? (
        <div className="product-card-image" style={{ overflowX: 'auto', scrollSnapType: 'x mandatory', display: 'flex' }}>
          {part.images.map((imgUrl, i) => (
            <img
              key={i}
              src={imgUrl.trim()}
              alt={`${part.name} ${i + 1}`}
              style={{ flex: '0 0 100%', scrollSnapAlign: 'start', objectFit: 'contain', backgroundColor: '#F9FAFB' }}
            />
          ))}
        </div>
      ) : (
        <div className="product-card-image product-card-image-placeholder">
          <ShoppingBag size={40} color="var(--text-light)" />
        </div>
      )}

      <div className="product-card-body">
        <span className="product-card-category">{part.category}</span>
        <h4 className="product-card-title">{part.name}</h4>
        <p className="product-card-desc">{part.desc}</p>

        {part.compatibility && (
          <div className="compat-list">
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Fits: </span>
            {part.compatibility.slice(0, 3).map(b => (
              <span key={b} className="compat-badge">{b}</span>
            ))}
            {part.compatibility.length > 3 && (
              <span className="compat-badge">+{part.compatibility.length - 3}</span>
            )}
          </div>
        )}

        <StarRating rating={part.rating} />

        <div className="product-card-footer">
          <div>
            <span className="product-price">₹{part.price.toFixed(2)}</span>
            <span className="product-stock">In Stock: {part.stock}</span>
          </div>
          <div className="product-card-actions">
            <button
              onClick={(e) => { e.stopPropagation(); onToggleWishlist(part); }}
              title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
            >
              <Heart size={14} fill={isWishlisted ? '#EF4444' : 'none'} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(part); }}
              className="add-cart-btn"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
