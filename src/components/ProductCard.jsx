import React, { useRef } from 'react';
import { ShoppingBag, Heart, Plus } from 'lucide-react';
import StarRating from './StarRating';

export default function ProductCard({ part, onViewProduct, onAddToCart, onToggleWishlist, isWishlisted }) {
  const cardRef = useRef(null);

  // 3D tilt effect on mouse move
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = '';
    }
  };

  // Ripple effect on add to cart
  const handleAddToCart = (e) => {
    e.stopPropagation();
    const btn = e.currentTarget;
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    const rect = btn.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    onAddToCart(part);
  };

  return (
    <div
      ref={cardRef}
      className="product-card"
      onClick={() => onViewProduct(part)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span className="product-card-badge">{part.subCategory || part.category}</span>

      {part.images && part.images.length > 0 ? (
        <div className="product-card-image" style={{ overflowX: 'auto', scrollSnapType: 'x mandatory', display: 'flex' }}>
          {part.images.map((imgUrl, i) => (
            <img
              key={i}
              src={imgUrl.trim()}
              alt={`${part.name} ${i + 1}`}
              className="product-card-img"
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
        <span className="product-card-category">
          {part.category}{part.subCategory ? ` • ${part.subCategory}` : ''}
        </span>
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
            <span className="product-price">₹{Math.round(part.price).toLocaleString('en-IN')}</span>
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
              onClick={handleAddToCart}
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
