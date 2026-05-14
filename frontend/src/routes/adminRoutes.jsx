import AdminLayout from '../components/layout/AdminLayout';
import FeatureShellPage from '../components/common/FeatureShellPage';
import AdminRoute from './AdminRoute';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminArticlesPage from '../pages/admin/AdminArticlesPage';
import AdminGalleryPage from '../pages/admin/AdminGalleryPage';
import AdminStoriesPage from '../pages/admin/AdminStoriesPage';
import AdminTagsPage from '../pages/admin/AdminTagsPage';

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
            element: (
              <FeatureShellPage
                breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Admin', to: '/admin' }, { label: 'Quản lý tài khoản Alumni' }]}
                eyebrow="Admin"
                title="Quản lý tài khoản Alumni"
                description="Module quản trị tài khoản sẽ phục vụ activate/deactivate người dùng, xem trạng thái xác thực và xử lý các hồ sơ pending."
                highlights={['User moderation', 'Kích hoạt tài khoản', 'Tra cứu hồ sơ theo email/CCCD']}
              />
            ),
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