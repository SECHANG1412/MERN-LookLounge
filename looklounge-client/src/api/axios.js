// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',         // 👉 서버 주소 (API를 여기로 보낸다!)
  headers: {
    'Content-Type': 'application/json',     // 👉 JSON 형식으로 주고받겠다는 의미
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if(token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
