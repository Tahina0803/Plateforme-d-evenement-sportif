import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth/admin';


// Ajouter un admin
export const createAdmin = async (adminData, token) => {
  const response = await axios.post(`${API_URL}/create`, adminData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


// Récupérer tous les admins
export const getAllAdmins = async (token) => {
  try {
    const response = await axios.get('http://localhost:3001/api/auth/admin/all', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Tous les admins récupérés:', response );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des administrateurs: ', error);
    throw error;
  }
};

// Modifier un admin
export const updateAdmin = async (id, adminData, token) => {
  console.log('voici l\'id de l\'admin à modifier :', id);
  const response = await axios.put(`http://localhost:3001/api/auth/admin/edit/${id}`, adminData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Supprimer un admin
export const deleteAdmin = async (id, token) => {
  try{
     const response = await axios.delete(`http://localhost:3001/api/auth/admin/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppréssion de l\'administrateur: ', error);
    throw error;
  }
};
