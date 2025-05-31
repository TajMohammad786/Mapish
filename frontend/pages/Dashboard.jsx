import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import MapComponent from '../components/MapComponent';


const Dashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(()=>{
        const data = localStorage.getItem('user-info');
        const userData = JSON.parse(data);
        setUserInfo(userData);
    },[])

    const handleLogout = ()=>{
        localStorage.removeItem('user-info');
        navigate('/login');
    }

    return (
        <>
            {/* <h1>Welcome {userInfo?.name}</h1>
            <h3>{userInfo?.email}</h3>
            <img src={userInfo?.image} alt={userInfo?.name}/>
            <button onClick={handleLogout}>
                Logout
            </button> */}
            <div style={{height: '100vh', width: '100vw'}}>
                
            <MapComponent/>
            </div>
        </>
    )
}

export default Dashboard