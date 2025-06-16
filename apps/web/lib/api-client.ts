import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9902';

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
        return Promise.reject(error);
    }
);