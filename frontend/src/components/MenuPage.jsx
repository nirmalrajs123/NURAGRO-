import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import './MenuPage.css';

// Plate Assets
import pastaImg from '../assets/pasta.png';
import cobbImg from '../assets/cobb.png'; // Using as substitute for Sorrel Soup
import salmonImg from '../assets/salmon_salad.png';
import dumplingImg from '../assets/dumplings.png';

const menuItems = [
  { id: 1, name: 'Pasta Dishes', price: '$10', image: pastaImg },
  { id: 2, name: 'Sorrel Soup Egg', price: '$5,5', image: cobbImg },
  { id: 3, name: 'Salmon Salad', price: '$7,5', image: salmonImg },
  { id: 4, name: 'Asian Dumplings', price: '$11', image: dumplingImg },
];

const MenuPage = () => {
  return (
    <div className="menu-page">
      <div className="menu-container">
        <div className="menu-grid">
          {menuItems.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item.id * 0.1 }}
              className="menu-card"
            >
              <div className="plate-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="card-bg">
                <h4 className="dish-name">{item.name}</h4>
                <div className="divider"></div>
                <p className="dish-desc">Mus Natoque Quisque Tincidunt</p>
                <div className="divider"></div>
                <div className="card-footer" style={{ justifyContent: 'flex-end' }}>
                  <button className="add-btn">
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
