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
      name: 'Camiseta Oficial FURIA | Adidas Preta',
      price: 359.00,
      image: '/store-products/camisa-furia-2025.jpeg',
      category: 'jerseys',
      isNew: true
    },
    {
      id: '2',
      name: 'Moletom Furia x Champion Lockup Off White',
      price: 399.99,
      image: '/store-products/moletom-furia.jpeg',
      category: 'clothing',
      isNew: true
    },
    {
      id: '3',
      name: 'Camiseta Oversized Furia Ultras Preta',
      price: 129.00,
      image: '/store-products/camiseta-oversized-furia.jpeg',
      category: 'jerseys',
      isNew: true
    },
    {
      id: '4',
      name: 'Boné Furia Preto',
      price: 119.00,
      image: '/store-products/bone-furia-preto.jpeg',
      category: 'accessories',
      isNew: true
    },
    {
      id: '5',
      name: 'Sacochila Furia Preta',
      price: 179.00,
      image: '/store-products/sacochila-furia-preto.jpeg',
      category: 'accessories',
      isNew: true
    },
    {
      id: '6',
      name: 'Camiseta Furia | Adidas Preta',
      price: 299.00,
      image: '/store-products/camiseta-adidas-furia.jpeg',
      category: 'jerseys',
      isNew: true
    },
    {
      id: '7',
      name: 'Cropped Furia Clutch Branco',
      price: 119.00,
      image: '/store-products/cropped-furia-branco.jpeg',
      category: 'clothing',
      isSale: true,
      salePrice: 71.40
    },
    {
      id: '8',
      name: 'Meia Furia Magic Panthera Preta',
      price: 89.00,
      image: '/store-products/meia-furia.jpeg',
      category: 'accessories',
      isSale: true,
      salePrice: 53.40
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
            href="https://www.furia.gg/" 
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
              {product.id === '1' && (
                <a 
                  href="https://www.furia.gg/produto/camiseta-oficial-furia-adidas-preta-150265"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="w-full mt-2 bg-furia-purple hover:bg-furia-purple/90 text-white py-2 rounded transition-colors text-center block"
                >
                  Comprar oficial
                </a>
              )}
              {product.id === '2' && (
                <a 
                  href="https://www.furia.gg/produto/moletom-furia-x-champion-lockup-off-white-150175"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="w-full mt-2 bg-furia-purple hover:bg-furia-purple/90 text-white py-2 rounded transition-colors text-center block"
                >
                  Comprar oficial
                </a>
              )}
              {product.id === '6' && (
                <a 
                  href="https://www.furia.gg/produto/camiseta-furia-adidas-preta-150263"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="w-full mt-2 bg-furia-purple hover:bg-furia-purple/90 text-white py-2 rounded transition-colors text-center block"
                >
                  Comprar oficial
                </a>
              )}
              {product.id === '3' && (
                <a 
                  href="https://www.furia.gg/produto/camiseta-oversized-furia-ultras-preta-150262"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="w-full mt-2 bg-furia-purple hover:bg-furia-purple/90 text-white py-2 rounded transition-colors text-center block"
                >
                  Comprar oficial
                </a>
              )}
              {product.id === '4' && (
                <a 
                  href="https://www.furia.gg/produto/bone-furia-preto-150142"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="w-full mt-2 bg-furia-purple hover:bg-furia-purple/90 text-white py-2 rounded transition-colors text-center block"
                >
                  Comprar oficial
                </a>
              )}
              {product.id === '5' && (
                <a 
                  href="https://www.furia.gg/produto/sacochila-furia-preta-150267"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="w-full mt-2 bg-furia-purple hover:bg-furia-purple/90 text-white py-2 rounded transition-colors text-center block"
                >
                  Comprar oficial
                </a>
              )}
              {product.id === '7' && (
                <a 
                  href="https://www.furia.gg/produto/cropped-furia-clutch-branco-150196"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="w-full mt-2 bg-furia-purple hover:bg-furia-purple/90 text-white py-2 rounded transition-colors text-center block"
                >
                  Comprar oficial
                </a>
              )}
              {product.id === '8' && (
                <a 
                  href="https://www.furia.gg/produto/meia-furia-magic-panthera-preta-150213"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="w-full mt-2 bg-furia-purple hover:bg-furia-purple/90 text-white py-2 rounded transition-colors text-center block"
                >
                  Comprar oficial
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StorePage; 