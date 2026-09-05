import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div
          key={t.id}
          className="toast-item toast-slide-in"
          data-type={t.type}
        >
          <div className="toast-icon-wrapper" data-type={t.type}>
            {t.type === 'success' ? <CheckCircle2 size={16} /> : t.type === 'error' ? <AlertCircle size={16} /> : <Info size={16} />}
          </div>
          <span className="toast-message">{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="toast-close-btn"
          >
            <X size={13} />
          </button>
          <div className="toast-progress" data-type={t.type} />
        </div>
      ))}
    </div>
  );
}
