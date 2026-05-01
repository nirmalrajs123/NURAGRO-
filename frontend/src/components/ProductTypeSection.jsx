import React from 'react';
import { Layers, ChevronRight } from 'lucide-react';
import './ProductTypeSection.css';

const ProductTypeSection = ({ typeOptions = [] }) => {
  if (!typeOptions || typeOptions.length === 0) return null;

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  return (
    <section className="type-section">
      <div className="type-container">
        <div className="type-header">
          <span className="type-tag">AVAILABLE VARIATIONS</span>
          <h2 className="type-title">Product Grades & Types</h2>
          <div className="title-underline"></div>
        </div>

        <div className="type-grid">
          {typeOptions.map((opt, idx) => {
            const imageSrc = opt.image_path 
              ? `${API_BASE}${opt.image_path.startsWith('/') ? '' : '/'}${opt.image_path}` 
              : 'https://images.unsplash.com/photo-1590541576391-defc443fc362?auto=format&fit=crop&q=80&w=600';

            return (
              <div key={opt.id || idx} className="type-modern-card">
                <div className="type-card-image">
                  <img src={imageSrc} alt={opt.variation_name} />
                  <div className="type-badge">
                    <Layers size={14} />
                    <span>PREMIUM</span>
                  </div>
                </div>
                
                <div className="type-card-content">
                  <h3 className="variation-name">{opt.variation_name}</h3>
                  <div className="variation-divider"></div>
                  <p className="variation-desc">{opt.description}</p>
                  
                  <div className="variation-footer">
                    <span className="view-specs">View Specifications <ChevronRight size={14} /></span>
                  </div>
                </div>

                <div className="card-hover-border"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductTypeSection;
