
import React from 'react';

interface IconProps {
  className?: string;
}

export const BroomIcon: React.FC<IconProps> = ({ className }) => (
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
    <path d="M19.4 12.1l2.6-2.6a1.5 1.5 0 0 0 -2.1-2.1l-2.6 2.6" />
    <path d="M17.3 14.2l-2.1-2.1" />
    <path d="M12.2 9.2l-2.1-2.1" />
    <path d="M11 4h-1l-4 4l4 4h1" />
    <path d="M15 8h4" />
    <path d="M7 12l-4 4l4 4" />
    <path d="M11 16h10" />
  </svg>
);
