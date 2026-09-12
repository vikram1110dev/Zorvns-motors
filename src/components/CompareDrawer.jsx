import React from 'react';
import { X, GitCompareArrows, Star, ShoppingBag } from 'lucide-react';
import StarRating from './StarRating';

/**
 * Bottom sticky bar + full comparison modal for up to 3 products.
 */
export default function CompareDrawer({
  items = [],
  onRemove,
  onClear,
  onAddToCart,
  onViewProduct,
}) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (items.length === 0) return null;

  return (
    <>
      {/* Sticky Bottom Bar */}
      <div className="compare-bar">
        <div className="compare-bar-inner">
          <div className="compare-bar-left">
            <GitCompareArrows size={18} color="var(--accent)" />
            <span className="compare-bar-count">{items.length} item{items.length > 1 ? 's' : ''} to compare</span>
          </div>
          <div className="compare-bar-items">
            {items.map((item) => (
              <div key={item.id} className="compare-bar-chip">
                <span>{item.name.length > 20 ? item.name.slice(0, 20) + '…' : item.name}</span>
                <button onClick={() => onRemove(item.id)} className="compare-bar-chip-x" aria-label={`Remove ${item.name}`}>
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <div className="compare-bar-actions">
            <button className="btn-primary compare-bar-btn" onClick={() => setIsExpanded(true)} disabled={items.length < 2}>
              <GitCompareArrows size={14} />
              Compare Now
            </button>
            <button className="btn-secondary compare-bar-clear" onClick={onClear}>
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Comparison Modal */}
      {isExpanded && (
        <div className="compare-overlay" onClick={() => setIsExpanded(false)}>
          <div className="compare-modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="compare-modal-header">
              <h3><GitCompareArrows size={20} /> Product Comparison</h3>
              <button className="compare-modal-close" onClick={() => setIsExpanded(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="compare-table-wrapper">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th className="compare-label-col">Feature</th>
                    {items.map((item) => (
                      <th key={item.id} className="compare-product-col">
                        <div className="compare-product-header">
                          {item.images && item.images.length > 0 ? (
                            <img src={item.images[0].trim()} alt={item.name} className="compare-product-img" />
                          ) : (
                            <div className="compare-product-img-placeholder">
                              <ShoppingBag size={28} color="var(--text-light)" />
                            </div>
                          )}
                          <span className="compare-product-name">{item.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <CompareRow label="Price" items={items} render={(i) => (
                    <span className="compare-price">₹{Math.round(i.price).toLocaleString('en-IN')}</span>
                  )} highlight="lowest" getValue={(i) => i.price} />

                  <CompareRow label="Rating" items={items} render={(i) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <StarRating rating={i.rating} />
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{i.rating}</span>
                    </div>
                  )} highlight="highest" getValue={(i) => i.rating} />

                  <CompareRow label="Stock" items={items} render={(i) => (
                    <span style={{ color: i.stock > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                      {i.stock > 0 ? `${i.stock} available` : 'Out of stock'}
                    </span>
                  )} highlight="highest" getValue={(i) => i.stock} />

                  <CompareRow label="Category" items={items} render={(i) => (
                    <span className="compare-category-badge">{i.category}</span>
                  )} />

                  <CompareRow label="Compatibility" items={items} render={(i) => (
                    <div className="compare-compat-list">
                      {(i.compatibility || []).slice(0, 4).map(b => (
                        <span key={b} className="compat-badge" style={{ fontSize: '0.68rem' }}>{b}</span>
                      ))}
                      {(i.compatibility || []).length > 4 && (
                        <span className="compat-badge" style={{ fontSize: '0.68rem' }}>+{i.compatibility.length - 4}</span>
                      )}
                    </div>
                  )} />

                  <tr>
                    <td className="compare-label-col">Actions</td>
                    {items.map((item) => (
                      <td key={item.id} className="compare-product-col">
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button className="btn-primary" style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }} onClick={(e) => { onAddToCart(item, e); }}>
                            <ShoppingBag size={13} /> Add to Cart
                          </button>
                          <button className="btn-secondary" style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }} onClick={() => { setIsExpanded(false); onViewProduct(item); }}>
                            View
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** A comparison table row with optional color-coded best-value highlighting */
function CompareRow({ label, items, render, highlight, getValue }) {
  let bestIdx = -1;
  if (highlight && getValue) {
    const values = items.map(getValue);
    if (highlight === 'lowest') {
      bestIdx = values.indexOf(Math.min(...values));
    } else if (highlight === 'highest') {
      bestIdx = values.indexOf(Math.max(...values));
    }
  }

  return (
    <tr>
      <td className="compare-label-col">{label}</td>
      {items.map((item, idx) => (
        <td
          key={item.id}
          className={`compare-product-col ${idx === bestIdx ? 'compare-best' : ''}`}
        >
          {render(item)}
        </td>
      ))}
    </tr>
  );
}
