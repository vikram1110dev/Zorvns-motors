import React, { StrictMode, useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Wrench, 
  Plus, 
  Trash2, 
  X, 
  Check, 
  Unlock, 
  LogOut, 
  DollarSign, 
  Package, 
  Inbox,
  AlertCircle,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import './index.css';
import zorvnsLogo from './assets/zorvns-logo.png';

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

const INITIAL_BIKE_BRANDS = {
  'ROYAL ENFIELD': [
    'Classic 350', 'Classic 500', 'Meteor 350', 'Himalayan 450', 
    'Guerrilla 450', 'Super Meteor 650', 'Himalayan 411', 'Scram 411', 
    'Interceptor 650', 'Continental GT 650', 'Hunter 350', 'Thunderbird 350',
    'Thunderbird 500', 'Classic reborn 350'
  ],
  'TVS': [
    'Apache RTR 300', 'Apache RR 310', 'Apache RTR 310', 'Apache RTR 200', 'Apache 160'
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

// Initial Mock spare parts catalog data
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
  { id: 2, name: 'Sarah Connor', email: 'sarah@example.com', subject: 'Bulk Order Discount', message: 'Looking to purchase 10 packs of NGK Iridium spark plugs. Do you offer bulk trade discounts?', resolved: true }
];

function AdminPortal() {
  // Spares store inventory state
  const [spares, setSpares] = useState(() => {
    const saved = localStorage.getItem('spark_spares');
    if (!saved) return INITIAL_SPARES;
    try {
      const parsed = JSON.parse(saved);
      return parsed.map(item => {
        if (!item.subCategory) {
          const matchInitial = INITIAL_SPARES.find(init => init.id === item.id);
          return { ...item, subCategory: matchInitial ? matchInitial.subCategory : '' };
        }
        return item;
      });
    } catch {
      return INITIAL_SPARES;
    }
  });

  useEffect(() => {
    localStorage.setItem('spark_spares', JSON.stringify(spares));
  }, [spares]);

  // Customer enquiries state
  const [enquiries, setEnquiries] = useState(() => {
    const saved = localStorage.getItem('spark_enquiries');
    return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
  });

  useEffect(() => {
    localStorage.setItem('spark_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  // Spares Menu State
  const [sparesMenu, setSparesMenu] = useState(() => {
    const saved = localStorage.getItem('spark_spares_menu');
    return saved ? JSON.parse(saved) : INITIAL_SPARES_MENU;
  });

  useEffect(() => {
    localStorage.setItem('spark_spares_menu', JSON.stringify(sparesMenu));
  }, [sparesMenu]);

  // Bike Brands state
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

  useEffect(() => {
    localStorage.setItem('spark_bike_brands', JSON.stringify(bikeBrands));
  }, [bikeBrands]);

  // Brand Management State
  const [brandLogos, setBrandLogos] = useState(() => {
    const saved = localStorage.getItem('spark_brand_logos');
    const parsed = saved ? JSON.parse(saved) : {};
    const merged = { ...INITIAL_BRAND_LOGOS, ...parsed };
    localStorage.setItem('spark_brand_logos', JSON.stringify(merged));
    return merged;
  });

  useEffect(() => {
    localStorage.setItem('spark_brand_logos', JSON.stringify(brandLogos));
  }, [brandLogos]);

  const [brandOrder, setBrandOrder] = useState(() => {
    const saved = localStorage.getItem('spark_brand_order');
    if (saved) return JSON.parse(saved);
    const defaultOrder = Object.keys(INITIAL_BIKE_BRANDS);
    localStorage.setItem('spark_brand_order', JSON.stringify(defaultOrder));
    return defaultOrder;
  });

  useEffect(() => {
    localStorage.setItem('spark_brand_order', JSON.stringify(brandOrder));
  }, [brandOrder]);

  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandModel, setNewBrandModel] = useState('');
  const [newModelInputs, setNewModelInputs] = useState({});


  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddMenuCategory = (colIdx) => {
    const title = prompt('Enter new category name (leave blank for a spacer):');
    if (title === null) return;
    const trimmed = title.trim();
    const newMenu = [...sparesMenu];
    newMenu[colIdx].push({ id: Date.now().toString(), title: trimmed, items: [] });
    setSparesMenu(newMenu);
    if (trimmed) {
      setNewPartData(prev => ({ ...prev, category: trimmed }));
      setNewProduct(prev => ({ ...prev, category: trimmed }));
      showToast(`Category "${trimmed}" added! Now available in Add New Spare Part.`, 'success');
    }
  };

  const handleEditMenuCategory = (colIdx, catIdx, oldTitle) => {
    const title = prompt('Edit category name:', oldTitle);
    if (title === null) return;
    const trimmed = title.trim();
    const newMenu = [...sparesMenu];
    newMenu[colIdx][catIdx].title = trimmed;
    setSparesMenu(newMenu);
    if (trimmed) {
      showToast(`Category renamed to "${trimmed}".`, 'success');
    }
  };

  const handleDeleteMenuCategory = (colIdx, catIdx) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    const newMenu = [...sparesMenu];
    newMenu[colIdx].splice(catIdx, 1);
    setSparesMenu(newMenu);
    showToast('Category deleted.', 'info');
  };

  const handleAddMenuLink = (colIdx, catIdx) => {
    const link = prompt('Enter new sub-category link name:');
    if (!link) return;
    const trimmed = link.trim();
    const newMenu = [...sparesMenu];
    newMenu[colIdx][catIdx].items.push(trimmed);
    setSparesMenu(newMenu);
    showToast(`Link "${trimmed}" added.`, 'success');
  };

  const handleDeleteMenuLink = (colIdx, catIdx, linkIdx) => {
    const newMenu = [...sparesMenu];
    newMenu[colIdx][catIdx].items.splice(linkIdx, 1);
    setSparesMenu(newMenu);
  };

  const handleSaveAllChanges = () => {
    localStorage.setItem('spark_spares_menu', JSON.stringify(sparesMenu));
    localStorage.setItem('spark_spares', JSON.stringify(spares));
    localStorage.setItem('spark_bike_brands', JSON.stringify(bikeBrands));
    localStorage.setItem('spark_last_modified', new Date().toISOString());
    window.dispatchEvent(new Event('storage'));
    showToast('All changes saved and published to site!', 'success');
  };

  const handleAddBrand = (e) => {
    e.preventDefault();
    if (!newBrandName.trim() || !newBrandModel.trim()) return;
    const brandName = newBrandName.toUpperCase();
    if (bikeBrands[brandName]) {
      alert('Brand already exists!');
      return;
    }
    setBikeBrands(prev => ({
      ...prev,
      [brandName]: [newBrandModel]
    }));
    setBrandOrder(prev => {
      if (prev.includes(brandName)) return prev;
      return [...prev, brandName];
    });
    setNewBrandName('');
    setNewBrandModel('');
  };

  const handleDeleteBrand = (brand) => {
    if (confirm(`Are you sure you want to delete ${brand}? This removes all its models.`)) {
      const newBrands = { ...bikeBrands };
      delete newBrands[brand];
      setBikeBrands(newBrands);
      setBrandOrder(prev => prev.filter(b => b !== brand));
    }
  };

  const handleMoveBrandUp = (index) => {
    if (index === 0) return;
    const newOrder = [...brandOrder];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setBrandOrder(newOrder);
  };

  const handleMoveBrandDown = (index) => {
    if (index === brandOrder.length - 1) return;
    const newOrder = [...brandOrder];
    [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
    setBrandOrder(newOrder);
  };


  const handleAddModel = (brand) => {
    const model = newModelInputs[brand];
    if (!model || !model.trim()) return;
    if (bikeBrands[brand].includes(model)) return;
    setBikeBrands(prev => ({
      ...prev,
      [brand]: [...prev[brand], model]
    }));
    setNewModelInputs(prev => ({ ...prev, [brand]: '' }));
  };

  const handleDeleteModel = (brand, model) => {
    if (confirm(`Remove ${model} from ${brand}?`)) {
      setBikeBrands(prev => ({
        ...prev,
        [brand]: prev[brand].filter(m => m !== model)
      }));
    }
  };

  const handleUpdateLogo = (brand, url) => {
    setBrandLogos(prev => ({
      ...prev,
      [brand]: url
    }));
  };

  // Admin Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    const saved = sessionStorage.getItem('spark_admin_auth');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    sessionStorage.setItem('spark_admin_auth', JSON.stringify(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  const [adminCredentials, setAdminCredentials] = useState({ email: '', password: '' });
  const [adminLoginError, setAdminLoginError] = useState('');

  // Admin New Part Form State
  const [newPartData, setNewPartData] = useState({
    name: '',
    category: 'Engine',
    subCategory: '',
    price: '',
    stock: '',
    desc: ''
  });
  const [compatCheckboxes, setCompatCheckboxes] = useState([]);

  // Compute contextual subcategory suggestions for current category and all known subcategories
  const availableSubCategories = useMemo(() => {
    const set = new Set();

    const defaultCategorySubMap = {
      'Engine': ['Spark plug', 'Piston', 'Cylinder Head', 'Gasket', 'Camshaft', 'Valves', 'Carburetor', 'Oil filter'],
      'Brakes': ['Brake Pads', 'Brake shoe', 'Disc plate', 'Master cylinder', 'Brake pedal', 'Brake lines', 'Brake housing', 'Brake cable'],
      'Filters': ['Air Filter', 'Oil filter', 'Fuel Filter', 'Cabin Filter'],
      'Controls': ['Levers', 'Gear pedal', 'Footrest', 'Footrest bracket', 'Throttle cable', 'Clutch cable', 'Handlebar', 'Mirrors', 'Control switch'],
      'Fluids': ['Engine Oil', 'Brake Fluid', 'Chain lube', 'Fork oil', 'Coolant', 'Chain maintenance'],
      'Electrical': ['Battery', 'Spark plug', 'Headlamp', 'Indicators', 'Regulator rectifier', 'Speedometer', 'Horn', 'Turn Signals'],
      'Drivetrain': ['Regular chain sprocket', 'Chain', 'Chain maintenance', 'Clutch plate', 'Clutch assembly', 'Clutch shoe', 'CVT belt'],
      'Fork parts': ['Fork oil seal', 'Shock absorber'],
      'Swingarm parts': ['Swingarm bush kit'],
      'Lighting': ['Headlamp', 'Indicators'],
      'Body parts': ['Visor', 'Front shield', 'Mudguard', 'Fairings'],
      'Gear system': ['Gear pedal'],
      'Foot control': ['Footrest', 'Footrest bracket'],
      'Fuel': ['Fuel pump assembly', 'Fuel cock']
    };

    if (newPartData.category && defaultCategorySubMap[newPartData.category]) {
      defaultCategorySubMap[newPartData.category].forEach(s => set.add(s));
    }

    (sparesMenu || []).forEach(col => {
      (col || []).forEach(block => {
        if (block.items) {
          block.items.forEach(it => {
            if (it && it.trim()) set.add(it.trim());
          });
        }
      });
    });

    (spares || []).forEach(p => {
      if (p.subCategory && p.subCategory.trim()) {
        set.add(p.subCategory.trim());
      }
    });

    return Array.from(set);
  }, [newPartData.category, sparesMenu, spares]);

  // Admin login handler
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if ((adminCredentials.email === 'admin@zorvns.com' || adminCredentials.email === 'admin@sparkcraft.com') && adminCredentials.password === 'admin123') {
      setIsAdminLoggedIn(true);
      setAdminLoginError('');
    } else {
      setAdminLoginError('Invalid admin credentials.');
    }
  };

  // Add Part handler
  const handleAddPart = (e) => {
    e.preventDefault();
    const newPart = {
      id: Date.now(),
      name: newPartData.name,
      category: newPartData.category,
      subCategory: (newPartData.subCategory || '').trim(),
      price: parseFloat(newPartData.price),
      stock: parseInt(newPartData.stock),
      rating: 5.0,
      desc: newPartData.desc,
      compatibility: compatCheckboxes
    };
    const updated = [...spares, newPart];
    setSpares(updated);
    setNewPartData({ name: '', category: 'Engine', subCategory: '', price: '', stock: '', desc: '' });
    setCompatCheckboxes([]);
    showToast(`Added ${newPart.name} to inventory!`, 'success');
  };

  // Toggle compatibility checkbox
  const handleToggleCompat = (bike) => {
    if (compatCheckboxes.includes(bike)) {
      setCompatCheckboxes(prev => prev.filter(b => b !== bike));
    } else {
      setCompatCheckboxes(prev => [...prev, bike]);
    }
  };

  // Update spares values directly
  const handleUpdateStock = (id, newStock) => {
    setSpares(prev => prev.map(item => item.id === id ? { ...item, stock: Math.max(0, parseInt(newStock)) } : item));
  };

  const handleUpdatePrice = (id, newPrice) => {
    setSpares(prev => prev.map(item => item.id === id ? { ...item, price: Math.max(0, parseFloat(newPrice)) } : item));
  };

  const handleUpdateSubCategory = (id, newSubCategory) => {
    setSpares(prev => prev.map(item => item.id === id ? { ...item, subCategory: newSubCategory } : item));
  };

  // Delete spare part
  const handleDeletePart = (id) => {
    if (confirm('Are you sure you want to delete this part from inventory?')) {
      setSpares(prev => prev.filter(item => item.id !== id));
    }
  };

  // Resolve Enquiry
  const handleResolveEnquiry = (id) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, resolved: !e.resolved } : e));
  };

  // Derive categories dynamically from Shop By Spares Mega Menu + existing catalog inventory
  const categories = useMemo(() => {
    const map = new Map();
    const addCategory = (name) => {
      if (!name) return;
      const trimmed = name.trim();
      if (!trimmed || trimmed.toLowerCase() === '(spacer)') return;
      const key = trimmed.toLowerCase();
      if (!map.has(key)) {
        map.set(key, trimmed);
      }
    };

    // 1. Categories defined in Shop By Spares Mega Menu
    (sparesMenu || []).forEach(col => {
      (col || []).forEach(cat => {
        addCategory(cat.title);
      });
    });

    // 2. Categories from existing spares catalog
    (spares || []).forEach(part => {
      addCategory(part.category);
    });

    // 3. Fallback defaults
    ['Engine', 'Brakes', 'Filters', 'Controls', 'Fluids', 'Electrical', 'Drivetrain'].forEach(d => addCategory(d));

    return Array.from(map.values());
  }, [sparesMenu, spares]);

  return (
    <>
      <nav style={styles.nav}>
        <div className="app-container" style={styles.navContainer}>
          <div 
            style={{ ...styles.logoGroup, cursor: 'pointer' }} 
            onClick={() => window.location.href = '/'}
            title="Return to Main Store"
          >
            <img 
              src={zorvnsLogo} 
              alt="ZORVNS" 
              style={{ height: '38px', maxWidth: '160px', objectFit: 'contain', display: 'block' }} 
            />
            <span style={styles.logoBadge}>OPERATIONS PORTAL</span>
          </div>

          <div style={styles.navActions}>
            {isAdminLoggedIn && (
              <button 
                onClick={() => { setIsAdminLoggedIn(false); window.location.href = '/'; }} 
                className="btn-secondary" 
                style={{ padding: '0.5rem 0.8rem', display: 'flex', gap: '0.25rem', height: '40px', alignItems: 'center' }}
              >
                <LogOut size={16} />
                Sign Out & Exit
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="app-container" style={{ padding: '6.5rem 1.5rem 4rem', minHeight: 'calc(100vh - 20rem)' }}>
        {!isAdminLoggedIn ? (
          <section className="animate-fade-in-up" style={{ maxWidth: '440px', margin: '4rem auto' }}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionSubtitle}>PORTAL LOCK</span>
              <h2 style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>AUTHENTICATE OPERATOR</h2>
            </div>

            <div className="glass-panel" style={{ padding: '2.5rem 2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem', gap: '0.6rem' }}>
                <img 
                  src={zorvnsLogo} 
                  alt="ZORVNS" 
                  style={{ height: '54px', maxWidth: '210px', objectFit: 'contain', display: 'block' }} 
                />
                <span style={styles.logoBadge}>ADMIN SECURE ACCESS</span>
              </div>

              {adminLoginError && (
                <div style={styles.errorAlert}>
                  <AlertCircle size={16} />
                  <span>{adminLoginError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                  <label style={styles.formLabel}>Admin Email</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="admin@zorvns.com"
                    value={adminCredentials.email}
                    onChange={(e) => setAdminCredentials({...adminCredentials, email: e.target.value})}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                  <label style={styles.formLabel}>Password</label>
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••"
                    value={adminCredentials.password}
                    onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                  <Unlock size={16} />
                  Authenticate
                </button>
              </form>
            </div>
          </section>
        ) : (
          <section className="animate-fade-in-up">
            <div style={styles.adminDashboardHeader}>
              <div>
                <span style={styles.sectionSubtitle}>CONTROL BOARD</span>
                <h2 style={{ fontSize: '2rem', textAlign: 'left' }}>ZORVNS OPERATIONS</h2>
              </div>
            </div>

            {/* Dashboard metrics grid */}
            <div style={styles.adminMetricsGrid}>
              <div className="glass-panel" style={styles.adminMetricCard}>
                <DollarSign size={20} color="var(--primary)" />
                <div>
                  <span style={styles.adminMetricLabel}>SIMULATED SALES</span>
                  <h4 style={styles.adminMetricVal}>$14,849.20</h4>
                </div>
              </div>

              <div className="glass-panel" style={styles.adminMetricCard}>
                <Package size={20} color="var(--info)" />
                <div>
                  <span style={styles.adminMetricLabel}>INVENTORY PARTS</span>
                  <h4 style={styles.adminMetricVal}>{spares.length} Items</h4>
                </div>
              </div>

              <div className="glass-panel" style={styles.adminMetricCard}>
                <Inbox size={20} color="var(--warning)" />
                <div>
                  <span style={styles.adminMetricLabel}>CONTACT INQUIRIES</span>
                  <h4 style={styles.adminMetricVal}>{enquiries.filter(e => !e.resolved).length} Pending</h4>
                </div>
              </div>
            </div>

            {/* Main Admin Section Grid */}
            <div style={styles.adminSectionLayout}>
              
              {/* Left Column: Inventory list & Add Spares form */}
              <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', textAlign: 'left' }}>Store Catalog Inventory</h3>
                  
                  
                  <div style={styles.adminTableContainer}>
                    <table style={styles.adminTable}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Name</th>
                          <th style={styles.th}>Category</th>
                          <th style={styles.th}>Sub Category</th>
                          <th style={styles.th}>Price ($)</th>
                          <th style={styles.th}>Stock</th>
                          <th style={styles.th}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(spares || []).map(part => (
                          <tr key={part.id} style={styles.tr}>
                            <td style={{ ...styles.td, fontWeight: 'bold' }}>{part.name}</td>
                            <td style={styles.td}>{part.category}</td>
                            <td style={styles.td}>
                              <input 
                                type="text"
                                list="admin-subcat-list"
                                placeholder="Sub category..."
                                value={part.subCategory || ''}
                                onChange={(e) => handleUpdateSubCategory(part.id, e.target.value)}
                                style={{ ...styles.adminTableInput, width: '130px', textAlign: 'left', padding: '0.35rem 0.5rem' }}
                              />
                            </td>
                            <td style={styles.td}>
                              <input 
                                type="number" 
                                step="0.01"
                                value={part.price}
                                onChange={(e) => handleUpdatePrice(part.id, e.target.value)}
                                style={styles.adminTableInput}
                              />
                            </td>
                            <td style={styles.td}>
                              <input 
                                type="number" 
                                value={part.stock}
                                onChange={(e) => handleUpdateStock(part.id, e.target.value)}
                                style={styles.adminTableInput}
                              />
                            </td>
                            <td style={styles.td}>
                              <button onClick={() => handleDeletePart(part.id)} style={styles.deleteBtn}>
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', textAlign: 'left' }}>Add New Spare Part</h3>
                  <form onSubmit={handleAddPart} style={styles.adminAddForm}>
                    <div style={styles.formRow}>
                      <div style={{ ...styles.formGroup, flex: 1.2 }}>
                        <label style={styles.formLabel}>Part Name</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. Ohlins Rear Shock"
                          value={newPartData.name}
                          onChange={(e) => setNewPartData({...newPartData, name: e.target.value})}
                        />
                      </div>
                      <div style={{ ...styles.formGroup, flex: 0.9 }}>
                        <label style={styles.formLabel}>Category</label>
                        <select 
                          value={newPartData.category}
                          onChange={(e) => setNewPartData({...newPartData, category: e.target.value})}
                        >
                          {(categories || []).map(cat => (
                            <option key={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ ...styles.formGroup, flex: 0.9 }}>
                        <label style={styles.formLabel}>Sub Category</label>
                        <input 
                          type="text"
                          list="admin-subcat-list"
                          placeholder="Select or enter..."
                          value={newPartData.subCategory}
                          onChange={(e) => setNewPartData({...newPartData, subCategory: e.target.value})}
                        />
                        <datalist id="admin-subcat-list">
                          {availableSubCategories.map(sub => (
                            <option key={sub} value={sub} />
                          ))}
                        </datalist>
                      </div>
                    </div>

                    {availableSubCategories.length > 0 && (
                      <div style={{ marginTop: '-0.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick Subcategory:</span>
                        {availableSubCategories.slice(0, 8).map(sub => (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => setNewPartData({ ...newPartData, subCategory: sub })}
                            style={{
                              border: newPartData.subCategory === sub ? '1px solid var(--accent)' : '1px solid var(--border)',
                              background: newPartData.subCategory === sub ? 'var(--accent)' : '#fff',
                              color: newPartData.subCategory === sub ? '#fff' : 'var(--text-main)',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              cursor: 'pointer',
                              fontWeight: newPartData.subCategory === sub ? '600' : 'normal'
                            }}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Price ($)</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          required 
                          placeholder="e.g. 299.99"
                          value={newPartData.price}
                          onChange={(e) => setNewPartData({...newPartData, price: e.target.value})}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Stock Count</label>
                        <input 
                          type="number" 
                          required 
                          placeholder="e.g. 5"
                          value={newPartData.stock}
                          onChange={(e) => setNewPartData({...newPartData, stock: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Bike Compatibility checklist */}
                    <div style={styles.formGroup}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={styles.formLabel}>
                          Bike Compatibility {compatCheckboxes.length > 0 && <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>({compatCheckboxes.length} selected)</span>}
                        </label>
                        {compatCheckboxes.length > 0 && (
                          <button 
                            type="button" 
                            onClick={() => setCompatCheckboxes([])} 
                            style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                      <div style={styles.checkboxGrid}>
                        {Object.entries(bikeBrands).map(([brand, bikes]) => {
                          const brandBikes = bikes || [];
                          const selectedInBrand = brandBikes.filter(b => compatCheckboxes.includes(b)).length;
                          const allSelected = brandBikes.length > 0 && selectedInBrand === brandBikes.length;

                          const toggleAllBrand = () => {
                            if (allSelected) {
                              setCompatCheckboxes(prev => prev.filter(b => !brandBikes.includes(b)));
                            } else {
                              setCompatCheckboxes(prev => [...new Set([...prev, ...brandBikes])]);
                            }
                          };

                          return (
                            <div 
                              key={brand} 
                              style={{ 
                                background: '#ffffff', 
                                border: '1px solid var(--border)', 
                                borderRadius: '8px', 
                                padding: '0.75rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.4rem',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                              }}
                            >
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                borderBottom: '1px solid var(--border)', 
                                paddingBottom: '0.35rem', 
                                marginBottom: '0.2rem' 
                              }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.03em' }}>{brand}</span>
                                {brandBikes.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={toggleAllBrand}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: allSelected ? 'var(--accent)' : 'var(--text-muted)',
                                      fontSize: '0.7rem',
                                      cursor: 'pointer',
                                      padding: '0 0.2rem',
                                      fontWeight: allSelected ? 600 : 400
                                    }}
                                  >
                                    {allSelected ? 'Deselect All' : 'Select All'}
                                  </button>
                                )}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                {brandBikes.length === 0 ? (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.2rem 0' }}>No models added</span>
                                ) : (
                                  brandBikes.map(bike => {
                                    const isChecked = compatCheckboxes.includes(bike);
                                    return (
                                      <label 
                                        key={bike} 
                                        style={{ 
                                          display: 'flex', 
                                          alignItems: 'center', 
                                          gap: '0.5rem', 
                                          fontSize: '0.82rem', 
                                          cursor: 'pointer',
                                          padding: '0.3rem 0.4rem',
                                          borderRadius: '5px',
                                          background: isChecked ? 'rgba(229, 57, 53, 0.08)' : 'transparent',
                                          transition: 'background 0.15s ease'
                                        }}
                                      >
                                        <input 
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={() => handleToggleCompat(bike)}
                                          style={{
                                            width: '15px',
                                            height: '15px',
                                            margin: 0,
                                            accentColor: 'var(--accent)',
                                            cursor: 'pointer',
                                            flexShrink: 0
                                          }}
                                        />
                                        <span style={{ 
                                          color: isChecked ? 'var(--accent)' : 'var(--text-main)', 
                                          fontWeight: isChecked ? 600 : 400,
                                          whiteSpace: 'nowrap'
                                        }}>
                                          {bike}
                                        </span>
                                      </label>
                                    );
                                  })
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Description</label>
                      <textarea 
                        required 
                        rows="2" 
                        placeholder="Description of the spare part and compatibility..."
                        value={newPartData.desc}
                        onChange={(e) => setNewPartData({...newPartData, desc: e.target.value})}
                      />
                    </div>

                    <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                      <Plus size={16} />
                      Add Part to Live Catalog
                    </button>
                  </form>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', textAlign: 'left' }}>Manage Bike Brands & Models</h3>
                  
                  {/* Add Brand Form */}
                  <form onSubmit={handleAddBrand} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '2rem', background: 'rgba(17,24,39,0.02)', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>New Brand Name</label>
                      <input 
                        type="text" required placeholder="e.g. DUCATI" 
                        value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} 
                        style={{ padding: '0.5rem', border: '1px solid #eee', borderRadius: '4px' }} 
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Initial Model</label>
                      <input 
                        type="text" required placeholder="e.g. Panigale V4" 
                        value={newBrandModel} onChange={(e) => setNewBrandModel(e.target.value)} 
                        style={{ padding: '0.5rem', border: '1px solid #eee', borderRadius: '4px' }} 
                      />
                    </div>
                    <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1rem' }}><Plus size={16} /> Add Brand</button>
                  </form>

                  {/* Existing Brands List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {(brandOrder || []).filter(b => bikeBrands && bikeBrands[b]).map((brand, index) => {
                      const models = bikeBrands[brand] || [];
                      return (
                      <div key={brand} style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {brandLogos[brand] ? (
                              <img src={brandLogos[brand]} alt={brand} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                            ) : (
                              <div style={{ width: '40px', height: '40px', background: '#eee', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#999' }}>No Logo</div>
                            )}
                            <h4 style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{brand}</h4>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <button onClick={() => handleMoveBrandUp(index)} disabled={index === 0} style={{ background: 'none', border: 'none', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1 }} title="Move Up"><ChevronUp size={16} /></button>
                            <button onClick={() => handleMoveBrandDown(index)} disabled={index === brandOrder.length - 1} style={{ background: 'none', border: 'none', cursor: index === brandOrder.length - 1 ? 'not-allowed' : 'pointer', opacity: index === brandOrder.length - 1 ? 0.3 : 1 }} title="Move Down"><ChevronDown size={16} /></button>
                            <button onClick={() => handleDeleteBrand(brand)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: '1rem' }}><Trash2 size={14} /> Delete</button>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Logo URL:</label>
                          <input 
                            type="text" placeholder="https://..." 
                            value={brandLogos[brand] || ''} 
                            onChange={(e) => handleUpdateLogo(brand, e.target.value)}
                            style={{ flex: 1, padding: '0.4rem', border: '1px solid #eee', borderRadius: '4px', fontSize: '0.8rem' }}
                          />
                        </div>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                          {(models || []).map(model => (
                            <span key={model} style={{ background: '#f5f5f5', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {model} 
                              <button onClick={() => handleDeleteModel(brand, model)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={12} /></button>
                            </span>
                          ))}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input 
                            type="text" placeholder="Add new model..." 
                            value={newModelInputs[brand] || ''} 
                            onChange={(e) => setNewModelInputs(prev => ({ ...prev, [brand]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddModel(brand)}
                            style={{ flex: 1, padding: '0.4rem', border: '1px solid #eee', borderRadius: '4px', fontSize: '0.85rem' }}
                          />
                          <button onClick={() => handleAddModel(brand)} style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '4px', padding: '0 0.75rem', cursor: 'pointer' }}><Plus size={14} /></button>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Customer Enquiries */}
              <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Customer messages panel */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', textAlign: 'left' }}>Customer Inbox</h3>
                  {enquiries.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'left' }}>No emails or enquiries in inbox.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {(enquiries || []).map(enq => (
                        <div key={enq.id} style={{
                          ...styles.adminEnquiryCard,
                          borderLeftColor: enq.resolved ? 'var(--success)' : 'var(--warning)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>{enq.subject}</span>
                            <button 
                              onClick={() => handleResolveEnquiry(enq.id)} 
                              style={{
                                background: 'none', 
                                border: 'none', 
                                color: enq.resolved ? 'var(--success)' : 'var(--text-muted)', 
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                            >
                              <Check size={14} />
                              {enq.resolved ? 'Resolved' : 'Mark Resolved'}
                            </button>
                          </div>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginTop: '0.25rem' }}>{enq.name}</h4>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{enq.email}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.5rem', background: '#fff', padding: '0.5rem', borderRadius: '4px' }}>"{enq.message}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* MEGA MENU MANAGEMENT (Full Width) */}
            <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', textAlign: 'left' }}>Shop By Spares Mega Menu Layout</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem', alignItems: 'start' }}>
                {sparesMenu.map((col, colIdx) => (
                  <div key={colIdx} style={{ background: 'rgba(17,24,39,0.02)', padding: '1rem', borderRadius: '8px', border: '1px dashed var(--border)', minHeight: '300px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>COL {colIdx + 1}</span>
                      <button onClick={() => handleAddMenuCategory(colIdx)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Plus size={12} /> Add Category
                      </button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {col.map((cat, catIdx) => (
                        <div key={cat.id} style={{ background: '#fff', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <strong style={{ fontSize: '0.85rem' }}>{cat.title || '(Spacer)'}</strong>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => handleEditMenuCategory(colIdx, catIdx, cat.title)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} title="Edit Name"><Wrench size={12} /></button>
                              <button onClick={() => handleDeleteMenuCategory(colIdx, catIdx)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)' }} title="Delete"><Trash2 size={12} /></button>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: '0.5rem', borderLeft: '2px solid var(--border)' }}>
                            {cat.items.map((link, linkIdx) => (
                              <div key={linkIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>{link}</span>
                                <button onClick={() => handleDeleteMenuLink(colIdx, catIdx, linkIdx)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)' }}><X size={10} /></button>
                              </div>
                            ))}
                            <button onClick={() => handleAddMenuLink(colIdx, catIdx)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '0.75rem', textAlign: 'left', marginTop: '0.25rem' }}>
                              + Add Link
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </section>
        )}

        {/* FLOATING SAVE ALL BUTTON */}
        {isAdminLoggedIn && (
          <button 
            onClick={handleSaveAllChanges}
            style={{
              position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 50,
              background: 'var(--success)', color: '#fff', border: 'none',
              padding: '1rem 2rem', borderRadius: '50px', fontSize: '1rem',
              fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem',
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            <Check size={18} /> Save All Changes
          </button>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '5.5rem',
              right: '2rem',
              zIndex: 1000,
              background: toastMessage.type === 'error' ? 'var(--danger)' : '#111827',
              color: '#fff',
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 500,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <Check size={16} color={toastMessage.type === 'error' ? '#fff' : '#10B981'} />
            <span>{toastMessage.msg}</span>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerBottom}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <img 
              src={zorvnsLogo} 
              alt="ZORVNS" 
              style={{ height: '30px', maxWidth: '130px', objectFit: 'contain' }} 
            />
          </div>
          <p>© 2026 ZORVNS Inc. All Rights Reserved. Crafted for precision rides.</p>
        </div>
      </footer>
    </>
  );
}

// Complete inline JavaScript styles for layout customization
const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '4.5rem',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--border)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center'
  },
  navContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer'
  },
  logoIcon: {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 10px var(--primary-glow)'
  },
  logoText: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.25rem',
    fontWeight: 800,
    letterSpacing: '0.05em',
    color: 'var(--text-main)'
  },
  logoBadge: {
    fontSize: '0.65rem',
    background: 'rgba(17, 24, 39, 0.04)',
    color: 'var(--text-muted)',
    padding: '0.15rem 0.4rem',
    borderRadius: '4px',
    fontWeight: 'bold',
    border: '1px solid rgba(17, 24, 39, 0.12)'
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  sectionHeader: {
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto 3rem'
  },
  sectionSubtitle: {
    color: 'var(--primary)',
    fontWeight: 700,
    fontSize: '0.85rem',
    letterSpacing: '0.15em'
  },
  formLabel: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-muted)'
  },
  contactIconCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(17, 24, 39, 0.04)',
    border: '1px solid rgba(17, 24, 39, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#EF4444',
    padding: '0.75rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    textAlign: 'left',
    marginBottom: '1rem'
  },
  adminDashboardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '1.5rem'
  },
  adminTogglePanel: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '0.75rem 1.25rem',
    borderRadius: '12px'
  },
  adminMetricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
    marginBottom: '2.5rem',
    textAlign: 'left'
  },
  adminMetricCard: {
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  adminMetricLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontWeight: 'bold',
    letterSpacing: '0.05em'
  },
  adminMetricVal: {
    fontSize: '1.35rem',
    fontWeight: 'bold',
    color: '#111827',
    marginTop: '0.15rem'
  },
  adminSectionLayout: {
    display: 'flex',
    gap: '2.5rem'
  },
  adminTableContainer: {
    overflowX: 'auto',
    marginTop: '0.5rem'
  },
  adminTable: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '0.85rem'
  },
  th: {
    borderBottom: '2px solid var(--border)',
    padding: '0.75rem 0.5rem',
    color: 'var(--text-muted)',
    fontWeight: '600'
  },
  tr: {
    borderBottom: '1px solid var(--border)'
  },
  td: {
    padding: '0.75rem 0.5rem',
    color: 'var(--text-main)'
  },
  adminTableInput: {
    width: '70px',
    padding: '0.35rem',
    fontSize: '0.8rem',
    background: '#fff'
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#EF4444',
    cursor: 'pointer',
    padding: '0.25rem',
    transition: 'color 0.2s'
  },
  adminAddForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    textAlign: 'left'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
    gap: '0.85rem',
    background: 'rgba(17, 24, 39, 0.02)',
    border: '1px solid var(--border)',
    padding: '1rem',
    borderRadius: '10px',
    maxHeight: '340px',
    overflowY: 'auto'
  },
  adminBookingCard: {
    background: 'rgba(17,24,39,0.01)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '1rem',
    textAlign: 'left'
  },
  adminEnquiryCard: {
    background: 'rgba(17,24,39,0.01)',
    border: '1px solid var(--border)',
    borderLeftWidth: '4px',
    borderRadius: '8px',
    padding: '1rem',
    textAlign: 'left'
  },
  footer: {
    borderTop: '1px solid var(--border)',
    padding: '2rem 0',
    background: '#FFFFFF',
    marginTop: '6rem'
  },
  footerBottom: {
    paddingTop: '1rem',
    fontSize: '0.8rem',
    color: 'var(--text-muted)'
  }
};

createRoot(document.getElementById('admin-root')).render(
  <StrictMode>
    <AdminPortal />
  </StrictMode>
);
