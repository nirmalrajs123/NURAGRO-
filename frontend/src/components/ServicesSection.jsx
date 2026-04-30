import React from 'react';
import './ServicesSection.css';

const ServicesSection = ({ typeOptions = [] }) => {
  const isDynamic = typeOptions && typeOptions.length > 0;

  const services = isDynamic ? typeOptions.map((opt, index) => ({
    id: index,
    title: opt.variation_name,
    desc: opt.description,
    img: opt.image_path ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${opt.image_path.startsWith('/') ? '' : '/'}${opt.image_path}` : 'https://via.placeholder.com/600x400?text=No+Image'
  })) : [
    {
      id: 1,
      title: 'Green Farming',
      desc: 'Green Farming supports eco-friendly methods that protect resources and ensure sustainability.',
      img: 'https://images.unsplash.com/photo-1595841696677-6477b21a3075?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 2,
      title: 'Drone Spraying',
      desc: 'Drone Spraying applies crop treatments quickly and accurately using aerial technology.',
      img: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 3,
      title: 'Wheat Farming',
      desc: 'It involves soil preparation, timely sowing, and precise irrigation for optimal growth.',
      img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600'
    }
  ];

  return (
    <section className="services-section">
      <div className="services-header">
        <div className="services-tag">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          {isDynamic ? 'PRODUCT TYPES' : 'OUR SERVICE'}
        </div>
        <h2 className="services-title">{isDynamic ? 'Available Type Variations' : 'Sustainable Growth For Farms'}</h2>
      </div>

      <div className="services-carousel-container">
        <button className="carousel-nav-btn left">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>

        <div className="services-grid">
          {services.map((service, index) => {
            const inverted = index === 1; // Middle card is inverted

            return (
              <div key={service.id} className={`service-card ${inverted ? 'inverted' : ''}`}>
                {!inverted && (
                  <div className="service-img-wrapper">
                    <img src={service.img} alt={service.title} />
                  </div>
                )}
                
                <div className="service-content">
                  <h3>{service.title}</h3>
                  <div className="divider-line-light" style={{height: '1px', background: '#f3f4f6', margin: '0 0 15px 0'}}></div>
                  <p>{service.desc}</p>
                  <div className="view-details">
                    View Details
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '6px'}}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>

                {inverted && (
                  <div className="service-img-wrapper bottom">
                    <img src={service.img} alt={service.title} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button className="carousel-nav-btn right">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </section>
  );
};

export default ServicesSection;
