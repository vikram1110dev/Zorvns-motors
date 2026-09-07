import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

/**
 * Horizontal scrolling carousel of recently viewed products.
 * Stored/read from localStorage key 'spark_recently_viewed'.
 */
export default function RecentlyViewed({ products, onViewProduct }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="recently-viewed-section">
      <div className="recently-viewed-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} color="var(--accent)" />
          <h3 className="recently-viewed-title">Recently Viewed</h3>
        </div>
        <span className="recently-viewed-count">{products.length} items</span>
      </div>

      <div className="recently-viewed-scroll">
        {products.map((part) => (
          <div
            key={part.id}
            className="recently-viewed-card"
            onClick={() => onViewProduct(part)}
          >
            <div className="recently-viewed-img">
              {part.images && part.images.length > 0 ? (
                <img
                  src={part.images[0].trim()}
                  alt={part.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>No Img</span>
              )}
            </div>
            <div className="recently-viewed-info">
              <span className="recently-viewed-cat">{part.category}</span>
              <h4 className="recently-viewed-name">{part.name}</h4>
              <span className="recently-viewed-price">
                ₹{Math.round(part.price).toLocaleString('en-IN')}
              </span>
            </div>
            <ArrowRight size={14} className="recently-viewed-arrow" />
          </div>
        ))}
      </div>
    </div>
  );
}
