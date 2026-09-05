import React from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';

export default function CartDrawer({ cart, isOpen, onClose, onUpdateQty, onRemove, onCheckout, totalPrice }) {
  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <h3>
            <ShoppingBag size={18} color="var(--accent)" />
            Spare Parts Cart
            {cart.length > 0 && (
              <span className="cart-header-count">{cart.reduce((a, c) => a + c.qty, 0)} items</span>
            )}
          </h3>
          <button onClick={onClose} className="cart-close-btn">
            <X size={18} />
          </button>
        </div>

        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={44} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
              <p style={{ fontWeight: 500 }}>Your cart is empty.</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Browse spares to add genuine parts.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cart.map((item, idx) => (
                <div
                  key={item.id}
                  className="cart-item cart-item-enter"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="cart-item-info" style={{ flex: 1 }}>
                    <h4>{item.name}</h4>
                    <span className="cart-item-price">₹{item.price.toFixed(2)}</span>
                    <span className="cart-item-subtotal">
                      = ₹{(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                  <div className="cart-qty-controls">
                    <button onClick={() => onUpdateQty(item.id, -1)} className="cart-qty-btn">
                      <Minus size={12} />
                    </button>
                    <span className="cart-qty-value">{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.id, 1)} className="cart-qty-btn">
                      <Plus size={12} />
                    </button>
                    <button onClick={() => onRemove(item.id)} className="cart-delete-btn">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-subtotal">
              <span className="cart-subtotal-label">Subtotal ({cart.reduce((a, c) => a + c.qty, 0)} items)</span>
              <span className="cart-subtotal-value">₹{totalPrice.toFixed(2)}</span>
            </div>
            <button onClick={onCheckout} className="btn-primary cart-checkout-btn" style={{ width: '100%' }}>
              Checkout &amp; Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
