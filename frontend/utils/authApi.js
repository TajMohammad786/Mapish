import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? "http://localhost:8080/auth/" : "/auth/",
    // withCredentials: true,
});

export const googleAuth = (code) => api.get(`/google?code=${code}`);