import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`bg-dark-800 border border-dark-700 rounded-xl p-6 transition-all duration-200 ${
        hover ? 'hover:border-primary-600 hover:shadow-lg hover:shadow-primary-600/10 hover:-translate-y-1' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;