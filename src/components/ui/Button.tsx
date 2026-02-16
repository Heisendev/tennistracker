import { cva } from 'class-variance-authority';

import type { ButtonHTMLAttributes } from "react";

type Variant = 'primary' | 'secondary' | 'danger';
    
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isLoading?: boolean;
    variant?: Variant;
};

const buttonStyles = cva(
  'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-(--bg-interactive-primary) hover:bg-(--bg-interactive-primary-hover) text-white',
        secondary: 'bg-(--bg-interactive-secondary) hover:bg-(--bg-interactive-secondary-hover) text-(--bg-color-brand) border border-gray-400',
        danger: 'bg-(--bg-interactive-danger) hover:bg-(--bg-interactive-danger-hover) text-white',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
)

export const Button = ({ isLoading = false, variant = 'primary', children, ...props }: ButtonProps) => {
    return (
        <button 
            className={buttonStyles({ variant })}
            disabled={isLoading || props.disabled} 
            aria-busy={isLoading}
            {...props} 
        >
            {isLoading ? 'Chargement...' : children}
        </button>
    );
}