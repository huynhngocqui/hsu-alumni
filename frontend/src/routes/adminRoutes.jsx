import { lazy } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import AdminRoute from './AdminRoute';
import LazyRoute from './LazyRoute';

const AdminAlumniPostsPage = lazy(() => import('../pages/admin/AdminAlumniPostsPage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const AdminArticlesPage = lazy(() => import('../pages/admin/AdminArticlesPage'));
const AdminEventsPage = lazy(() => import('../pages/admin/AdminEventsPage'));
const AdminGalleryPage = lazy(() => import('../pages/admin/AdminGalleryPage'));
const AdminNewsCategoriesPage = lazy(() => import('../pages/admin/AdminNewsCategoriesPage'));
const AdminNewsPage = lazy(() => import('../pages/admin/AdminNewsPage'));
const AdminStoriesPage = lazy(() => import('../pages/admin/AdminStoriesPage'));
const AdminTagsPage = lazy(() => import('../pages/admin/AdminTagsPage'));
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage'));

export const adminRoutes = [
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: 'admin', element: <LazyRoute component={AdminDashboardPage} /> },
          {
            path: 'admin/users',
            element: <LazyRoute component={AdminUsersPage} />,
          },
          {
            path: 'admin/content/articles',
            element: <LazyRoute component={AdminArticlesPage} />,
          },
          {
            path: 'admin/tin-tuc',
            element: <LazyRoute component={AdminNewsPage} />,
          },
          {
            path: 'admin/tin-tuc/danh-muc',
            element: <LazyRoute component={AdminNewsCategoriesPage} />,
          },
          {
            path: 'admin/su-kien',
            element: <LazyRoute component={AdminEventsPage} />,
          },
          {
            path: 'admin/cong-dong-alumni',
            element: <LazyRoute component={AdminAlumniPostsPage} />,
          },
          {
            path: 'admin/content/stories',
            element: <LazyRoute component={AdminStoriesPage} />,
          },
          {
            path: 'admin/content/gallery',
            element: <LazyRoute component={AdminGalleryPage} />,
          },
          {
            path: 'admin/tags',
            element: <LazyRoute component={AdminTagsPage} />,
          },
        ],
      },
    ],
  },
];