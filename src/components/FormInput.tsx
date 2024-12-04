// components/FormInput.tsx
import React from 'react';
import { Controller } from 'react-hook-form';
import TextInput from "./TextInput";

interface FormInputProps {
  label: string;
  name: string;
  control: any;
  errors: any;
  type?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, name, control, errors, type = 'text' }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextInput {...field} type={type} placeholder={label} error={errors[name]?.message} />
      )}
    />
  </div>
);

export default FormInput;
 