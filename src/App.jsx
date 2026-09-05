import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  AlertCircle,
  Check,
  Phone,
  MapPin,
  Mail,
  Send,
  Heart,
  ChevronUp,
  ArrowLeft
} from 'lucide-react';
import './App.css';
import heroImg from './assets/hero.png';
import zorvnsLogo from './assets/zorvns-logo.png';

// Components
import Toast from './components/Toast';
import StarRating from './components/StarRating';
import ProductCard from './components/ProductCard';
import CategoryGrid from './components/CategoryGrid';
import HeroSection from './components/HeroSection';
import CartDrawer from './components/CartDrawer';
import WishlistModal from './components/WishlistModal';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollReveal from './components/ScrollReveal';
import SkeletonCard from './components/SkeletonCard';
import { CATEGORY_SUBCATEGORIES_MAP } from './constants/categories';

// INITIAL SPARES MENU DEFINITION
const INITIAL_SPARES_MENU = [
  [
    { id: 'c1', title: 'Brand Directory', items: ['Oil filter', 'Spark plug', 'Damper rubber', 'Chain lube'] },
    { id: 'c2', title: 'Body parts', items: ['Visor', 'Front shield'] },
    { id: 'c3', title: 'Mirror', items: [] }
  ],
  [
    { id: 'c4', title: '', items: ['Brake shoe', 'Brake pedal', 'Disc plate', 'Master cylinder', 'Brake housing', 'Brake cable'] },
    { id: 'c5', title: 'Gear system', items: ['Gear pedal'] },
    { id: 'c6', title: 'Foot control', items: ['Footrest', 'Footrest bracket'] }
  ],
  [
    { id: 'c7', title: '', items: ['Regular chain sprocket', 'Chain maintenance'] },
    { id: 'c8', title: 'Fork parts', items: ['Fork oil seal', 'Shock absorber'] },
    { id: 'c9', title: 'Swingarm parts', items: ['Swingarm bush kit'] }
  ],
  [
    { id: 'c10', title: '', items: ['Regulator rectifier', 'Speedometer'] },
    { id: 'c11', title: 'Lighting', items: ['Headlamp', 'Indicators'] },
    { id: 'c12', title: 'Silencer', items: [] }
  ],
  [
    { id: 'c13', title: '', items: ['Fuel pump assembly', 'Fuel cock'] },
    { id: 'c14', title: 'Control switch', items: [] },
    { id: 'c15', title: 'Sticker kits', items: [] }
  ],
  [
    { id: 'c16', title: '', items: ['Clutch plate', 'Clutch assembly', 'Clutch shoe', 'CVT belt'] },
    { id: 'c17', title: 'Lock Sets', items: [] }
  ]
];

// INITIAL BIKE DATA DEFINITION
const INITIAL_BIKE_BRANDS = {
  'ROYAL ENFIELD': [
    'Classic 350', 'Classic 500', 'Meteor 350', 'Himalayan 450',
    'Guerrilla 450', 'Super Meteor 650', 'Himalayan 411', 'Scram 411',
    'Interceptor 650', 'Continental GT 650', 'Hunter 350', 'Thunderbird 350',
    'Thunderbird 500', 'Classic reborn 350'
  ],
  'TVS': [
    'Apachr RTX 300', 'Apache RR 310', 'Apache RTR 310', 'Apache RTR 200', 'Apache 160'
  ],
  'BMW': [
    'GS 310', '310 R', 'S 1000 RR', 'F 450 GS'
  ],
  'KTM': [
    'Duke 125', 'Duke 200', 'Duke 250', 'Duke 390', 'RC 125', 'RC 200',
    'RC 390', 'Adventure 250', 'Adventure 390', 'Adventure 390 (2025)', 'DUKE 250 (GEN 3)'
  ],
  'YAMAHA': [
    'XSR 155', 'Aerox', 'R15 V1', 'R15 V2', 'R15 V3', 'R15 V4',
    'MT 15', 'MT 09', 'FZ 16', 'FZ-X', 'FZ 250', 'FZ V2',
    'YZF-R1M', 'YZF-R1', 'YZF-R3'
  ],
  'HUSQVARNA': [
    'Svartpilen 401', 'Vitpilen 401'
  ],
  'BAJAJ': [
    'Pulsar NS 200', 'Pulsar RS 200', 'Pulsar NS 160', 'Dominar 400',
    'Dominar 250', 'Pulsar 220F', 'Pulsar NS 400', 'Pulsar N160'
  ],
  'KAWASAKI': [
    'Ninja 650', 'Ninja 400', 'Ninja ZX-14R', 'Ninja ZX-10R', 'Ninja ZX-6R',
    'Ninja H2R', 'Vulcan S', 'Vulcan 900 Classic', 'Versys 650', 'Versys 1000',
    'Z400', 'Z650', 'Z800', 'Z900', 'Z1000'
  ],
  'BENELLI': [
    'TNT 300', 'TNT 600i', 'TNT 899', 'TRK 502', 'TRK 502X', 'Imperiale 400'
  ],
  'PIAGGIO': [
    'Aprilia SR 125', 'Aprilia SR 150', 'Aprilia SR 160', 'Aprilia SXR',
    'Aprilia storm 125', 'Aprilia Storm 150', 'Aprilia Storm 160',
    'Vespa SXL 125', 'Vespa VXL 125', 'Aprilia RS 457'
  ],
  'HERO': [
    'Xpulse 200', 'Xpulse 210'
  ],
  'DUCATI': [
    'Panigale', 'Scrambler 800', 'Monster', 'Multistrada', 'Diavel 1260'
  ],
  'HONDA': [
    'H\'ness 350', 'CBR 150', 'CBR 250', 'CBR 650', 'CB 350RS', 'CB 300', 'CBR 1000 RR'
  ],
  'OLA': [],
  'Harley davidson': [],
  'Suzuki': [
    'V strom SX 250', 'Gixxer SF 250', 'Burgman'
  ],
  'Triumph': [
    'Speed 400', 'Scrambler 400X'
  ],
  'Ather': [],
  'Jawa': [
    'JAWA 42', 'Jawa bobber'
  ]
};

