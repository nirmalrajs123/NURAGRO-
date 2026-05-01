import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import './SpecialOffers.css';

import meatImg from '../assets/fresh_meat.png';
import broccoliImg from '../assets/broccoli.png';
import riceImg from '../assets/basmati_rice.png';
import salmonImg from '../assets/salmon.png';

const SpecialOffers = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: 50,
    hours: 18,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let s = prev.seconds - 1;
        let m = prev.minutes;
        let h = prev.hours;
        let d = prev.days;

        if (s < 0) {
          s = 59;
          m -= 1;
        }
        if (m < 0) {
          m = 59;
          h -= 1;
        }
        if (h < 0) {
          h = 23;
          d -= 1;
        }
        if (d < 0) {
          clearInterval(timer);
          return prev;
        }

        return { days: d, hours: h, minutes: m, seconds: s };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [dynamicOffers, setDynamicOffers] = useState([]);

  useEffect(() => {
    const fetchSpecialProducts = async () => {
      try {
        const { data } = await import('../services/productService').then(m => m.getProducts());
        const filtered = (data || []).map(p => ({
          id: p.id,
          slug_text: p.slug_text,
          badge: p.special === 1 ? 'Special' : 'Sale',
          category: p.category_name || 'Organic',
          title: p.name,
          price: p.weight || '$12.00',
          img: p.image ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${p.image.startsWith('/') ? '' : '/'}${p.image}` : meatImg
        }));
        setDynamicOffers(filtered);
      } catch (err) {
        console.error("Error fetching special offers:", err);
      }
    };

    fetchSpecialProducts();
  }, []);

  const fallbackOffers = [
    { id: 1, badge: 'New', category: 'Meat', title: 'Fresh meat', price: '$120.85', img: meatImg },
    { id: 2, badge: 'Sale', category: 'Vegetables', title: 'Cauliflower Vegetable', price: '$120.85', img: broccoliImg },
    { id: 3, badge: 'Hot', category: 'Groceries', title: 'Long Basmati Rice', price: '$120.85', img: riceImg },
    { id: 4, badge: '-15%', category: 'Fish', title: 'Salmon Red Fish', price: '$95.85', oldPrice: '$120.85', img: salmonImg }
  ];

  const offers = dynamicOffers.length > 0 ? dynamicOffers : fallbackOffers;

  return (
    <section className="special-offers-section">
      <div className="special-offers-container">
        <div className="special-offers-header">
          <span className="offering-subtitle">Special Offers</span>

        </div>

        <div className="offers-grid">
          {offers.map(item => (
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
