import React, { useState, useEffect } from 'react';

/**
 * Premium page transition overlay with a branded red accent wipe.
 * Renders a full-screen animated bar when `isActive` is true.
 */
export default function PageTransition({ isActive }) {
  const [phase, setPhase] = useState('idle'); // idle | wipe-in | wipe-out

  useEffect(() => {
    if (isActive) {
      setPhase('wipe-in');
      const outTimer = setTimeout(() => setPhase('wipe-out'), 250);
      const doneTimer = setTimeout(() => setPhase('idle'), 500);
      return () => { clearTimeout(outTimer); clearTimeout(doneTimer); };
    }
  }, [isActive]);

  if (phase === 'idle') return null;

  return (
    <div className={`page-transition-overlay page-transition-${phase}`}>
      <div className="page-transition-bar" />
      <div className="page-transition-logo">
        <span>Z</span>
      </div>
    </div>
  );
}