const INITIAL_BRAND_LOGOS = {
  'ROYAL ENFIELD': '',
  'TVS': '',
  'BMW': '',
  'KTM': '',
  'YAMAHA': '',
  'HUSQVARNA': '',
  'BAJAJ': '',
  'KAWASAKI': '',
  'BENELLI': '',
  'PIAGGIO': '',
  'HERO': '',
  'DUCATI': '',
  'HONDA': '',
  'OLA': '',
  'Harley davidson': '',
  'Suzuki': '',
  'Triumph': '',
  'Ather': '',
  'Jawa': ''
};

// Mock spare parts catalog data
const INITIAL_SPARES = [
  { id: 1, name: 'Brembo Sintered Brake Pads', category: 'Brakes', subCategory: 'Brake Pads', price: 89.99, stock: 12, rating: 4.9, desc: 'High friction coefficient pads for maximum stopping power.', compatibility: ['Yamaha YZF-R15', 'Yamaha MT-15', 'KTM RC 390', 'KTM Duke 250', 'Honda CBR650R'] },
  { id: 2, name: 'NGK Iridium IX Spark Plug (Pack of 4)', category: 'Engine', subCategory: 'Spark plug', price: 45.50, stock: 8, rating: 4.8, desc: 'Designed specifically for high-performance motorcycle engines.', compatibility: ['Yamaha YZF-R15', 'Yamaha MT-15', 'KTM RC 390', 'KTM Duke 250', 'RE Classic 350', 'RE Himalayan 450', 'RE Continental GT 650'] },
  { id: 3, name: 'K&N High-Flow Air Filter', category: 'Filters', subCategory: 'Air Filter', price: 65.00, stock: 15, rating: 4.7, desc: 'Washable and reusable filter for increased horsepower.', compatibility: ['KTM RC 390', 'KTM Adventure 390', 'RE Himalayan 450'] },
  { id: 4, name: 'CNC Adjustable Clutch & Brake Levers', category: 'Controls', subCategory: 'Levers', price: 110.00, stock: 6, rating: 4.9, desc: '6-position adjustable aluminum levers, black anodized.', compatibility: ['Yamaha YZF-R15', 'Yamaha MT-15', 'KTM Duke 250', 'KTM RC 390'] },
  { id: 5, name: 'Motul 300V Synthetic Oil (4 Liters)', category: 'Fluids', subCategory: 'Engine Oil', price: 79.99, stock: 20, rating: 5.0, desc: 'Double Ester technology for racing & high-revving engines.', compatibility: ['Yamaha YZF-R15', 'Yamaha MT-15', 'KTM RC 390', 'KTM Duke 250', 'RE Classic 350', 'RE Himalayan 450', 'RE Continental GT 650', 'Honda CB350 H\'ness', 'Honda CBR650R', 'Honda Hornet 2.0', 'KTM Adventure 390'] },
  { id: 6, name: 'LED Sequential Turn Signals (Set of 2)', category: 'Electrical', subCategory: 'Turn Signals', price: 34.99, stock: 24, rating: 4.6, desc: 'Sequential flowing glow pattern with high brightness LEDs.', compatibility: ['Yamaha YZF-R15', 'Yamaha MT-15', 'KTM RC 390', 'KTM Duke 250', 'RE Classic 350', 'RE Himalayan 450', 'RE Continental GT 650', 'Honda CB350 H\'ness', 'Honda CBR650R', 'Honda Hornet 2.0', 'KTM Adventure 390'] },
  { id: 7, name: 'DID 525 VX3 Gold X-Ring Chain', category: 'Drivetrain', subCategory: 'Chain', price: 135.00, stock: 4, rating: 4.9, desc: 'Top-tier durability and reduced friction chain.', compatibility: ['RE Continental GT 650', 'Honda CBR650R'] },
  { id: 8, name: 'Yuasa Heavy Duty AGM Battery', category: 'Electrical', subCategory: 'Battery', price: 95.00, stock: 10, rating: 4.7, desc: 'Maintenance-free high cranking amp battery.', compatibility: ['RE Classic 350', 'RE Himalayan 450', 'Honda CB350 H\'ness'] }
];

