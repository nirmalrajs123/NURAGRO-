import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './ProductShowcase.css';

// Assets (Assuming these are in src/assets)
import corianderImg from '../assets/coriander.png';
import blackMilletImg from '../assets/black_millet.png';
import yellowMilletImg from '../assets/yellow_millet.png';
import redMilletImg from '../assets/red_millet.png';

const categories = ['All products', 'Cereal', 'Oiled', 'Spices'];

const products = [
  { id: 1, name: 'Coriander', image: corianderImg, category: 'Spices' },
  { id: 2, name: 'Black millet', image: blackMilletImg, category: 'Cereal' },
  { id: 3, name: 'Yellow millet', image: yellowMilletImg, category: 'Cereal' },
  { id: 4, name: 'Red millet', image: redMilletImg, category: 'Cereal' },
];

const ProductShowcase = () => {
  const [activeFilter, setActiveFilter] = useState('All products');
  const navigate = useNavigate();

  const filteredProducts = activeFilter === 'All products' 
    ? products 
    : products.filter(p => p.category === activeFilter);

  return (
    <section id="products" className="product-showcase">
      <div className="section-header-pill">
        <span className="subtitle">OUR PRODUCTS</span>
        <h2>What we offer</h2>
      </div>

      <div className="controls-row">
        <div className="filters-container">
          <div className="filters-label">FILTERS</div>
          <div className="filters-line"></div>
          <div className="pill-group">
            {categories.map(cat => (
              <button 
                key={cat}
                className={`filter-pill ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button className="quote-action-btn">
          Get a Quote
        </button>
      </div>

      <div className="product-card-grid">
        {filteredProducts.map(product => (
          <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            key={product.id} 
            className="product-item-card"
            onClick={() => navigate('/menu')}
            style={{ cursor: 'pointer' }}
          >
            <div className="product-image-overlap">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-card-bg">
              <h4>{product.name}</h4>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProductShowcase;
