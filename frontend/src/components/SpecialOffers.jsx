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
          <h2>Special Offers on Products</h2>
          <div className="countdown-timer">
            <div className="timer-block">
              <span className="timer-num">{timeLeft.days}</span>
              <span className="timer-label">Days</span>
            </div>
            <div className="timer-block">
              <span className="timer-num">{timeLeft.hours}</span>
              <span className="timer-label">Hours</span>
            </div>
            <div className="timer-block">
              <span className="timer-num">{timeLeft.minutes}</span>
              <span className="timer-label">Minutes</span>
            </div>
            <div className="timer-block">
              <span className="timer-num">{timeLeft.seconds}</span>
              <span className="timer-label">Seconds</span>
            </div>
          </div>
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
            >
              <div className="card-top">
                <span className="offer-badge">{item.badge}</span>
                <div className="card-image-wrapper">
                  <img src={item.img} alt={item.title} className="offer-img" />
                </div>

              </div>

              <div className="card-bottom">
                <span className="card-category">{item.category}</span>
                <h3>{item.title}</h3>


              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
