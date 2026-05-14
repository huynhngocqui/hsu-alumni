import { lazy } from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import GuestOnlyRoute from './GuestOnlyRoute';
import LazyRoute from './LazyRoute';

const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

export const authRoutes = [
  {
    element: <GuestOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: 'dang-nhap', element: <LazyRoute component={LoginPage} /> },
          { path: 'dang-ky', element: <LazyRoute component={RegisterPage} /> },
          { path: 'quen-mat-khau', element: <LazyRoute component={ForgotPasswordPage} /> },
          { path: 'thiet-lap-mat-khau', element: <LazyRoute component={ResetPasswordPage} /> },
        ],
      },
    ],
  },
];
