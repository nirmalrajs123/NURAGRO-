import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import './TrendingProducts.css';

import handWashImg from '../assets/hand_wash.png';
import vegImg from '../assets/broccoli.png';
import fruitImg from '../assets/organic_fruits.png';
import basketImg from '../assets/organic_basket.png';

const TrendingProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await import('../services/productService').then(m => m.getProducts());
        const filtered = (data || []).filter(p => p.trending === 1).slice(0, 3).map((p, i) => ({
          id: p.id,
          slug_text: p.slug_text,
          badge: i === 0 ? '-15%' : i === 1 ? 'Sale' : 'Hot',
          category: p.category_name || 'Groceries',
          title: p.name,
          price: p.weight || '$120.85',
          img: p.image ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${p.image.startsWith('/') ? '' : '/'}${p.image}` : [handWashImg, vegImg, fruitImg][i % 3]
        }));
        setProducts(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrending();
  }, []);

  const fallbackProducts = [
    { id: 1, badge: '-15%', category: 'Hand Wash', title: 'Hand Sanitizer', price: '$95.85', oldPrice: '$120.85', img: handWashImg },
    { id: 2, badge: 'Sale', category: 'Vegetables', title: 'Cauliflower Vegetable', price: '$120.85', img: vegImg },
    { id: 3, badge: 'Hot', category: 'Fresh Fruits', title: 'Fresh Strawberry', price: '$120.85', img: fruitImg }
  ];

  const displayProducts = products;

  return (
    <section className="trending-section">
      <div className="trending-container">

        {/* Left Promo Banner */}
        <div className="promo-banner-left">
          <div className="promo-banner-content">
            <span className="promo-tag">20% Online OFF</span>
            <h2>The vegetable is now yours</h2>
            <button className="promo-shop-btn">SHOP NOW »</button>
          </div>
          <img src={basketImg} alt="Organic Vegetables" className="promo-banner-img" />
        </div>

        {/* Right Products Grid */}
        <div className="trending-products-side">
          <div className="trending-header-row">
            <h2>Trending Products</h2>
            <div className="header-line"></div>
            <button className="see-more-btn">SEE MORE »</button>
          </div>

          <div className="offers-grid">
            {displayProducts.length === 0 ? (
              <div
                style={{
                  color: '#aaa',
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '40px 0',
                  fontSize: '16px'
                }}
              >
                No trending products available at the moment.
              </div>
            ) : (
              displayProducts.map(item => (
                <motion.div
                  key={item.id}
                  className="offer-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/product/${item.slug_text || item.id}`)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: item.id * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    y: -12,
                    transition: { type: "spring", stiffness: 400, damping: 12 }
                  }}
                >
                  <div className="offer-card-header">
                    <div className="header-text">
                      <span className="card-category">{item.category}</span>
                      <h3 className="card-title">{item.title}</h3>
                    </div>
                  </div>

                  <div className="card-image-section">
                    <img src={item.img} alt={item.title} className="offer-img" />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TrendingProducts;
