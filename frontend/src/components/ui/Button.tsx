import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger' | 'quiz';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: 'bg-furia-purple hover:bg-furia-purple-light text-white shadow-neon',
  secondary: 'bg-furia-gray hover:bg-gray-600 text-white',
  outline: 'bg-transparent border border-furia-purple text-furia-purple hover:bg-furia-purple/10',
  ghost: 'bg-transparent hover:bg-furia-gray/20 text-white',
  link: 'bg-transparent text-furia-purple hover:text-furia-purple-light underline p-0',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  quiz: 'bg-gradient-to-r from-furia-purple to-furia-purple-dark hover:from-furia-purple-light hover:to-furia-purple text-white shadow-neon-lg',
};

const sizeStyles = {
  sm: 'py-1 px-3 text-sm rounded-lg',
  md: 'py-2 px-4 text-base rounded-xl',
  lg: 'py-3 px-6 text-lg rounded-xl',
  xl: 'py-4 px-8 text-xl rounded-2xl',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth,
  className = '',
  disabled,
  ...props
}) => {
  const buttonClasses = `
    font-medium transition-all duration-300
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : ''}
    ${!disabled && !isLoading ? 'hover:scale-[1.03] active:scale-[0.98]' : ''}
    flex items-center justify-center gap-2
    transform
    ${className}
  `;

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!isLoading && leftIcon && <span>{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span>{rightIcon}</span>}
    </button>
  );
};

export default Button; 