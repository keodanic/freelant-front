import React, { createContext, useState, useEffect, PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  token: string;
  type: 'user' | 'freelancer';
};

type AuthContextProps = {
  user: AuthenticatedUser | null;
  login: (email: string, password: string, type: 'user' | 'freelancer') => Promise<void>;
  logout: () => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do AsyncStorage quando o app inicia
  useEffect(() => {
    async function loadUser() {
      const storedUser = await AsyncStorage.getItem('@auth_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
      }
      setLoading(false);
    }

    loadUser();
  }, []);

  // Login de cliente ou freelancer
  async function login(email: string, password: string, type: 'user' | 'freelancer') {
    try {
      const endpoint = type === 'user' ? '/auth-user/login' : '/auth-freela/login';

      const response = await api.post(endpoint, { email, password });

      const data = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        token: response.data.token,
        type,
      };

      setUser(data);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      await AsyncStorage.setItem('@auth_user', JSON.stringify(data));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login.');
    }
  }

  // Logout
  async function logout() {
    setUser(null);
    await AsyncStorage.removeItem('@auth_user');
    delete api.defaults.headers.common['Authorization'];
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};


