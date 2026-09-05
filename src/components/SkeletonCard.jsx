import React from 'react';

/**
 * Skeleton loading placeholder that mimics the ProductCard layout.
 * Uses CSS shimmer animation for a polished loading experience.
 */
export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image skeleton-shimmer" />
      <div className="skeleton-body">
        <div className="skeleton-line skeleton-shimmer" style={{ width: '40%', height: '10px' }} />
        <div className="skeleton-line skeleton-shimmer" style={{ width: '85%', height: '14px', marginTop: '0.5rem' }} />
        <div className="skeleton-line skeleton-shimmer" style={{ width: '100%', height: '10px', marginTop: '0.4rem' }} />
        <div className="skeleton-line skeleton-shimmer" style={{ width: '70%', height: '10px', marginTop: '0.25rem' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <div className="skeleton-line skeleton-shimmer" style={{ width: '60px', height: '18px' }} />
          <div className="skeleton-line skeleton-shimmer" style={{ width: '70px', height: '30px', borderRadius: 'var(--radius-md)' }} />
        </div>
      </div>
    </div>
  );
}
