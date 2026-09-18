import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Flame, Sliders, ShoppingBag, X, Zap } from 'lucide-react';

const ENGINE_PROFILES = [
  {
    id: 'inline4',
    name: 'Inline-4 Superbike',
    subtitle: 'High-Rev Screamer (14,000 RPM)',
    baseFreq: 65,
    maxFreq: 460,
    maxRpm: 14000,
    idleRpm: 1200,
    color: '#00f0ff',
    exhausts: [
      { name: 'Akrapovič Titanium Slip-On', gain: '+4.2 HP', price: 18999, id: 'ex-akr-1' },
      { name: 'SC-Project S1 GP Carbon Exhaust', gain: '+6.1 HP', price: 24499, id: 'ex-sc-1' }
    ]
  },
  {
    id: 'thumper',
    name: 'Single Thumper 350cc',
    subtitle: 'Deep Rhythmic Thump',
    baseFreq: 38,
    maxFreq: 210,
    maxRpm: 7500,
    idleRpm: 950,
    color: '#ff6b00',
    exhausts: [
      { name: 'Zorvns Barrel Short Canister Exhaust', gain: '+2.8 HP', price: 7499, id: 'ex-bar-1' },
      { name: 'Red Rooster Performance Polished Pipe', gain: '+3.5 HP', price: 9200, id: 'ex-rrp-1' }
    ]
  },
  {
    id: 'ptwin',
    name: 'Parallel-Twin 650cc',
    subtitle: 'Throaty Mid-Range Growl',
    baseFreq: 50,
    maxFreq: 340,
    maxRpm: 10500,
    idleRpm: 1100,
    color: '#39ff14',
    exhausts: [
      { name: 'AEW 202 Brushed Dual Slip-Ons', gain: '+5.0 HP', price: 15800, id: 'ex-aew-1' },
      { name: 'Powerage Performance Dual Carbon Exhaust', gain: '+5.8 HP', price: 17500, id: 'ex-pow-1' }
    ]
  },
  {
    id: 'vtwin',
    name: 'V-Twin Cruiser 1200cc',
    subtitle: 'Low-End Torque Burble',
    baseFreq: 32,
    maxFreq: 240,
    maxRpm: 6800,
    idleRpm: 850,
    color: '#ff0055',
    exhausts: [
      { name: 'Vance & Hines Twin Slash Mufflers', gain: '+4.9 HP', price: 29999, id: 'ex-vh-1' },
      { name: 'Cobra Speedster Short Swept System', gain: '+6.4 HP', price: 34999, id: 'ex-cob-1' }
    ]
  }
];

const EXHAUST_MODES = [
  { id: 'stock', name: 'Stock OEM', multiplier: 0.8, bass: 0.8, filterQ: 2 },
  { id: 'slipon', name: 'Slip-On Tuned', multiplier: 1.25, bass: 1.4, filterQ: 4 },
  { id: 'fullsystem', name: 'Race Full System', multiplier: 1.7, bass: 1.9, filterQ: 6 }
];

