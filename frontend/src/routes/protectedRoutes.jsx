import { lazy } from 'react';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import LazyRoute from './LazyRoute';

const CoopPostPage = lazy(() => import('../pages/coop/CoopPostPage'));
const ApplicantApplicationsPage = lazy(() => import('../pages/dashboard/ApplicantApplicationsPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const OwnerPostManagementPage = lazy(() => import('../pages/dashboard/OwnerPostManagementPage'));
const JobPostPage = lazy(() => import('../pages/jobs/JobPostPage'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));
const ChangePasswordPage = lazy(() => import('../pages/profile/ChangePasswordPage'));

export const protectedRoutes = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: 'dashboard', element: <LazyRoute component={DashboardPage} /> },
          { path: 'dashboard/bai-dang', element: <LazyRoute component={OwnerPostManagementPage} /> },
          { path: 'dashboard/ung-tuyen', element: <LazyRoute component={ApplicantApplicationsPage} /> },
          { path: 'ho-so', element: <LazyRoute component={ProfilePage} /> },
          { path: 'ho-so/doi-mat-khau', element: <LazyRoute component={ChangePasswordPage} /> },
          { path: 'dich-vu-alumni/hoa-sen-coop/dang-moi', element: <LazyRoute component={CoopPostPage} /> },
          { path: 'viec-lam-ket-noi/dang-tin-tuyen-dung', element: <LazyRoute component={JobPostPage} /> },
        ],
      },
    ],
  },
];
