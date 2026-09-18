import React, { useState, useMemo } from 'react';
import { Wrench, ShoppingBag, X, Sparkles, Bike, Gauge, ShieldCheck } from 'lucide-react';

const SERVICE_PARTS_DATABASE = {
  oil: { name: 'Motul 7100 4T 10W-50 Fully Synthetic (1.5L)', price: 1250, replaceEveryKm: 5000, category: 'Lubricants' },
  oilFilter: { name: 'OEM Micro-Pore High-Flow Oil Filter', price: 280, replaceEveryKm: 5000, category: 'Filters' },
  sparkPlug: { name: 'NGK Laser Iridium High Performance Spark Plug', price: 650, replaceEveryKm: 12000, category: 'Ignition' },
  airFilter: { name: 'BMC High-Performance Washable Air Filter', price: 2199, replaceEveryKm: 15000, category: 'Filters' },
  frontBrakePads: { name: 'Brembo Sintered Ceramic Front Brake Pads', price: 1850, replaceEveryKm: 10000, category: 'Braking' },
  rearBrakePads: { name: 'Organic Composite Rear Brake Shoe/Pads', price: 890, replaceEveryKm: 12000, category: 'Braking' },
  chainSprocket: { name: 'Rolon Brass Coated Heavy-Duty O-Ring Chain Kit', price: 2850, replaceEveryKm: 20000, category: 'Drivetrain' },
  forkOil: { name: 'Maxima Racing Fork Fluid & Dual Oil Seals', price: 950, replaceEveryKm: 25000, category: 'Suspension' }
};

