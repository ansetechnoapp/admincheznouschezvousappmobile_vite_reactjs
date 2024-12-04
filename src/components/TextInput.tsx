import React, { forwardRef } from 'react';

interface TextInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
  error?: string;  // Assuming you want to show errors directly in TextInput
  type?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ name, value, onChange, placeholder, className, error, ...rest }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
          {...rest}  // Passer les autres attributs comme ceux ajoutés par `register`
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);

export default TextInput;
