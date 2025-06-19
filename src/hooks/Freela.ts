// src/hooks/useFreelancer.ts
import { useContext } from 'react';
import { FreelancerContext } from '../context/freelancercontext';

export const useFreelancer = () => {
  const context = useContext(FreelancerContext);
  if (!context) {
    throw new Error('useFreelancer deve ser usado dentro de um <FreelancerProvider>');
  }
  return context;
};
