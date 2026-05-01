import React from 'react';
import { Box, Package, Archive } from 'lucide-react';
import './ProductPackingSection.css';

const ProductPackingSection = ({ packingOptions = [] }) => {
  if (!packingOptions || packingOptions.length === 0) return null;

  return (
    <section className="packing-section">
      <div className="packing-container">
        <div className="packing-header">
          <span className="packing-tag">PACKING & LOGISTICS</span>
          <h2 className="packing-title">Standard Packing Options</h2>
          <div className="title-underline"></div>
        </div>

        <div className="packing-grid">
          {packingOptions.map((opt, idx) => {
            const imageSrc = opt.image_path 
              ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${opt.image_path.startsWith('/') ? '' : '/'}${opt.image_path}` 
              : 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600';

            return (
              <div key={opt.id || idx} className="packing-modern-card">
                <div className="packing-card-image">
                  <img src={imageSrc} alt="Packing option" />
                  <div className="image-overlay-icon">
                    <Box size={20} />
                  </div>
                </div>
                
                <div className="packing-card-content">
                  <div className="info-group">
                    <span className="info-label"><Package size={14} /> PACKING DESCRIPTION</span>
                    <p className="info-value description">{opt.packing_product}</p>
                  </div>

                  <div className="info-row">
                    <div className="info-group">
                      <span className="info-label"><Archive size={14} /> QUANTITY</span>
                      <p className="info-value highlighted">{opt.packing_packing}</p>
                    </div>
                    
                    <div className="info-group">
                      <span className="info-label">CONTAINER</span>
                      <p className="info-value">{opt.packing_container}</p>
                    </div>
                  </div>
                </div>

                <div className="card-footer-accent"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductPackingSection;
