import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth/organizer';

// Récupérer tous les organisateurs
export const getAllOrganizers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des organisateurs:', error);
    throw error;
  }
};

// Ajouter un organisateur
export const createOrganizer = async (organizerData, token) => {
  const response = await axios.post(`${API_URL}/create`, organizerData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Modifier un organisateur
export const updateOrganizer = async (id, organizerData, token) => {
  const response = await axios.put(`${API_URL}/${id}`, organizerData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Supprimer un organisateur
export const deleteOrganizer = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
