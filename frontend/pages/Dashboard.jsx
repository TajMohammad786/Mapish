import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import VideoSidebar from '../components/VideoSidebar';
import '../AppGlobal.css';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const mapRef = useRef();

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
      <MapComponent ref={mapRef} />
      <VideoSidebar mapRef={mapRef} />
    </div>
  );
};

export default Dashboard;
