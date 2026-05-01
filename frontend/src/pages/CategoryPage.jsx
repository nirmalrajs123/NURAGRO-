import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { motion } from 'framer-motion';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import './CategoryPage.css';

const CategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          getProducts(),
          getCategories()
        ]);

        const allProducts = prodRes.data || [];
        const allCategories = catRes.data || [];

        const currentCat = allCategories.find(c => c.id.toString() === id);
        setCategory(currentCat);

        const filtered = allProducts.filter(p => p.category_id?.toString() === id);
        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching category products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="category-page-loading">Loading Products...</div>;

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  return (
    <div className="category-page">
      <div className="category-hero">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} /> Back
        </button>
        <div className="hero-content">
          <span className="category-subtitle">Browsing Category</span>
          <h1 className="category-title">{category ? category.category_name : 'Products'}</h1>
          <div className="title-underline"></div>
        </div>
      </div>

      <div className="category-container">
        {products.length === 0 ? (
          <div className="no-products">
            <ShoppingBag size={64} opacity={0.2} />
            <p>No products found in this category.</p>
            <button className="go-home-btn" onClick={() => navigate('/')}>Return to Shop</button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product, idx) => (
              <motion.div 
                key={product.id}
                className="product-card-modern"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(`/product/${product.slug_text || product.id}`)}
              >
                <div className="product-img-box">
                  <img 
                    src={product.image ? `${API_BASE}${product.image.startsWith('/') ? '' : '/'}${product.image}` : '/placeholder.png'} 
                    alt={product.name} 
                  />
                  <div className="product-overlay">
                    <span className="view-details">View Details</span>
                  </div>
                </div>
                <div className="product-info">
                  <span className="product-cat">{category?.category_name}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-footer">
                    <span className="product-price">${product.price || 'Market Price'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
