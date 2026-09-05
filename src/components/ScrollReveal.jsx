import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

/**
 * Wrapper component that reveals its children with a fade-in-up animation
 * when they scroll into view.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number} props.delay - Animation delay in ms (for staggering), default 0
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.as - Element tag to render, default 'div'
 * @param {number} props.threshold - IntersectionObserver threshold, default 0.15
 */
export default function ScrollReveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
  threshold = 0.15,
  ...rest
}) {
  const { ref, isVisible } = useScrollReveal({ threshold });

  return (
    <Tag
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...rest.style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
