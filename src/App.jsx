import React, { useState, useEffect, useRef } from 'react';
import {
  Wrench,
  ShoppingBag,
  Calendar,
  Search,
  Plus,
  Minus,
  Trash2,
  X,
  Check,
  Clock,
  Phone,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Mail,
  Send,
  Sliders,
  ChevronRight,
  CheckCircle2,
  Info,
  Star,
  Heart,
  ChevronUp,
  User,
  ChevronDown,
  ArrowLeft,
  Settings
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
  { id: 1, name: 'Brembo Sintered Brake Pads', category: 'Brakes', price: 89.99, stock: 12, rating: 4.9, desc: 'High friction coefficient pads for maximum stopping power.', compatibility: ['Yamaha YZF-R15', 'Yamaha MT-15', 'KTM RC 390', 'KTM Duke 250', 'Honda CBR650R'] },
  { id: 2, name: 'NGK Iridium IX Spark Plug (Pack of 4)', category: 'Engine', price: 45.50, stock: 8, rating: 4.8, desc: 'Designed specifically for high-performance motorcycle engines.', compatibility: ['Yamaha YZF-R15', 'Yamaha MT-15', 'KTM RC 390', 'KTM Duke 250', 'RE Classic 350', 'RE Himalayan 450', 'RE Continental GT 650'] },
  { id: 3, name: 'K&N High-Flow Air Filter', category: 'Filters', price: 65.00, stock: 15, rating: 4.7, desc: 'Washable and reusable filter for increased horsepower.', compatibility: ['KTM RC 390', 'KTM Adventure 390', 'RE Himalayan 450'] },
  { id: 4, name: 'CNC Adjustable Clutch & Brake Levers', category: 'Controls', price: 110.00, stock: 6, rating: 4.9, desc: '6-position adjustable aluminum levers, black anodized.', compatibility: ['Yamaha YZF-R15', 'Yamaha MT-15', 'KTM Duke 250', 'KTM RC 390'] },
  { id: 5, name: 'Motul 300V Synthetic Oil (4 Liters)', category: 'Fluids', price: 79.99, stock: 20, rating: 5.0, desc: 'Double Ester technology for racing & high-revving engines.', compatibility: ['Yamaha YZF-R15', 'Yamaha MT-15', 'KTM RC 390', 'KTM Duke 250', 'RE Classic 350', 'RE Himalayan 450', 'RE Continental GT 650', 'Honda CB350 H\'ness', 'Honda CBR650R', 'Honda Hornet 2.0', 'KTM Adventure 390'] },
  { id: 6, name: 'LED Sequential Turn Signals (Set of 2)', category: 'Electrical', price: 34.99, stock: 24, rating: 4.6, desc: 'Sequential flowing glow pattern with high brightness LEDs.', compatibility: ['Yamaha YZF-R15', 'Yamaha MT-15', 'KTM RC 390', 'KTM Duke 250', 'RE Classic 350', 'RE Himalayan 450', 'RE Continental GT 650', 'Honda CB350 H\'ness', 'Honda CBR650R', 'Honda Hornet 2.0', 'KTM Adventure 390'] },
  { id: 7, name: 'DID 525 VX3 Gold X-Ring Chain', category: 'Drivetrain', price: 135.00, stock: 4, rating: 4.9, desc: 'Top-tier durability and reduced friction chain.', compatibility: ['RE Continental GT 650', 'Honda CBR650R'] },
  { id: 8, name: 'Yuasa Heavy Duty AGM Battery', category: 'Electrical', price: 95.00, stock: 10, rating: 4.7, desc: 'Maintenance-free high cranking amp battery.', compatibility: ['RE Classic 350', 'RE Himalayan 450', 'Honda CB350 H\'ness'] }
];

// Service status categories
const STATUS_STEPS = [
  { key: 'booked', label: 'Booking Confirmed', desc: 'Appointment scheduled successfully', color: 'var(--info)' },
  { key: 'received', label: 'Bike Received', desc: 'Checked in at the workshop garage', color: 'var(--warning)' },
  { key: 'inspecting', label: 'Diagnostic Check', desc: 'Pre-service checks and inspection', color: 'var(--accent)' },
  { key: 'servicing', label: 'Active Repairs', desc: 'Spares replacement & servicing', color: 'var(--accent-hover)' },
  { key: 'testing', label: 'Quality Test', desc: 'Road testing and diagnostic verification', color: 'var(--info)' },
  { key: 'ready', label: 'Ready for Pickup', desc: 'Finished, polished, and ready to ride!', color: 'var(--success)' }
];

