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
  selectedBrand,
  selectedBike,
  setSelectedBrand,
  setSelectedBike,
  categoryFilter,
  onSelectCategory,
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
              <button
                className={`nav-dropdown-btn ${hoveredMenu === 'bike' ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setHoveredMenu(hoveredMenu === 'bike' ? null : 'bike');
                }}
              >
                Shop By Bike <ChevronDown size={13} />
              </button>
              {hoveredMenu === 'bike' && (
                <div className="mega-menu" onClick={(e) => e.stopPropagation()}>
                  <div className="app-container" style={{ display: 'flex', gap: '2rem', textAlign: 'left' }}>
                    {/* Left: Brands Grid */}
                    <div style={{ flex: '0 0 520px', borderRight: '1px solid var(--border)', paddingRight: '1.25rem', maxHeight: '390px', overflowY: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <h4 className="mega-menu-heading" style={{ margin: 0 }}>Select Brand</h4>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Click brand to view models</span>
                      </div>
                      <div className="brand-grid">
                        {(brandOrder || []).filter(b => bikeBrands && bikeBrands[b]).map((brand) => {
                          const isCurrentActive = (activeMegaMenuBrand || selectedBrand) === brand;
                          return (
                            <button
                              key={brand}
                              type="button"
                              className={`brand-card ${isCurrentActive ? 'active' : ''}`}
                              onClick={() => setActiveMegaMenuBrand(brand)}
                              title={`Click to view ${brand} models`}
                            >
                              {brandLogos[brand] ? (
                                <img
                                  src={brandLogos[brand]}
                                  alt={brand}
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    objectFit: 'contain',
                                    opacity: isCurrentActive ? 1 : 0.75,
                                    transition: 'opacity 0.2s ease'
                                  }}
                                />
                              ) : (
                                <div className="brand-icon">{brand.substring(0, 2).toUpperCase()}</div>
                              )}
                              <span className="brand-name">{brand}</span>
                              {isCurrentActive && (
                                <span className="brand-active-indicator" title="Selected brand">
                                  ✓
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: Models */}
                    <div style={{ flex: 1, paddingLeft: '0.5rem', maxHeight: '390px', overflowY: 'auto' }}>
                      {(() => {
                        const effectiveBrand = activeMegaMenuBrand || selectedBrand || (brandOrder && brandOrder[0]);
                        const models = effectiveBrand && bikeBrands ? bikeBrands[effectiveBrand] : [];
                        return (
                          <>
                            <div className="mega-menu-models-header">
                              <div>
                                <h4 className="mega-menu-heading" style={{ margin: 0 }}>
                                  {effectiveBrand ? `Models for ${effectiveBrand}` : 'Select a brand'}
                                </h4>
                                {effectiveBrand && models && (
                                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                    {models.length} {models.length === 1 ? 'model' : 'models'} available
                                  </span>
                                )}
                              </div>
                              {effectiveBrand && (
                                <button
                                  type="button"
                                  className="view-all-brand-btn"
                                  onClick={() => {
                                    setSelectedBrand(effectiveBrand);
                                    setSelectedBike('');
                                    setHoveredMenu(null);
                                    handleNavClick('catalog');
                                  }}
                                  title={`View all parts compatible with ${effectiveBrand}`}
                                >
                                  View All {effectiveBrand} Spares &rarr;
                                </button>
                              )}
                            </div>

                            {effectiveBrand && models && models.length > 0 ? (
                              <div className="model-grid">
                                {models.map((model, idx) => {
                                  const isSelectedBike = selectedBike === model && selectedBrand === effectiveBrand;
                                  return (
                                    <button
                                      key={idx}
                                      type="button"
                                      className={`model-link-btn ${isSelectedBike ? 'active' : ''}`}
                                      onClick={() => {
                                        setSelectedBrand(effectiveBrand);
                                        setSelectedBike(model);
                                        setHoveredMenu(null);
                                        handleNavClick('catalog');
                                      }}
                                    >
                                      <span className="model-link-text">{model}</span>
                                      <span className="model-link-icon">&rarr;</span>
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                Click any brand on the left to browse compatible bike models.
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shop By Spares dropdown */}
            <div className="nav-dropdown-wrapper" onMouseEnter={() => setHoveredMenu('spares')}>
              <button
                className={`nav-dropdown-btn ${hoveredMenu === 'spares' ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setHoveredMenu(hoveredMenu === 'spares' ? null : 'spares');
                }}
              >
                Shop By Spares <ChevronDown size={13} />
              </button>
              {hoveredMenu === 'spares' && (
                <div className="mega-menu" onClick={(e) => e.stopPropagation()}>
                  <div className="app-container mega-menu-grid">
                    {(sparesMenu || []).map((col, colIdx) => (
                      <div key={colIdx} className="mega-menu-column">
                        {col.map((cat, catIdx) => (
                          <React.Fragment key={cat.id || catIdx}>
                            {catIdx > 0 && <div style={{ height: '0.75rem' }} />}
                            {cat.title && (
                              <button
                                type="button"
                                className={`mega-menu-heading-btn ${categoryFilter === cat.title ? 'active' : ''}`}
                                onClick={() => {
                                  if (onSelectCategory) onSelectCategory(cat.title);
                                  setHoveredMenu(null);
                                  handleNavClick('catalog');
                                }}
                                title={`Shop all ${cat.title}`}
                              >
                                <span>{cat.title}</span>
                                <span className="mega-menu-arrow">&rarr;</span>
                              </button>
                            )}
                            {(cat.items || []).map((item, iIdx) => (
                              <button
                                key={iIdx}
                                type="button"
                                className={`mega-menu-link-btn-text ${categoryFilter === item ? 'active' : ''}`}
                                onClick={() => {
                                  if (onSelectCategory) onSelectCategory(item);
                                  setHoveredMenu(null);
                                  handleNavClick('catalog');
                                }}
                                title={`Shop ${item}`}
                              >
                                {item}
                              </button>
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
              <button
                className={`nav-dropdown-btn ${hoveredMenu === 'accessories' ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setHoveredMenu(hoveredMenu === 'accessories' ? null : 'accessories');
                }}
              >
                Shop By Accessories <ChevronDown size={13} />
              </button>
              {hoveredMenu === 'accessories' && (
                <div className="mega-menu" onClick={(e) => e.stopPropagation()}>
                  <div className="app-container mega-menu-grid">
                    {[
                      { heading: 'Riding Gear', items: ['Helmets', 'Riding Jackets', 'Riding Gloves', 'Riding Pants', 'Riding Boots'] },
                      { heading: 'Luggage', items: ['Tank Bags', 'Saddlebags', 'Top Boxes', 'Tail Bags', 'Bungee Cords'] },
                      { heading: 'Protection', items: ['Crash Guards', 'Frame Sliders', 'Handguards', 'Radiator Guards', 'Sump Guards'] },
                      { heading: 'Performance', items: ['Exhaust Systems', 'Performance Air Filters', 'ECU Remaps', 'Quickshifters'] },
                      { heading: 'Styling & Care', items: ['Decals & Stickers', 'Tail Tidies', 'Bar End Mirrors', 'Bike Covers', 'Cleaning Kits'] },
                      { heading: 'Electronics', items: ['Mobile Mounts', 'USB Chargers', 'Auxiliary Lights', 'Action Cameras', 'Bluetooth Communicators'] }
                    ].map((group, gIdx) => (
                      <div key={gIdx} className="mega-menu-column">
                        <button
                          type="button"
                          className={`mega-menu-heading-btn ${categoryFilter === group.heading ? 'active' : ''}`}
                          onClick={() => {
                            if (onSelectCategory) onSelectCategory(group.heading);
                            setHoveredMenu(null);
                            handleNavClick('catalog');
                          }}
                          title={`Shop ${group.heading}`}
                        >
                          <span>{group.heading}</span>
                          <span className="mega-menu-arrow">&rarr;</span>
                        </button>
                        {group.items.map((item, iIdx) => (
                          <button
                            key={iIdx}
                            type="button"
                            className={`mega-menu-link-btn-text ${categoryFilter === item ? 'active' : ''}`}
                            onClick={() => {
                              if (onSelectCategory) onSelectCategory(item);
                              setHoveredMenu(null);
                              handleNavClick('catalog');
                            }}
                            title={`Shop ${item}`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    ))}
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
