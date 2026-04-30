import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './PromoCards.css';
import { getBanners } from '../services/bannerService';
import handWashImg from '../assets/hand_wash.png';
import organicVegImg from '../assets/organic_veg.png';
import organicFruitsImg from '../assets/organic_fruits.png';

const PromoCards = () => {
  const [promos, setPromos] = useState([]);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const { data } = await getBanners();
        const banners = data.data || [];
        const filtered = banners.filter(b => b.type === 'promo').slice(0, 3).map(b => ({
          id: b.id,
          badge: b.subtitle || '20% OFF',
          title: b.title,
          img: b.image ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${b.image.startsWith('/') ? '' : '/'}${b.image}` : organicVegImg,
          cardBg: b.background_color || 'linear-gradient(135deg, #0a3b1e 0%, #135a30 100%)',
          textColor: 'white'
        }));

        if (filtered.length === 0) {
          setPromos([
            { id: 1, badge: '20% OFF', title: 'Hand Cleaning Wash', img: handWashImg, badgeBg: '#faa300', badgeColor: 'white', btnBg: '#0b8a13', btnColor: 'white', cardBg: 'linear-gradient(135deg, #a3e2c9 0%, #d3f2e4 100%)' },
            { id: 2, badge: '20% OFF', title: 'Fresh & Organic Vegetable', img: organicVegImg, badgeBg: 'white', badgeColor: '#0b8a13', btnBg: '#0b8a13', btnColor: 'white', cardBg: 'linear-gradient(135deg, #0a3b1e 0%, #135a30 100%)', textColor: 'white' },
            { id: 3, badge: '20% OFF', title: 'Fresh Organic Fruits', img: organicFruitsImg, badgeBg: '#0b8a13', badgeColor: 'white', btnBg: '#faa300', btnColor: 'white', cardBg: 'linear-gradient(135deg, #0b4e58 0%, #16697a 100%)', textColor: 'white' }
          ]);
        } else {
          setPromos(filtered);
        }
      } catch (err) {
        console.error('Failed to fetch promos:', err);
      }
    };
    fetchPromos();
  }, []);

  return (
    <section className="promo-section">
      <div className="promo-container">
        {promos.map(card => (

          <motion.div 
            key={card.id} 
            className="promo-card" 
            style={{ background: card.cardBg, color: card.textColor || '#1a1a1a' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: card.id * 0.1 }}
          >
            <div className="promo-content">
              <span 
                className="promo-badge" 
                style={{ backgroundColor: card.badgeBg, color: card.badgeColor }}
              >
                {card.badge}
              </span>
              <h2>{card.title}</h2>
              <button 
                className="promo-btn" 
                style={{ backgroundColor: card.btnBg, color: card.btnColor }}
              >
                SHOP NOW &raquo;
              </button>
            </div>
            <div className="promo-image">
              <img src={card.img} alt={card.title} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PromoCards;
