'use client';

import { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'secondary';
}

export function Button({ children, className = '', variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow hover:bg-opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 
      ${variant === 'default' 
        ? 'bg-primary text-white focus-visible:outline-primary' 
        : 'bg-secondary text-secondary-foreground focus-visible:outline-secondary'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}