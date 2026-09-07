import React, { useState, useEffect, useRef } from 'react';

/**
 * Animated count-up component.
 * Animates a number from 0 to `end` over `duration` ms when scrolled into view.
 *
 * @param {number} end - Target number
 * @param {number} duration - Animation duration in ms (default 800)
 * @param {string} prefix - String prepended to the number (e.g. '₹')
 * @param {string} suffix - String appended to the number
 * @param {boolean} locale - Format with toLocaleString (default true)
 */
export default function CountUp({ end, duration = 800, prefix = '', suffix = '', locale = true }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();

          const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  const formatted = locale ? value.toLocaleString('en-IN') : value;

  return (
    <span ref={ref} className="count-up-value">
      {prefix}{formatted}{suffix}
    </span>
  );
}
