import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function HeroSection({ heroImage, onShopNow }) {
  return (
    <div className="hero-section">
      <div
        className="hero-bg"
        style={{
          backgroundImage: heroImage
            ? `url(${heroImage})`
            : 'url("https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070&auto=format&fit=crop")'
        }}
      />
      <div className="hero-content">
        <h1 className="hero-title">Upgrade Your Ride</h1>
        <p className="hero-subtitle">
          Premium Spares & Performance Parts for True Enthusiasts.
        </p>
        <button onClick={onShopNow} className="hero-cta">
          Shop Now <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
