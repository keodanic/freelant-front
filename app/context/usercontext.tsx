// context/UserContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthenticatedFreelancer {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  portfolio_link?: string;
  profile_picture?: string;
  workCategory?: {
    id: string;
    name: string;
  };
}

interface UserContextData {
  freelancer: AuthenticatedFreelancer | null;
  setFreelancer: (freelancer: AuthenticatedFreelancer | null) => void;
  updateFreelancer: (data: Partial<AuthenticatedFreelancer>) => void;
}

const UserContext = createContext<UserContextData | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [freelancer, setFreelancer] = useState<AuthenticatedFreelancer | null>(null);

  useEffect(() => {
    const loadFreelancer = async () => {
      const data = await AsyncStorage.getItem("freelancerData");
      if (data) setFreelancer(JSON.parse(data));
    };
    loadFreelancer();
  }, []);

  const updateFreelancer = (data: Partial<AuthenticatedFreelancer>) => {
    if (!freelancer) return;
    const updated = { ...freelancer, ...data };
    setFreelancer(updated);
    AsyncStorage.setItem("freelancerData", JSON.stringify(updated));
  };

  return (
    <UserContext.Provider value={{ freelancer, setFreelancer, updateFreelancer }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextData => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser deve ser usado dentro do UserProvider");
  return context;
};
