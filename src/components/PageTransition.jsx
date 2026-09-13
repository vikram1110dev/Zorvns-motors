import React, { useState, useEffect, useRef } from 'react';

/**
 * Premium page transition overlay with a branded red accent wipe.
 * Wipes across screen smoothly on route changes and never gets stuck.
 */
export default function PageTransition({ isActive }) {
  const [phase, setPhase] = useState('idle'); // idle | wipe-in | wipe-out
  const phaseRef = useRef('idle');
  const timer1Ref = useRef(null);
  const timer2Ref = useRef(null);

  const updatePhase = (newPhase) => {
    phaseRef.current = newPhase;
    setPhase(newPhase);
  };

  const clearTimers = () => {
    if (timer1Ref.current) {
      clearTimeout(timer1Ref.current);
      timer1Ref.current = null;
    }
    if (timer2Ref.current) {
      clearTimeout(timer2Ref.current);
      timer2Ref.current = null;
    }
  };

  useEffect(() => {
    if (isActive) {
      clearTimers();
      updatePhase('wipe-in');

      // Safety timeout: If isActive stays true or switch hangs, auto wipe-out
      timer1Ref.current = setTimeout(() => {
        updatePhase('wipe-out');
        timer2Ref.current = setTimeout(() => {
          updatePhase('idle');
        }, 260);
      }, 300);
    } else if (phaseRef.current === 'wipe-in') {
      // Screen switch finished; start wipe-out to reveal the new page
      clearTimers();
      updatePhase('wipe-out');
      timer2Ref.current = setTimeout(() => {
        updatePhase('idle');
      }, 260);
    }
  }, [isActive]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => clearTimers();
  }, []);

  if (phase === 'idle') return null;

  return (
    <div className={`page-transition-overlay page-transition-${phase}`} aria-hidden="true">
      <div className="page-transition-bar" />
      <div className="page-transition-logo">
        <span>Z</span>
      </div>
    </div>
  );
}