export default function ServiceEstimatorModal({
  isOpen,
  onClose,
  bikeBrands = {},
  activeBike = null,
  onAddToCart,
  onShowToast
}) {
  const brandList = Object.keys(bikeBrands);
  const [selectedBrand, setSelectedBrand] = useState(activeBike?.brand || (brandList.length > 0 ? brandList[0] : 'ROYAL ENFIELD'));
  const [selectedModel, setSelectedModel] = useState(activeBike?.model || (bikeBrands[brandList[0]]?.[0] || 'Classic 350'));
  const [odometerKm, setOdometerKm] = useState(12000);
  const [ridingCondition, setRidingCondition] = useState('mixed'); // 'city', 'highway', 'mixed', 'aggressive'

  // Sync if activeBike changes
  React.useEffect(() => {
    if (activeBike?.brand && activeBike?.model) {
      setSelectedBrand(activeBike.brand);
      setSelectedModel(activeBike.model);
    }
  }, [activeBike]);

  // Model list for selected brand
  const modelList = useMemo(() => {
    return bikeBrands[selectedBrand] || [];
  }, [bikeBrands, selectedBrand]);

  const handleBrandChange = (b) => {
    setSelectedBrand(b);
    const models = bikeBrands[b] || [];
    if (models.length > 0) setSelectedModel(models[0]);
  };

  // Calculate part wear and service requirement based on mileage and riding condition
  const wearCalculations = useMemo(() => {
    const conditionMultiplier = {
      city: 1.2,        // frequent stop and go increases brake & clutch wear
      highway: 0.85,    // smooth cruising extends consumable life
      mixed: 1.0,
      aggressive: 1.4   // track or hard riding wears parts 40% faster
    }[ridingCondition] || 1.0;

    return Object.entries(SERVICE_PARTS_DATABASE).map(([key, item]) => {
      const effectiveMileage = odometerKm * conditionMultiplier;
      const cycleProgress = (effectiveMileage % item.replaceEveryKm) / item.replaceEveryKm;
      const wearPercent = Math.min(100, Math.round(cycleProgress * 100));

      let status = 'good';
      let statusLabel = 'Optimal Condition';
      let statusColor = '#22c55e';

      if (wearPercent >= 80) {
        status = 'replace';
        statusLabel = 'Immediate Replacement Due';
        statusColor = '#ef4444';
      } else if (wearPercent >= 50) {
        status = 'inspect';
        statusLabel = 'Inspection Required Soon';
        statusColor = '#f59e0b';
      }

      return {
        key,
        ...item,
        wearPercent,
        status,
        statusLabel,
        statusColor
      };
    });
  }, [odometerKm, ridingCondition]);

  // Urgent parts that need replacement or inspection
  const urgentParts = useMemo(() => {
    return wearCalculations.filter(p => p.status === 'replace' || p.status === 'inspect');
  }, [wearCalculations]);

  const rawTotalCost = useMemo(() => {
    return urgentParts.reduce((acc, p) => acc + p.price, 0);
  }, [urgentParts]);

  // Discount 12% for bundling full kit
  const bundledDiscount = Math.round(rawTotalCost * 0.12);
  const bundleKitPrice = rawTotalCost - bundledDiscount;

  const handleAddBundleToCart = () => {
    if (urgentParts.length === 0) {
      if (onShowToast) onShowToast('All parts are in optimal condition! No kit needed right now.', 'info');
      return;
    }

    urgentParts.forEach((part) => {
      if (onAddToCart) {
        onAddToCart({
          id: `srv-${part.key}-${selectedModel.toLowerCase().replace(/\s+/g, '-')}`,
          name: `${selectedModel} - ${part.name}`,
          price: part.price,
          category: part.category,
          image: '',
          rating: 5.0,
          reviews: 84
        });
      }
    });

    if (onShowToast) {
      onShowToast(`Added ${urgentParts.length} service spares for ${selectedModel} to cart! (Bundle saved ₹${bundledDiscount.toLocaleString()})`, 'success');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="service-modal-header">
          <div className="service-header-info">
            <div className="service-header-pill">
              <Wrench size={14} /> Zorvns Intelligent Maintenance
            </div>
            <h2>Smart Bike Service Estimator</h2>
            <p>Accurate wear diagnostics, scheduled service checklists, and certified replacement kits</p>
          </div>
          <button className="service-modal-close" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Top Controls Grid */}
        <div className="service-controls-grid">
          {/* Brand & Model Selectors */}
          <div className="service-control-group">
            <label className="service-control-label">
              <Bike size={14} /> Motorcycle Model
            </label>
            <div className="service-select-row">
              <select
                value={selectedBrand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="service-select-input"
              >
                {brandList.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="service-select-input"
              >
                {modelList.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Odometer Quick Selector */}
          <div className="service-control-group">
            <label className="service-control-label">
              <Gauge size={14} /> Odometer Reading: <strong style={{ color: '#00f0ff' }}>{odometerKm.toLocaleString()} KM</strong>
            </label>
            <div className="service-odometer-slider-wrapper">
              <input
                type="range"
                min="1000"
                max="60000"
                step="1000"
                value={odometerKm}
                onChange={(e) => setOdometerKm(Number(e.target.value))}
                className="service-range-slider"
              />
              <div className="service-km-chips">
                {[5000, 10000, 20000, 35000, 50000].map((km) => (
                  <button
                    key={km}
                    type="button"
                    className={`km-chip-btn ${odometerKm === km ? 'active' : ''}`}
                    onClick={() => setOdometerKm(km)}
                  >
                    {km >= 1000 ? `${km / 1000}k` : km} km
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Riding Habit / Environment */}
          <div className="service-control-group">
            <label className="service-control-label">
              <ShieldCheck size={14} /> Riding Environment & Habit
            </label>
            <div className="condition-chips">
              {[
                { id: 'city', label: 'City Traffic (Stop-Go)' },
                { id: 'mixed', label: 'Balanced Mixed (Daily)' },
                { id: 'highway', label: 'Highway Touring' },
                { id: 'aggressive', label: 'Track / High-RPM' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`condition-pill ${ridingCondition === c.id ? 'active' : ''}`}
                  onClick={() => setRidingCondition(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle: Parts Health Diagnostic Grid */}
        <div className="service-breakdown-section">
          <div className="breakdown-header-bar">
            <h3>Component Wear & Interval Diagnostics</h3>
            <span className="health-badge-status">
              {urgentParts.length > 0 ? (
                <span style={{ color: '#ef4444' }}>⚠️ {urgentParts.length} parts need attention</span>
              ) : (
                <span style={{ color: '#22c55e' }}>✅ All components healthy</span>
              )}
            </span>
          </div>

          <div className="service-parts-grid">
            {wearCalculations.map((part) => (
              <div key={part.key} className={`service-part-card status-${part.status}`}>
                <div className="part-card-top">
                  <div className="part-name-block">
                    <span className="part-category-tag">{part.category}</span>
                    <h4 className="part-name-text">{part.name}</h4>
                  </div>
                  <span className="part-price-tag">₹{part.price.toLocaleString('en-IN')}</span>
                </div>

                {/* Progress bar of component life cycle */}
                <div className="part-wear-indicator">
                  <div className="wear-meta-row">
                    <span className="wear-status-txt" style={{ color: part.statusColor }}>
                      {part.statusLabel}
                    </span>
                    <span className="wear-percent-txt">{part.wearPercent}% Life Cycle</span>
                  </div>
                  <div className="wear-progress-track">
                    <div
                      className="wear-progress-fill"
                      style={{
                        width: `${part.wearPercent}%`,
                        backgroundColor: part.statusColor
                      }}
                    />
                  </div>
                  <span className="interval-subtext">Interval: Every {part.replaceEveryKm.toLocaleString()} KM</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Kit Recommendation & 1-Click Bundle Add */}
        <div className="service-modal-bottom-bar">
          <div className="service-bundle-summary">
            <div className="bundle-title-wrap">
              <Sparkles size={20} className="sparkle-icon-spin" />
              <div>
                <h4>Recommended {selectedModel} Overhaul Service Kit</h4>
                <p>Includes {urgentParts.length} essential parts requiring service at {odometerKm.toLocaleString()} KM</p>
              </div>
            </div>

            <div className="service-pricing-breakdown">
              {bundledDiscount > 0 && (
                <span className="service-original-val">₹{rawTotalCost.toLocaleString('en-IN')}</span>
              )}
              <span className="service-final-val">₹{bundleKitPrice.toLocaleString('en-IN')}</span>
              {bundledDiscount > 0 && (
                <span className="service-save-pill">Save ₹{bundledDiscount.toLocaleString('en-IN')} (12% Off)</span>
              )}
            </div>
          </div>

          <div className="service-actions-row">
            <button
              type="button"
              className="service-add-bundle-btn"
              onClick={handleAddBundleToCart}
              disabled={urgentParts.length === 0}
            >
              <ShoppingBag size={18} />
              <span>Add Complete Kit to Cart ({urgentParts.length} Items)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
