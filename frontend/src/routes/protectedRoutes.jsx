import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import CoopPostPage from '../pages/coop/CoopPostPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import JobPostPage from '../pages/jobs/JobPostPage';
import ProfilePage from '../pages/profile/ProfilePage';
import ChangePasswordPage from '../pages/profile/ChangePasswordPage';

export const protectedRoutes = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'ho-so', element: <ProfilePage /> },
          { path: 'ho-so/doi-mat-khau', element: <ChangePasswordPage /> },
          { path: 'dich-vu-alumni/hoa-sen-coop/dang-moi', element: <CoopPostPage /> },
          { path: 'viec-lam-ket-noi/dang-tin-tuyen-dung', element: <JobPostPage /> },
        ],
      },
    ],
  },
];