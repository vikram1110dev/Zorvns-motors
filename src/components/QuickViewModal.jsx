import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import StarRating from './StarRating';
import QuantityButton from './QuantityButton';

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onUpdateQty,
  cartQty = 0,
  onToggleWishlist,
  isWishlisted,
  onViewFullDetails
}) {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [pincode, setPincode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState(null);

  // Close on Escape key press and prevent body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : [];

  const handleCheckPincode = (e) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setDeliveryResult({
        valid: false,
        message: 'Please enter a valid 6-digit Indian PIN code.'
      });
      return;
    }

    // Calculate delivery date (2 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2);
    const dateStr = deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    setDeliveryResult({
      valid: true,
      message: `Fast Delivery by ${dateStr}`,
      subtext: 'Free delivery on orders above ₹499 • Express Dispatch in 24h'
    });
  };

  return (
    <div className="quickview-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="quickview-title">
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="quickview-close-btn"
          title="Close (Esc)"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="quickview-layout">
          {/* Left Column: Image Preview & Gallery */}
          <div className="quickview-media">
            <div className="quickview-main-image-wrap">
              {images.length > 0 ? (
                <img
                  src={images[selectedImgIndex]?.trim()}
                  alt={`${product.name} view ${selectedImgIndex + 1}`}
                  className="quickview-main-img"
                />
              ) : (
                <div className="quickview-placeholder">
                  <ShoppingBag size={48} color="var(--text-light)" />
                  <span>No image preview available</span>
                </div>
              )}
              <span className="quickview-oem-badge">
                <ShieldCheck size={13} color="#10B981" /> 100% Genuine
              </span>
            </div>

            {/* Thumbnail selector if multiple images */}
            {images.length > 1 && (
              <div className="quickview-thumb-strip">
                {images.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`quickview-thumb-btn ${selectedImgIndex === i ? 'active' : ''}`}
                    onClick={() => setSelectedImgIndex(i)}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={imgUrl.trim()} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Information & Interactive Actions */}
          <div className="quickview-content">
            {/* Category / Subcategory & Stock pill */}
            <div className="quickview-meta-row">
              <span className="quickview-category-badge">
                {product.category}{product.subCategory ? ` • ${product.subCategory}` : ''}
              </span>
              <span className={`quickview-stock-badge ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                <span className="stock-live-dot" />
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            {/* Title */}
            <h2 id="quickview-title" className="quickview-title">{product.name}</h2>

            {/* Rating */}
            <div className="quickview-rating-wrap">
              <StarRating rating={product.rating} />
              <span className="quickview-rating-num">{product.rating ? Number(product.rating).toFixed(1) : '5.0'}</span>
              <span className="quickview-rating-count">(Verified Zorvns OEM)</span>
            </div>

            {/* Price */}
            <div className="quickview-price-wrap">
              <span className="quickview-price">₹{Math.round(product.price).toLocaleString('en-IN')}</span>
              <span className="quickview-taxes-tag">Inclusive of all taxes</span>
            </div>

            {/* Description */}
            <p className="quickview-desc">
              {product.desc || 'High-durability precision engineered spare part crafted specifically for optimal motorcycle performance and reliable longevity.'}
            </p>

            {/* Bike Compatibility Badges */}
            {product.compatibility && product.compatibility.length > 0 && (
              <div className="quickview-compat-box">
                <span className="quickview-compat-label">Vehicle Fitment:</span>
                <div className="quickview-compat-tags">
                  {product.compatibility.map((bike) => (
                    <span key={bike} className="compat-badge quickview-compat-pill">
                      ✓ {bike}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Pincode Delivery Estimator */}
            <div className="quickview-delivery-box">
              <form onSubmit={handleCheckPincode} className="quickview-pincode-form">
                <Truck size={16} className="quickview-truck-icon" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="quickview-pincode-input"
                />
                <button type="submit" className="quickview-pincode-btn">
                  Check
                </button>
              </form>

              {deliveryResult && (
                <div className={`quickview-delivery-status ${deliveryResult.valid ? 'success' : 'error'}`}>
                  {deliveryResult.valid ? (
                    <CheckCircle2 size={15} color="var(--success)" />
                  ) : (
                    <AlertCircle size={15} color="var(--danger)" />
                  )}
                  <div>
                    <p className="quickview-delivery-msg">{deliveryResult.message}</p>
                    {deliveryResult.subtext && (
                      <p className="quickview-delivery-sub">{deliveryResult.subtext}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons Row */}
            <div className="quickview-actions-row">
              <QuantityButton
                quantity={cartQty}
                onAdd={(e) => onAddToCart(product, e)}
                onIncrement={(e) => onUpdateQty ? onUpdateQty(product.id, 1) : onAddToCart(product, e)}
                onDecrement={() => onUpdateQty && onUpdateQty(product.id, -1)}
                max={product.stock}
                disabled={product.stock <= 0}
                size="large"
              />

              <button
                type="button"
                onClick={() => onToggleWishlist(product)}
                className={`quickview-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                aria-label="Wishlist"
              >
                <Heart size={20} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : 'currentColor'} />
              </button>
            </div>

            {/* View Full Details link */}
            <button
              type="button"
              className="quickview-details-link"
              onClick={() => onViewFullDetails(product)}
            >
              <span>View Complete Part Specifications</span>
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
