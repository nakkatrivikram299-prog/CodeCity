import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Loading from './components/Loading.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';

const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const City = lazy(() => import('./pages/City.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Team = lazy(() => import('./pages/Team.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

/**
 * Handles the GitHub OAuth redirect: the backend appends a short-lived JWT
 * as a query param after exchanging the OAuth `code` server-side, and this
 * page hands it to AuthContext then routes into the app.
 */
function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const { completeOAuthLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const returnedState = searchParams.get('state');
    const expectedState = sessionStorage.getItem('codecity_oauth_state');
    sessionStorage.removeItem('codecity_oauth_state');

    if (!token || (expectedState && returnedState !== expectedState)) {
      navigate('/login?error=oauth_failed', { replace: true });
      return;
    }

    completeOAuthLogin(token).then(() => {
      navigate('/city', { replace: true });
    });
  }, [searchParams, completeOAuthLogin, navigate]);

  return <Loading fullscreen label="Signing you in" />;
}

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<Loading fullscreen label="Loading CodeCity" />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/city"
            element={
              <ProtectedRoute>
                <City />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:username?"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team/:teamId?"
            element={
              <ProtectedRoute>
                <Team />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}
