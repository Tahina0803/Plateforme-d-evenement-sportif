// src/pages/Auth/AuthRouter.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Error from '../../_utils/Error';
import Login from './login';
import AdminLogin from '../admin/AdminLogin';

const AuthRouter = () => {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="login" element={<Login />} />
      <Route path="*" element={<Error />} />
      <Route path='/admin' element={<AdminLogin/>}/>
    </Routes>
  );
};

export default AuthRouter;
