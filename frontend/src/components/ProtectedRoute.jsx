import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    // If there is no token, redirect to the login page
    return <Navigate to="/admin/login" replace />;
  }

  // If token exists, render the protected component
  return children;
};

export default ProtectedRoute;
