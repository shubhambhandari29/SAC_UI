import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import Loader from './ui/Loader';

export default function PrivateRoute() {
  const { user, status } = useSelector((state) => state.auth);

  if (status === 'loading') return <Loader size={40} />;
  if (!!user) return <Outlet />;
  return <Navigate to="/login" replace />;
}
