import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

type CardVariant = 'default' | 'highlight' | 'news' | 'match' | 'result' | 'player' | 'quiz' | 'store';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
  onClick?: () => void;
  delay?: number;
}

const variantStyles = {
  default: 'bg-furia-darker',
  highlight: 'bg-gradient-to-br from-furia-dark to-furia-darker border border-furia-purple/30',
  news: 'bg-furia-darker border-l-4 border-furia-purple',
  match: 'bg-furia-darker border-t-4 border-furia-purple',
  result: 'bg-furia-darker border-r-4 border-furia-purple',
  player: 'bg-gradient-to-br from-furia-dark to-furia-darker',
  quiz: 'bg-gradient-to-br from-furia-purple-dark to-furia-darker',
  store: 'bg-furia-darker border border-furia-gray/30',
};

export const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  className = '', 
  variant = 'default',
  onClick,
  delay = 0
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: delay * 0.1,
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className={`furia-card ${variantStyles[variant]} ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''} ${className}`}
      onClick={onClick}
    >
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          {variant === 'highlight' && (
            <div className="h-1.5 w-1.5 rounded-full bg-furia-purple animate-pulse"></div>
          )}
        </div>
      )}
      <div>{children}</div>
    </motion.div>
  );
};

export default Card; 