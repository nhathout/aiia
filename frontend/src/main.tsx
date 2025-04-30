import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import AuthProvider, { AuthCtx } from './AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function AppRoutes() {
  const { token } = React.useContext(AuthCtx);
  return (
    <Routes>
      <Route path="/login" element={!token ? <Login/> : <Navigate to="/" />} />
      <Route path="/" element={token ? <Dashboard/> : <Navigate to="/login" />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter><AppRoutes/></BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
