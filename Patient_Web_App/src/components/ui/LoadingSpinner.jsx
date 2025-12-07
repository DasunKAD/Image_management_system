const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-3',
    lg: 'w-10 h-10 border-4',
  };

  return (
    <div 
      className={`${sizeClasses[size]} border-primary-100 border-t-primary-600 rounded-full animate-spin`}
    />
  );
};

export default LoadingSpinner;