import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

/**
 * QuantityButton Component
 * Renders an "+ Add" button when quantity is 0.
 * Once added, transitions into the segmented pill stepper:
 * [-] [ count ] [+] matching the requested design with vibrant pink accents and light center.
 */
export default function QuantityButton({
  quantity = 0,
  onAdd,
  onIncrement,
  onDecrement,
  max = 999,
  disabled = false,
  size = 'medium', // 'small' | 'medium' | 'large'
  className = ''
}) {
  const [animating, setAnimating] = useState(false);

  const triggerAnimation = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 200);
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    if (disabled) return;
    triggerAnimation();
    if (onAdd) onAdd(e);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (disabled || (max !== undefined && quantity >= max)) return;
    triggerAnimation();
    if (onIncrement) onIncrement(e);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (disabled) return;
    triggerAnimation();
    if (onDecrement) onDecrement(e);
  };

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        className={`qty-btn-disabled qty-size-${size} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        Out of Stock
      </button>
    );
  }

  if (quantity <= 0) {
    return (
      <button
        type="button"
        onClick={handleAdd}
        className={`qty-add-btn qty-size-${size} ${className}`}
        aria-label="Add to cart"
      >
        <Plus size={size === 'large' ? 18 : size === 'small' ? 13 : 15} strokeWidth={2.6} />
        <span>ADD</span>
      </button>
    );
  }

  return (
    <div
      className={`qty-stepper qty-size-${size} ${animating ? 'qty-bump' : ''} ${className}`}
      onClick={(e) => e.stopPropagation()}
      role="group"
      aria-label="Quantity selector"
    >
      <button
        type="button"
        onClick={handleDecrement}
        className="qty-stepper-btn qty-stepper-minus"
        aria-label="Decrease quantity"
        title="Decrease quantity"
      >
        <Minus size={size === 'large' ? 18 : size === 'small' ? 12 : 14} strokeWidth={2.8} />
      </button>

      <div className="qty-stepper-value" aria-live="polite">
        <span className="qty-number">{quantity}</span>
      </div>

      <button
        type="button"
        onClick={handleIncrement}
        className="qty-stepper-btn qty-stepper-plus"
        disabled={max !== undefined && quantity >= max}
        aria-label="Increase quantity"
        title={max !== undefined && quantity >= max ? 'Maximum stock reached' : 'Increase quantity'}
      >
        <Plus size={size === 'large' ? 18 : size === 'small' ? 12 : 14} strokeWidth={2.8} />
      </button>
    </div>
  );
}
