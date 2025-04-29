import React from 'react';
import Card from './Card';
import { CalendarDays } from 'lucide-react';

interface CardNewsProps {
  title: string;
  timestamp: string;
  image?: string;
  description?: string;
  onClick?: () => void;
  delay?: number;
}

const CardNews: React.FC<CardNewsProps> = ({ 
  title, 
  timestamp, 
  image, 
  description,
  onClick,
  delay = 0
}) => {
  return (
    <Card 
      variant="news" 
      className="overflow-hidden" 
      onClick={onClick}
      delay={delay}
    >
      {image && (
        <div className="h-48 w-full mb-4 overflow-hidden rounded-xl">
          <img 
            src={image} 
            alt={title} 
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" 
          />
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className="text-lg font-bold line-clamp-2">{title}</h3>
        
        {description && (
          <p className="text-gray-300 text-sm line-clamp-3">{description}</p>
        )}
        
        <div className="flex items-center text-gray-400 text-sm">
          <CalendarDays size={14} className="mr-1" />
          <span>{timestamp}</span>
        </div>
      </div>
    </Card>
  );
};

export default CardNews; 