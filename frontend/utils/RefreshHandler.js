import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useVideoStore from '../store/videoStore';

function RefrshHandler() {
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthenticated = useVideoStore((state) => state.isAuthenticated);
    const setIsAuthenticated = useVideoStore((state) => state.setIsAuthenticated);

    useEffect(() => {
        const data = localStorage.getItem('user-info');
        const token = JSON.parse(data)?.token;
        if (token) {
            setIsAuthenticated(true);
            console.log("user is authenticated", isAuthenticated);
            if (location.pathname === '/' ||
                location.pathname === '/login'
            ) {
                navigate('/dashboard', { replace: false });
            }
        }
    }, [location, navigate, setIsAuthenticated])

    return (
        null
    )
}

export default RefrshHandler