export default function SoundSimulatorModal({ isOpen, onClose, onAddToCart }) {
  const [selectedEngine, setSelectedEngine] = useState(ENGINE_PROFILES[0]);
  const [exhaustMode, setExhaustMode] = useState(EXHAUST_MODES[1]);
  const [isAudioRunning, setIsAudioRunning] = useState(false);
  const [isThrottleActive, setIsThrottleActive] = useState(false);
  const [currentRpm, setCurrentRpm] = useState(ENGINE_PROFILES[0].idleRpm);
  const [flameBurst, setFlameBurst] = useState(false);
  const [volume, setVolume] = useState(0.7);

  const audioCtxRef = useRef(null);
  const osc1Ref = useRef(null);
  const osc2Ref = useRef(null);
  const filterRef = useRef(null);
  const gainRef = useRef(null);
  const revIntervalRef = useRef(null);
  const flameTimeoutRef = useRef(null);
  const currentRpmRef = useRef(ENGINE_PROFILES[0].idleRpm);

  // Initialize or resume audio context
  const startAudio = async () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Primary Oscillator (Harmonic Engine Tone)
        const osc1 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1Ref.current = osc1;

        // Sub Oscillator (Engine Body Rumble)
        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2Ref.current = osc2;

        // Lowpass Filter simulating cylinder chamber resonance
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 350;
        filter.Q.value = exhaustMode.filterQ;
        filterRef.current = filter;

        // Master Gain
        const gainNode = ctx.createGain();
        gainNode.gain.value = volume;
        gainRef.current = gainNode;

        // Wire connections
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();
      }

      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }

      setIsAudioRunning(true);
    } catch (e) {
      console.warn('Audio Context error:', e);
    }
  };

  const stopAudio = () => {
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend();
    }
    setIsAudioRunning(false);
    setIsThrottleActive(false);
  };

  // Handle engine profile changes
  const handleSelectEngine = (engine) => {
    setSelectedEngine(engine);
    currentRpmRef.current = engine.idleRpm;
    setCurrentRpm(engine.idleRpm);
  };

  // Update audio nodes based on RPM
  const updateAudioPitch = (rpm, engine, mode) => {
    if (!audioCtxRef.current || !osc1Ref.current || !filterRef.current) return;
    const norm = (rpm - engine.idleRpm) / (engine.maxRpm - engine.idleRpm);
    const clampedNorm = Math.max(0, Math.min(1, norm));

    const targetFreq = engine.baseFreq + (engine.maxFreq - engine.baseFreq) * clampedNorm;
    const filterFreq = (200 + clampedNorm * 3200) * (mode.multiplier || 1);

    const now = audioCtxRef.current.currentTime;
    osc1Ref.current.frequency.setTargetAtTime(targetFreq, now, 0.05);
    osc2Ref.current.frequency.setTargetAtTime(targetFreq * 0.5, now, 0.05);
    filterRef.current.frequency.setTargetAtTime(filterFreq, now, 0.05);
  };

  // Throttle physics loop
  useEffect(() => {
    if (!isAudioRunning) return;

    revIntervalRef.current = setInterval(() => {
      const engine = selectedEngine;
      let rpm = currentRpmRef.current;

      if (isThrottleActive) {
        // Accelerating
        const revSpeed = (engine.maxRpm - engine.idleRpm) * 0.065;
        rpm += revSpeed;
        if (rpm >= engine.maxRpm) {
          // Rev limiter bounce & flame pop!
          rpm = engine.maxRpm - (Math.random() * 800 + 400);
          setFlameBurst(true);
          if (flameTimeoutRef.current) clearTimeout(flameTimeoutRef.current);
          flameTimeoutRef.current = setTimeout(() => setFlameBurst(false), 220);
        }
      } else {
        // Decelerating back to idle
        const dropSpeed = (rpm - engine.idleRpm) * 0.12;
        rpm -= Math.max(40, dropSpeed);
        if (rpm <= engine.idleRpm) {
          rpm = engine.idleRpm + (Math.random() * 40 - 20); // subtle idle flutter
        }
      }

      currentRpmRef.current = Math.round(rpm);
      setCurrentRpm(currentRpmRef.current);
      updateAudioPitch(currentRpmRef.current, engine, exhaustMode);
    }, 40);

    return () => {
      if (revIntervalRef.current) clearInterval(revIntervalRef.current);
    };
  }, [isAudioRunning, isThrottleActive, selectedEngine, exhaustMode]);

  // Spacebar hotkey to rev
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !e.repeat && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        if (!isAudioRunning) {
          startAudio();
        }
        setIsThrottleActive(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsThrottleActive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, isAudioRunning]);

  // Handle modal close
  const handleModalClose = () => {
    stopAudio();
    onClose();
  };

  if (!isOpen) return null;

  const rpmProgress = Math.min(1, Math.max(0, (currentRpm - selectedEngine.idleRpm) / (selectedEngine.maxRpm - selectedEngine.idleRpm)));
  const needleAngle = -120 + rpmProgress * 240; // -120deg to +120deg dial
  const isRedlining = currentRpm >= selectedEngine.maxRpm * 0.88;

  return (
    <div className="sound-modal-overlay" onClick={handleModalClose}>
      <div className="sound-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sound-modal-header">
          <div className="sound-modal-title-group">
            <div className="sound-modal-badge">
              <Zap size={14} /> Zorvns Audio Dynamics
            </div>
            <h2>Performance Exhaust Lab</h2>
            <p>Live WebAudio Engine & Exhaust Note Simulator</p>
          </div>
          <button className="sound-modal-close" onClick={handleModalClose} title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Engine Profile Selection Pills */}
        <div className="sound-engine-pills">
          {ENGINE_PROFILES.map((engine) => {
            const isSelected = selectedEngine.id === engine.id;
            return (
              <button
                key={engine.id}
                className={`sound-engine-pill ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelectEngine(engine)}
                style={{ '--accent-engine': engine.color }}
              >
                <div className="pill-dot" />
                <div className="pill-text">
                  <span className="pill-title">{engine.name}</span>
                  <span className="pill-sub">{engine.subtitle}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Central Cockpit Display */}
        <div className="sound-cockpit-grid">
          {/* Left: Interactive Tachometer Gauge */}
          <div className={`sound-gauge-card ${isRedlining ? 'redlining-glow' : ''}`}>
            <div className="gauge-viewport">
              <svg viewBox="0 0 240 240" className="tachometer-svg">
                {/* Dial background arc */}
                <circle
                  cx="120"
                  cy="120"
                  r="95"
                  fill="none"
                  stroke="#1c212d"
                  strokeWidth="16"
                  strokeDasharray="440"
                  strokeDashoffset="110"
                  transform="rotate(120 120 120)"
                />
                {/* Active RPM progress arc */}
                <circle
                  cx="120"
                  cy="120"
                  r="95"
                  fill="none"
                  stroke={isRedlining ? '#ff0055' : selectedEngine.color}
                  strokeWidth="16"
                  strokeDasharray="440"
                  strokeDashoffset={440 - (rpmProgress * 330)}
                  strokeLinecap="round"
                  transform="rotate(120 120 120)"
                  className="gauge-active-arc"
                />
                {/* Redline indicator zone */}
                <circle
                  cx="120"
                  cy="120"
                  r="95"
                  fill="none"
                  stroke="#ff1e42"
                  strokeWidth="6"
                  strokeDasharray="80 360"
                  strokeDashoffset="80"
                  transform="rotate(30 120 120)"
                  opacity="0.6"
                />
                {/* Gauge Needle */}
                <g transform={`rotate(${needleAngle} 120 120)`} className="tachometer-needle-group">
                  <line x1="120" y1="120" x2="120" y2="35" stroke="#ff3838" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="120" cy="120" r="10" fill="#ffffff" />
                  <circle cx="120" cy="120" r="5" fill="#ff2a2a" />
                </g>
              </svg>

              {/* Digital RPM overlay */}
              <div className="digital-rpm-display">
                <span className="digital-rpm-val">{currentRpm.toLocaleString()}</span>
                <span className="digital-rpm-unit">RPM</span>
                {isRedlining && <span className="redline-pill">REV LIMIT</span>}
              </div>

              {/* Exhaust Flame Pop Effect */}
              {flameBurst && (
                <div className="exhaust-flame-burst">
                  <Flame size={48} className="flame-icon-pop" />
                  <span className="pop-sound-tag">💥 BANG!</span>
                </div>
              )}
            </div>

            {/* Throttle Rev Trigger Button */}
            <div className="throttle-action-row">
              <button
                type="button"
                className={`sound-rev-trigger-btn ${isThrottleActive ? 'active-rev' : ''}`}
                onMouseDown={() => {
                  if (!isAudioRunning) startAudio();
                  setIsThrottleActive(true);
                }}
                onMouseUp={() => setIsThrottleActive(false)}
                onMouseLeave={() => setIsThrottleActive(false)}
                onTouchStart={() => {
                  if (!isAudioRunning) startAudio();
                  setIsThrottleActive(true);
                }}
                onTouchEnd={() => setIsThrottleActive(false)}
              >
                <Zap size={20} className={isThrottleActive ? 'spin-zap' : ''} />
                <span>{isThrottleActive ? 'FULL THROTTLE! 🔥' : 'HOLD TO REV (OR SPACEBAR)'}</span>
              </button>

              <button
                type="button"
                className={`sound-audio-toggle ${isAudioRunning ? 'running' : ''}`}
                onClick={isAudioRunning ? stopAudio : startAudio}
                title={isAudioRunning ? 'Mute Engine' : 'Ignite Engine'}
              >
                {isAudioRunning ? <Volume2 size={20} /> : <VolumeX size={20} />}
                <span>{isAudioRunning ? 'Engine Live' : 'Start Engine'}</span>
              </button>
            </div>
          </div>

          {/* Right: Exhaust Setup & Recommendations */}
          <div className="sound-controls-card">
            <h4 className="card-section-title">
              <Sliders size={16} /> Exhaust Setup & Tuning
            </h4>

            {/* Exhaust Mode Selector */}
            <div className="exhaust-mode-selector">
              {EXHAUST_MODES.map((mode) => (
                <button
                  key={mode.id}
                  className={`exhaust-mode-btn ${exhaustMode.id === mode.id ? 'active' : ''}`}
                  onClick={() => setExhaustMode(mode)}
                >
                  <span className="mode-name">{mode.name}</span>
                  <span className="mode-tag">{mode.multiplier}x Resonance</span>
                </button>
              ))}
            </div>

            {/* Engine Specs Quick Card */}
            <div className="engine-specs-box">
              <div className="spec-item">
                <span className="spec-label">Idle RPM</span>
                <span className="spec-val">{selectedEngine.idleRpm} RPM</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Redline</span>
                <span className="spec-val" style={{ color: '#ff3b30' }}>{selectedEngine.maxRpm} RPM</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Decibel Range</span>
                <span className="spec-val">88 dB - 114 dB</span>
              </div>
            </div>

            {/* Recommended High-Performance Exhausts for This Tone */}
            <div className="sound-recommended-shelf">
              <h5 className="shelf-heading">Recommended Systems For This Sound:</h5>
              <div className="shelf-items-list">
                {selectedEngine.exhausts.map((ex) => (
                  <div key={ex.id} className="sound-product-row">
                    <div className="product-row-info">
                      <span className="sound-product-name">{ex.name}</span>
                      <div className="sound-product-meta">
                        <span className="power-gain">{ex.gain}</span>
                        <span className="sound-price">₹{ex.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="sound-add-cart-btn"
                      onClick={() => {
                        if (onAddToCart) {
                          onAddToCart({
                            id: ex.id,
                            name: ex.name,
                            price: ex.price,
                            category: 'Exhaust Systems',
                            image: '',
                            rating: 4.9,
                            reviews: 42
                          });
                        }
                      }}
                      title="Add to Cart"
                    >
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <div className="sound-modal-footer">
          <span>⚡ Built with Web Audio API DSP Synthesis • Pure Dynamic Frequency & Harmonic Modelling</span>
        </div>
      </div>
    </div>
  );
}
