import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { deleteAccount, resetState } from "../../Redux/Slices/authSlice";
import { useAppDispatch } from "../../Redux/store";
import { RootState } from '../../Redux/store';
import { Trash2, AlertTriangle, Mail, Phone, MapPin, Globe } from 'lucide-react';

const DeleteAccount = () => {
  const dispatch = useAppDispatch();
  const { loading, error, success } = useSelector(
    (state: RootState) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(deleteAccount({ email, password, userId }));
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(resetState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 rounded-t-lg text-center">
        <h1 className="text-2xl font-bold mb-2">WET SARL</h1>
        <p className="text-sm px-4">
          L'application mobile chez nous chez vous est sous la tutelle de la société WET SARL, 
          pour toutes informations, veuillez-nous contacter à ce numéro +229 0198535283, 
          nous sommes situés au Bénin..
        </p>
        <div className="flex justify-center items-center mt-3 space-x-2 text-sm">
          <MapPin size={16} />
          <span>Bénin</span>
          <Phone size={16} />
          <a href="tel:+22990339900" className="hover:underline">+229 90339900</a>
          <Globe size={16} />
          <a href="https://www.wetsarl.com/contact">Official website</a>
        </div>
      </header>

      <div className="flex-grow p-6">
        <div className="flex items-center mb-6">
          <Trash2 className="text-red-500 mr-3" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Delete Account</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2" size={20} />
                Delete Account
              </>
            )}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-center">
            <AlertTriangle className="mr-2 text-red-500" size={20} />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
            <p className="text-sm">Account deleted successfully.</p>
          </div>
        )}
      </div>
      
      {/* Contact Footer */}
      <footer className="mt-6 pt-4 border-t border-gray-200 text-center p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Need Help?</h3>
        <div className="flex justify-center space-x-4 text-gray-600">
          <div className="flex items-center">
            <Mail className="mr-2" size={16} />
            <a href="mailto:support@example.com" className="text-sm hover:text-blue-600">support@example.com</a>
          </div>
          <div className="flex items-center">
            <Phone className="mr-2" size={16} />
            <a href="tel:+1234567890" className="text-sm hover:text-blue-600">+229 0198535283</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DeleteAccount;
