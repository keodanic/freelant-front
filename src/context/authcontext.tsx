// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  PropsWithChildren,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

export type AuthenticatedUser = {
  id: string;
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

  // Carrega do AsyncStorage no bootstrap
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as AuthenticatedUser;
          setUser(parsed);
          api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
        }
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(
    async (email: string, password: string, type: 'user' | 'freelancer') => {
      setLoading(true);
      try {
        const endpoint = type === 'user' ? '/auth-user/login' : '/auth-freela/login';
        const res = await api.post(endpoint, { email, password });
        const token: string = res.data.access_token;
        const returned = type === 'user' ? res.data.user : res.data.freelancer;

        const minimal: AuthenticatedUser = {
          id: returned.id,
          email: returned.email,
          token,
          type,
        };

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(minimal));
        setUser(minimal);
      } catch (err: any) {
        const msg = err.response?.data?.message || 'Erro ao fazer login.';
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

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
