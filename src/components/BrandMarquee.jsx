import React from 'react';

const BRANDS = ['BREMBO', 'K&N', 'MOTUL', 'NGK', 'AKRAPOVIC', 'MICHELIN', 'PIRELLI', 'CASTROL', 'BOSCH', 'DENSO'];

/**
 * Auto-scrolling infinite marquee of brand names.
 * Pauses on hover for better UX.
 */
export default function BrandMarquee() {
  // Duplicate the array for seamless infinite scroll
  const items = [...BRANDS, ...BRANDS];

  return (
    <div className="marquee-wrapper">
      <div className="marquee-track">
        {items.map((brand, idx) => (
          <div key={idx} className="marquee-item">
            <span className="marquee-brand-text">{brand}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
