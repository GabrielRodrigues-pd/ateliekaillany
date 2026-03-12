import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          const response = await api.get('/auth/profile');
          setUser(response.data);
        } catch (error) {
          console.error('Falha na persistência da conta do cliente:', error.message);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const loginWithGoogle = async (credential) => {
    try {
      const response = await api.post('/auth/google', { credential });
      const { token, user } = response.data;
      
      localStorage.setItem('userToken', token);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