// Mock initial enquiries
const INITIAL_ENQUIRIES = [
  { id: 1, name: 'Alex Hunter', email: 'alex@example.com', subject: 'Parts Availability Inquiry', message: 'Do you have fork seals for a 2021 Kawasaki Ninja 400 in stock?', resolved: false },
  { id: 2, name: 'Sarah Connor', email: 'sarah@example.com', subject: 'Bulk Order Discount', message: 'Looking to purchase 10 packs of NGK Iridium spark plugs. Do you offer bulk trade discounts?', resolved: true }];

// ─────────────────────────────────────────────
// MAIN APP COMPONENT
// ─────────────────────────────────────────────
function App() {
  // Navigation active tab (highlighter)
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [sparesMenu, setSparesMenu] = useState(() => {
    const saved = localStorage.getItem('spark_spares_menu');
    return saved ? JSON.parse(saved) : INITIAL_SPARES_MENU;
  });

  // Sync menu across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'spark_spares_menu') setSparesMenu(e.newValue ? JSON.parse(e.newValue) : INITIAL_SPARES_MENU);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
  const [activeMegaMenuBrand, setActiveMegaMenuBrand] = useState(Object.keys(INITIAL_BIKE_BRANDS)[0]);

  // Pull bike brands from local storage
  const [bikeBrands, setBikeBrands] = useState(() => {
    const saved = localStorage.getItem('spark_bike_brands');
    const parsed = saved ? JSON.parse(saved) : {};
    const merged = { ...INITIAL_BIKE_BRANDS };
    for (const [brand, models] of Object.entries(parsed)) {
      if (merged[brand]) {
        merged[brand] = [...new Set([...merged[brand], ...models])];
      } else {
        merged[brand] = models;
      }
    }
    localStorage.setItem('spark_bike_brands', JSON.stringify(merged));
    return merged;
  });

  const [brandLogos, setBrandLogos] = useState(() => {
    const saved = localStorage.getItem('spark_brand_logos');
    const parsed = saved ? JSON.parse(saved) : {};
    const merged = { ...INITIAL_BRAND_LOGOS, ...parsed };
    localStorage.setItem('spark_brand_logos', JSON.stringify(merged));
    return merged;
  });

  const [brandOrder, setBrandOrder] = useState(() => {
    const saved = localStorage.getItem('spark_brand_order');
    if (saved) return JSON.parse(saved);
    const defaultOrder = Object.keys(INITIAL_BIKE_BRANDS);
    localStorage.setItem('spark_brand_order', JSON.stringify(defaultOrder));
    return defaultOrder;
  });

  // Listen for storage changes from admin tab
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'spark_bike_brands' && e.newValue) {
        setBikeBrands(JSON.parse(e.newValue));
      }
      if (e.key === 'spark_brand_logos' && e.newValue) {
        setBrandLogos(JSON.parse(e.newValue));
      }
      if (e.key === 'spark_brand_order' && e.newValue) {
        setBrandOrder(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Pull latest spares inventory from local storage (synced with admin panel)
  const [spares, setSpares] = useState(() => {
    const saved = localStorage.getItem('spark_spares');
    if (!saved) return INITIAL_SPARES;
    try {
      const parsed = JSON.parse(saved);
      return parsed.map(item => {
        if (!item.subCategory) {
          const match = INITIAL_SPARES.find(i => i.id === item.id);
          return { ...item, subCategory: match ? match.subCategory : '' };
        }
        return item;
      });
    } catch {
      return INITIAL_SPARES;
    }
  });

  // Pull enquiries from local storage (synced with admin panel)
  const [enquiries, setEnquiries] = useState(() => {
    const saved = localStorage.getItem('spark_enquiries');
    return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
  });

  // Spare By Bike State Finder
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedBike, setSelectedBike] = useState('');

  // Keep local states synchronized with changes made in other tabs (Admin panel)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedSpares = localStorage.getItem('spark_spares');
      if (savedSpares) setSpares(JSON.parse(savedSpares));

      const savedEnquiries = localStorage.getItem('spark_enquiries');
      if (savedEnquiries) setEnquiries(JSON.parse(savedEnquiries));

      const savedMenu = localStorage.getItem('spark_spares_menu');
      if (savedMenu) setSparesMenu(JSON.parse(savedMenu));
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Contact Form State
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    subject: 'Parts Availability Inquiry',
    message: ''
  });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Toast Notification State
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  const showToast = (message, type = 'info') => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  // Back-to-top visibility state
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('spark_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const toggleWishlist = (part) => {
    const exists = wishlist.find(i => i.id === part.id);
    const updated = exists
      ? wishlist.filter(i => i.id !== part.id)
      : [...wishlist, part];
    localStorage.setItem('spark_wishlist', JSON.stringify(updated));
    showToast(exists ? 'Removed from wishlist' : `${part.name} saved to wishlist!`, exists ? 'info' : 'success');
    setWishlist(updated);
  };
  const isWishlisted = (id) => wishlist.some(i => i.id === id);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cart helper functions
  const addToCart = (part) => {
    const existing = cart.find(item => item.id === part.id);
    if (existing) {
      showToast(`${part.name} quantity updated in cart.`, 'info');
    } else {
      showToast(`✅ ${part.name} added to cart!`, 'success');
    }
    setCart((prevCart) => {
      const found = prevCart.find(item => item.id === part.id);
      if (found) {
        return prevCart.map(item => item.id === part.id ? { ...item, qty: Math.min(item.qty + 1, part.stock) } : item);
      }
      return [...prevCart, { ...part, qty: 1 }];
    });
  };

  const updateQty = (id, change) => {
    setCart((prevCart) => prevCart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + change;
        if (newQty <= 0) return null;
        return { ...item, qty: Math.min(newQty, item.stock) };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  const totalCartPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // Catalog State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [subCategoryFilter, setSubCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // Submit Contact Form
  const handleContactSubmit = (e) => {
    e.preventDefault();
    const newEnquiry = {
      id: Date.now(),
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject,
      message: contactData.message,
      resolved: false
    };
    const updatedEnquiries = [newEnquiry, ...enquiries];
    setEnquiries(updatedEnquiries);
    localStorage.setItem('spark_enquiries', JSON.stringify(updatedEnquiries));

    setContactSuccess(true);
    setContactData({
      name: '',
      email: '',
      subject: 'Parts Availability Inquiry',
      message: ''
    });
  };

  // Checkout simulation
  const handleCheckout = () => {
    showToast(`🎉 Order placed! Total ₹${Math.round(totalCartPrice).toLocaleString('en-IN')} — Thank you!`, 'success');
    setCart([]);
    setIsCartOpen(false);
  };

  // Filter products
  const filteredProducts = spares.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          part.desc.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (categoryFilter && categoryFilter !== 'All') {
      const filterNorm = categoryFilter.trim().toLowerCase();
      const partCatNorm = (part.category || '').trim().toLowerCase();
      const partSubCatNorm = (part.subCategory || '').trim().toLowerCase();

      const exactMatch = partCatNorm === filterNorm || partSubCatNorm === filterNorm;
      const singularMatch = partCatNorm.replace(/s$/, '') === filterNorm.replace(/s$/, '') ||
                            partSubCatNorm.replace(/s$/, '') === filterNorm.replace(/s$/, '');
      const includesMatch = partCatNorm.includes(filterNorm) || filterNorm.includes(partCatNorm) ||
                            partSubCatNorm.includes(filterNorm) || filterNorm.includes(partSubCatNorm);
      const nameMatch = (part.name || '').toLowerCase().includes(filterNorm);
      const descMatch = (part.desc || '').toLowerCase().includes(filterNorm);

      matchesCategory = exactMatch || singularMatch || includesMatch || nameMatch || descMatch;
    }

    let matchesSubCategory = true;
    if (subCategoryFilter && subCategoryFilter !== 'All') {
      const subNorm = subCategoryFilter.trim().toLowerCase();
      const partSubNorm = (part.subCategory || '').trim().toLowerCase();
      const partNameNorm = (part.name || '').trim().toLowerCase();

      matchesSubCategory = partSubNorm === subNorm ||
                           partSubNorm.includes(subNorm) ||
                           subNorm.includes(partSubNorm) ||
                           partNameNorm.includes(subNorm);
    }

    let matchesBike = true;
    if (selectedBike) {
      matchesBike = part.compatibility && part.compatibility.some(b => b.toLowerCase() === selectedBike.toLowerCase());
    } else if (selectedBrand) {
      const brandBikes = bikeBrands[selectedBrand] || [];
      matchesBike = part.compatibility && part.compatibility.some(bike =>
        brandBikes.some(b => b.toLowerCase() === bike.toLowerCase())
      );
    }

    return matchesSearch && matchesCategory && matchesSubCategory && matchesBike;
  });

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  // Dynamic categories computed from sparesMenu and catalog spares
  const categories = useMemo(() => {
    const map = new Map();
    map.set('all', 'All');

    const addCat = (name) => {
      if (!name) return;
      const trimmed = name.trim();
      if (!trimmed || trimmed.toLowerCase() === '(spacer)') return;
      const key = trimmed.toLowerCase();
      if (!map.has(key)) {
        map.set(key, trimmed);
      }
    };

    // 1. Categories from Shop By Spares Mega Menu
    (sparesMenu || []).forEach(col => {
      (col || []).forEach(cat => {
        addCat(cat.title);
      });
    });

    // 2. Categories from existing spares catalog
    (spares || []).forEach(part => {
      addCat(part.category);
    });

    // 3. Defaults
    ['Engine', 'Brakes', 'Filters', 'Controls', 'Fluids', 'Electrical', 'Drivetrain'].forEach(d => addCat(d));

    // If currently filtered by a specific category, ensure it is in the list
    if (categoryFilter && categoryFilter !== 'All') {
      addCat(categoryFilter);
    }

    return Array.from(map.values());
  }, [sparesMenu, spares, categoryFilter]);

  // Contextual subcategories available for filter pills (strictly for the selected category)
  const availableSubCategoriesForFilter = useMemo(() => {
    // Only show subcategories after a category has been selected first!
    if (!categoryFilter || categoryFilter === 'All') return [];

    const set = new Set();
    const catNorm = categoryFilter.trim().toLowerCase();

    // 1. Direct match from CATEGORY_SUBCATEGORIES_MAP
    for (const [catName, subs] of Object.entries(CATEGORY_SUBCATEGORIES_MAP || {})) {
      if (catName.toLowerCase() === catNorm || catNorm.includes(catName.toLowerCase()) || catName.toLowerCase().includes(catNorm)) {
        subs.forEach(s => set.add(s));
      }
    }

    // 2. Only spares in catalog belonging to this category
    (spares || []).forEach(p => {
      const pCat = (p.category || '').trim().toLowerCase();
      if ((pCat === catNorm || pCat.includes(catNorm) || catNorm.includes(pCat)) && p.subCategory && p.subCategory.trim()) {
        set.add(p.subCategory.trim());
      }
    });

    // 3. Only matching blocks in sparesMenu
    (sparesMenu || []).forEach(col => {
      (col || []).forEach(block => {
        const blockTitle = (block.title || '').toLowerCase().trim();
        if (blockTitle && (blockTitle === catNorm || blockTitle.includes(catNorm) || catNorm.includes(blockTitle))) {
          (block.items || []).forEach(it => {
            if (it && it.trim()) set.add(it.trim());
          });
        }
      });
    });

    return Array.from(set);
  }, [spares, sparesMenu, categoryFilter]);

  // Page transition state
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Switch Screen logic
  const switchScreen = (tabName) => {
    setIsTransitioning(true);
    setHoveredMenu(null);
    if (tabName !== 'product') setSelectedProduct(null);
    setTimeout(() => {
      setActiveTab(tabName);
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  };

  return (
    <>
      <div className="bg-gradient-wrapper"></div>

      {/* Header Component */}
      <Header
        zorvnsLogo={zorvnsLogo}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cart={cart}
        onCartOpen={() => setIsCartOpen(true)}
        onSwitchScreen={switchScreen}
        hoveredMenu={hoveredMenu}
        setHoveredMenu={setHoveredMenu}
        sparesMenu={sparesMenu}
        bikeBrands={bikeBrands}
        brandLogos={brandLogos}
        brandOrder={brandOrder}
        activeMegaMenuBrand={activeMegaMenuBrand}
        setActiveMegaMenuBrand={setActiveMegaMenuBrand}
        selectedBrand={selectedBrand}
        selectedBike={selectedBike}
        setSelectedBrand={setSelectedBrand}
        setSelectedBike={setSelectedBike}
        categoryFilter={categoryFilter}
        onSelectCategory={(cat) => {
          const isPrimary = categories.some(c => c.toLowerCase() === cat.toLowerCase());
          if (isPrimary) {
            setCategoryFilter(cat);
            setSubCategoryFilter('All');
          } else {
            const matchPart = spares.find(p => (p.subCategory || '').toLowerCase() === cat.toLowerCase());
            if (matchPart) {
              setCategoryFilter(matchPart.category);
              setSubCategoryFilter(cat);
            } else {
              setCategoryFilter('All');
              setSubCategoryFilter(cat);
            }
          }
          setSearchQuery('');
          switchScreen('catalog');
        }}
      />

      {/* Main Content */}
      <main className={`app-container main-content ${isTransitioning ? 'page-transition-exit' : 'page-transition-enter'}`} style={{ padding: '1.5rem' }}>

        {/* Skeleton Loading during transition */}
        {isTransitioning && (
          <div className="products-grid" style={{ paddingTop: '2rem' }}>
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ═══ HOME SCREEN ═══ */}
        {!isTransitioning && activeTab === 'home' && (
          <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', width: '100vw', marginLeft: 'calc(-50vw + 50%)', overflowX: 'hidden' }}>

            {/* Hero */}
            <HeroSection heroImage={heroImg} onShopNow={() => switchScreen('catalog')} />

            {/* Shop by Category */}
            <ScrollReveal>
              <div className="app-container" style={{ textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
                <h2 className="section-title" style={{ textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '2rem' }}>Shop By Category</h2>
                <CategoryGrid onCategoryClick={() => switchScreen('catalog')} />
              </div>
            </ScrollReveal>

            {/* Promo Banner */}
            <ScrollReveal delay={100}>
              <div className="app-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="promo-banner">
                  <h3>FREE SHIPPING ON ORDERS OVER ₹4,999!</h3>
                  <p>Use code <span className="promo-code">FREERIDE</span> at checkout. Valid until end of month.</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Best Sellers */}
            <ScrollReveal>
              <div className="app-container" style={{ textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
                <h2 className="section-title" style={{ textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '2rem' }}>Best Sellers</h2>
                <div className="products-grid stagger-children">
                  {spares.slice(0, 4).map((part, idx) => (
                    <ScrollReveal key={part.id} delay={idx * 100}>
                      <ProductCard
                        part={part}
                        onViewProduct={(p) => { setSelectedProduct(p); switchScreen('product'); }}
                        onAddToCart={addToCart}
                        onToggleWishlist={toggleWishlist}
                        isWishlisted={isWishlisted(part.id)}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Top Brands */}
            <ScrollReveal delay={100}>
              <div className="app-container" style={{ textAlign: 'center', maxWidth: '1200px', margin: '0 auto', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '2rem' }}>Top Brands</h2>
                <div className="brands-grid stagger-children">
                  {['BREMBO', 'K&N', 'MOTUL', 'NGK', 'AKRAPOVIC', 'MICHELIN'].map((brand, idx) => (
                    <ScrollReveal key={idx} delay={idx * 80}>
                      <div className="brand-logo-card">{brand}</div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* ═══ CATALOG SCREEN ═══ */}
        {!isTransitioning && activeTab === 'catalog' && (
          <section className="animate-fade-in-up" style={{ paddingTop: '1rem', marginBottom: '2rem' }}>
            <div className="section-header">
              <span className="section-subtitle">ZORVNS STORE</span>
              <h2 className="section-title">GENUINE SPARES CATALOG</h2>
              <p className="section-desc">Search or filter our catalog of race-tested and manufacturer-approved components.</p>
            </div>

            {/* Bike Finder */}
            <div className="glass-panel bike-finder" style={{ textAlign: 'left' }}>
              <div className="bike-finder-header">
                <ShoppingBag size={18} color="var(--accent)" />
                <h3>Find Spares by Bike Model</h3>
              </div>
              <div className="bike-finder-controls">
                <div className="finder-field">
                  <label>1. Select Brand</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => { setSelectedBrand(e.target.value); setSelectedBike(''); }}
                  >
                    <option value="">-- All Brands --</option>
                    {(brandOrder || []).filter(b => bikeBrands && bikeBrands[b]).map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
                <div className="finder-field">
                  <label>2. Select Bike Model</label>
                  <select
                    value={selectedBike}
                    disabled={!selectedBrand}
                    onChange={(e) => setSelectedBike(e.target.value)}
                  >
                    <option value="">-- All Bikes --</option>
                    {selectedBrand && bikeBrands[selectedBrand].map(bike => (
                      <option key={bike} value={bike}>{bike}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => { setSelectedBrand(''); setSelectedBike(''); }}
                  className="btn-secondary"
                  style={{ alignSelf: 'flex-end', height: '42px' }}
                >
                  Clear Selection
                </button>
              </div>
              {(selectedBrand || selectedBike) && (
                <div className="compat-feedback">
                  <Check size={14} />
                  <span>Showing spare parts compatible with {selectedBike ? <strong>{selectedBike}</strong> : <strong>all {selectedBrand} models</strong>}</span>
                </div>
              )}
              {categoryFilter !== 'All' && (
                <div className="compat-feedback" style={{ marginTop: '0.65rem', background: 'rgba(229, 57, 53, 0.08)', borderColor: 'rgba(229, 57, 53, 0.25)', color: 'var(--accent)' }}>
                  <ShoppingBag size={14} color="var(--accent)" />
                  <span>Category filter: <strong>{categoryFilter}</strong></span>
                  <button 
                    onClick={() => { setCategoryFilter('All'); setSubCategoryFilter('All'); }} 
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                  >
                    Clear Category &times;
                  </button>
                </div>
              )}
              {subCategoryFilter !== 'All' && (
                <div className="compat-feedback" style={{ marginTop: '0.4rem', background: 'rgba(17, 24, 39, 0.05)', borderColor: 'var(--border)', color: 'var(--text-main)' }}>
                  <ShoppingBag size={14} color="var(--accent)" />
                  <span>Sub-category: <strong>{subCategoryFilter}</strong></span>
                  <button 
                    onClick={() => setSubCategoryFilter('All')} 
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                  >
                    Clear Sub-Category &times;
                  </button>
                </div>
              )}
            </div>

            {/* Filter Controls */}
            <div className="glass-panel filter-panel">
              <div className="search-box">
                <Search size={17} color="var(--text-light)" />
                <input
                  type="text"
                  placeholder="Search parts, brands, keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="filter-pills">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategoryFilter(cat);
                      setSubCategoryFilter('All');
                    }}
                    className={`filter-pill ${categoryFilter === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Contextual Sub Category Filter Pills */}
              {availableSubCategoriesForFilter.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.65rem', paddingTop: '0.65rem', borderTop: '1px dashed var(--border)' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Sub Categories:
                  </span>
                  <button
                    onClick={() => setSubCategoryFilter('All')}
                    className={`filter-pill ${subCategoryFilter === 'All' ? 'active' : ''}`}
                    style={{ fontSize: '0.74rem', padding: '0.2rem 0.6rem' }}
                  >
                    All
                  </button>
                  {availableSubCategoriesForFilter.map(sub => (
                    <button
                      key={sub}
                      onClick={() => setSubCategoryFilter(sub)}
                      className={`filter-pill ${subCategoryFilter === sub ? 'active' : ''}`}
                      style={{ fontSize: '0.74rem', padding: '0.2rem 0.6rem' }}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
              <div className="sort-bar">
                <span className="sort-label">Sort by:</span>
                <div className="filter-pills">
                  {[
                    { key: 'default', label: 'Default' },
                    { key: 'price-asc', label: 'Price: Low → High' },
                    { key: 'price-desc', label: 'Price: High → Low' },
                    { key: 'rating', label: '⭐ Top Rated' }
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setSortBy(opt.key)}
                      className={`filter-pill ${sortBy === opt.key ? 'active' : ''}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {sortedProducts.length === 0 ? (
              <div className="glass-panel empty-state">
                <AlertCircle size={44} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
                <h3>No Compatible Spare Parts Found</h3>
                <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search queries or selecting a different bike model.</p>
              </div>
            ) : (
              <div className="products-grid">
                {sortedProducts.map(part => (
                  <ProductCard
                    key={part.id}
                    part={part}
                    onViewProduct={(p) => { setSelectedProduct(p); switchScreen('product'); }}
                    onAddToCart={addToCart}
                    onToggleWishlist={toggleWishlist}
                    isWishlisted={isWishlisted(part.id)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ═══ PRODUCT DETAIL SCREEN ═══ */}
        {!isTransitioning && activeTab === 'product' && selectedProduct && (
          <section className="animate-fade-in-up" style={{ maxWidth: '1100px', margin: '0 auto', paddingTop: '1.5rem' }}>
            <button
              onClick={() => { switchScreen('catalog'); setSelectedProduct(null); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}
            >
              <ArrowLeft size={16} /> Back to Catalog
            </button>

            <div className="product-detail-grid">
              {/* Image */}
              <div className="product-detail-image">
                <div className="product-detail-image-main">
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    <div style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', width: '100%', height: '100%', WebkitOverflowScrolling: 'touch' }}>
                      {selectedProduct.images.map((imgUrl, i) => (
                        <img key={i} src={imgUrl.trim()} alt={`${selectedProduct.name} ${i + 1}`} style={{ flex: '0 0 100%', width: '100%', height: '100%', objectFit: 'contain', scrollSnapAlign: 'start', backgroundColor: '#fff' }} />
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: '#ccc' }}>No Image Available</span>
                  )}
                </div>
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', padding: '0.75rem' }}>Swipe or scroll to view more images</p>
                )}
              </div>

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
                <div>
                  <span style={{ display: 'inline-block', background: 'var(--bg-main)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {selectedProduct.category}
                  </span>
                  <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.2, marginBottom: '0.5rem' }}>
                    {selectedProduct.name}
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                    <StarRating rating={selectedProduct.rating} />
                    <span style={{ fontSize: '0.82rem', color: 'var(--success)', fontWeight: 600 }}>
                      {selectedProduct.stock > 0 ? `In Stock (${selectedProduct.stock})` : 'Out of Stock'}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--accent)' }}>
                    ₹{Math.round(selectedProduct.price).toLocaleString('en-IN')}
                  </h2>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1.25rem 0' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem' }}>Product Overview</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    {selectedProduct.desc || 'No description available for this product.'}
                  </p>
                </div>

                {selectedProduct.compatibility && selectedProduct.compatibility.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem' }}>Compatibility</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {selectedProduct.compatibility.map(b => (
                        <span key={b} className="compat-badge" style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}>{b}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => { addToCart(selectedProduct); showToast(`Added ${selectedProduct.name} to cart`, 'success'); }}
                    className="btn-primary"
                    style={{ flex: 1, padding: '0.9rem', fontSize: '1rem' }}
                    disabled={selectedProduct.stock <= 0}
                  >
                    <ShoppingBag size={18} />
                    {selectedProduct.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                  <button
                    onClick={() => toggleWishlist(selectedProduct)}
                    className={`wishlist-btn ${isWishlisted(selectedProduct.id) ? 'active' : ''}`}
                    style={{ width: '50px', height: '50px' }}
                    title={isWishlisted(selectedProduct.id) ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <Heart size={22} fill={isWishlisted(selectedProduct.id) ? '#EF4444' : 'none'} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}



        {/* ═══ CONTACT SCREEN ═══ */}
        {!isTransitioning && activeTab === 'contact' && (
          <section className="animate-fade-in-up" style={{ maxWidth: '880px', margin: '0 auto', paddingTop: '1rem' }}>
            <div className="section-header">
              <span className="section-subtitle">CONTACT US</span>
              <h2 className="section-title">GET IN TOUCH WITH ZORVNS</h2>
              <p className="section-desc">Have inquiries about specific spare parts, stock levels, or order tracking? Drop us a message.</p>
            </div>

            <div className="contact-layout">
              <div className="contact-info-col">
                <div className="glass-panel contact-info-card">
                  <div className="contact-icon"><Phone size={18} /></div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Phone Support</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.15rem' }}>+1 (555) 019-2834</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Toll Free parts line</p>
                  </div>
                </div>
                <div className="glass-panel contact-info-card">
                  <div className="contact-icon"><Mail size={18} /></div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Email Address</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.15rem' }}>parts@zorvns.com</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Response in 24 hours</p>
                  </div>
                </div>
                <div className="glass-panel contact-info-card">
                  <div className="contact-icon"><MapPin size={18} /></div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>HQ Warehouse</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.15rem' }}>482 Gearbox Alley, Speedville</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel" style={{ flex: 1.3, padding: '1.75rem' }}>
                {contactSuccess ? (
                  <div className="animate-fade-in-up" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--success-bg)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                      <Check size={28} color="var(--success)" />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Message Sent!</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                      Thank you for contacting ZORVNS. Our parts department will get back to you shortly.
                    </p>
                    <button onClick={() => setContactSuccess(false)} className="btn-secondary">Send Another Message</button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', textAlign: 'left' }}>Send Us a Message</h3>
                    <div className="form-group">
                      <label className="form-label">Your Name</label>
                      <input type="text" required placeholder="e.g. Vikram Dev" value={contactData.name} onChange={(e) => setContactData({ ...contactData, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input type="email" required placeholder="e.g. vikram@example.com" value={contactData.email} onChange={(e) => setContactData({ ...contactData, email: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <select value={contactData.subject} onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}>
                        <option>Parts Availability Inquiry</option>
                        <option>Bulk Order Discount</option>
                        <option>Shipping & Delivery Status</option>
                        <option>General Feedback</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message</label>
                      <textarea required rows="4" placeholder="Write your request details here..." value={contactData.message} onChange={(e) => setContactData({ ...contactData, message: e.target.value })} />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                      <Send size={15} /> Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Cart Drawer */}
      <CartDrawer
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
        totalPrice={totalCartPrice}
      />

      {/* Footer */}
      <Footer zorvnsLogo={zorvnsLogo} onSwitchScreen={switchScreen} />

      {/* Wishlist Modal */}
      {!isTransitioning && activeTab === 'wishlist' && (
        <WishlistModal
          wishlist={wishlist}
          onClose={() => switchScreen('catalog')}
          onToggleWishlist={toggleWishlist}
          onAddToCart={(part) => { addToCart(part); showToast(`${part.name} moved to cart!`, 'success'); }}
        />
      )}

      {/* Back to Top */}
      {showBackToTop && (
        <button onClick={scrollToTop} className="back-to-top animate-fade-in-up" title="Back to top">
          <ChevronUp size={18} />
        </button>
      )}

      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  );
}

export default App;
