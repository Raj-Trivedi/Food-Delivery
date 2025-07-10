import { useContext } from 'react';
import { AppContext } from '../../Context/AppContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AppContext);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const user = localStorage.getItem('user');

  if (!token || !user || role !== 'seller' || !isAuthenticated) {
    return <Navigate to="/seller-signin" replace />;
  }

  return children;
};

export default ProtectedRoute; 