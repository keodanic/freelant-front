// AuthContext.tsx
import React, { createContext, useState, useEffect, PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

type AuthenticatedUser = {
  id: string;
  name?: string;              // opcional: pode vir vazio ou ser buscado depois
  email: string;
  token: string;
  profile_picture?: string;   // opcional: normalmente não retorna no login
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
      try {
        const storedUser = await AsyncStorage.getItem('@auth_user');
        if (storedUser) {
          const parsed: AuthenticatedUser = JSON.parse(storedUser);
          setUser(parsed);
          api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
        }
      } catch (err) {
        console.error('Erro ao carregar usuário do AsyncStorage:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  // Login de cliente ou freelancer
  async function login(email: string, password: string, type: 'user' | 'freelancer') {
    try {
      if (type === 'user') {
        // Chama o endpoint /auth-user/login
        // Espera retorno: { access_token: string, user: { id: string, email: string, role: Role } }
        const response = await api.post('/auth-user/login', { email, password });
        const access_token: string = response.data.access_token;
        const returnedUser = response.data.user; // { id, email, role }

        const data: AuthenticatedUser = {
          id: returnedUser.id,
          name: undefined,            // não vem no login; se quiser, busque /user/me depois
          profile_picture: undefined, // idem
          email: returnedUser.email,
          token: access_token,
          type: 'user',
        };

        setUser(data);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        await AsyncStorage.setItem('@auth_user', JSON.stringify(data));
      } else {
        // type === 'freelancer'
        // Chama o endpoint /auth-freela/login
        // Espera retorno: { access_token: string, freelancer: { id: string, email: string } }
        const response = await api.post('/auth-freela/login', { email, password });
        const access_token: string = response.data.access_token;
        const returnedFreela = response.data.freelancer; // { id, email }

        const data: AuthenticatedUser = {
          id: returnedFreela.id,
          name: undefined,            // não vem no login
          profile_picture: undefined, // idem
          email: returnedFreela.email,
          token: access_token,
          type: 'freelancer',
        };

        setUser(data);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        await AsyncStorage.setItem('@auth_user', JSON.stringify(data));
      }
    } catch (error: any) {
      // Se o erro vier do servidor, tenta extrair a mensagem, senão mostra genérico
      const message = error.response?.data?.message || 'Erro ao fazer login.';
      throw new Error(message);
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
