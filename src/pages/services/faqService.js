import axios from 'axios';

const API_URL = 'http://localhost:3001/api/faq';
const getToken = () => localStorage.getItem('token');

export const createFaq = async (faqData) => {
  const response = await axios.post(`${API_URL}`, faqData, {
    headers: {Authorization: `Bearer ${getToken()}`},
  });
  return response.data;
};

export const getAllFaqs = async () => {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${getToken()}`},
  });
  return response.data;
};

export const updateFaq = async (id, faqData) => {
  const response = await axios.put(`${API_URL}/${id}`, faqData, {
    headers: { Authorization: `Bearer ${getToken()}`},
  });
  return response.data;
};

export const deleteFaq = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}`},
  });
  return response.data;
};
