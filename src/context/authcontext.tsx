// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  PropsWithChildren,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import { api } from '../services/api';

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  token: string;
  profile_picture?: string;
  type: 'user' | 'freelancer';
};

export type AuthContextProps = {
  user: AuthenticatedUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    type: 'user' | 'freelancer'
  ) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

const STORAGE_KEY = '@auth_user';

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Interceptor para logout automático em 401
  useEffect(() => {
    const id = axios.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(id);
  }, []);

  // Carrega usuário salvo no AsyncStorage ao iniciar
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: AuthenticatedUser = JSON.parse(raw);
          setUser(parsed);
          api.defaults.headers.common['Authorization'] =
            `Bearer ${parsed.token}`;
        }
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Função de login unificada para usuários e freelancers
  const login = useCallback(
    async (
      email: string,
      password: string,
      type: 'user' | 'freelancer'
    ) => {
      setLoading(true);
      try {
        const endpoint =
          type === 'user' ? '/auth-user/login' : '/auth-freela/login';
        const res = await api.post(endpoint, { email, password });
        const token: string = res.data.access_token;
        const returned = type === 'user'
          ? res.data.user
          : res.data.freelancer;

        // Monta objeto mínimo
        const minimal: AuthenticatedUser = {
          id: returned.id,
          name: '',
          email: returned.email,
          token,
          type,
        };

        // Seta header e armazena
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(minimal)
        );

        // Busca perfil completo (nome e foto)
        const profileUrl =
          type === 'user' ? '/user/me' : '/freelancers/me';
        const prof = await api.get<{
          name: string;
          profile_picture?: string;
        }>(profileUrl);

        const complete: AuthenticatedUser = {
          ...minimal,
          name: prof.data.name,
          profile_picture: prof.data.profile_picture,
        };

        setUser(complete);
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(complete)
        );
      } catch (error: any) {
        const msg =
          error.response?.data?.message ||
          'Erro ao fazer login. Verifique suas credenciais.';
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Função de logout
  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
    delete api.defaults.headers.common['Authorization'];
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
