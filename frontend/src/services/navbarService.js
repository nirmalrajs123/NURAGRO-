import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const NAVBARS_URL = `${API_BASE}/api/navbars`;

export const getNavbars = () => axios.get(NAVBARS_URL);
export const createNavbar = (navbar) => axios.post(NAVBARS_URL, navbar);
export const updateNavbar = (id, navbar) => axios.put(`${NAVBARS_URL}/${id}`, navbar);
export const deleteNavbar = (id) => axios.delete(`${NAVBARS_URL}/${id}`);
