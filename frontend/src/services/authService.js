import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const AUTH_URL = `${API_BASE}/api/users`;

export const loginUser = (credentials) => axios.post(`${AUTH_URL}/login`, credentials);
export const registerUser = (userData) => axios.post(`${AUTH_URL}/register`, userData);
