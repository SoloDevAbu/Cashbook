import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
})

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);