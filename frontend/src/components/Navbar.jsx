import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [navRes, catRes] = await Promise.all([getNavbars(), getCategories()]);
        const allNavs = navRes.data;
        const allCats = catRes.data;

        // Recursive function to build category tree
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

            // If it's the Product menu, inject the recursive category tree
            if (isProduct) {
              const categoryTree = buildCategoryTree(null);
              children = [...children, ...categoryTree];
            }

            return {
              id: nav.id,
              name: nav.nav_menu_name.toUpperCase(),
              href: nav.path || '#',
              hasChildren: children.length > 0,
              children: children
            };
          });

        setNavItems(topLevel);
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
      // Handle scroll to section if needed, or just navigate to home first
      if (window.location.pathname !== '/') {
        navigate('/');
        // Use a timeout or state to scroll after navigation if needed
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
        {!isSub && activeTab === item.name && (
          <motion.div
            layoutId="active-pill"
            className="active-bg"
            transition={{ type: 'spring', duration: 0.5 }}
          />
        )}
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
    <nav className={`nav-container ${isScrolled ? 'scrolled' : ''}`}>
      <div className="logo-container" onClick={() => navigate('/')}>
        <img src={logo} alt="Nuragro Logo" className="site-logo" />
      </div>

      <div className="pill-wrapper">
        <div className="pill-nav">
          <div className="nav-items-desktop">
            {navItems.map((item) => (
              <RenderNavItem key={item.id} item={item} />
            ))}
          </div>

          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div className="login-container">
        <button className="login-btn" onClick={() => navigate('/login')}>
          Log In
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mobile-menu glass-morphism"
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
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
