import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { setUser } from '../../Redux/Slices/authSlice';
import { auth } from '../../services/firebase';

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    await auth.signOut();
    dispatch(setUser(null)); 
  }; 
  
  return (
    <header className="bg-white shadow-md py-4 px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center">
          <span className="text-gray-600 mr-4">Welcome, {user?.email}</span>
          <button 
            onClick={handleLogout}
            className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;