import React, { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'jerseys' | 'clothing' | 'accessories';
  isNew?: boolean;
  isSale?: boolean;
  salePrice?: number;
}

const StorePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Mock products data
  const products: Product[] = [
    {
      id: '1',
      name: 'Camisa Oficial FURIA 2023',
      price: 299.90,
      image: 'https://via.placeholder.com/300',
      category: 'jerseys',
      isNew: true
    },
    {
      id: '2',
      name: 'Moletom FURIA Estampado',
      price: 189.90,
      image: 'https://via.placeholder.com/300',
      category: 'clothing'
    },
    {
      id: '3',
      name: 'Camiseta FURIA Logo',
      price: 99.90,
      image: 'https://via.placeholder.com/300',
      category: 'clothing',
      isSale: true,
      salePrice: 79.90
    },
    {
      id: '4',
      name: 'Boné FURIA Snapback',
      price: 89.90,
      image: 'https://via.placeholder.com/300',
      category: 'accessories'
    },
    {
      id: '5',
      name: 'Mousepad FURIA Pro',
      price: 119.90,
      image: 'https://via.placeholder.com/300',
      category: 'accessories',
      isNew: true
    },
    {
      id: '6',
      name: 'Camisa Oficial FURIA Away',
      price: 299.90,
      image: 'https://via.placeholder.com/300',
      category: 'jerseys',
      isSale: true,
      salePrice: 239.90
    },
    {
      id: '7',
      name: 'Casaco FURIA Winter',
      price: 329.90,
      image: 'https://via.placeholder.com/300',
      category: 'clothing'
    },
    {
      id: '8',
      name: 'Garrafa FURIA',
      price: 59.90,
      image: 'https://via.placeholder.com/300',
      category: 'accessories'
    }
  ];

  // Filter products based on active category
  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(product => product.category === activeCategory);

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Loja FURIA</h1>
          <p className="text-gray-400">
            Produtos oficiais da FURIA Esports. Envio para todo o Brasil!
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <a 
            href="https://furiagg.com/loja" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-furia-purple text-white px-6 py-3 rounded-md font-medium hover:bg-furia-purple/90 transition-colors"
          >
            Visitar Loja Oficial
          </a>
        </div>
      </div>
      
      {/* Category tabs */}
      <div className="flex overflow-x-auto space-x-2 border-b border-furia-gray/30 mb-8 pb-2">
        {['all', 'jerseys', 'clothing', 'accessories'].map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-md whitespace-nowrap capitalize ${
              activeCategory === category
                ? 'bg-furia-purple text-white'
                : 'bg-furia-darker text-gray-400 hover:bg-furia-dark transition-colors'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category === 'all' ? 'Todos' : category === 'jerseys' ? 'Camisas' : category === 'clothing' ? 'Roupas' : 'Acessórios'}
          </button>
        ))}
      </div>
      
      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            className="bg-furia-darker rounded-xl overflow-hidden shadow-md hover:shadow-neon-sm transition-all duration-300"
          >
            <div className="relative aspect-square overflow-hidden bg-white">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
              />
              {product.isNew && (
                <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded">
                  NOVO
                </span>
              )}
              {product.isSale && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded">
                  OFERTA
                </span>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-medium h-12">{product.name}</h3>
              <div className="mt-2">
                {product.isSale ? (
                  <div className="flex items-center">
                    <span className="text-gray-400 line-through mr-2">
                      R$ {product.price.toFixed(2)}
                    </span>
                    <span className="text-furia-purple font-bold">
                      R$ {product.salePrice?.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-furia-purple font-bold">
                    R$ {product.price.toFixed(2)}
                  </span>
                )}
              </div>
              
              <button className="w-full mt-4 bg-furia-dark hover:bg-furia-dark/80 text-white py-2 rounded transition-colors">
                Ver produto
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StorePage; 