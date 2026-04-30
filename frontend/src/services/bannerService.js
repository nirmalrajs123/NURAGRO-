import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE}/api/banners`;

export const getBanners = () => axios.get(API_URL);
export const updateBanner = (id, bannerData) => axios.put(`${API_URL}/${id}`, bannerData);
export const createBanner = (bannerData) => axios.post(API_URL, bannerData);
export const deleteBanner = (id) => axios.delete(`${API_URL}/${id}`);
