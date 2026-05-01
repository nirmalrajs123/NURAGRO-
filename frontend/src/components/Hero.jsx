import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Hero.css';
import organicBasket from '../assets/organic_basket.png';
import { getBanners } from '../services/bannerService';

const Hero = () => {
  const [heroBanner, setHeroBanner] = useState(null);

  useEffect(() => {
    const fetchHeroBanner = async () => {
      try {
        const { data } = await getBanners();
        const banners = data.data || [];
        const hero = banners.find(b => b.type === 'hero') || banners[0];
        if (hero) {
          setHeroBanner(hero);
        }
      } catch (err) {
        console.error('Failed to fetch hero banner:', err);
      }
    };
    fetchHeroBanner();
  }, []);

  const title = heroBanner ? heroBanner.title : "Discover the Freshest Organic Groceries Deals!";
  const subtitle = heroBanner ? heroBanner.subtitle : "100% Organic Shop";
  const imageSrc = heroBanner
    ? (heroBanner.image && heroBanner.image.startsWith('/uploads')
      ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${heroBanner.image}`
      : heroBanner.image)
    : organicBasket;

  return (
    <section
      className={`hero-organic ${heroBanner ? 'full-banner' : ''}`}
      style={heroBanner ? { backgroundImage: `url(${imageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      <div className="hero-organic-container">
        {/* Left side text content */}
        <div className="hero-organic-text">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="organic-badge"
          >
            {subtitle}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={heroBanner ? { textShadow: '0 2px 10px rgba(0,0,0,0.1)' } : {}}
            className="offering-subtitle"

          >
            {title}
          </motion.h1>




        </div>

        {/* Right side image content - only show if not using background mode */}
        {!heroBanner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="hero-organic-image"
          >
            <img src={imageSrc} alt={title} className="basket-img" />
          </motion.div>
        )}
      </div>
    </section >
  );
};

export default Hero;
