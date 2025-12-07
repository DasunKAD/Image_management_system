import LoadingSpinner from './LoadingSpinner';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading, 
  disabled, 
  fullWidth, 
  onClick, 
  type = 'button',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl border-none cursor-pointer transition-all duration-200';
  
  const variants = {
    primary: 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-600/30 hover:-translate-y-0.5',
    secondary: 'bg-primary-50 text-primary-700 border border-primary-200 hover:-translate-y-0.5',
    ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-100',
    danger: 'bg-red-50 text-red-600 border border-red-200 hover:-translate-y-0.5',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const disabledClasses = (disabled || loading) ? 'opacity-60 cursor-not-allowed' : '';
  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${widthClasses} ${className}`}
    >
      {loading ? <LoadingSpinner size="sm" /> : children}
    </button>
  );
};

export default Button;