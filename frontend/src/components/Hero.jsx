import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-badge"
        >
          <span>Excellence in Engineering</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Precision Crafted <br /> 
          <span className="accent-text">Industrial Solutions</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Leading the way in global distribution and advanced manufacturing technologies. 
          Our commitment to quality ensures your success.
        </motion.p>
        
        <motion.div 
          className="hero-cta"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button className="primary-btn">View Our Products</button>
          <button className="secondary-btn">Learn More</button>
        </motion.div>
      </div>

      <div className="hero-stats">
        <div className="stat-item">
          <span className="stat-num">500+</span>
          <span className="stat-label">Projects</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">24/7</span>
          <span className="stat-label">Support</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">15+</span>
          <span className="stat-label">Countries</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
