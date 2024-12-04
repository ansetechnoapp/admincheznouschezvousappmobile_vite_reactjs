import React, { forwardRef } from 'react';
import { Category } from '../../services/Categories';

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Category[];
  error?: string;
}

const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ name, value, onChange, options, className, error, ...rest }, ref) => {
    return (
      <div>
        <select 
          ref={ref}
          name={name} 
          value={value} 
          onChange={onChange}
          className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
          {...rest}
        >
          <option value="">Select a category</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

SelectInput.displayName = 'SelectInput';

export default SelectInput;