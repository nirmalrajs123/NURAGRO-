import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE}/api/products`;

export const getProducts = () => axios.get(API_URL);
export const getProductById = (id) => axios.get(`${API_URL}/${id}`);
export const createProduct = (product) => axios.post(API_URL, product);
export const updateProduct = (id, product) => axios.put(`${API_URL}/${id}`, product);
export const toggleSpecial = (id, special) => axios.patch(`${API_URL}/${id}/special`, { special });
export const toggleTrending = (id, trending) => axios.patch(`${API_URL}/${id}/trending`, { trending });
export const toggleBestSeller = (id, best_seller) => axios.patch(`${API_URL}/${id}/best_seller`, { best_seller });
export const toggleFeaturedProducts = (id, featured_products) => axios.patch(`${API_URL}/${id}/featured_products`, { featured_products });
export const toggleNewArrivalProducts = (id, new_arrival_products) => axios.patch(`${API_URL}/${id}/new_arrival_products`, { new_arrival_products });
export const deleteProduct = (id) => axios.delete(`${API_URL}/${id}`);
export const getProductSeo = (id) => axios.get(`${API_URL}/${id}/seo`);
export const updateProductSeo = (id, seoData) => axios.put(`${API_URL}/${id}/seo`, seoData);
