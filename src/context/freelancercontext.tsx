// src/contexts/FreelancerContext.tsx
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

export interface FreelancerProfile {
  id: string;
  name: string;
  email: string;
  profile_picture?: string;
  phone_number?: string;
  link_portfolio?: string;
  workCategory?: { name: string };
}

export interface FreelancerContextProps {
  profile: FreelancerProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

// **Exportar o contexto** para que o hook possa importá-lo
export const FreelancerContext = createContext<FreelancerContextProps>(
  {} as FreelancerContextProps
);

export const FreelancerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshProfile = useCallback(async () => {
    if (user?.type !== 'freelancer' || !user.token) {
      setProfile(null);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get<FreelancerProfile>('/freelancers/me');
      setProfile(res.data);
    } catch (err) {
      console.error('Erro ao carregar perfil do freelancer:', err);
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
    <FreelancerContext.Provider
      value={{ profile, loading: loading || authLoading, refreshProfile }}
    >
      {children}
    </FreelancerContext.Provider>
  );
};

// Hook permanece inalterado
export const useFreelancer = () => useContext(FreelancerContext);
