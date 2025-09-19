
import React from 'react';

interface IconProps {
  className?: string;
}

export const WandIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 4V2" />
    <path d="M15 10V8" />
    <path d="M12.5 6.5L14 5" />
    <path d="M16 2.5L17.5 4" />
    <path d="m20 10-4.5 4.5a5 5 0 0 1-7 7L3 21" />
    <path d="m16 14 3 3" />
  </svg>
);
