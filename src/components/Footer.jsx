import React from 'react';
import { Clock, Phone, MapPin, Globe, MessageCircle } from 'lucide-react';

// Simple inline SVG social icons (lucide removed brand icons)
const InstagramIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" />
  </svg>
);

export default function Footer({ zorvnsLogo, onSwitchScreen }) {
  return (
    <footer className="site-footer">
      <div className="app-container footer-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="header-logo" onClick={() => onSwitchScreen('home')} title="ZORVNS - Home">
            <img src={zorvnsLogo} alt="ZORVNS" style={{ height: '38px', maxWidth: '160px', objectFit: 'contain' }} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: '320px' }}>
            Premium motorcycle spare parts & performance components. Trusted by riders, built for enthusiasts.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
            <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} title="Instagram">
              <InstagramIcon size={18} />
            </a>
            <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} title="Facebook">
              <FacebookIcon size={18} />
            </a>
            <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} title="YouTube">
              <YoutubeIcon size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '0.85rem', fontSize: '0.95rem' }}>Store Timings</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={14} color="var(--accent)" />
              <span>Mon - Sat: 9:00 AM - 7:30 PM</span>
            </div>
            <div style={{ paddingLeft: '1.65rem' }}>Sunday: Closed</div>
          </div>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '0.85rem', fontSize: '0.95rem' }}>Contact</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={14} color="var(--accent)" />
              <span>+1 (555) 019-2834</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={14} color="var(--accent)" />
              <span>482 Gearbox Alley, Speedville</span>
            </div>
          </div>
        </div>
      </div>
      <div className="app-container">
        <div className="footer-bottom">
          <p>© 2026 ZORVNS Inc. All Rights Reserved. Crafted for precision rides.</p>
        </div>
      </div>
    </footer>
  );
}
