import AuthLayout from '../components/layout/AuthLayout';
import GuestOnlyRoute from './GuestOnlyRoute';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

export const authRoutes = [
  {
    element: <GuestOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: 'dang-nhap', element: <LoginPage /> },
          { path: 'dang-ky', element: <RegisterPage /> },
          { path: 'quen-mat-khau', element: <ForgotPasswordPage /> },
          { path: 'thiet-lap-mat-khau', element: <ResetPasswordPage /> },
        ],
      },
    ],
  },
];