// Initial mock bookings seeded to local storage
const INITIAL_BOOKINGS = [
  {
    code: 'SC-77301',
    name: 'Vikram Dev',
    phone: '9876543210',
    bikeModel: 'Yamaha YZF-R1',
    serviceType: 'Performance Tuning & Fluid Flush',
    date: '2026-08-12',
    time: '10:00 AM',
    statusIndex: 3, // Servicing
    notes: 'Please check rear brake feel and adjust chain slack.'
  },
  {
    code: 'SC-12402',
    name: 'John Doe',
    phone: '9988776655',
    bikeModel: 'KTM Duke 390',
    serviceType: 'General Servicing',
    date: '2026-08-13',
    time: '02:30 PM',
    statusIndex: 1, // Received
    notes: 'Standard 10,000 km oil change & service.'
  }
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

  // SHOW_GARAGE_SERVICES state (controlled by admin dashboard!)
  const [showGarage, setShowGarage] = useState(() => {
    const saved = localStorage.getItem('spark_show_garage');
    return saved ? JSON.parse(saved) : false;
  });

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
    return saved ? JSON.parse(saved) : INITIAL_SPARES;
  });

  // Pull latest bookings from local storage (synced with admin panel)
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('spark_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  // Pull enquiries from local storage (synced with admin panel)
  const [enquiries, setEnquiries] = useState(() => {
    const saved = localStorage.getItem('spark_enquiries');
    return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
  });

  // Spare By Bike State Finder
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedBike, setSelectedBike] = useState('');

  // Sidebar Filter States
  const [filterCategories, setFilterCategories] = useState([]);
  const [filterVehicleConfigs, setFilterVehicleConfigs] = useState([]);
  const [filterAvailability, setFilterAvailability] = useState([]);
  const [filterPriceRange, setFilterPriceRange] = useState({ min: '', max: '' });

  // Keep local states synchronized with changes made in other tabs (Admin panel)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedGarage = localStorage.getItem('spark_show_garage');
      if (savedGarage) setShowGarage(JSON.parse(savedGarage));

      const savedSpares = localStorage.getItem('spark_spares');
      if (savedSpares) setSpares(JSON.parse(savedSpares));

      const savedBookings = localStorage.getItem('spark_bookings');
      if (savedBookings) setBookings(JSON.parse(savedBookings));

      const savedEnquiries = localStorage.getItem('spark_enquiries');
      if (savedEnquiries) setEnquiries(JSON.parse(savedEnquiries));
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Booking Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bikeModel: '',
    serviceType: 'General Diagnostics & Tuning',
    date: '',
    time: '09:00 AM',
    notes: ''
  });
  const [bookingSuccessCode, setBookingSuccessCode] = useState('');

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
  const cartPulseKeyRef = useRef(0);
  const [cartPulseKey, setCartPulseKey] = useState(0);

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

  // Catalog State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // Tracking Code Input
  const [searchTrackingCode, setSearchTrackingCode] = useState('SC-77301');
  const [trackedBooking, setTrackedBooking] = useState(bookings[0]);

  // Sync tracked booking when bookings state updates
  useEffect(() => {
    if (trackedBooking) {
      const match = bookings.find(b => b.code === trackedBooking.code);
      if (match) setTrackedBooking(match);
    }
  }, [bookings]);

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
    setCartPulseKey(k => k + 1);
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

  // Submit Booking Form
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const newCode = `SC-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking = {
      code: newCode,
      name: formData.name,
      phone: formData.phone,
      bikeModel: formData.bikeModel,
      serviceType: formData.serviceType,
      date: formData.date,
      time: formData.time,
      statusIndex: 0,
      notes: formData.notes
    };
    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    localStorage.setItem('spark_bookings', JSON.stringify(updatedBookings));

    setBookingSuccessCode(newCode);
    setSearchTrackingCode(newCode);
    setTrackedBooking(newBooking);

    setFormData({
      name: '',
      phone: '',
      bikeModel: '',
      serviceType: 'General Diagnostics & Tuning',
      date: '',
      time: '09:00 AM',
      notes: ''
    });

    switchScreen('tracking');
  };

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

  // Simulate advancing the status of a tracked booking for demo purposes
  const advanceTrackedStatus = () => {
    if (!trackedBooking) return;
    const currentIdx = trackedBooking.statusIndex;
    const nextIdx = (currentIdx + 1) % STATUS_STEPS.length;

    const updatedBookings = bookings.map(b => {
      if (b.code === trackedBooking.code) {
        return { ...b, statusIndex: nextIdx };
      }
      return b;
    });
    setBookings(updatedBookings);
    localStorage.setItem('spark_bookings', JSON.stringify(updatedBookings));
    setTrackedBooking(prev => ({ ...prev, statusIndex: nextIdx }));
  };

  // Handle Tracking Search
  const handleTrackSubmit = (e) => {
    e.preventDefault();
    const result = bookings.find(b => b.code.toUpperCase().trim() === searchTrackingCode.toUpperCase().trim());
    if (result) {
      setTrackedBooking(result);
      showToast(`Booking ${result.code} found!`, 'success');
    } else {
      setTrackedBooking(null);
      showToast('Tracking code not found. Try "SC-77301" for a demo!', 'error');
    }
  };

  // Checkout simulation
  const handleCheckout = () => {
    showToast(`🎉 Order placed! Total ₹${totalCartPrice.toFixed(2)} — Thank you!`, 'success');
    setCart([]);
    setIsCartOpen(false);
  };

  // Filter products
  const filteredProducts = spares.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          part.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || part.category === categoryFilter;

    let matchesBike = true;
    if (selectedBike) {
      matchesBike = part.compatibility && part.compatibility.includes(selectedBike);
    } else if (selectedBrand) {
      const brandBikes = bikeBrands[selectedBrand] || [];
      matchesBike = part.compatibility && part.compatibility.some(bike => brandBikes.includes(bike));
    }

    return matchesSearch && matchesCategory && matchesBike;
  });

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const categories = ['All', 'Engine', 'Brakes', 'Filters', 'Controls', 'Fluids', 'Electrical', 'Drivetrain'];

  // Switch Screen logic
  const switchScreen = (tabName) => {
    setActiveTab(tabName);
    setHoveredMenu(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        showGarage={showGarage}
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
      />

      {/* Main Content */}
      <main className="app-container main-content" style={{ padding: '1.5rem' }}>

        {/* ═══ HOME SCREEN ═══ */}
        {activeTab === 'home' && (
          <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', width: '100vw', marginLeft: 'calc(-50vw + 50%)', overflowX: 'hidden' }}>

            {/* Hero */}
            <HeroSection heroImage={heroImg} onShopNow={() => switchScreen('catalog')} />

            {/* Shop by Category */}
            <div className="app-container" style={{ textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
              <h2 className="section-title" style={{ textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '2rem' }}>Shop By Category</h2>
              <CategoryGrid onCategoryClick={() => switchScreen('catalog')} />
            </div>

            {/* Promo Banner */}
            <div className="app-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div className="promo-banner">
                <h3>FREE SHIPPING ON ORDERS OVER ₹4,999!</h3>
                <p>Use code <span className="promo-code">FREERIDE</span> at checkout. Valid until end of month.</p>
              </div>
            </div>

            {/* Best Sellers */}
            <div className="app-container" style={{ textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
              <h2 className="section-title" style={{ textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '2rem' }}>Best Sellers</h2>
              <div className="products-grid">
                {spares.slice(0, 4).map(part => (
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
            </div>

            {/* Top Brands */}
            <div className="app-container" style={{ textAlign: 'center', maxWidth: '1200px', margin: '0 auto', marginBottom: '2rem' }}>
              <h2 className="section-title" style={{ textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '2rem' }}>Top Brands</h2>
              <div className="brands-grid">
                {['BREMBO', 'K&N', 'MOTUL', 'NGK', 'AKRAPOVIC', 'MICHELIN'].map((brand, idx) => (
                  <div key={idx} className="brand-logo-card">{brand}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ SERVICES SCREEN ═══ */}
        {showGarage && activeTab === 'services' && (
          <section className="animate-fade-in-up" style={{ paddingTop: '1rem', marginBottom: '2rem' }}>
            <div className="section-header">
              <span className="section-subtitle">CLINIC SERVICES</span>
              <h2 className="section-title">PROFESSIONAL MOTORCYCLE CARE</h2>
              <p className="section-desc">Our certified technicians use cutting edge tools to maintain, diagnose, and repair superbikes and commuter rides alike.</p>
            </div>

            <div className="service-grid">
              {[
                { icon: Wrench, title: 'General Tune-up & Inspection', text: 'Comprehensive 32-point inspection, chain adjustments, Spark plugs check, oil replacement, filter cleaning, and clutch wire adjustment.', price: '₹3,999' },
                { icon: Settings, title: 'Performance ECU Tuning', text: 'Custom fuel mapping, ignition curve optimization, dyno runs, throttle response adjustments, and speed limiter configuration.', price: '₹12,499' },
                { icon: ShieldCheck, title: 'Brake System Overhaul', text: 'Brembo pad replacements, rotor resurfacing, brake fluid flush, master cylinder rebuild, and pressure testing for supreme safety.', price: '₹2,999' },
                { icon: TrendingUp, title: 'Suspension Tuning & Seals', text: 'Sag calibration for riders weight, rebuild front forks, dust and oil seals replacements, rear shock overhaul, and damping setup.', price: '₹6,999' }
              ].map((service, idx) => (
                <div key={idx} className="glass-panel service-card">
                  <div className="service-icon"><service.icon size={22} /></div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{service.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', flex: 1 }}>{service.text}</p>
                  <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.92rem' }}>Starting at {service.price}</span>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <button onClick={() => switchScreen('book')} className="btn-primary">Book An Appointment</button>
            </div>
          </section>
        )}

        {/* ═══ CATALOG SCREEN ═══ */}
        {activeTab === 'catalog' && (
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
                    onClick={() => setCategoryFilter(cat)}
                    className={`filter-pill ${categoryFilter === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
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

            {/* Garage Teaser */}
            {!showGarage && (
              <div className="glass-panel teaser-banner animate-fade-in-up">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <div className="service-icon" style={{ width: '48px', height: '48px' }}>
                    <Wrench size={22} />
                  </div>
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>ZORVNS Clinic & Garage Servicing</h3>
                <span style={{
                  fontSize: '0.75rem', background: 'var(--bg-main)', color: 'var(--text-muted)',
                  border: '1px solid var(--border)', padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-sm)', fontWeight: 700
                }}>COMING SOON</span>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '580px', margin: '1rem auto 0', lineHeight: 1.6 }}>
                  We are expanding our store! Professional diagnostic evaluations, suspension setups, and high-performance ECU mappings will be available in our clinic soon.
                </p>
              </div>
            )}
          </section>
        )}

        {/* ═══ PRODUCT DETAIL SCREEN ═══ */}
        {activeTab === 'product' && selectedProduct && (
          <section className="animate-fade-in-up" style={{ maxWidth: '1100px', margin: '0 auto', paddingTop: '1rem' }}>
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
                    ₹{selectedProduct.price.toFixed(2)}
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

        {/* ═══ TRACKING SCREEN ═══ */}
        {showGarage && activeTab === 'tracking' && (
          <section className="animate-fade-in-up" style={{ paddingTop: '1rem', marginBottom: '2rem' }}>
            <div className="section-header">
              <span className="section-subtitle">TRACKER</span>
              <h2 className="section-title">LIVE GARAGE STATUS</h2>
              <p className="section-desc">Watch the status of your machine live as technicians work. Search using your unique ZORVNS booking code.</p>
            </div>

            <div style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
              <form onSubmit={handleTrackSubmit} style={{ display: 'flex', gap: '0.6rem', width: '100%' }}>
                <input
                  type="text"
                  placeholder="Enter Code (try: SC-77301)"
                  value={searchTrackingCode}
                  onChange={(e) => setSearchTrackingCode(e.target.value)}
                  style={{ fontSize: '1rem', padding: '0.85rem' }}
                />
                <button type="submit" className="btn-primary">Track Ride</button>
              </form>
            </div>

            {trackedBooking ? (
              <div className="glass-panel animate-fade-in-up" style={{ padding: '2rem', textAlign: 'left', maxWidth: '820px', margin: '0 auto' }}>
                <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={15} color="var(--accent)" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>DEMO SIMULATION TOOL</span>
                  </div>
                  <button onClick={advanceTrackedStatus} className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
                    Simulate Status Step Forward
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                  <div>
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{trackedBooking.code}</span>
                    <h3 style={{ fontSize: '1.35rem', marginTop: '0.2rem' }}>{trackedBooking.bikeModel}</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Owner</span>
                    <p style={{ fontWeight: 600 }}>{trackedBooking.name}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>SERVICE TYPE</span>
                    <p style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.1rem' }}>{trackedBooking.serviceType}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>APPOINTMENT SLOT</span>
                    <p style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.1rem' }}>{trackedBooking.date} at {trackedBooking.time}</p>
                  </div>
                </div>

                {trackedBooking.notes && (
                  <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.85rem', marginBottom: '2rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>SYMPTOMS & NOTES</span>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>"{trackedBooking.notes}"</p>
                  </div>
                )}

                <div className="timeline-grid">
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx <= trackedBooking.statusIndex;
                    const isActive = idx === trackedBooking.statusIndex;
                    return (
                      <div key={step.key} className="timeline-step">
                        <div className={`timeline-dot ${isCompleted ? 'completed' : 'pending'} ${isActive ? 'active' : ''}`}>
                          {isCompleted ? <Check size={13} color="#fff" /> : <span>{idx + 1}</span>}
                        </div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>{step.label}</div>
                        <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{step.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="glass-panel empty-state" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <AlertCircle size={36} color="var(--text-light)" style={{ marginBottom: '0.5rem' }} />
                <h3>No active tracking lookup.</h3>
                <p style={{ color: 'var(--text-muted)' }}>Enter one of the demo booking codes (like <strong>SC-77301</strong> or <strong>SC-12402</strong>) above to test the interactive status simulation!</p>
              </div>
            )}
          </section>
        )}

        {/* ═══ BOOKING SCREEN ═══ */}
        {showGarage && activeTab === 'book' && (
          <section className="animate-fade-in-up" style={{ maxWidth: '700px', margin: '0 auto', paddingTop: '1rem' }}>
            <div className="section-header">
              <span className="section-subtitle">RESERVATION</span>
              <h2 className="section-title">BOOK A SERVICE SLOT</h2>
              <p className="section-desc">Fill in your details below. We will assign you a tracking code immediately.</p>
            </div>

            {bookingSuccessCode ? (
              <div className="glass-panel animate-fade-in-up" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--success-bg)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <Check size={30} color="var(--success)" />
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Booking Confirmed!</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Your appointment slot has been successfully locked. Use the tracking code below in the 'Track Ride' panel.
                </p>
                <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'inline-flex', flexDirection: 'column', gap: '0.2rem', minWidth: '260px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>TRACKING CODE</span>
                  <span style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--accent)' }}>{bookingSuccessCode}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                  <button onClick={() => { switchScreen('tracking'); setBookingSuccessCode(''); }} className="btn-primary">Track Live Progress</button>
                  <button onClick={() => setBookingSuccessCode('')} className="btn-secondary">Book Another Slot</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" required placeholder="e.g. Vikram Dev" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" required placeholder="e.g. 9876543210" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Motorcycle Model</label>
                    <input type="text" required placeholder="e.g. Yamaha YZF-R1 or Duke 390" value={formData.bikeModel} onChange={(e) => setFormData({ ...formData, bikeModel: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Service Category</label>
                    <select value={formData.serviceType} onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}>
                      <option>General Diagnostics & Tuning</option>
                      <option>Performance ECU Tuning</option>
                      <option>Suspension Tuning & Fork seals</option>
                      <option>Braking System Overhaul</option>
                      <option>Complete Fluid & Engine Flush</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Preferred Date</label>
                    <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preferred Time Slot</label>
                    <select value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })}>
                      <option>09:00 AM - 11:30 AM</option>
                      <option>11:30 AM - 02:00 PM</option>
                      <option>02:30 PM - 05:00 PM</option>
                      <option>05:00 PM - 07:30 PM</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Special Notes / Diagnostics Symptoms</label>
                  <textarea rows="3" placeholder="Provide any details..." value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                  <Calendar size={16} /> Confirm and Book Appointment
                </button>
              </form>
            )}
          </section>
        )}

        {/* ═══ CONTACT SCREEN ═══ */}
        {activeTab === 'contact' && (
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
      {activeTab === 'wishlist' && (
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
