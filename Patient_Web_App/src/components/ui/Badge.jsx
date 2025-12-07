const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700',
    success: 'bg-primary-100 text-primary-700',
    warning: 'bg-amber-100 text-amber-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${variants[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;