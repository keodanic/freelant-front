import PublicRoutes from './publicroutes';
import FreelancerRoutes from './freelancersroutes';
import UserRoutes from './userroutes';
import { useAuth } from '../hooks/Auth';
import React from 'react';

const Routes = () => {
  const { user } = useAuth();

  if (!user?.token) return <PublicRoutes />;
  if (user.type === 'freelancer') return <FreelancerRoutes />;
  if (user.type === 'user') return <UserRoutes />;

  return null;
};

export default Routes;
