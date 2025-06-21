import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import VideoSidebar from '../components/VideoSidebar';
import '../AppGlobal.css';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('user-info');
    const userData = JSON.parse(data);
    if (!userData) {
      navigate('/login');
    } else {
      setUserInfo(userData);
    }
  }, [navigate]);

  return (
    <div className="dashboard-fullscreen">
      <MapComponent />
      <VideoSidebar />
    </div>
  );
};

export default Dashboard;
