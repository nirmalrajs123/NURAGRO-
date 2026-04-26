import axios from 'axios';

const NAVBARS_URL = 'http://localhost:5000/api/navbars';

export const getNavbars = () => axios.get(NAVBARS_URL);
export const createNavbar = (navbar) => axios.post(NAVBARS_URL, navbar);
export const updateNavbar = (id, navbar) => axios.put(`${NAVBARS_URL}/${id}`, navbar);
export const deleteNavbar = (id) => axios.delete(`${NAVBARS_URL}/${id}`);
