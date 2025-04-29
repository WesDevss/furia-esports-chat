import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-9xl font-bold text-furia-purple mb-4">404</div>
      <h1 className="text-3xl font-bold mb-6">Página não encontrada</h1>
      <p className="text-gray-400 max-w-md mb-8">
        A página que você está procurando pode ter sido removida, renomeada ou está temporariamente indisponível.
      </p>
      <Link 
        to="/"
        className="bg-furia-purple text-white px-6 py-3 rounded-md font-medium hover:bg-furia-purple/90 transition-colors"
      >
        Voltar para a Página Inicial
      </Link>
    </div>
  );
};

export default NotFoundPage; 