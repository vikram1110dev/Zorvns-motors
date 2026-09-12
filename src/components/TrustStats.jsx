import React, { useState, useEffect, useRef } from 'react';
import { Package, Bike, Star, Truck } from 'lucide-react';
import CountUp from './CountUp';

const STATS = [
  { icon: Package, value: 10000, suffix: '+', label: 'Parts Sold', color: '#E53935' },
  { icon: Bike, value: 500, suffix: '+', label: 'Bike Models', color: '#F59E0B' },
  { icon: Star, value: 4.9, suffix: '★', label: 'Avg Rating', decimals: 1, color: '#10B981' },
  { icon: Truck, value: 24, suffix: 'hr', label: 'Fast Delivery', color: '#3B82F6' },
];

export default function TrustStats() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="trust-stats-strip">
      {STATS.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <React.Fragment key={stat.label}>
            {idx > 0 && <div className="trust-stats-divider" />}
            <div
              className={`trust-stat-item ${isVisible ? 'trust-stat-visible' : ''}`}
              style={{ animationDelay: `${idx * 120}ms` }}
            >
              <div className="trust-stat-icon-wrap" style={{ '--stat-color': stat.color }}>
                <span className="trust-stat-icon-pulse" />
                <Icon size={24} strokeWidth={1.8} />
              </div>
              <div className="trust-stat-content">
                <span className="trust-stat-value">
                  {isVisible ? (
                    <>
                      {stat.decimals ? (
                        <span>{stat.value}</span>
                      ) : (
                        <CountUp end={stat.value} duration={1200} />
                      )}
                      <span className="trust-stat-suffix">{stat.suffix}</span>
                    </>
                  ) : (
                    <span>0</span>
                  )}
                </span>
                <span className="trust-stat-label">{stat.label}</span>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
