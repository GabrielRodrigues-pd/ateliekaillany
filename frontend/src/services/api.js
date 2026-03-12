import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Endereço do nosso servidor Node
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT em requisições seguras
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
