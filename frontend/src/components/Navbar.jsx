import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, Search, User, Heart, ShoppingCart, Grid, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getNavbars } from '../services/navbarService';
import { getCategories } from '../services/categoryService';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const [navItems, setNavItems] = useState([]);
  const [activeTab, setActiveTab] = useState(window.location.pathname === '/menu' ? 'PRODUCT' : 'HOME');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCatMenu, setShowCatMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [navRes, catRes] = await Promise.all([getNavbars(), getCategories()]);
        const allNavs = navRes.data;
        const allCats = catRes.data;

        const buildCategoryTree = (parentId = null) => {
          return allCats
            .filter(cat => cat.parent_id_cat === parentId && cat.is_active === true)
            .map(cat => {
              const children = buildCategoryTree(cat.id);
              return {
                id: `cat-${cat.id}`,
                name: cat.category_name,
                href: cat.path || `/category/${cat.id}`,
                hasChildren: children.length > 0,
                children: children
              };
            });
        };

        const topLevel = allNavs
          .filter(nav => nav.parent_id === null && nav.is_active === 1)
          .map(nav => {
            const isProduct = nav.nav_menu_name.toUpperCase() === 'PRODUCT';

            let children = allNavs
              .filter(n => n.parent_id === nav.id && n.is_active === 1)
              .map(child => ({
                id: child.id,
                name: child.nav_menu_name,
                href: child.path || '#'
              }));

            if (isProduct) {
              const categoryTree = buildCategoryTree(null);
              children = [...children, ...categoryTree];
            }

            return {
              id: nav.id,
              name: nav.nav_menu_name.toUpperCase(),
              href: nav.nav_menu_name.toUpperCase() === 'HOME' ? '/' : (nav.path || '#'),
              hasChildren: children.length > 0,
              children: children
            };
          });

        // If no nav items from DB, add some defaults to match design
        if (topLevel.length === 0) {
          setNavItems([
            { id: 1, name: 'HOME', href: '/', hasChildren: true, children: [] },
            { id: 2, name: 'SHOP', href: '/shop', hasChildren: true, children: [] },
            { id: 3, name: 'PAGES', href: '/pages', hasChildren: true, children: [] },
            { id: 4, name: 'GALLERY', href: '/gallery', hasChildren: true, children: [] },
            { id: 5, name: 'NEWS', href: '/news', hasChildren: true, children: [] },
            { id: 6, name: 'CONTACT', href: '/contact', hasChildren: false }
          ]);
        } else {
          setNavItems(topLevel);
        }

        // Set top-level categories for the search dropdown
        setCategories(allCats.filter(cat => cat.parent_id_cat === null && cat.is_active === true));
      } catch (err) {
        console.error('Error fetching navbar data', err);
      }
    };
    fetchData();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (item) => {
    setActiveTab(item.name);
    if (item.href.startsWith('/')) {
      navigate(item.href);
    } else {
      if (window.location.pathname !== '/') {
        navigate('/');
      }
    }
  };

  const RenderNavItem = ({ item, isSub = false }) => (
    <div className={isSub ? "dropdown-item-wrapper" : "nav-item-container"}>
      <a
        href={item.href}
        className={isSub ? "dropdown-item" : `nav-link ${activeTab === item.name ? 'active' : ''}`}
        onClick={(e) => {
          handleNavClick(item);
          if (item.href.startsWith('/')) e.preventDefault();
        }}
      >
        <span className="nav-text">{item.name}</span>
        {item.hasChildren && (
          isSub ? <ChevronDown size={12} className="chevron-right" /> : <ChevronDown size={14} className="chevron" />
        )}
      </a>

      {item.hasChildren && item.children && item.children.length > 0 && (
        <div className={isSub ? "sub-dropdown-menu" : "dropdown-menu"}>
          {item.children.map(child => (
            <RenderNavItem key={child.id} item={child} isSub={true} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header className="main-header">
      {/* Top Row: Logo, Search, Icons */}
      <div className="header-top">
        <div className="header-container">
          <div className="logo-container" onClick={() => navigate('/')}>
            <img src={logo} alt="Site Logo" className="site-logo" />
          </div>

          <div className="icons-section">
            <button className="icon-circle" onClick={() => navigate('/login')}>
              <User size={18} />
            </button>
            <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Navigation Links & Contact */}
      <div className={`header-bottom ${isScrolled ? 'sticky' : ''}`}>
        <div className="header-container">
          <div className="nav-menu">
            {navItems.map((item) => (
              <RenderNavItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mobile-menu"
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="mobile-nav-link"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(item);
                  if (item.href.startsWith('/')) e.preventDefault();
                }}
              >
                {item.name}
                {item.hasChildren && <ChevronDown size={14} />}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
