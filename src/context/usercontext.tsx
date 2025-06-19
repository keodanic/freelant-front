// src/contexts/UserContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/Auth';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profile_picture?: string;
  address?: string;
  phone_number?: string;
  date_birth?: string;
  role: 'USER' | 'ADMIN';
}

export interface UserContextProps {
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

// **Exportar o contexto** para que o hook possa importá-lo
export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps
);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshProfile = useCallback(async () => {
    if (user?.type !== 'user' || !user.token) {
      setProfile(null);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get<UserProfile>('/user/me');
      setProfile(res.data);
    } catch (err) {
      console.error('Erro ao carregar perfil de usuário:', err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      refreshProfile();
    }
  }, [authLoading, refreshProfile]);

  return (
    <UserContext.Provider
      value={{ profile, loading: loading || authLoading, refreshProfile }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
