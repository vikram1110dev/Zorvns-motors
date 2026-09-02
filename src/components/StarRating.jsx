import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={12}
          fill={i <= Math.round(rating) ? '#F59E0B' : 'transparent'}
          color={i <= Math.round(rating) ? '#F59E0B' : '#D1D5DB'}
        />
      ))}
      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.25rem', fontWeight: 500 }}>{rating.toFixed(1)}</span>
    </div>
  );
}
