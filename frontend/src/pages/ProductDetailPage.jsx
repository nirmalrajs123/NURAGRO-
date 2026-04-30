import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import ServicesSection from '../components/ServicesSection';
import ProductPackingSection from '../components/ProductPackingSection';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        const prod = res.data;
        setProduct(prod);
        setLoading(false);

        if (prod) {
          // 1. Update Document Title
          document.title = prod.seo_title || `${prod.name} | Nuragro`;

          // 2. Update or Create Meta Description
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
          }
          metaDesc.content = prod.meta_description || `Premium quality ${prod.name} provided by Nuragro.`;

          // 3. Update or Create Meta Keywords (Focus Keyphrase)
          let metaKeywords = document.querySelector('meta[name="keywords"]');
          if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.name = 'keywords';
            document.head.appendChild(metaKeywords);
          }
          if (prod.focus_keyphrase) {
            metaKeywords.content = prod.focus_keyphrase;
          }
        }
      } catch (err) {
        console.error("Error loading product details:", err);
        setError("Product not found or server error.");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail-container" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <div className="loading-spinner">Loading Product Details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container" style={{ flexDirection: 'column', alignItems: 'center', padding: '50px' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '20px' }}>Error</h2>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>{error || "We couldn't load the product."}</p>
        <button className="back-btn" onClick={() => navigate('/home')}>Go Back Home</button>
      </div>
    );
  }

  const badgeText = product.special === 1 ? 'Special' : product.trending === 1 ? 'Trending' : product.best_seller === 1 ? 'Best Seller' : 'Popular';
  const imageSrc = product.image ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${product.image.startsWith('/') ? '' : '/'}${product.image}` : 'https://via.placeholder.com/500?text=No+Image';

  return (
    <>
      <div className="product-detail-container">
        {/* Left Column: Large Image */}
        <div className="product-image-section">
          <img src={imageSrc} alt={product.name} className="main-product-img" />
        </div>

        {/* Right Column: Content */}
        <div className="product-content-section">
          <div className="details-block">
            <div className="category-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              {product.category_name || 'PREMIUM AGRO'}
            </div>

            <h1 className="product-title">{product.name}</h1>

            <div className="pill-tags-container">
              <span className="pill-tag active"><span className="dot"></span>Premium Quality</span>
              <span className="pill-tag"><span className="dot"></span>Organic Certified</span>
              <span className="pill-tag"><span className="dot"></span>Sustainable</span>
            </div>

            <div className="divider-line"></div>

            <div className="details-main-content">
              <div className="details-img-wrapper">
                <img src={imageSrc} alt="Details" className="small-detail-img" />
              </div>

              <div className="details-text-wrapper">
                <p className="product-desc">
                  {product.description || "Our objective is to craft meaningful solutions that elevate identity and improve usability."}
                </p>

                <ul className="benefits-list">
                  <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '10px', color: '#A4C639' }}><polyline points="20 6 9 17 4 12" /></svg> Future Focused</li>
                  <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '10px', color: '#A4C639' }}><polyline points="20 6 9 17 4 12" /></svg> Quality Craftsmanship</li>
                  <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '10px', color: '#A4C639' }}><polyline points="20 6 9 17 4 12" /></svg> Smart Solutions</li>
                  <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '10px', color: '#A4C639' }}><polyline points="20 6 9 17 4 12" /></svg> Design Precision</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ServicesSection typeOptions={product?.type_options} />
      <ProductPackingSection packingOptions={product?.packing_options} />

      {(product.spec_file || product.nutrition_file || (product.nutrition_options && product.nutrition_options.length > 0 && product.nutrition_options.some(n => n.display))) && (
        <section className="product-nutrition-section">
          <div className="nutrition-container">
            <div className="nutrition-header">
              <span className="nutrition-tag">SPECIFICATIONS & NUTRITION</span>
              <h2 className="nutrition-title">PRODUCT SPECS & HEALTH VALUES</h2>
              <p className="nutrition-subtitle">
                Every batch is rigorously tested to ensure the highest degree of dietary standard and design precision.
              </p>
            </div>
            <div className="nutrition-body-grid">
              {product.spec_file && (
                <div className="nutrition-item-col">
                  <h4 className="column-sub-title">PRODUCT SPECIFICATIONS</h4>
                  {product.spec_file.toLowerCase().endsWith('.pdf') ? (
                    <div className="pdf-viewer-placeholder">
                      <p>Product specification document available.</p>
                      <a
                        href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${product.spec_file.startsWith('/') ? '' : '/'}${product.spec_file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-pdf-btn"
                      >
                        View Specifications
                      </a>
                    </div>
                  ) : (
                    <div className="nutrition-img-frame">
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${product.spec_file.startsWith('/') ? '' : '/'}${product.spec_file}`}
                        alt="Specifications Sheet"
                        className="nutrition-sheet-img"
                      />
                    </div>
                  )}
                </div>
              )}

              {(product.nutrition_options?.some(n => n.display) || product.nutrition_file) && (
                <div className="nutrition-item-col">
                  <h4 className="column-sub-title">NUTRITION FACTS</h4>
                  {product.nutrition_options?.some(n => n.display) ? (
                    <div className="nutrition-facts-panel" style={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '24px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                      color: '#222',
                      maxWidth: '420px',
                      margin: '0 auto'
                    }}>
                      <h2 style={{ fontSize: '32px', fontWeight: '900', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>Nutrition Facts</h2>
                      <p style={{ margin: '0 0 8px 0', fontSize: '15px' }}>Serving Size: {product.weight || '100gm'}</p>
                      <div style={{ height: '10px', backgroundColor: '#222', marginBottom: '8px' }}></div>


                      {(() => {
                        const options = product.nutrition_options.filter(n => n.display).sort((a, b) => a.order - b.order);
                        const standardVitamins = ['vitamin', 'calcium', 'iron', 'magnesium', 'zinc', 'thiamin', 'riboflavin', 'niacin', 'folate'];
                        const checkVitamins = (name) => standardVitamins.some(kw => name.toLowerCase().includes(kw));

                        const mainNutrients = options.filter(n => !checkVitamins(n.name));
                        const vitamins = options.filter(n => checkVitamins(n.name));

                        return (
                          <>
                            {(() => {
                              const roots = mainNutrients.filter(n => n.parent_id == null);
                              return roots.map((root, i) => {
                                // SECURE MATCHING: Only match children if root has a valid ID, to prevent null == null bugs
                                const children = root.id ? mainNutrients.filter(n => n.parent_id === root.id) : [];
                                
                                return (
                                  <React.Fragment key={`root-group-${i}`}>
                                    <div style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      borderBottom: '1px solid #ccc',
                                      padding: '6px 0',
                                      fontSize: '14px',
                                      paddingLeft: '0'
                                    }}>
                                      <div>
                                        <strong style={{ fontWeight: '700' }}>{root.name}</strong> {root.amount && <span>{root.amount}</span>}
                                      </div>
                                      {root.dv && <div><strong style={{ fontWeight: '700' }}>{root.dv}%</strong></div>}
                                    </div>
                                    
                                    {children.map((child, j) => (
                                      <div key={`child-${i}-${j}`} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        borderBottom: '1px solid #ccc',
                                        padding: '6px 0',
                                        fontSize: '14px',
                                        paddingLeft: '16px'
                                      }}>
                                        <div>
                                          <strong style={{ fontWeight: '400' }}>{child.name}</strong> {child.amount && <span>{child.amount}</span>}
                                        </div>
                                        {child.dv && <div><strong style={{ fontWeight: '700' }}>{child.dv}%</strong></div>}
                                      </div>
                                    ))}
                                  </React.Fragment>
                                );
                              });
                            })()}

                            {vitamins.length > 0 && (
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                columnGap: '16px',
                                marginTop: '8px',
                                borderTop: '4px solid #222',
                                paddingTop: '4px'
                              }}>
                                {vitamins.map((n, i) => (
                                  <div key={`vit-${i}`} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    borderBottom: '1px solid #ccc',
                                    padding: '4px 0',
                                    fontSize: '12px'
                                  }}>
                                    <span>{n.name}</span>
                                    <span><strong style={{ fontWeight: '700' }}>{n.dv ? `${n.dv}%` : (n.amount || '')}</strong></span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        );
                      })()}

                      <div style={{ height: '1px', backgroundColor: '#999', marginTop: '12px', marginBottom: '4px' }}></div>
                      <p style={{ fontSize: '10px', color: '#666', margin: 0 }}>*Percent Daily Values are based on a 2,000 Calorie diet.</p>
                    </div>
                  ) : product.nutrition_file.toLowerCase().endsWith('.pdf') ? (
                    <div className="pdf-viewer-placeholder">
                      <p>Nutrition breakdown document available.</p>
                      <a
                        href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${product.nutrition_file.startsWith('/') ? '' : '/'}${product.nutrition_file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-pdf-btn"
                      >
                        View Nutrition
                      </a>
                    </div>
                  ) : (
                    <div className="nutrition-img-frame">
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${product.nutrition_file.startsWith('/') ? '' : '/'}${product.nutrition_file}`}
                        alt="Nutrition Sheet"
                        className="nutrition-sheet-img"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {(product.description_facts || product.facts) && (
        <section className="product-facts-section">
          <div className="facts-container">
            <div className="facts-header">
              <span className="facts-tag">DISCOVER MORE</span>
              <h2 className="facts-title">THE STORY & FACTS</h2>
            </div>
            <div className="facts-content">
              {(product.description_facts || product.facts).split('\n').map((para, idx) => (
                para.trim() && <p key={idx} className="facts-paragraph">{para.trim()}</p>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProductDetailPage;
