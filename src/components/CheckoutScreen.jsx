import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  CheckCircle2,
  CreditCard,
  QrCode,
  Building,
  Truck,
  ShieldCheck,
  ArrowLeft,
  ShoppingBag,
  Clock,
  Download,
  Percent,
  Check,
  AlertCircle
} from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi NCR', 'Chandigarh', 'Puducherry'
];

export default function CheckoutScreen({
  cart,
  onUpdateQty,
  onRemoveItem,
  onBackToShopping,
  onOrderSuccess,
  showToast
}) {
  // Step navigation: 'details' (Address & Payment) | 'success' (Order Placed)
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');

  // Customer Contact Info
  const [customer, setCustomer] = useState({
    fullName: '',
    phone: '',
    email: ''
  });

  // Customer Delivery Address & Location
  const [address, setAddress] = useState({
    houseNo: '',
    street: '',
    landmark: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    coordinates: null
  });

  // Delivery Option
  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard' | 'express'

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod'
  const [upiId, setUpiId] = useState('');
  const [cardData, setCardData] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: ''
  });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Coupon Code
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Calculate pricing
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  
  // Shipping calculation
  let shippingCost = 0;
  if (shippingMethod === 'express') {
    shippingCost = 149;
  } else {
    shippingCost = subtotal > 4999 ? 0 : 99;
  }

  // Coupon discount calculation
  let discount = 0;
  if (appliedCoupon === 'FREERIDE') {
    discount = shippingCost; // free shipping
  } else if (appliedCoupon === 'ZORVNS10') {
    discount = Math.round(subtotal * 0.10); // 10% off
  }

  const tax = Math.round(subtotal * 0.18); // 18% GST estimate
  const finalTotal = Math.max(0, subtotal + shippingCost - discount);

  // Apply coupon handler
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'FREERIDE') {
      setAppliedCoupon('FREERIDE');
      if (showToast) showToast('🎉 Promo code FREERIDE applied! Free delivery unlocked.', 'success');
    } else if (code === 'ZORVNS10') {
      setAppliedCoupon('ZORVNS10');
      if (showToast) showToast('🎉 Promo code ZORVNS10 applied! 10% discount added.', 'success');
    } else {
      setCouponError('Invalid coupon code. Try "FREERIDE" or "ZORVNS10".');
    }
  };

  // Browser Geolocation Detector
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      if (showToast) showToast('Geolocation is not supported by your browser', 'warning');
      return;
    }

    setLocating(true);
    setLocationStatus('Accessing device GPS...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationStatus('Resolving address details...');
        
        try {
          // Attempt reverse geocoding via public OpenStreetMap Nominatim
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          if (response.ok) {
            const data = await response.json();
            const addr = data.address || {};

            setAddress(prev => ({
              ...prev,
              street: [addr.road, addr.suburb, addr.neighbourhood].filter(Boolean).join(', ') || prev.street,
              city: addr.city || addr.town || addr.village || addr.county || prev.city,
              state: addr.state || prev.state,
              pincode: addr.postcode || prev.pincode,
              coordinates: `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`
            }));

            if (showToast) showToast('📍 Location detected & address pre-filled!', 'success');
          } else {
            setAddress(prev => ({
              ...prev,
              coordinates: `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`
            }));
            if (showToast) showToast(`GPS Coordinates pinned: ${latitude.toFixed(3)}, ${longitude.toFixed(3)}`, 'info');
          }
        } catch (err) {
          setAddress(prev => ({
            ...prev,
            coordinates: `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`
          }));
          if (showToast) showToast('Location pinned. Please verify street & pin code.', 'info');
        } finally {
          setLocating(false);
          setLocationStatus('');
        }
      },
      (error) => {
        setLocating(false);
        setLocationStatus('');
        if (showToast) showToast('Could not access GPS. Please enter your address manually.', 'info');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Card formatting
  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardData({ ...cardData, number: formatted });
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardData({ ...cardData, expiry: val });
  };

  // Detect card brand
  const getCardBrand = (number) => {
    const clean = number.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(clean)) return 'Mastercard';
    if (/^(60|65|81|82)/.test(clean)) return 'RuPay';
    return 'Card';
  };

  // Form submission / Order placement
  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // Validations
    if (!customer.fullName.trim() || !customer.phone.trim()) {
      if (showToast) showToast('Please enter your full name and phone number.', 'warning');
      return;
    }

    if (!address.street.trim() || !address.city.trim() || !address.pincode.trim()) {
      if (showToast) showToast('Please complete your street address, city, and PIN code.', 'warning');
      return;
    }

    if (cart.length === 0) {
      if (showToast) showToast('Your cart is empty!', 'warning');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `ZOR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + (shippingMethod === 'express' ? 2 : 4));

      const orderData = {
        orderId,
        date: new Date().toISOString(),
        estimatedDelivery: deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
        customer,
        address,
        shippingMethod,
        paymentMethod,
        items: [...cart],
        subtotal,
        shippingCost,
        discount,
        tax,
        finalTotal
      };

      setPlacedOrder(orderData);
      setIsSubmitting(false);

      if (onOrderSuccess) {
        onOrderSuccess(orderData);
      }
      if (showToast) {
        showToast(`🎉 Order #${orderId} confirmed!`, 'success');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1400);
  };

  // If cart is empty and no order has been placed
  if (cart.length === 0 && !placedOrder) {
    return (
      <div className="checkout-empty-view glass-panel">
        <ShoppingBag size={56} color="var(--text-light)" />
        <h2>Your Cart is Empty</h2>
        <p>You need items in your cart before heading to checkout.</p>
        <button onClick={onBackToShopping} className="btn-primary" style={{ marginTop: '1rem' }}>
          <ArrowLeft size={16} /> Return to Spares Catalog
        </button>
      </div>
    );
  }

  // ══════════════════════════════════════════
  // ORDER SUCCESS CONFIRMATION VIEW
  // ══════════════════════════════════════════
  if (placedOrder) {
    return (
      <div className="checkout-success-container animate-fade-in-up">
        <div className="glass-panel checkout-success-card">
          <div className="success-icon-wrapper">
            <CheckCircle2 size={64} color="#10B981" />
          </div>

          <span className="success-tag">Order Confirmed</span>
          <h1 className="success-title">Thank You, {placedOrder.customer.fullName}!</h1>
          <p className="success-subtitle">
            Your genuine motorcycle spares order has been placed and is being dispatched.
          </p>

          <div className="order-receipt-box">
            <div className="receipt-row">
              <span className="receipt-label">Order Reference:</span>
              <span className="receipt-val font-mono">#{placedOrder.orderId}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Estimated Delivery:</span>
              <span className="receipt-val highlight-green">
                <Truck size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
                {placedOrder.estimatedDelivery}
              </span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Delivery Address:</span>
              <span className="receipt-val">
                {placedOrder.address.houseNo ? `${placedOrder.address.houseNo}, ` : ''}
                {placedOrder.address.street}, {placedOrder.address.city}, {placedOrder.address.state} - {placedOrder.address.pincode}
              </span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Payment Method:</span>
              <span className="receipt-val" style={{ textTransform: 'uppercase' }}>
                {placedOrder.paymentMethod === 'upi' ? 'UPI / QR Code' :
                 placedOrder.paymentMethod === 'card' ? 'Credit / Debit Card' :
                 placedOrder.paymentMethod === 'netbanking' ? 'Net Banking' : 'Cash on Delivery (COD)'}
              </span>
            </div>
            <div className="receipt-row receipt-total-row">
              <span className="receipt-label">Total Amount Paid:</span>
              <span className="receipt-val total-amount">₹{placedOrder.finalTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="order-items-summary">
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', textAlign: 'left' }}>
              Ordered Items ({placedOrder.items.reduce((a, c) => a + c.qty, 0)})
            </h4>
            <div className="order-items-scroll">
              {placedOrder.items.map((item) => (
                <div key={item.id} className="order-summary-item-compact">
                  <div className="summary-item-details">
                    <span className="summary-item-name">{item.name}</span>
                    <span className="summary-item-qty">Qty: {item.qty} × ₹{Math.round(item.price)}</span>
                  </div>
                  <span className="summary-item-total">₹{Math.round(item.price * item.qty).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="success-actions">
            <button
              onClick={() => window.print()}
              className="btn-secondary print-invoice-btn"
            >
              <Download size={16} /> Print / Save Invoice
            </button>
            <button
              onClick={onBackToShopping}
              className="btn-primary"
            >
              <ShoppingBag size={16} /> Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════
  // CHECKOUT & PAYMENT FORM VIEW
  // ══════════════════════════════════════════
  return (
    <div className="checkout-page-container animate-fade-in-up">
      {/* Top Header */}
      <div className="checkout-top-bar">
        <button onClick={onBackToShopping} className="checkout-back-btn">
          <ArrowLeft size={16} /> Back to Catalog
        </button>
        <div className="checkout-steps-badge">
          <span className="step-badge active">1. Address &amp; Delivery</span>
          <span className="step-divider">›</span>
          <span className="step-badge active">2. Payment</span>
          <span className="step-divider">›</span>
          <span className="step-badge">3. Confirmation</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="checkout-grid-layout">
        {/* Left Column: Form Details */}
        <div className="checkout-form-column">
          {/* 1. Customer Contact Details */}
          <div className="glass-panel checkout-card">
            <div className="checkout-card-header">
              <span className="card-number-badge">1</span>
              <div>
                <h3>Contact Information</h3>
                <p className="card-desc">We will send order tracking updates &amp; GST invoice here.</p>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-field">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Mobile Number *</label>
                <div className="phone-input-wrapper">
                  <span className="phone-prefix">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98765 43210"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, '') })}
                  />
                </div>
              </div>
            </div>

            <div className="form-field" style={{ marginTop: '0.75rem' }}>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="vikram@example.com"
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              />
            </div>
          </div>

          {/* 2. Customer Location & Delivery Address */}
          <div className="glass-panel checkout-card">
            <div className="checkout-card-header">
              <span className="card-number-badge">2</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3>Customer Location &amp; Address</h3>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={locating}
                    className="location-detect-btn"
                    title="Use device GPS to auto-fill address"
                  >
                    <Compass size={14} className={locating ? 'spin-icon' : ''} />
                    <span>{locating ? 'Detecting Location...' : 'Use Current Location'}</span>
                  </button>
                </div>
                <p className="card-desc">Accurate address ensures swift delivery of mechanical spares.</p>
              </div>
            </div>

            {/* GPS coordinates badge if found */}
            {address.coordinates && (
              <div className="location-detected-banner">
                <MapPin size={14} color="#10B981" />
                <span>GPS Location: <strong>{address.coordinates}</strong></span>
              </div>
            )}

            {locationStatus && (
              <div className="location-status-text">
                <Clock size={12} /> {locationStatus}
              </div>
            )}

            <div className="form-row-2">
              <div className="form-field">
                <label>Flat / House / Building No.</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 402, Sai Residency"
                  value={address.houseNo}
                  onChange={(e) => setAddress({ ...address, houseNo: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Street Address / Area *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MG Road, Near Metro Station"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row-3" style={{ marginTop: '0.75rem' }}>
              <div className="form-field">
                <label>Landmark (Optional)</label>
                <input
                  type="text"
                  placeholder="Near HP Petrol Pump"
                  value={address.landmark}
                  onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>City / Town *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>PIN Code *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="411001"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '') })}
                />
              </div>
            </div>

            <div className="form-field" style={{ marginTop: '0.75rem' }}>
              <label>State *</label>
              <select
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
              >
                {INDIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Delivery Speed Options */}
            <div style={{ marginTop: '1.25rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'block' }}>
                Delivery Speed:
              </label>
              <div className="delivery-speed-options">
                <label className={`delivery-radio-card ${shippingMethod === 'standard' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="standard"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                  />
                  <div className="radio-card-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <strong>Standard Courier</strong>
                      <span className="speed-price">{subtotal > 4999 ? 'FREE' : '₹99'}</span>
                    </div>
                    <span className="speed-desc">Estimated 3 - 5 business days</span>
                  </div>
                </label>

                <label className={`delivery-radio-card ${shippingMethod === 'express' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="express"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                  />
                  <div className="radio-card-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <strong>⚡ Express Priority Dispatch</strong>
                      <span className="speed-price">₹149</span>
                    </div>
                    <span className="speed-desc">Estimated 1 - 2 business days</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="glass-panel checkout-card">
            <div className="checkout-card-header">
              <span className="card-number-badge">3</span>
              <div>
                <h3>Select Payment Method</h3>
                <p className="card-desc">All transactions are encrypted with 256-bit bank grade security.</p>
              </div>
            </div>

            <div className="payment-method-tabs">
              <button
                type="button"
                className={`payment-tab-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                <QrCode size={18} />
                <span>UPI / QR Code</span>
              </button>
              <button
                type="button"
                className={`payment-tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard size={18} />
                <span>Cards</span>
              </button>
              <button
                type="button"
                className={`payment-tab-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('netbanking')}
              >
                <Building size={18} />
                <span>Net Banking</span>
              </button>
              <button
                type="button"
                className={`payment-tab-btn ${paymentMethod === 'cod' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <Truck size={18} />
                <span>Cash on Delivery</span>
              </button>
            </div>

            <div className="payment-tab-content">
              {/* UPI Option */}
              {paymentMethod === 'upi' && (
                <div className="payment-upi-box animate-fade-in">
                  <div className="upi-qr-section">
                    <div className="qr-code-placeholder">
                      <div className="qr-inner-pattern">
                        <QrCode size={80} color="var(--primary)" />
                      </div>
                      <span className="qr-caption">Scan with Google Pay, PhonePe, Paytm</span>
                    </div>
                    <div className="upi-details">
                      <label>Or enter UPI ID / VPA</label>
                      <div className="upi-input-group">
                        <input
                          type="text"
                          placeholder="username@okhdfcbank"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                        />
                        <button type="button" className="btn-secondary verify-btn" onClick={() => showToast && showToast('UPI Verified ✓', 'success')}>
                          Verify
                        </button>
                      </div>
                      <p className="upi-helper">Supported: GPay • PhonePe • Paytm • BHIM • Cred</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Option */}
              {paymentMethod === 'card' && (
                <div className="payment-card-box animate-fade-in">
                  <div className="form-field">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <label>Card Number *</label>
                      <span className="card-brand-badge">{getCardBrand(cardData.number)}</span>
                    </div>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8920"
                      value={cardData.number}
                      onChange={handleCardNumberChange}
                    />
                  </div>

                  <div className="form-row-3" style={{ marginTop: '0.75rem' }}>
                    <div className="form-field" style={{ gridColumn: 'span 2' }}>
                      <label>Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="NAME ON CARD"
                        value={cardData.holder}
                        onChange={(e) => setCardData({ ...cardData, holder: e.target.value.toUpperCase() })}
                      />
                    </div>
                    <div className="form-field">
                      <label>Expiry (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardData.expiry}
                        onChange={handleExpiryChange}
                      />
                    </div>
                  </div>

                  <div className="form-field" style={{ marginTop: '0.75rem', maxWidth: '140px' }}>
                    <label>CVV / CVC</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                </div>
              )}

              {/* Net Banking */}
              {paymentMethod === 'netbanking' && (
                <div className="payment-netbanking-box animate-fade-in">
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                    Popular Banks:
                  </label>
                  <div className="popular-banks-grid">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra'].map(bank => (
                      <button
                        type="button"
                        key={bank}
                        className={`bank-pill ${selectedBank === bank ? 'active' : ''}`}
                        onClick={() => setSelectedBank(bank)}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>

                  <div className="form-field" style={{ marginTop: '1rem' }}>
                    <label>Or select from all Indian banks</label>
                    <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra">Kotak Mahindra Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                      <option value="Bank of Baroda">Bank of Baroda</option>
                      <option value="Canara Bank">Canara Bank</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Cash on Delivery */}
              {paymentMethod === 'cod' && (
                <div className="payment-cod-box animate-fade-in">
                  <div className="cod-notice">
                    <Truck size={24} color="#E60050" />
                    <div>
                      <strong>Pay upon delivery at your doorstep</strong>
                      <p>You can pay via Cash or any UPI app when the courier delivery partner arrives with your package.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="checkout-summary-column">
          <div className="glass-panel checkout-summary-card">
            <h3 className="summary-title">Order Summary</h3>

            {/* Item List */}
            <div className="summary-items-list">
              {cart.map((item) => (
                <div key={item.id} className="checkout-summary-item">
                  <div className="checkout-item-thumb">
                    {item.images && item.images[0] ? (
                      <img src={item.images[0].trim()} alt={item.name} />
                    ) : (
                      <ShoppingBag size={20} color="var(--text-light)" />
                    )}
                    <span className="checkout-item-qty-badge">{item.qty}</span>
                  </div>
                  <div className="checkout-item-info">
                    <h5 className="checkout-item-title">{item.name}</h5>
                    <span className="checkout-item-unit-price">₹{Math.round(item.price).toLocaleString('en-IN')} each</span>
                  </div>
                  <div className="checkout-item-total-price">
                    ₹{Math.round(item.price * item.qty).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon input */}
            <div className="checkout-coupon-box">
              <div className="coupon-input-wrapper">
                <Percent size={15} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Coupon code (e.g. FREERIDE)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button type="button" onClick={handleApplyCoupon} className="coupon-apply-btn">
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <div className="coupon-success-tag">
                  <Check size={12} /> {appliedCoupon} applied
                </div>
              )}
              {couponError && (
                <div className="coupon-error-tag">
                  <AlertCircle size={12} /> {couponError}
                </div>
              )}
            </div>

            {/* Bill Details */}
            <div className="checkout-bill-details">
              <div className="bill-row">
                <span>Items Subtotal</span>
                <span>₹{Math.round(subtotal).toLocaleString('en-IN')}</span>
              </div>
              <div className="bill-row">
                <span>Delivery Charges</span>
                <span>
                  {shippingCost === 0 ? (
                    <span style={{ color: '#10B981', fontWeight: 700 }}>FREE</span>
                  ) : (
                    `₹${shippingCost}`
                  )}
                </span>
              </div>
              {discount > 0 && (
                <div className="bill-row discount-row">
                  <span>Discount ({appliedCoupon})</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="bill-row">
                <span>Estimated GST (18%)</span>
                <span>Included</span>
              </div>
              <div className="bill-row total-row">
                <span>Total Payable</span>
                <span className="final-price">₹{Math.round(finalTotal).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary checkout-submit-btn"
            >
              {isSubmitting ? (
                <span className="btn-spinner-content">
                  <span className="spinner-dot"></span> Processing Payment...
                </span>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Place Order • ₹{Math.round(finalTotal).toLocaleString('en-IN')}</span>
                </>
              )}
            </button>

            {/* Trust Badges */}
            <div className="checkout-trust-badges">
              <div className="trust-item">
                <ShieldCheck size={14} color="#10B981" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <div className="trust-item">
                <Truck size={14} color="#3B82F6" />
                <span>Insured Transit</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={14} color="#E60050" />
                <span>100% Genuine OEM</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
