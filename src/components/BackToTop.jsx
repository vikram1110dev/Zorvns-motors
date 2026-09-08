import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

/**
 * Enhanced Back to Top button with:
 * 1. Circular SVG Scroll Progress indicator (tracks reading % in real-time)
 * 2. Breathing ambient pulse radar aura
 * 3. Animated scroll percentage tooltip on hover
 * 4. Rocket-style launch animation when clicked
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        setScrollProgress(progress);
      }
      setVisible(scrollTop > 280);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    setIsLaunching(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setIsLaunching(false);
    }, 700);
  };

  if (!visible) return null;

  const radius = 21;
  const circumference = 2 * Math.PI * radius; // ~131.95
  const strokeOffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`back-to-top-wrapper ${visible ? 'visible' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Percentage Tooltip on Hover */}
      <div className={`back-to-top-tooltip ${isHovered ? 'tooltip-visible' : ''}`}>
        <span>{Math.round(scrollProgress)}%</span>
      </div>

      {/* Breathing Radar Aura */}
      <div className="back-to-top-aura" />

      {/* Main Interactive Button */}
      <button
        onClick={handleClick}
        className={`back-to-top-btn ${isLaunching ? 'launching' : ''}`}
        title={`Back to top (${Math.round(scrollProgress)}% scrolled)`}
        aria-label="Scroll back to top"
      >
        {/* SVG Circular Progress Ring */}
        <svg className="scroll-progress-svg" width="50" height="50" viewBox="0 0 50 50">
          <circle
            className="scroll-progress-track"
            cx="25"
            cy="25"
            r={radius}
            strokeWidth="3.5"
          />
          <circle
            className="scroll-progress-bar"
            cx="25"
            cy="25"
            r={radius}
            strokeWidth="3.5"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeOffset,
            }}
          />
        </svg>

        {/* Center Icon */}
        <span className="back-to-top-icon-wrapper">
          <ChevronUp size={18} strokeWidth={2.6} />
        </span>
      </button>
    </div>
  );
}
