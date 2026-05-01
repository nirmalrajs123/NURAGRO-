import React, { useState, useEffect, useRef } from 'react';
import { Carrot, Apple, Milk, Coffee, Fish, Leaf, Drumstick, Egg, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './OfferingSection.css';
import { getCategories } from '../services/categoryService';

const getCategoryIcon = (name) => {
  const lower = (name || '').toLowerCase();
  if (lower.includes('veg')) return Carrot;
  if (lower.includes('fruit')) return Apple;
  if (lower.includes('dairy') || lower.includes('milk')) return Milk;
  if (lower.includes('tea') || lower.includes('coffee') || lower.includes('drink')) return Coffee;
  if (lower.includes('meat') || lower.includes('fish')) return Fish;
  if (lower.includes('poultry') || lower.includes('chicken')) return Drumstick;
  if (lower.includes('egg')) return Egg;
  return Leaf;
};

const OfferingSection = () => {
  const navigate = useNavigate();
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchOfferings = async () => {
      try {
        const response = await getCategories();
        const data = response.data || [];
        
        // Map API data to component structure
        const mapped = data.map((cat, index) => ({
          id: cat.id,
          title: cat.category_name,
          count: `Product (0${Math.floor(Math.random() * 9) + 1})`,
          Icon: getCategoryIcon(cat.category_name),
          image: cat.category_image
        }));

        if (mapped.length === 0) {
          setOfferings([
            { id: 1, title: 'Fresh Vegetable', count: 'Product (09)', Icon: Carrot },
            { id: 2, title: 'Natural Fruits', count: 'Product (08)', Icon: Apple },
            { id: 3, title: 'Dairy Products', count: 'Product (09)', Icon: Milk },
            { id: 4, title: 'Tea & Coffee', count: 'Product (05)', Icon: Coffee },
            { id: 5, title: 'Meat and Fish', count: 'Product 09', Icon: Fish }
          ]);
        } else {
          setOfferings(mapped);
        }
      } catch (error) {
        console.error("Error fetching offerings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferings();
  }, []);

  const scroll = (direction) => {
    const { current } = scrollRef;
    const scrollAmount = 300;
    if (direction === 'left') {
      current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="offering-section">Loading...</div>;

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  return (
    <section className="offering-section">
      <div className="offering-container">
        <div className="offering-header">
          <div className="header-text-side">
            <span className="offering-subtitle">Food Category</span>
            <h2 className="offering-title">What We're Offering</h2>
          </div>
          <div className="offering-controls">
            <button className="offering-nav-btn" onClick={() => scroll('left')}>
              <ChevronLeft size={24} />
            </button>
            <button className="offering-nav-btn active" onClick={() => scroll('right')}>
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="offering-slider" ref={scrollRef}>
          {offerings.map((item) => (
            <div 
              key={item.id} 
              className="offering-card"
              onClick={() => navigate(`/category/${item.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="offering-icon-wrapper">
                <div className="offering-icon-circle">
                  {item.image ? (
                    <img 
                      src={item.image.startsWith('data:image') ? item.image : `${API_BASE}${item.image.startsWith('/') ? '' : '/'}${item.image}`} 
                      alt={item.title} 
                      className="db-icon-img"
                    />
                  ) : (
                    <item.Icon size={80} strokeWidth={1} />
                  )}
                </div>
              </div>
              <div className="offering-info">
                <span className="offering-count">{item.count}</span>
                <h3 className="offering-name">{item.title}</h3>
              </div>
              <div className="brush-border"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferingSection;
