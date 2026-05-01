import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import OfferingSection from './components/OfferingSection';
import PromoCards from './components/PromoCards';
import SpecialOffers from './components/SpecialOffers';
import TrendingProducts from './components/TrendingProducts';
import MenuPage from './components/MenuPage';
import Certifications from './components/Certifications';
import VerticalProductLists from './components/VerticalProductLists';
import ServicesSection from './components/ServicesSection';
import CMS from './pages/CMS';
import Login from './pages/Login';
import ProductDetailPage from './pages/ProductDetailPage';
import './App.css';

const Home = () => (
  <main>
    <Hero />
    <OfferingSection />
    <SpecialOffers />
    <TrendingProducts />
    <VerticalProductLists />
    <ServicesSection />
    <Certifications />
    <section id="about" className="content-section dark">
      <div className="section-header">
        <h2 style={{ color: 'white' }}>About Nuragro</h2>
        <div className="underline"></div>
      </div>
      <div className="about-content">
        <div className="about-text">
          <p>Founded in 1998, Nuragro has been at the forefront of industrial innovation. We provide end-to-end solutions for the world's most demanding sectors.</p>
        </div>
      </div>
    </section>
  </main>
);

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <div className="app">
      {!isAuthPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/admin/*" element={<CMS />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      {!isAuthPage && (
        <footer>
          <div className="footer-content">
            <div className="footer-brand">NURAGRO</div>
            <div className="copyright">
              © 2026 Nuragro Industrial Solutions. All rights reserved.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
export default App;
