import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, removeToast }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem',
      pointerEvents: 'none'
    }}>
      {toasts.map(t => (
        <div
          key={t.id}
          className="animate-fade-in-up"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: t.type === 'success' ? 'rgba(16,185,129,0.95)'
              : t.type === 'error' ? 'rgba(239,68,68,0.95)'
              : 'rgba(17,24,39,0.95)',
            color: '#fff',
            padding: '0.8rem 1.15rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            fontSize: '0.88rem',
            fontWeight: 500,
            backdropFilter: 'blur(8px)',
            pointerEvents: 'all',
            maxWidth: '340px',
            border: '1px solid rgba(255,255,255,0.12)'
          }}
        >
          {t.type === 'success' ? <CheckCircle2 size={17} /> : t.type === 'error' ? <AlertCircle size={17} /> : <Info size={17} />}
          <span style={{ flex: 1 }}>{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7, padding: '0 0.2rem' }}
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
