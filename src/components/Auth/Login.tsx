import React, { useState } from 'react';
import {  useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, selectAuth } from '../../../Redux/Slices/authSlice';
import { InputField, Button as Buton, ErrorMessage } from '../../common';
import { useAppDispatch } from '../../../Redux/store';



const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useSelector(selectAuth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login({ email: formData.email, password: formData.password })) 
      .unwrap()
      .then(() => navigate('/Dashboard'))
      .catch(() => { });
  };

  return ( 
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-auto w-auto md:H-[250px] md:w-[250px]"
          src="../../../src/assets/logo.jpeg"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Connexion au compte admin
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="mt-2">
              <InputField
                id="email"
                name="email" // Ensure this is lowercase
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>
          </div>
          <div>
            <div className="mt-2">
              <InputField
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>
          </div>
          <div>
            <Buton type="submit" 
            disabled={auth.status === 'loading'} 
            aria-busy={auth.status === 'loading'}
            >
              {auth.status === 'loading' ? 'patientez...' : 'connexion'}
            </Buton>
            {auth.error && <ErrorMessage>{auth.error}</ErrorMessage>}
          </div>
        </form>
        <div>
    </div>
      </div>
    </div>
  );
};

export default Login;
