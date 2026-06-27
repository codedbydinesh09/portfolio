import React from 'react';

interface NeuCardProps {
  children: React.ReactNode;
  className?: string;
  inset?: boolean;
  padding?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const NeuCard: React.FC<NeuCardProps> = ({
  children,
  className = '',
  inset = false,
  padding = 'p-6',
  hoverEffect = false,
  onClick
}) => {
  const baseClasses = 'rounded-[18px] transition-all duration-300 bg-neu-surface border border-[rgba(11,43,38,0.08)] text-neu-text';
  const shadowClass = inset ? 'shadow-neu-inset' : 'shadow-neu';
  const hoverClass = hoverEffect && !inset ? 'hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(5,31,32,0.12)]' : '';
  
  return (
    <div 
      className={`${baseClasses} ${shadowClass} ${padding} ${hoverClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
