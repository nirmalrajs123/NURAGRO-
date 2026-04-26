import axios from 'axios';

const CATEGORIES_URL = 'http://localhost:5000/api/categories';

export const getCategories = () => axios.get(CATEGORIES_URL);
export const createCategory = (category) => axios.post(CATEGORIES_URL, category);
export const updateCategory = (id, category) => axios.put(`${CATEGORIES_URL}/${id}`, category);
export const deleteCategory = (id) => axios.delete(`${CATEGORIES_URL}/${id}`);
