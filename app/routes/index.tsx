// app/routes/index.tsx  (ou onde você escolhe qual fluxo carregar)
import React from 'react';
import { useAuth } from '../hooks/Auth'; 
import PublicRoutes from './publicroutes';
import UserRoutes from './userroutes';
import FreelancerRoutes from './freelancersroutes';

const Routes = () => {
  const { user } = useAuth();

  if (!user?.token) {
    return <PublicRoutes />;
  } else if (user.type === 'user') {
    return <UserRoutes />;
  } else if (user.type === 'freelancer') {
    return <FreelancerRoutes />;
  }

  return null;
};

export default Routes;
