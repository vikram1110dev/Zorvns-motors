import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  X,
  ChevronRight,
  ExternalLink,
  Printer,
  MessageSquare,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';

export default function TrackOrderModal({
  isOpen,
  onClose,
  recentOrders = [],
  initialOrderId = null,
  onContactSupport
}) {
  const [searchId, setSearchId] = useState('');
  const [activeOrder, setActiveOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // Demo order for testing if no orders exist or for quick preview
  const demoOrder = {
    orderId: 'ZOR-2026-882194',
    date: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 48 * 3600 * 1000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
    shippingMethod: 'express',
    paymentMethod: 'UPI / Online Payment (Prepaid)',
    status: 'in_transit',
    trackingNumber: 'BLR-884920194',
    carrier: 'BlueDart Express',
    currentLocation: 'Hub Sort Facility, Bengaluru',
    customer: {
      name: 'Vikram Sharma',
      email: 'vikram@example.com',
      phone: '+91 98765 43210'
    },
    address: {
      street: '124, 4th Main Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038'
    },
    items: [
      {
        id: 'demo-1',
        name: 'Ceramic High-Performance Brake Pads',
        category: 'Brakes',
        price: 1850,
        qty: 1
      },
      {
        id: 'demo-2',
        name: 'Iridium Spark Plug IX',
        category: 'Ignition',
        price: 750,
        qty: 2
      }
    ],
    finalTotal: 3350
  };

  // Select initial order if provided or set first recent order
  useEffect(() => {
    if (initialOrderId) {
      const match = recentOrders.find(o => o.orderId.toLowerCase() === initialOrderId.toLowerCase());
      if (match) {
        setActiveOrder(match);
        setSearchId(match.orderId);
      } else if (initialOrderId === demoOrder.orderId) {
        setActiveOrder(demoOrder);
        setSearchId(demoOrder.orderId);
      }
    } else if (recentOrders.length > 0 && !activeOrder) {
      setActiveOrder(recentOrders[0]);
      setSearchId(recentOrders[0].orderId);
    }
  }, [initialOrderId, recentOrders]);

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e?.preventDefault();
    setNotFound(false);
    const query = searchId.trim().toUpperCase();
    if (!query) return;

    // Search in user's recent orders
    const match = recentOrders.find(
      o => o.orderId.toUpperCase() === query ||
           (o.customer?.phone && o.customer.phone.includes(query))
    );

    if (match) {
      setActiveOrder(match);
      setNotFound(false);
    } else if (query === demoOrder.orderId || query.includes('882194')) {
      setActiveOrder(demoOrder);
      setNotFound(false);
    } else {
      setNotFound(true);
    }
  };

  const loadDemo = () => {
    setSearchId(demoOrder.orderId);
    setActiveOrder(demoOrder);
    setNotFound(false);
  };

  // Determine timeline step states
  // Steps: 1. Confirmed, 2. Packed, 3. In Transit, 4. Delivered
  const getStepStatus = (stepIndex) => {
    // Demo is step 3 (in transit)
    if (activeOrder?.orderId === demoOrder.orderId) {
      if (stepIndex <= 3) return 'completed';
      return 'pending';
    }

    // For real user orders, calculate based on order placement date
    const placedTime = activeOrder?.date ? new Date(activeOrder.date).getTime() : Date.now();
    const elapsedHours = (Date.now() - placedTime) / (1000 * 3600);

    if (elapsedHours < 2) {
      return stepIndex === 1 ? 'completed' : stepIndex === 2 ? 'current' : 'pending';
    } else if (elapsedHours < 24) {
      return stepIndex <= 2 ? 'completed' : stepIndex === 3 ? 'current' : 'pending';
    } else if (elapsedHours < 72) {
      return stepIndex <= 3 ? 'completed' : stepIndex === 4 ? 'current' : 'pending';
    } else {
      return 'completed';
    }
  };

  return (
    <div className="wishlist-overlay" onClick={onClose}>
      <div
        className="glass-panel track-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="track-title"
      >
        {/* Modal Header */}
        <div className="track-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="track-icon-badge">
              <Truck size={22} color="var(--primary)" />
            </div>
            <div>
              <h2 id="track-title" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                Track Order & Service
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                Real-time dispatch updates, shipment tracking & delivery status
              </p>
            </div>
          </div>
          <button onClick={onClose} className="cart-close-btn" aria-label="Close tracking modal">
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <form className="track-search-form" onSubmit={handleSearch}>
          <div className="track-input-wrapper">
            <Search size={18} className="track-input-icon" />
            <input
              type="text"
              className="track-input"
              placeholder="Enter Order ID (e.g. ZOR-2026-882194) or Phone Number"
              value={searchId}
              onChange={(e) => {
                setSearchId(e.target.value);
                setNotFound(false);
              }}
            />
            {searchId && (
              <button
                type="button"
                className="cart-close-btn"
                style={{ width: '22px', height: '22px', marginRight: '0.25rem' }}
                onClick={() => {
                  setSearchId('');
                  setNotFound(false);
                }}
              >
                <X size={14} />
              </button>
            )}
            <button type="submit" className="btn-primary" style={{ padding: '0.55rem 1.1rem', fontSize: '0.82rem' }}>
              Track
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Looking for a sample?{' '}
              <button
                type="button"
                className="track-link-btn"
                onClick={loadDemo}
              >
                Test demo order #{demoOrder.orderId}
              </button>
            </span>
          </div>
        </form>

        {/* Not Found Alert */}
        {notFound && (
          <div className="track-notfound animate-fade-in">
            <AlertCircle size={18} color="#EF4444" />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Order Not Found</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                We couldn't find an order matching "{searchId}". Please check your order ID or test with our sample order.
              </div>
            </div>
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', marginLeft: 'auto' }}
              onClick={loadDemo}
            >
              Try Demo
            </button>
          </div>
        )}

        <div className="track-body">
          {/* Active Order Details */}
          {activeOrder ? (
            <div className="track-order-details animate-fade-in">
              {/* Top Order Badge Banner */}
              <div className="track-status-banner">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                      ORDER #{activeOrder.orderId}
                    </span>
                    <span className="track-live-pill">
                      <span className="garage-pulse-dot" />
                      IN TRANSIT
                    </span>
                  </div>
                  <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.1rem', fontWeight: 800 }}>
                    Estimated Delivery: {activeOrder.estimatedDelivery || 'Within 2-4 Days'}
                  </h3>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Carrier & AWB</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {activeOrder.carrier || 'BlueDart Express'} • {activeOrder.trackingNumber || 'AWB-20268819'}
                  </div>
                </div>
              </div>

              {/* Progress Milestones Stepper */}
              <div className="track-stepper-container">
                <div className="track-stepper">
                  {/* Step 1 */}
                  <div className={`stepper-node ${getStepStatus(1)}`}>
                    <div className="stepper-circle">
                      <CheckCircle2 size={16} />
                    </div>
                    <div className="stepper-label">
                      <span className="stepper-title">Order Confirmed</span>
                      <span className="stepper-time">Payment Verified</span>
                    </div>
                  </div>

                  <div className={`stepper-line ${getStepStatus(2) !== 'pending' ? 'completed' : ''}`} />

                  {/* Step 2 */}
                  <div className={`stepper-node ${getStepStatus(2)}`}>
                    <div className="stepper-circle">
                      <Package size={16} />
                    </div>
                    <div className="stepper-label">
                      <span className="stepper-title">Packed & QC</span>
                      <span className="stepper-time">Warehouse Inspected</span>
                    </div>
                  </div>

                  <div className={`stepper-line ${getStepStatus(3) !== 'pending' ? 'completed' : ''}`} />

                  {/* Step 3 */}
                  <div className={`stepper-node ${getStepStatus(3)}`}>
                    <div className="stepper-circle">
                      <Truck size={16} />
                    </div>
                    <div className="stepper-label">
                      <span className="stepper-title">In Transit</span>
                      <span className="stepper-time">Sort Facility Hub</span>
                    </div>
                  </div>

                  <div className={`stepper-line ${getStepStatus(4) === 'completed' ? 'completed' : ''}`} />

                  {/* Step 4 */}
                  <div className={`stepper-node ${getStepStatus(4)}`}>
                    <div className="stepper-circle">
                      <Clock size={16} />
                    </div>
                    <div className="stepper-label">
                      <span className="stepper-title">Out for Delivery</span>
                      <span className="stepper-time">Courier Handover</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Info Grid */}
              <div className="track-info-grid">
                {/* Destination */}
                <div className="track-info-card">
                  <div className="track-info-heading">
                    <MapPin size={15} color="var(--primary)" /> Delivery Address
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.35rem' }}>
                    {activeOrder.customer?.name || 'Customer'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: '0.2rem' }}>
                    {activeOrder.address?.street || 'Address on file'}<br />
                    {activeOrder.address?.city} {activeOrder.address?.state} - {activeOrder.address?.pincode}
                  </div>
                </div>

                {/* Summary */}
                <div className="track-info-card">
                  <div className="track-info-heading">
                    <ShoppingBag size={15} color="var(--primary)" /> Order Summary
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.35rem' }}>
                    {activeOrder.items?.length || 1} {(activeOrder.items?.length || 1) === 1 ? 'Item' : 'Items'} • ₹{(activeOrder.finalTotal || activeOrder.items?.reduce((s, i) => s + (i.price * (i.qty || 1)), 0) || 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Method: {activeOrder.shippingMethod === 'express' ? 'Express Air Cargo' : 'Standard Road Delivery'}
                    <br />
                    Payment: {activeOrder.paymentMethod || 'Paid'}
                  </div>
                </div>
              </div>

              {/* Items in this Order */}
              {activeOrder.items && activeOrder.items.length > 0 && (
                <div className="track-items-list">
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                    Included Items
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {activeOrder.items.map((item, idx) => (
                      <div key={idx} className="track-item-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div className="track-item-icon">
                            <Package size={16} color="var(--primary)" />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.86rem', fontWeight: 700 }}>{item.name}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              Qty: {item.qty || 1} {item.category ? `• ${item.category}` : ''}
                            </div>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                          ₹{((item.price || 0) * (item.qty || 1)).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Support Actions */}
              <div className="track-footer-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                  onClick={() => window.print()}
                >
                  <Printer size={15} /> Print Receipt
                </button>
                {onContactSupport && (
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
                    onClick={() => {
                      onClose();
                      onContactSupport(activeOrder.orderId);
                    }}
                  >
                    <MessageSquare size={15} /> Need Help With Order?
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="track-empty-view">
              <Package size={44} color="var(--text-muted)" style={{ opacity: 0.3 }} />
              <h4 style={{ margin: '0.75rem 0 0.25rem', fontSize: '1rem', fontWeight: 700 }}>Track Any Order</h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '300px' }}>
                Enter your Order ID above or select a recent purchase to view live shipping milestones.
              </p>
            </div>
          )}

          {/* Recent Orders Switcher */}
          {recentOrders.length > 0 && (
            <div className="track-recent-section">
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Recent Orders On This Device
              </div>
              <div className="track-recent-grid">
                {recentOrders.map((ord) => {
                  const isCur = activeOrder?.orderId === ord.orderId;
                  return (
                    <button
                      key={ord.orderId}
                      type="button"
                      className={`track-recent-card ${isCur ? 'active' : ''}`}
                      onClick={() => {
                        setActiveOrder(ord);
                        setSearchId(ord.orderId);
                        setNotFound(false);
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.85rem', color: isCur ? 'var(--primary)' : 'var(--text-main)' }}>
                          #{ord.orderId}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {ord.date ? new Date(ord.date).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        <span>{ord.items?.length || 1} items</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                          ₹{(ord.finalTotal || 0).toLocaleString()}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
