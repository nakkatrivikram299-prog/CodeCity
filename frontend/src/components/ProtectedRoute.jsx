import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext.jsx';
import Loading from './Loading.jsx';

/**
 * Gatekeeps a route behind an authenticated session.
 * Preserves the attempted location so login can redirect back after success.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading fullscreen label="Checking your session" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
