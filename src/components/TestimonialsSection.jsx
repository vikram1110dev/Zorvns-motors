import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Arjun Mehta',
    bike: 'Royal Enfield Classic 350',
    avatar: null,
    rating: 5,
    text: "Zorvns is my go-to for genuine spares. The Brembo brake pads I ordered were top quality and arrived faster than expected. Highly recommended!",
  },
  {
    id: 2,
    name: 'Priya Sharma',
    bike: 'KTM Duke 390',
    avatar: null,
    rating: 5,
    text: "I was struggling to find a K&N filter for my Duke. Zorvns had it in stock and the fitment was perfect. Their customer service is excellent too.",
  },
  {
    id: 3,
    name: 'Rahul Verma',
    bike: 'Yamaha R15 V4',
    avatar: null,
    rating: 4,
    text: "Great selection of performance parts at competitive prices. The CNC levers I bought look and feel premium. Will definitely order again.",
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    bike: 'Honda CB350 H\'ness',
    avatar: null,
    rating: 5,
    text: "Motul 300V oil from Zorvns — my engine has never felt smoother. Authentic products with proper packaging. These guys know their stuff!",
  },
  {
    id: 5,
    name: 'Vikram Singh',
    bike: 'BMW GS 310',
    avatar: null,
    rating: 5,
    text: "The DID chain I ordered was a perfect upgrade. Zorvns provided installation tips too. Real riders supporting riders!",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState('next');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((idx, dir) => {
    if (isAnimating) return;
    setDirection(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setIsAnimating(false);
    }, 400);
  }, [isAnimating]);

  const goNext = useCallback(() => {
    const next = (current + 1) % TESTIMONIALS.length;
    goTo(next, 'next');
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    const prev = (current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
    goTo(prev, 'prev');
  }, [current, goTo]);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(goNext, 5000);
    return () => clearInterval(timerRef.current);
  }, [goNext, isPaused]);

  const t = TESTIMONIALS[current];

  // Generate initials for avatar
  const initials = t.name.split(' ').map(w => w[0]).join('').slice(0, 2);

  return (
    <div
      className="testimonials-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="testimonials-header">
        <span className="section-subtitle">WHAT RIDERS SAY</span>
        <h2 className="section-title" style={{ textTransform: 'uppercase', letterSpacing: '1.5px' }}>
          Customer Testimonials
        </h2>
      </div>

      <div className="testimonials-carousel">
        {/* Navigation arrows */}
        <button className="testimonial-nav testimonial-nav-prev" onClick={goPrev} aria-label="Previous testimonial">
          <ChevronLeft size={20} />
        </button>

        <div className={`testimonial-card glass-panel ${isAnimating ? `testimonial-exit-${direction}` : 'testimonial-enter'}`}>
          <div className="testimonial-quote-icon">
            <Quote size={28} />
          </div>

          <div className="testimonial-stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < t.rating ? '#F59E0B' : 'none'}
                color={i < t.rating ? '#F59E0B' : '#D1D5DB'}
                strokeWidth={1.5}
              />
            ))}
          </div>

          <p className="testimonial-text">"{t.text}"</p>

          <div className="testimonial-author">
            <div className="testimonial-avatar">
              {t.avatar ? (
                <img src={t.avatar} alt={t.name} />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="testimonial-author-info">
              <span className="testimonial-name">{t.name}</span>
              <span className="testimonial-bike">{t.bike}</span>
            </div>
          </div>
        </div>

        <button className="testimonial-nav testimonial-nav-next" onClick={goNext} aria-label="Next testimonial">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dots */}
      <div className="testimonial-dots">
        {TESTIMONIALS.map((_, idx) => (
          <button
            key={idx}
            className={`testimonial-dot ${idx === current ? 'active' : ''}`}
            onClick={() => goTo(idx, idx > current ? 'next' : 'prev')}
            aria-label={`Go to testimonial ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
