import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewsItemProps {
  title: string;
  time: string;
  isHighlight?: boolean;
}

const NewsItem: React.FC<NewsItemProps> = ({ title, time, isHighlight }) => {
  return (
    <div className={`p-4 rounded-lg ${isHighlight ? 'bg-furia-purple/10 border border-furia-purple/30' : 'bg-gray-800'}`}>
      <h3 className="font-semibold text-white">{title}</h3>
      <div className="flex items-center mt-2 text-xs text-gray-400">
        <Calendar className="h-3 w-3 mr-1" />
        <span>{time}</span>
      </div>
    </div>
  );
};

const HomeNewsList: React.FC = () => {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white">Últimas Notícias</h2>
        <Link to="/news" className="text-furia-purple hover:underline text-sm flex items-center">
          Ver todas
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      <div className="p-4">
        {/* Notícia principal com imagem */}
        <div className="mb-6 bg-gray-800 rounded-lg overflow-hidden">
          <div className="h-48 bg-gray-700 relative">
            <img 
              src="/esl-furia-celebration.jpg" 
              alt="FURIA vence NAVI"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/800x400?text=FURIA+vs+NAVI";
              }}
            />
            <div className="absolute top-0 right-0 bg-black/70 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
              CS2
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white">FURIA vence a NAVI na estreia do campeonato</h3>
            <p className="text-gray-400 text-sm mt-2 mb-3">
              Em uma impressionante reviravolta, a FURIA derrotou a Natus Vincere por 2-1 nas quartas de final do Major.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-400">
                <Calendar className="h-3 w-3 mr-1" />
                <span>há 2 horas</span>
              </div>
              <Link to="/news" className="text-furia-purple hover:underline text-sm">
                Ler mais
              </Link>
            </div>
          </div>
        </div>
        
        {/* Lista de notícias recentes */}
        <div className="space-y-3">
          <NewsItem 
            title="FURIA Anuncia Substituição no Elenco de CS2" 
            time="15/12/2024" 
            isHighlight 
          />
          <NewsItem 
            title="FURIA Valorant Anuncia Bootcamp na Europa" 
            time="20/12/2024" 
          />
          <NewsItem 
            title="FURIA Expande Centro de Treinamento em São Paulo" 
            time="01/12/2024" 
          />
        </div>
      </div>
    </div>
  );
};

export default HomeNewsList; 