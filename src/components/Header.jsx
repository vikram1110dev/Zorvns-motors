import React, { useState } from 'react';
import { Search, User, ShoppingBag, ChevronDown, X, Menu } from 'lucide-react';

export default function Header({
  zorvnsLogo,
  searchQuery,
  onSearchChange,
  cart,
  onCartOpen,
  onSwitchScreen,
  showGarage,
  // Mega menu props
  hoveredMenu,
  setHoveredMenu,
  sparesMenu,
  bikeBrands,
  brandLogos,
  brandOrder,
  activeMegaMenuBrand,
  setActiveMegaMenuBrand,
  setSelectedBrand,
  setSelectedBike,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (screen) => {
    onSwitchScreen(screen);
    setMobileMenuOpen(false);
  };

  return (
    <header className="header-wrapper" onMouseLeave={() => setHoveredMenu(null)}>
      {/* Top bar: Logo + Search + Actions */}
      <div className="header-middle">
        <div className="app-container header-middle-inner">
          {/* Hamburger (mobile) */}
          <button className="hamburger-btn" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={22} />
          </button>

          {/* Logo */}
          <div className="header-logo" onClick={() => handleNavClick('home')} title="ZORVNS - Home">
            <img src={zorvnsLogo} alt="ZORVNS" />
          </div>

          {/* Search */}
          <div className="header-search">
            <div className="header-search-inner">
              <span className="header-search-icon"><Search size={17} /></span>
              <input
                type="text"
                placeholder="Search for spare parts..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="header-actions">
            <button className="header-icon-btn" title="Account">
              <User size={20} />
            </button>
            <button onClick={onCartOpen} className="header-cart-btn">
              <ShoppingBag size={20} />
              <span style={{ fontWeight: 500 }}>Cart</span>
              {cart.length > 0 && (
                <span className="cart-badge cart-badge-pulse">
                  {cart.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation (desktop) */}
      <div className="header-bottom">
        <div className="app-container header-bottom-inner">
          <nav className="bottom-nav-scroll">
            <button onClick={() => handleNavClick('home')} className="nav-link-btn">Home</button>
            <button onClick={() => handleNavClick('catalog')} className="nav-link-btn">All Collections</button>

            {/* Shop By Bike dropdown */}
            <div className="nav-dropdown-wrapper" onMouseEnter={() => setHoveredMenu('bike')}>
              <button className="nav-dropdown-btn">Shop By Bike <ChevronDown size={13} /></button>
              {hoveredMenu === 'bike' && (
                <div className="mega-menu">
                  <div className="app-container" style={{ display: 'flex', gap: '2rem', textAlign: 'left' }}>
                    {/* Left: Brands Grid */}
                    <div style={{ flex: '0 0 520px', borderRight: '1px solid var(--border)', paddingRight: '1rem', maxHeight: '380px', overflowY: 'auto' }}>
                      <h4 className="mega-menu-heading" style={{ marginBottom: '0.75rem' }}>Select Brand</h4>
                      <div className="brand-grid">
                        {(brandOrder || []).filter(b => bikeBrands && bikeBrands[b]).map((brand) => (
                          <div
                            key={brand}
                            className={`brand-card ${activeMegaMenuBrand === brand ? 'active' : ''}`}
                            onMouseEnter={() => setActiveMegaMenuBrand(brand)}
                          >
                            {brandLogos[brand] ? (
                              <img src={brandLogos[brand]} alt={brand} style={{ width: '32px', height: '32px', objectFit: 'contain', opacity: activeMegaMenuBrand === brand ? 1 : 0.6 }} />
                            ) : (
                              <div className="brand-icon">{brand.substring(0, 2).toUpperCase()}</div>
                            )}
                            <span className="brand-name">{brand}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Models */}
                    <div style={{ flex: 1, paddingLeft: '0.5rem', maxHeight: '380px', overflowY: 'auto' }}>
                      <h4 className="mega-menu-heading" style={{ marginBottom: '0.75rem' }}>
                        {activeMegaMenuBrand ? `Models for ${activeMegaMenuBrand}` : 'Select a brand'}
                      </h4>
                      {activeMegaMenuBrand && bikeBrands[activeMegaMenuBrand] && (
                        <div className="model-grid">
                          {bikeBrands[activeMegaMenuBrand].map((model, idx) => (
                            <a
                              key={idx}
                              href="#"
                              className="model-link"
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedBrand(activeMegaMenuBrand);
                                setSelectedBike(model);
                                handleNavClick('catalog');
                              }}
                            >
                              {model}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shop By Spares dropdown */}
            <div className="nav-dropdown-wrapper" onMouseEnter={() => setHoveredMenu('spares')}>
              <button className="nav-dropdown-btn">Shop By Spares <ChevronDown size={13} /></button>
              {hoveredMenu === 'spares' && (
                <div className="mega-menu">
                  <div className="app-container mega-menu-grid">
                    {(sparesMenu || []).map((col, colIdx) => (
                      <div key={colIdx} className="mega-menu-column">
                        {col.map((cat, catIdx) => (
                          <React.Fragment key={cat.id}>
                            {catIdx > 0 && <div style={{ height: '0.75rem' }} />}
                            {cat.title && <h4 className="mega-menu-heading">{cat.title}</h4>}
                            {(cat.items || []).map((item, iIdx) => (
                              <a key={iIdx} href="#" className="mega-menu-link">{item}</a>
                            ))}
                          </React.Fragment>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shop By Accessories dropdown */}
            <div className="nav-dropdown-wrapper" onMouseEnter={() => setHoveredMenu('accessories')}>
              <button className="nav-dropdown-btn">Shop By Accessories <ChevronDown size={13} /></button>
              {hoveredMenu === 'accessories' && (
                <div className="mega-menu">
                  <div className="app-container mega-menu-grid">
                    <div className="mega-menu-column">
                      <h4 className="mega-menu-heading">Riding Gear</h4>
                      {['Helmets', 'Riding Jackets', 'Riding Gloves', 'Riding Pants', 'Riding Boots'].map(i => <a key={i} href="#" className="mega-menu-link">{i}</a>)}
                    </div>
                    <div className="mega-menu-column">
                      <h4 className="mega-menu-heading">Luggage</h4>
                      {['Tank Bags', 'Saddlebags', 'Top Boxes', 'Tail Bags', 'Bungee Cords'].map(i => <a key={i} href="#" className="mega-menu-link">{i}</a>)}
                    </div>
                    <div className="mega-menu-column">
                      <h4 className="mega-menu-heading">Protection</h4>
                      {['Crash Guards', 'Frame Sliders', 'Handguards', 'Radiator Guards', 'Sump Guards'].map(i => <a key={i} href="#" className="mega-menu-link">{i}</a>)}
                    </div>
                    <div className="mega-menu-column">
                      <h4 className="mega-menu-heading">Performance</h4>
                      {['Exhaust Systems', 'Performance Air Filters', 'ECU Remaps', 'Quickshifters'].map(i => <a key={i} href="#" className="mega-menu-link">{i}</a>)}
                    </div>
                    <div className="mega-menu-column">
                      <h4 className="mega-menu-heading">Styling & Care</h4>
                      {['Decals & Stickers', 'Tail Tidies', 'Bar End Mirrors', 'Bike Covers', 'Cleaning Kits'].map(i => <a key={i} href="#" className="mega-menu-link">{i}</a>)}
                    </div>
                    <div className="mega-menu-column">
                      <h4 className="mega-menu-heading">Electronics</h4>
                      {['Mobile Mounts', 'USB Chargers', 'Auxiliary Lights', 'Action Cameras', 'Bluetooth Communicators'].map(i => <a key={i} href="#" className="mega-menu-link">{i}</a>)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button className="nav-link-btn">Wholesale Price</button>
            {showGarage && <button onClick={() => handleNavClick('tracking')} className="nav-link-btn">Track Order</button>}
            <button className="nav-link-btn">Faq</button>
            <button onClick={() => handleNavClick('contact')} className="nav-link-btn">Contact Us</button>
            <button className="nav-link-btn">Blog</button>
            <button onClick={() => handleNavClick('wishlist')} className="nav-link-btn">Wishlist</button>
            <button className="nav-link-btn">Return & Replacement</button>
            <button className="nav-link-btn">Brand Directory</button>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-menu-drawer">
            <div className="mobile-menu-header">
              <img src={zorvnsLogo} alt="ZORVNS" style={{ height: '32px', objectFit: 'contain' }} />
              <button onClick={() => setMobileMenuOpen(false)} className="cart-close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="mobile-menu-body">
              <button className="mobile-menu-link" onClick={() => handleNavClick('home')}>Home</button>
              <button className="mobile-menu-link" onClick={() => handleNavClick('catalog')}>All Collections</button>
              <button className="mobile-menu-link" onClick={() => handleNavClick('catalog')}>Shop By Bike</button>
              <button className="mobile-menu-link" onClick={() => handleNavClick('catalog')}>Shop By Spares</button>
              <button className="mobile-menu-link" onClick={() => handleNavClick('catalog')}>Shop By Accessories</button>
              <div className="mobile-menu-divider" />
              <button className="mobile-menu-link">Wholesale Price</button>
              {showGarage && <button className="mobile-menu-link" onClick={() => handleNavClick('tracking')}>Track Order</button>}
              <button className="mobile-menu-link">Faq</button>
              <button className="mobile-menu-link" onClick={() => handleNavClick('contact')}>Contact Us</button>
              <button className="mobile-menu-link" onClick={() => handleNavClick('wishlist')}>Wishlist</button>
              <div className="mobile-menu-divider" />
              <button className="mobile-menu-link">Blog</button>
              <button className="mobile-menu-link">Return & Replacement</button>
              <button className="mobile-menu-link">Brand Directory</button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
