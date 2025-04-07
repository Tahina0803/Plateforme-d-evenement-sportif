// src/pages/route/Root.jsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminRouter from '../admin/AdminRouter';
import AuthRouter from '../Auth/AuthRouter';
import PublicRouter from './../public/PublicRouter';

export default function Root() {
  return (
    <>
      <div id="detail">
        <BrowserRouter>
          <Routes>
            {/* Routes publiques */}
            <Route path="/*" element={<PublicRouter />} />

            {/* Routes pour la partie administrateur */}
            <Route path='/admin/*' element={<AdminRouter />} />

            {/* Routes pour l'authentification */}
            <Route path='/auth/*' element={<AuthRouter />} />

            {/* Redirection par défaut vers une page d'erreur */}
            <Route path="*" element={<div>Page non trouvée</div>} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}
