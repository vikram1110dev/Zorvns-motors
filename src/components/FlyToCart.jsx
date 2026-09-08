import React, { useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

/**
 * Single flying particle that arches from the clicked product button into the header cart.
 */
function FlyingParticle({ item, onComplete }) {
  const { id, startX, startY, endX, endY } = item;
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(id);
    }, 750);
    return () => clearTimeout(timer);
  }, [id, onComplete]);

  return (
    <div
      className="fly-to-cart-outer"
      style={{
        left: `${startX}px`,
        top: `${startY}px`,
        '--fly-dx': `${deltaX}px`,
      }}
    >
      <div
        className="fly-to-cart-inner"
        style={{
          '--fly-dy': `${deltaY}px`,
        }}
      >
        <div className="fly-to-cart-orb">
          <ShoppingBag size={14} color="#FFFFFF" strokeWidth={2.8} />
          <span className="fly-to-cart-plus">+1</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Container rendering all active flying particles in a fixed viewport overlay.
 */
export default function FlyToCart({ items, onParticleArrival }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="fly-to-cart-container" aria-hidden="true">
      {items.map((item) => (
        <FlyingParticle
          key={item.id}
          item={item}
          onComplete={onParticleArrival}
        />
      ))}
    </div>
  );
}
