import axios from 'axios';

const NUTRITION_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/nutrition`;

export const getNutritions = () => axios.get(NUTRITION_URL);
export const createNutrition = (nutrition) => axios.post(NUTRITION_URL, nutrition);
export const updateNutrition = (id, nutrition) => axios.put(`${NUTRITION_URL}/${id}`, nutrition);
export const deleteNutrition = (id) => axios.delete(`${NUTRITION_URL}/${id}`);
