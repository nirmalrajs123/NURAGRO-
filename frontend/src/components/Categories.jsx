import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Carrot, CupSoda, Fish, Apple } from 'lucide-react';
import './Categories.css';
import { getCategories } from '../services/categoryService';

const getCategoryVisuals = (name) => {
  const lower = (name || '').toLowerCase();
  if (lower.includes('veg')) return { Icon: Carrot, color: '#FF6B6B' };
  if (lower.includes('drink') || lower.includes('juice')) return { Icon: CupSoda, color: '#4D96FF' };
  if (lower.includes('fish') || lower.includes('meat')) return { Icon: Fish, color: '#6BCB77' };
  return { Icon: Apple, color: '#FFD93D' };
};

const Categories = () => {
  const [popularCategories, setPopularCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        // Map API response and inject Icons, fallback colors, and counts
        const mapped = (response.data || []).slice(0, 8).map(cat => {
          const visuals = getCategoryVisuals(cat.category_name);
          return {
            id: cat.id,
            name: cat.category_name,
            count: 'Browse Products',
            Icon: visuals.Icon,
            color: visuals.color,
            image: cat.category_image
          };
        });

        // If no categories in DB yet, provide default fallbacks
        if (mapped.length === 0) {
          setPopularCategories([
            { id: 1, name: 'Vegetables', count: '45 Products', Icon: Carrot, color: '#FF6B6B' },
            { id: 2, name: 'Drinks & Juice', count: '25 Products', Icon: CupSoda, color: '#4D96FF' },
            { id: 3, name: 'Fish & Meats', count: '15 Products', Icon: Fish, color: '#6BCB77' },
            { id: 4, name: 'Organic Fruits', count: '65 Products', Icon: Apple, color: '#FFD93D' }
          ]);
        } else {
          setPopularCategories(mapped);
        }
      } catch (error) {
        console.error("Failed fetching categories", error);
      }
    };
    fetchCategories();
  }, []);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === 'left') {
      current.scrollBy({ left: -300, behavior: 'smooth' });
    } else {
      current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="categories-section">
      <div className="categories-container">
        <div className="categories-header">
          <div className="header-title-area">
            <span className="sub-title">Product Category</span>
            <h2>Popular Categories</h2>
          </div>
          <div className="slider-controls">
            <button className="control-btn orange" onClick={() => scroll('left')}>
              <ChevronLeft size={20} />
            </button>
            <button className="control-btn green" onClick={() => scroll('right')}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="categories-slider" ref={scrollRef}>
          {popularCategories.map((cat) => (
            <div key={cat.id} className="category-card">
              <div className="icon-wrapper" style={{ backgroundColor: `${cat.color}15`, overflow: 'hidden' }}>
                {cat.image ? (
                  <img 
                    src={cat.image.startsWith('data:image') ? cat.image : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${cat.image}`} 
                    alt={cat.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <cat.Icon size={32} style={{ color: cat.color }} />
                )}
              </div>
              <div className="card-info">
                <h3>{cat.name}</h3>
                <span>{cat.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
