import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './VerticalProductLists.css';

import dairyTallImg from '../assets/dairy_tall.png';
// Using existing assets for fallbacks
import corianderImg from '../assets/coriander.png';
import broccoliImg from '../assets/broccoli.png';
import bananaImg from '../assets/organic_fruits.png'; // Fallback fruit image

const VerticalProductLists = () => {
  const navigate = useNavigate();
  const [bestSellers, setBestSellers] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [tallBanner, setTallBanner] = useState(null);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const { data } = await import('../services/productService').then(m => m.getProducts());
        const list = data || [];

        const bestSlice = list.filter(p => p.best_seller === 1).slice(0, 4);
        const featuredSlice = list.filter(p => p.featured_products === 1).slice(0, 4);
        const newSlice = list.filter(p => p.new_arrival_products === 1).slice(0, 4);

        setBestSellers(bestSlice);
        setFeatured(featuredSlice);
        setNewArrivals(newSlice);

        const { getBanners } = await import('../services/bannerService');
        const bannerRes = await getBanners();
        const banners = bannerRes.data.data || [];
        const tall = banners.find(b => b.type === 'tall');
        if (tall) setTallBanner(tall);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLists();
  }, []);

  const fallbackBest = [
    { id: 1, name: 'Yogurt Milk Chocolate', category: 'Dairy Products', price: '$120.85', img: broccoliImg },
    { id: 2, name: 'Yummy Cream', category: 'Dairy Products', price: '$120.85', img: corianderImg },
    { id: 3, name: 'Organic Passion Fruit', category: 'Fresh Fruits', price: '$120.85', img: bananaImg },
    { id: 4, name: 'Organic Papaya', category: 'Fresh Fruits', price: '$120.85', img: broccoliImg }
  ];

  const fallbackFeatured = [
    { id: 5, name: 'Sour Cherry Sweetness', category: 'Fresh Fruits', price: '$120.85', img: bananaImg },
    { id: 6, name: 'Strawberry Fruits', category: 'Fresh Fruits', price: '$120.85', img: broccoliImg },
    { id: 7, name: 'Six Ripe Banana', category: 'Fresh Fruits', price: '$120.85', img: bananaImg },
    { id: 8, name: 'Sausage Rib Beef Meat', category: 'Fresh Foods', price: '$120.85', img: corianderImg }
  ];

  const fallbackNew = [
    { id: 9, name: 'Quencher Sports Drink', category: 'Beverage', price: '$120.85', img: corianderImg },
    { id: 10, name: 'Fresh Apple Juice', category: 'Organic Juice', price: '$120.85', img: bananaImg },
    { id: 11, name: 'Chocolate Chip', category: 'Beverage', price: '$120.85', img: broccoliImg },
    { id: 12, name: 'Cantaloupe Melon', category: 'Fresh Foods', price: '$120.85', img: bananaImg }
  ];

  const getImgUrl = (p, fallbackIdx) => {
    if (p.image) {
      return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${p.image.startsWith('/') ? '' : '/'}${p.image}`;
    }
    return [broccoliImg, corianderImg, bananaImg][fallbackIdx % 3];
  };

  const renderListColumn = (title, items, fallbackItems) => {
    const displayItems = items.length > 0 ? items : fallbackItems;

    return (
      <div className="product-list-column">
        <div className="column-header">
          <h3>{title}</h3>
          <div className="column-line"></div>
        </div>
        <div className="column-items">
          {displayItems.map((item, idx) => (
            <div 
              key={item.id || idx} 
              className="compact-product-card" 
              style={{ cursor: 'pointer' }}
              onClick={() => item.id && navigate(`/product/${item.slug_text || item.id}`)}
            >
              <div className="compact-img-wrapper">
                <img src={item.img || getImgUrl(item, idx)} alt={item.name} />
              </div>
              <div className="compact-info">
                <span className="compact-cat">{item.category_name || item.category || 'Organic'}</span>
                <h4>{item.name}</h4>


              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="vertical-lists-section">
      <div className="vertical-lists-container">

        <div className="lists-grid">
          {renderListColumn('Best Seller Products', bestSellers, fallbackBest)}
          {renderListColumn('Featured Products', featured, fallbackFeatured)}
          {renderListColumn('New Arrival Products', newArrivals, fallbackNew)}
        </div>

        {/* Right Tall Banner */}
        <div className="tall-dairy-banner">
          <img 
            src={tallBanner && tallBanner.image.startsWith('/uploads') 
              ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${tallBanner.image}` 
              : (tallBanner ? tallBanner.image : dairyTallImg)} 
            alt="Banner Background" 
            className="tall-banner-bg" 
          />
          <div className="tall-banner-overlay">
            <span className="banner-tag">{tallBanner ? tallBanner.subtitle : 'Get 100% Organic Food'}</span>
            <h2>{tallBanner ? tallBanner.title : 'Dairy delivered, delightfully delicious'}</h2>
            <button className="banner-btn" onClick={() => {
              if (tallBanner && tallBanner.link) window.location.href = tallBanner.link;
            }}>SHOP NOW »</button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default VerticalProductLists;
