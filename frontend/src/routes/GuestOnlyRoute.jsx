import { Navigate, Outlet } from 'react-router-dom';
import LoadingState from '../components/common/LoadingState';
import { useAuth } from '../hooks/useAuth';

function GuestOnlyRoute() {
  const { isAuthenticated, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return <div className="page-shell"><LoadingState title="Đang kiểm tra phiên đăng nhập" /></div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default GuestOnlyRoute;
