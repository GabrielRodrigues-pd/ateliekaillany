import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição: Adiciona o token correto conforme o contexto
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('userToken');

  // Todas as rotas administrativas agora contém obrigatoriamente '/admin/'
  if (config.url.includes('/admin/')) {
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  } else if (userToken) {
    // Rotas de cliente (/user-orders, /auth/profile, etc)
    config.headers.Authorization = `Bearer ${userToken}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor de resposta: Lida com erros globais (Ex: 401 - Não autorizado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAdminRoute = error.config.url.includes('/admin/');
      
      if (isAdminRoute) {
        console.warn('Sessão administrativa expirada ou inválida.');
        localStorage.removeItem('adminToken');
      } else {
        // Assume que rotas não admin que dão 401 são de cliente
        console.warn('Sessão do cliente expirada ou inválida.');
        localStorage.removeItem('userToken');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
