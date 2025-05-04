import { useContext } from 'react';
import { FuriBotContext } from '../App';

export const useFuriBot = () => {
  const context = useContext(FuriBotContext);
  
  if (!context) {
    throw new Error('useFuriBot deve ser usado dentro de um FuriBotContext.Provider');
  }
  
  return context;
}; 