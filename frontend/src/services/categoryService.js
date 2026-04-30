import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const CATEGORIES_URL = `${API_BASE}/api/categories`;

export const getCategories = () => axios.get(CATEGORIES_URL);
export const createCategory = (category) => axios.post(CATEGORIES_URL, category);
export const updateCategory = (id, category) => axios.put(`${CATEGORIES_URL}/${id}`, category);
export const deleteCategory = (id) => axios.delete(`${CATEGORIES_URL}/${id}`);
