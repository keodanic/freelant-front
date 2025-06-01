// context/UserContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/app/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthenticatedFreelancer {
  id: string;
  name: string;
  email: string;
  profile_picture?: string;
  phone_number?: string;
  portfolio_link?: string;
  workCategory?: {
    name: string;
  };
  // outros campos que forem relevantes no backend
}

interface UserContextProps {
  freelancer: AuthenticatedFreelancer | null;
  updateFreelancer: () => Promise<void>;
}

const UserContext = createContext<UserContextProps>({} as UserContextProps);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [freelancer, setFreelancer] = useState<AuthenticatedFreelancer | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem('@token');
      if (!token) return;
      setAuthToken(token);

      try {
        const res = await api.get('/freelancers/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFreelancer(res.data);
      } catch (error) {
        console.error('Erro ao carregar freelancer:', error);
      }
    };

    loadUser();
  }, []);

  const updateFreelancer = async () => {
    if (!authToken) return;
    try {
      const res = await api.get('/freelancers/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setFreelancer(res.data);
    } catch (error) {
      console.error('Erro ao atualizar freelancer:', error);
    }
  };

  return (
    <UserContext.Provider value={{ freelancer, updateFreelancer }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
