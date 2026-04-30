import React from 'react';
import './Certifications.css';

import dairyEggsImg from '../assets/dairy_eggs.png';
import lentilsImg from '../assets/red_lentils.png';

const Certifications = () => {
  // Pure SVG badge vectors
  const badges = [
    { id: 1, title: 'Eco Friendly', color: '#1b4332', svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90Z" fill="#eef7f1"/>
        <path d="M50 25C36.19 25 25 36.19 25 50C25 60.17 31.08 68.92 39.81 72.78L38.06 74.53C36.89 75.7 36.89 77.6 38.06 78.77C39.23 79.94 41.13 79.94 42.3 78.77L45.55 75.52C46.99 75.83 48.48 76 50 76C63.81 76 75 64.81 75 50C75 36.19 63.81 25 50 25ZM60 45C57.24 45 55 42.76 55 40C55 37.24 57.24 35 60 35C62.76 35 65 37.24 65 40C65 42.76 62.76 45 60 45ZM40 58.26C37.88 56.14 35 53.26 35 50C35 41.72 41.72 35 50 35C52.14 35 54.13 35.45 55.93 36.27C53.13 38.6 51.36 42.1 51.36 46C51.36 53.18 57.18 59 64.36 59C65.41 59 66.42 58.87 67.39 58.63C65.97 66.8 58.73 73 50 73C46.1 73 42.46 71.91 39.36 70.03L41.97 67.42C43.14 66.25 43.14 64.35 41.97 63.18C40.8 62.01 38.9 62.01 37.73 63.18L35.46 65.45C35.16 63.12 36.75 60.51 40 58.26Z" fill="#0b8a13"/>
      </svg>
    )},
    { id: 2, title: 'Gluten Free', color: '#1b4332', svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90Z" fill="#eef7f1"/>
        <path d="M35 40C35 40 40 35 50 40C60 45 65 40 65 40" stroke="#0b8a13" strokeWidth="4" strokeLinecap="round"/>
        <path d="M35 50C35 50 40 45 50 50C60 55 65 50 65 50" stroke="#0b8a13" strokeWidth="4" strokeLinecap="round"/>
        <path d="M35 60C35 60 40 55 50 60C60 65 65 60 65 60" stroke="#0b8a13" strokeWidth="4" strokeLinecap="round"/>
        <path d="M50 25V75" stroke="#0b8a13" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    )},
    { id: 3, title: '100% Natural', color: '#1b4332', svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90Z" fill="#eef7f1"/>
        <path d="M50 30C40 30 30 40 30 50C30 65 50 75 50 75C50 75 70 65 70 50C70 40 60 30 50 30Z" stroke="#0b8a13" strokeWidth="4" strokeLinejoin="round"/>
        <path d="M50 40V60" stroke="#0b8a13" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    )},
    { id: 4, title: 'Organic Product', color: '#1b4332', svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90Z" fill="#eef7f1"/>
        <path d="M35 65C35 65 40 50 50 50C60 50 65 65 65 65" stroke="#0b8a13" strokeWidth="4" strokeLinecap="round"/>
        <path d="M50 35C45 40 45 48 50 50C55 48 55 40 50 35Z" fill="#0b8a13"/>
      </svg>
    )},
    { id: 5, title: 'Bio Product', color: '#1b4332', svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90Z" fill="#eef7f1"/>
        <circle cx="50" cy="50" r="20" stroke="#0b8a13" strokeWidth="4"/>
        <path d="M50 30C50 30 55 40 50 50C45 40 50 30 50 30Z" fill="#0b8a13"/>
      </svg>
    )},
    { id: 6, title: 'Natural Food', color: '#1b4332', svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90Z" fill="#eef7f1"/>
        <path d="M30 50H70M50 30V70" stroke="#0b8a13" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    )}
  ];

  return (
    <section className="certifications-section">
      <div className="certifications-container">
        
        {/* Badges Row */}
        <div className="badges-row">
          {badges.map(badge => (
            <div key={badge.id} className="badge-item">
              <div className="badge-vector">
                {badge.svg}
              </div>
              <h4>{badge.title}</h4>
            </div>
          ))}
        </div>

        {/* Two Large Promo Banners */}
        <div className="promo-banners-row">
          
          {/* Banner 1: Dairy & Eggs */}
          <div className="large-promo-banner orange-bg">
            <div className="large-promo-content">
              <span className="organic-tag">Organic Only</span>
              <h3>Dairy & Eggs</h3>
              <p>30% OFF FOR THIS MONTH</p>
              <button className="large-promo-btn">SHOP NOW »</button>
            </div>
            <div className="large-promo-img-wrapper">
              <img src={dairyEggsImg} alt="Dairy & Eggs" className="promo-product-img" />
            </div>
          </div>

          {/* Banner 2: Red Lentils */}
          <div className="large-promo-banner peach-bg">
            <div className="large-promo-content">
              <span className="organic-tag">Organic Only</span>
              <h3>Red Lentils</h3>
              <p>30% OFF FOR THIS MONTH</p>
              <button className="large-promo-btn">SHOP NOW »</button>
            </div>
            <div className="large-promo-img-wrapper">
              <img src={lentilsImg} alt="Red Lentils" className="promo-product-img" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Certifications;
