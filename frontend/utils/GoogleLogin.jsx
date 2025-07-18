import {useState} from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "./authApi";
import {useNavigate} from 'react-router-dom';

    
const GoogleLogin = (props) => {
	const [user, setUser] = useState(null);
	const navigate = useNavigate();
	const responseGoogle = async (authResult) => {
		try {
			if (authResult["code"]) {
				const result = await googleAuth(authResult.code);
				const {email, name, image} = result.data.user;
				const token = result.data.token;
				const obj = {email,name, token, image};
				localStorage.setItem('user-info',JSON.stringify(obj));
				navigate('/dashboard');
			} else {
				console.log(authResult);
				throw new Error(authResult);
			}
		} catch (e) {
			console.log('Error while Google Login...', e);
		}
	};

	const googleLogin = useGoogleLogin({
		onSuccess: responseGoogle,
		onError: responseGoogle,
		flow: "auth-code",
	});

	return (
		<div className="App" style={{ display: "flex", justifyContent: "center" }}>
			<button onClick={googleLogin} style={{ marginTop: "300px" }}>
				Sign in with Google
			</button>
		</div>

	);
};

export default GoogleLogin;