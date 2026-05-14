import AdminLayout from '../components/layout/AdminLayout';
import AdminRoute from './AdminRoute';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminArticlesPage from '../pages/admin/AdminArticlesPage';
import AdminGalleryPage from '../pages/admin/AdminGalleryPage';
import AdminStoriesPage from '../pages/admin/AdminStoriesPage';
import AdminTagsPage from '../pages/admin/AdminTagsPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';

export const adminRoutes = [
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: 'admin', element: <AdminDashboardPage /> },
          {
            path: 'admin/users',
            element: <AdminUsersPage />,
          },
          {
            path: 'admin/content/articles',
            element: <AdminArticlesPage />,
          },
          {
            path: 'admin/content/stories',
            element: <AdminStoriesPage />,
          },
          {
            path: 'admin/content/gallery',
            element: <AdminGalleryPage />,
          },
          {
            path: 'admin/tags',
            element: <AdminTagsPage />,
          },
        ],
      },
    ],
  },
];