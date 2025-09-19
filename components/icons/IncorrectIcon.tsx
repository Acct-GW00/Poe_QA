
import React from 'react';

interface IconProps {
  className?: string;
}

export const IncorrectIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
    <path d="m9 10 2 2" />
    <path d="m11 10-2 2" />
    <path d="m15 10 2 2" />
    <path d="m17 10-2 2" />
  </svg>
);
