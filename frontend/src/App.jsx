import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from "@react-oauth/google";

import GoogleLogin from '../utils/GoogleLogin';
import Dashboard from '../pages/Dashboard';
import RefrshHandler from '../utils/RefreshHandler';
import NotFound from '../components/NotFound';
import Navbar from '../components/Navbar';
import useVideoStore from '../store/videoStore';

const App = () => {
  const isAuthenticated = useVideoStore((state) => state.isAuthenticated);
  const googleClientId = '639894565953-tegbiaf6ef1fo3crl4ireadeabss05kv.apps.googleusercontent.com';
   const updateIsMobile = useVideoStore((state) => state.updateIsMobile);

  useEffect(() => {

    updateIsMobile();

    const handleResize = () => {
      updateIsMobile();
    };
    window.addEventListener('resize', handleResize);
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateIsMobile]);

 

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <RefrshHandler />
        <Navbar  />

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
