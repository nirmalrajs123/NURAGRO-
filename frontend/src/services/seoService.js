import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE}/api/seo`;

export const getSeos = () => axios.get(API_URL);
export const getSeoById = (id) => axios.get(`${API_URL}/${id}`);
export const createSeo = (data) => axios.post(API_URL, data);
export const updateSeo = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteSeo = (id) => axios.delete(`${API_URL}/${id}`);
