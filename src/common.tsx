import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ type = 'button', onClick, disabled, children }) => {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
      {children}
    </button>
  );
};


interface ErrorMessageProps {
  children: React.ReactNode;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ children }) => {
  return (
    <p style={{ color: 'red' }} role="alert">
      {children}
    </p>
  );
};




interface InputFieldProps {
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ id, name, type, value, onChange, placeholder, required = false }) => {
  return (
    <div>
      <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor={id}>{name.charAt(0).toUpperCase() + name.slice(1)}</label>
      <input 
        type={type} 
        id={id}
        name={name}
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        required={required}
        aria-label={name}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
    </div>
  );
};
