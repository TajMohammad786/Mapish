import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { GoogleOAuthProvider } from "@react-oauth/google";

import GoogleLogin from '../utils/GoogleLogin';
import Dashboard from '../pages/Dashboard';
import RefrshHandler from '../utils/RefreshHandler';
import NotFound from '../components/NotFound';
import Navbar from '../components/Navbar';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const googleClientId = '639894565953-tegbiaf6ef1fo3crl4ireadeabss05kv.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

        <Routes>
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <GoogleLogin />
          } />
          <Route path="/dashboard" element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/" />
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
