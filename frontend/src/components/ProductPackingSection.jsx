import React from 'react';
import './ProductPackingSection.css';

const ProductPackingSection = ({ packingOptions = [] }) => {
  if (!packingOptions || packingOptions.length === 0) return null;

  return (
    <section className="packing-section">
      <div className="packing-container">
        <div className="packing-header">
          <div className="packing-header-left">
            <span className="packing-tag">PACKING OPTIONS</span>
            <h2 className="packing-title">CHOOSE THE RIGHT PACKING FOR YOU</h2>
          </div>
          <div className="packing-header-right">
            <p>
              We offer a variety of packing options to suit your needs. Select the most convenient and secure packaging designed to preserve quality and freshness.
            </p>
          </div>
        </div>

        <div className="packing-list">
          {packingOptions.map((opt, idx) => {
            if (!opt) return null;
            
            const imageSrc = opt.image_path 
              ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${opt.image_path.startsWith('/') ? '' : '/'}${opt.image_path}` 
              : 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=600';
              
            return (
              <div key={`pack-${idx}`} className="packing-card">
                <div className="packing-img-col">
                  <img src={imageSrc} alt={opt.packing_product} />
                </div>
                
                <div className="packing-content-col">
                  <div className="packing-card-header">
                    <h3 className="packing-card-title">{opt.packing_product || `Option ${idx + 1}`}</h3>
                    {opt.packing_container && <span className="packing-card-badge">{opt.packing_container}</span>}
                  </div>
                  
                  <p className="packing-card-desc">
                    {opt.packing_packing || 'Standard secure packaging for optimal preservation during transport and storage.'}
                  </p>
                  
                  <div className="packing-perfect-for">
                    <strong>PERFECT FOR</strong>
                    <ul className="packing-features-list">
                      <li>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Bulk storage
                      </li>
                      <li>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Safe transit
                      </li>
                      <li>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Freshness guarantee
                      </li>
                    </ul>
                  </div>
                  
                  <button className="packing-select-btn">SELECT PACKING</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductPackingSection;
