import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Endereço do nosso servidor Node
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
