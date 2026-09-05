import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export default function HeroSection({ heroImage, onShopNow }) {
  // Parallax scroll effect
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        if (rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animated title words
  const titleWords = ['Upgrade', 'Your', 'Ride'];
  const [visibleWords, setVisibleWords] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleWords(prev => {
        if (prev >= titleWords.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 200);
    return () => clearInterval(timer);
  }, []);

  // Subtitle and CTA reveal
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    const subtitleTimer = setTimeout(() => setShowSubtitle(true), titleWords.length * 200 + 200);
    const ctaTimer = setTimeout(() => setShowCta(true), titleWords.length * 200 + 500);
    return () => { clearTimeout(subtitleTimer); clearTimeout(ctaTimer); };
  }, []);

  return (
    <div className="hero-section" ref={heroRef}>
      <div
        className="hero-bg"
        style={{
          backgroundImage: heroImage
            ? `url(${heroImage})`
            : 'url("https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070&auto=format&fit=crop")',
          transform: `translateY(${scrollY * 0.25}px) scale(${1 + scrollY * 0.0003})`,
        }}
      />

      {/* Floating Particles */}
      <div className="hero-particles">
        {[...Array(6)].map((_, i) => (
          <span key={i} className={`hero-particle hero-particle-${i + 1}`} />
        ))}
      </div>

      <div className="hero-content">
        <h1 className="hero-title">
          {titleWords.map((word, i) => (
            <span
              key={i}
              className={`hero-word ${i < visibleWords ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {word}{' '}
            </span>
          ))}
        </h1>
        <p className={`hero-subtitle ${showSubtitle ? 'hero-subtitle-visible' : ''}`}>
          Premium Spares &amp; Performance Parts for True Enthusiasts.
        </p>
        <button
          onClick={onShopNow}
          className={`hero-cta ${showCta ? 'hero-cta-visible' : ''}`}
        >
          Shop Now <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
