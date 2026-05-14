import { Navigate, Outlet } from 'react-router-dom';
import LoadingState from '../components/common/LoadingState';
import { useAuth } from '../hooks/useAuth';

function AdminRoute() {
  const { isAuthenticated, isAuthReady, user } = useAuth();

  if (!isAuthReady) {
    return <div className="page-shell"><LoadingState title="Đang kiểm tra quyền truy cập" /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/dang-nhap" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
