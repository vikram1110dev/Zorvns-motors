import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Flame, Clock, ShoppingBag, Zap } from 'lucide-react';
import StarRating from './StarRating';

/**
 * "Deal of the Day" section with a live countdown timer
 * and flip-clock style animated digits.
 */
export default function DealOfTheDay({ spares, onAddToCart, onViewProduct }) {
  // Pick a featured product — rotate daily based on date
  const featured = useMemo(() => {
    if (!spares || spares.length === 0) return null;
    const dayIndex = new Date().getDate() % spares.length;
    return spares[dayIndex];
  }, [spares]);

  // Calculate time remaining until midnight
  const getTimeRemaining = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(23, 59, 59, 999);
    const diff = Math.max(0, midnight - now);
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [time, setTime] = useState(getTimeRemaining);
  const [prevTime, setPrevTime] = useState(time);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPrevTime(time);
      setTime(getTimeRemaining());
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [time]);

  // Discount percentage (mock — always 25% off)
  const discountPct = 25;
  const originalPrice = featured ? Math.round(featured.price / (1 - discountPct / 100)) : 0;

  if (!featured) return null;

  return (
    <div className="deal-of-day-section">
      <div className="deal-of-day-glow" />
      <div className="deal-of-day-inner">
        {/* Left: Info + Timer */}
        <div className="deal-of-day-info">
          <div className="deal-badge">
            <Flame size={14} />
            <span>Deal of the Day</span>
          </div>
          <h3 className="deal-title">{featured.name}</h3>
          <p className="deal-desc">{featured.desc}</p>

          <div className="deal-pricing">
            <span className="deal-price-now">₹{Math.round(featured.price).toLocaleString('en-IN')}</span>
            <span className="deal-price-original">₹{originalPrice.toLocaleString('en-IN')}</span>
            <span className="deal-discount-tag">-{discountPct}% OFF</span>
          </div>

          <StarRating rating={featured.rating} />

          {/* Countdown Timer */}
          <div className="deal-timer-label">
            <Clock size={14} />
            <span>Offer ends in:</span>
          </div>
          <div className="deal-timer">
            <FlipDigit value={time.hours} prevValue={prevTime.hours} label="Hours" />
            <span className="deal-timer-colon">:</span>
            <FlipDigit value={time.minutes} prevValue={prevTime.minutes} label="Min" />
            <span className="deal-timer-colon">:</span>
            <FlipDigit value={time.seconds} prevValue={prevTime.seconds} label="Sec" />
          </div>

          <div className="deal-actions">
            <button className="btn-primary deal-cta" onClick={(e) => onAddToCart(featured, e)}>
              <ShoppingBag size={16} />
              <span>Grab This Deal</span>
            </button>
            <button className="btn-secondary" onClick={() => onViewProduct(featured)}>
              View Details
            </button>
          </div>
        </div>

        {/* Right: Product image */}
        <div className="deal-of-day-image">
          {featured.images && featured.images.length > 0 ? (
            <img src={featured.images[0].trim()} alt={featured.name} />
          ) : (
            <div className="deal-image-placeholder">
              <Zap size={56} color="var(--accent)" strokeWidth={1} />
            </div>
          )}
          <div className="deal-image-badge">
            <span>-{discountPct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Flip-clock style animated digit */
function FlipDigit({ value, prevValue, label }) {
  const displayVal = String(value).padStart(2, '0');
  const prevDisplayVal = String(prevValue).padStart(2, '0');
  const changed = displayVal !== prevDisplayVal;

  return (
    <div className="flip-digit-group">
      <div className={`flip-digit ${changed ? 'flip-animate' : ''}`}>
        <span className="flip-digit-current" key={displayVal}>{displayVal}</span>
      </div>
      <span className="flip-digit-label">{label}</span>
    </div>
  );
}
