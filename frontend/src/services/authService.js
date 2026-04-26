import axios from 'axios';

const AUTH_URL = 'http://localhost:5000/api/users';

export const loginUser = (credentials) => axios.post(`${AUTH_URL}/login`, credentials);
export const registerUser = (userData) => axios.post(`${AUTH_URL}/register`, userData);
