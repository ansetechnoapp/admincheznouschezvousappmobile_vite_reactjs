import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import DisplayMenuItems from '../components/MenuItems';
import DeleteAccount from '../Page/DeleteAccount.tsx';
import { DisplayCategories } from '../components/Categories';
import Login from '../components/Auth/Login';
import AddRestaurantInfo from '../components/RestaurantInfo';
import {UploadImage} from '../components/SlideImageManager';
import UsersList from '../components/Manager/UsersList';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><DisplayMenuItems /></ProtectedRoute>} />
        <Route path="/slideImage" element={<ProtectedRoute><UploadImage /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><DisplayCategories /></ProtectedRoute>} />
        <Route path="/addRestoInfo" element={<ProtectedRoute><AddRestaurantInfo /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UsersList /></ProtectedRoute>} />
        <Route path="/DeleteAccount" element={<DeleteAccount />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;