import { useState } from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  icon: Icon, 
  error, 
  disabled,
  ...props 
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1.5 text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${focused ? 'text-primary-600' : 'text-neutral-400'}`}>
            <Icon size={20} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full py-3.5 text-base font-sans rounded-xl outline-none transition-all
            ${Icon ? 'pl-12 pr-3.5' : 'px-3.5'}
            ${error ? 'border-2 border-red-300' : focused ? 'border-2 border-primary-500 ring-4 ring-primary-100' : 'border-2 border-neutral-200'}
            ${disabled ? 'bg-neutral-100' : 'bg-white'}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;