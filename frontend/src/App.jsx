import './App.css'
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from '../utils/GoogleLogin';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { useState } from 'react';
import RefrshHandler from '../utils/RefreshHandler';
import NotFound from '../components/NotFound';
import Navbar from '../components/Navbar';


function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
	
	const GoogleWrapper = ()=>(
		<GoogleOAuthProvider clientId={googleClientId}>
			<GoogleLogin></GoogleLogin>
		</GoogleOAuthProvider>
	)
	const PrivateRoute = ({ element }) => {
		return isAuthenticated ? element : <Navigate to="/login" />
	}
	return (
		<BrowserRouter>
		    <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
			{/* <Navbar/> */}
			<Routes>
				<Route path="/login" element={<GoogleWrapper />} />
				<Route path="/" element={<Navigate to="/login" />} />
				<Route path='/dashboard' element={<PrivateRoute element={<Dashboard/>}/>}/>
				<Route path="*" element={<NotFound/>} />
			</Routes>
	</BrowserRouter>
	);
}

export default App
