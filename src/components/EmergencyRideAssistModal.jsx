import React, { useState, useEffect } from 'react';
import { PhoneCall, AlertOctagon, MapPin, Navigation, MessageSquare, ShieldAlert, CheckCircle, Copy, X, Wrench, BatteryCharging, Disc } from 'lucide-react';

const EMERGENCY_SERVICES = [
  { id: 'tyre', label: 'Flat Tyre / Puncture', desc: 'Mobile puncture repair & portable air inflator dispatch', icon: Disc },
  { id: 'battery', label: 'Dead Battery / Jumpstart', desc: '12V Booster jumpstart & alternator check', icon: BatteryCharging },
  { id: 'chain', label: 'Snapped Chain / Cable', desc: 'Drive chain link replacement & throttle/clutch cable fix', icon: Wrench },
  { id: 'fuel', label: 'Fuel Exhaustion', desc: 'Emergency 3-5L petrol delivery directly to highway spot', icon: AlertOctagon }
];

export default function EmergencyRideAssistModal({
  isOpen,
  onClose,
  activeBike = null
}) {
  const [selectedIssue, setSelectedIssue] = useState('tyre');
  const [riderName, setRiderName] = useState('');
  const [riderPhone, setRiderPhone] = useState('');
  const [bikeDesc, setBikeDesc] = useState(activeBike ? `${activeBike.brand} ${activeBike.model}` : '');
  const [coords, setCoords] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState('');
  const [copied, setCopied] = useState(false);

  // Sync bike desc if activeBike is provided
  useEffect(() => {
    if (activeBike?.brand && activeBike?.model && !bikeDesc) {
      setBikeDesc(`${activeBike.brand} ${activeBike.model}`);
    }
  }, [activeBike]);

  // Fetch current geolocation
  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      return;
    }

    setLocLoading(true);
    setLocError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude.toFixed(5),
          longitude: pos.coords.longitude.toFixed(5),
          accuracy: Math.round(pos.coords.accuracy)
        });
        setLocLoading(false);
      },
      (err) => {
        setLocLoading(false);
        setLocError('Location permission denied or unavailable. You can enter your landmark manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Auto trigger location fetch on modal open
  useEffect(() => {
    if (isOpen && !coords && !locLoading) {
      fetchLocation();
    }
  }, [isOpen]);

  const copyCoordinates = () => {
    if (!coords) return;
    const text = `${coords.latitude}, ${coords.longitude}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate WhatsApp SOS link
  const generateWhatsAppLink = () => {
    const issueObj = EMERGENCY_SERVICES.find(s => s.id === selectedIssue);
    const locationText = coords
      ? `https://maps.google.com/?q=${coords.latitude},${coords.longitude} (Lat: ${coords.latitude}, Lng: ${coords.longitude})`
      : 'Highway / Spot Location to be shared';

    const message = `🚨 *URGENT: ZORVNS ROADSIDE ASSISTANCE (SOS)* 🚨%0A%0A` +
      `*Rider Name:* ${riderName || 'Stranded Rider'}%0A` +
      `*Contact:* ${riderPhone || 'Not provided'}%0A` +
      `*Bike:* ${bikeDesc || 'Motorcycle'}%0A` +
      `*Issue:* ${issueObj?.label || selectedIssue}%0A` +
      `*Live GPS:* ${locationText}%0A%0A` +
      `_Please dispatch nearest partner breakdown van immediately!_`;

    return `https://wa.me/919876543210?text=${message}`;
  };

  if (!isOpen) return null;

  return (
    <div className="ride-assist-overlay" onClick={onClose}>
      <div className="ride-assist-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ride-assist-header">
          <div className="sos-badge-pulse">
            <span className="sos-dot" /> 24/7 EMERGENCY SOS
          </div>
          <h2>Zorvns RideAssist™ Breakdown Dispatch</h2>
          <p>Instant highway breakdown support, mobile puncture van & live GPS dispatch</p>
          <button className="ride-assist-close" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="ride-assist-body">
          {/* Issue Type Selection */}
          <div className="assist-field-group">
            <label className="assist-label">Select Breakdown Emergency:</label>
            <div className="assist-issue-grid">
              {EMERGENCY_SERVICES.map((srv) => {
                const IconComponent = srv.icon;
                const isSelected = selectedIssue === srv.id;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    className={`assist-issue-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedIssue(srv.id)}
                  >
                    <IconComponent size={22} className="assist-issue-icon" />
                    <div className="assist-issue-texts">
                      <span className="assist-issue-title">{srv.label}</span>
                      <span className="assist-issue-desc">{srv.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* GPS Location Tracker */}
          <div className="assist-location-box">
            <div className="assist-location-header">
              <div className="loc-title-wrap">
                <MapPin size={18} className="loc-pin-icon" />
                <span>Live GPS Breakdown Location</span>
              </div>
              <button
                type="button"
                className="loc-refresh-btn"
                onClick={fetchLocation}
                disabled={locLoading}
              >
                <Navigation size={13} /> {locLoading ? 'Detecting...' : 'Re-Detect GPS'}
              </button>
            </div>

            {coords ? (
              <div className="loc-coords-display">
                <span className="coords-text">
                  📍 {coords.latitude}° N, {coords.longitude}° E (Accurate within {coords.accuracy}m)
                </span>
                <button
                  type="button"
                  className="coords-copy-btn"
                  onClick={copyCoordinates}
                  title="Copy Lat/Lng"
                >
                  {copied ? <CheckCircle size={14} color="#22c55e" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy GPS'}</span>
                </button>
              </div>
            ) : locLoading ? (
              <div className="loc-status-text">🛰️ Ping in progress... fetching highway satellite coordinates.</div>
            ) : (
              <div className="loc-status-text error">{locError || 'Click Re-Detect GPS to capture exact location'}</div>
            )}
          </div>

          {/* Rider and Bike Details */}
          <div className="assist-form-row">
            <div className="assist-input-col">
              <label className="assist-sublabel">Your Name</label>
              <input
                type="text"
                placeholder="e.g. Vikram Sharma"
                value={riderName}
                onChange={(e) => setRiderName(e.target.value)}
                className="assist-text-input"
              />
            </div>
            <div className="assist-input-col">
              <label className="assist-sublabel">Your Phone Number</label>
              <input
                type="tel"
                placeholder="e.g. +91 98765 00000"
                value={riderPhone}
                onChange={(e) => setRiderPhone(e.target.value)}
                className="assist-text-input"
              />
            </div>
            <div className="assist-input-col">
              <label className="assist-sublabel">Bike Brand & Model</label>
              <input
                type="text"
                placeholder="e.g. Continental GT 650"
                value={bikeDesc}
                onChange={(e) => setBikeDesc(e.target.value)}
                className="assist-text-input"
              />
            </div>
          </div>

          {/* Direct Actions (WhatsApp SOS & Direct Call) */}
          <div className="assist-cta-grid">
            <a
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="assist-whatsapp-btn"
            >
              <MessageSquare size={20} />
              <div className="cta-text-wrap">
                <span className="cta-headline">Dispatch Recovery via WhatsApp</span>
                <span className="cta-sub">Auto-sends GPS coordinates & details</span>
              </div>
            </a>

            <a href="tel:+919876543210" className="assist-call-btn">
              <PhoneCall size={20} />
              <div className="cta-text-wrap">
                <span className="cta-headline">Call 24/7 Helpline</span>
                <span className="cta-sub">1800-ZORVNS-HELP (+91 98765 43210)</span>
              </div>
            </a>
          </div>

          {/* Safety instructions banner */}
          <div className="assist-safety-tip">
            <ShieldAlert size={16} />
            <span>
              <strong>Highway Safety Rule:</strong> Park your motorcycle behind the safety guardrail if stranded on high-speed expressways. Keep hazard indicators flashing.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
