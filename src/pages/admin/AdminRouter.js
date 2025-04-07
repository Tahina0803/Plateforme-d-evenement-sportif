// src/pages/admin/AdminRouter.js
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ALayout from "./ALayout";
import Dashboard from "./Dashboard";
import AdminLogin from "./AdminLogin"; // Formulaire de connexion admin


// Fonction pour vérifier si l'utilisateur est authentifié
const isAuthenticated = () => {
  return !!localStorage.getItem('token'); // Vérifie si le token existe
};

function AdminRouter() {
  return (
    <div className="adminRouter">
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route element={<ALayout />}> {/* Layout global pour l'admin */}
          {/* Route protégée pour le tableau de bord */}
          <Route
            path="dashboard"
            element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />}
          />
        </Route>
        {/* Redirection par défaut vers login si pas authentifié */}
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </div>
  );
}

export default AdminRouter;
