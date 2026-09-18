import React, { useState } from 'react';
import { Bike, Plus, Trash2, X, Check, ShieldCheck, Wrench, ChevronRight } from 'lucide-react';

export default function MyGarageModal({
  isOpen,
  onClose,
  garageBikes = [],
  activeBike = null,
  onSelectActiveBike,
  onAddBike,
  onRemoveBike,
  bikeBrands = {},
  onBrowseCatalog,
  onOpenServiceEstimator
}) {
  const [newBrand, setNewBrand] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newYear, setNewYear] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const brandKeys = Object.keys(bikeBrands || {});
  const availableModels = (newBrand && bikeBrands[newBrand]) ? bikeBrands[newBrand] : [];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newBrand || !newModel) return;

    onAddBike({
      brand: newBrand,
      model: newModel,
      year: newYear.trim() || undefined,
      nickname: newNickname.trim() || undefined
    });

    // Reset form
    setNewBrand('');
    setNewModel('');
    setNewYear('');
    setNewNickname('');
    setIsAdding(false);
  };

  return (
    <div className="wishlist-overlay" onClick={onClose}>
      <div
        className="glass-panel garage-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="garage-title"
      >
        {/* Header */}
        <div className="garage-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="garage-icon-badge">
              <Bike size={22} color="var(--primary)" />
            </div>
            <div>
              <h2 id="garage-title" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                My Garage
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                Save your motorcycles for instant 1-click fitment filtering
              </p>
            </div>
          </div>
          <button onClick={onClose} className="cart-close-btn" aria-label="Close My Garage">
            <X size={20} />
          </button>
        </div>

        {/* Active Fitment Filter Banner */}
        {activeBike ? (
          <div className="garage-active-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span className="garage-pulse-dot" />
              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#10B981', fontWeight: 700 }}>
                  Active Fitment Filter
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {activeBike.brand} {activeBike.model}
                  {activeBike.nickname && <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: '6px' }}>({activeBike.nickname})</span>}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                onClick={() => onSelectActiveBike(null)}
                title="Clear bike filter to view all parts"
              >
                Clear Filter
              </button>
              {onBrowseCatalog && (
                <button
                  type="button"
                  className="btn-primary"
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
                  onClick={() => {
                    onClose();
                    onBrowseCatalog();
                  }}
                >
                  Shop Parts <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="garage-inactive-banner">
            <ShieldCheck size={18} color="var(--text-muted)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              No active filter. Select a bike below to only show compatible parts.
            </span>
          </div>
        )}

        {/* Garage Content */}
        <div className="garage-body">
          {/* Saved Bikes List */}
          <div className="garage-list-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '0.92rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: 0, fontWeight: 700 }}>
                Saved Motorcycles ({garageBikes.length})
              </h3>
              {!isAdding && (
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  onClick={() => setIsAdding(true)}
                >
                  <Plus size={15} /> Add Bike
                </button>
              )}
            </div>

            {garageBikes.length === 0 ? (
              <div className="garage-empty-state">
                <div className="garage-empty-icon">
                  <Bike size={36} color="var(--primary)" style={{ opacity: 0.6 }} />
                </div>
                <h4 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1rem', fontWeight: 700 }}>Your Garage is Empty</h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '320px' }}>
                  Add your motorcycle once to guarantee that every spare part you view is 100% compatible with your ride.
                </p>
                {!isAdding && (
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ marginTop: '1rem', padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
                    onClick={() => setIsAdding(true)}
                  >
                    <Plus size={16} /> Add Your First Motorcycle
                  </button>
                )}
              </div>
            ) : (
              <div className="garage-cards-grid">
                {garageBikes.map((bike) => {
                  const isActive = activeBike && activeBike.id === bike.id;
                  return (
                    <div
                      key={bike.id}
                      className={`garage-bike-card ${isActive ? 'active-bike' : ''}`}
                    >
                      <div className="garage-bike-info">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="garage-brand-tag">{bike.brand}</span>
                          {bike.year && <span className="garage-year-tag">{bike.year}</span>}
                          {isActive && (
                            <span className="garage-active-tag">
                              <Check size={12} /> Active Filter
                            </span>
                          )}
                        </div>
                        <h4 className="garage-bike-title">{bike.model}</h4>
                        {bike.nickname && (
                          <span className="garage-bike-nickname">"{bike.nickname}"</span>
                        )}
                      </div>

                      <div className="garage-card-actions">
                        {isActive ? (
                          <button
                            type="button"
                            className="btn-secondary active-btn"
                            onClick={() => onSelectActiveBike(null)}
                            title="Turn off compatibility filter"
                          >
                            <Check size={14} color="#10B981" /> Selected
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn-primary-ghost"
                            onClick={() => onSelectActiveBike(bike)}
                            title={`Filter store for ${bike.brand} ${bike.model}`}
                          >
                            Select for Filter
                          </button>
                        )}
                        {onOpenServiceEstimator && (
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ padding: '0.4rem 0.65rem', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                            onClick={() => {
                              onSelectActiveBike(bike);
                              onClose();
                              onOpenServiceEstimator();
                            }}
                            title={`Check service intervals & spares for ${bike.model}`}
                          >
                            <Wrench size={13} color="#f59e0b" /> Service
                          </button>
                        )}
                        <button
                          type="button"
                          className="garage-delete-btn"
                          onClick={() => onRemoveBike(bike.id)}
                          title="Remove bike from garage"
                          aria-label={`Remove ${bike.brand} ${bike.model}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add Bike Drawer / Form */}
          {isAdding && (
            <form className="garage-add-form animate-fade-in" onSubmit={handleAddSubmit}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Wrench size={16} color="var(--primary)" /> Add Motorcycle to Garage
                </h4>
                <button
                  type="button"
                  className="cart-close-btn"
                  onClick={() => setIsAdding(false)}
                  style={{ width: '24px', height: '24px' }}
                >
                  <X size={15} />
                </button>
              </div>

              <div className="garage-form-grid">
                <div>
                  <label className="garage-form-label">Motorcycle Brand *</label>
                  <select
                    className="garage-select"
                    value={newBrand}
                    required
                    onChange={(e) => {
                      setNewBrand(e.target.value);
                      setNewModel('');
                    }}
                  >
                    <option value="">-- Choose Brand --</option>
                    {brandKeys.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="garage-form-label">Model *</label>
                  <select
                    className="garage-select"
                    value={newModel}
                    required
                    disabled={!newBrand}
                    onChange={(e) => setNewModel(e.target.value)}
                  >
                    <option value="">{newBrand ? '-- Choose Model --' : '-- First Select Brand --'}</option>
                    {availableModels.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="garage-form-label">Year (Optional)</label>
                  <input
                    type="text"
                    className="garage-input"
                    placeholder="e.g. 2023"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    maxLength={4}
                  />
                </div>

                <div>
                  <label className="garage-form-label">Nickname (Optional)</label>
                  <input
                    type="text"
                    className="garage-input"
                    placeholder="e.g. Daily Ride, Track Machine"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    maxLength={24}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!newBrand || !newModel}
                >
                  <Plus size={15} /> Save to My Garage
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
