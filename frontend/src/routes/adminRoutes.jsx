import AdminLayout from '../components/layout/AdminLayout';
import FeatureShellPage from '../components/common/FeatureShellPage';
import AdminRoute from './AdminRoute';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';

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
                eyebrow="Admin"
                title="Quản lý tài khoản Alumni"
                description="Module quản trị tài khoản sẽ phục vụ activate/deactivate người dùng, xem trạng thái xác thực và xử lý các hồ sơ pending."
                highlights={['User moderation', 'Kích hoạt tài khoản', 'Tra cứu hồ sơ theo email/CCCD']}
              />
            ),
          },
          {
            path: 'admin/content/articles',
            element: (
              <FeatureShellPage
                eyebrow="Admin"
                title="Quản lý bài viết CMS"
                description="Khu vực quản trị bài viết Tin tức, Sự kiện, Career Webinars và các trang nội dung cộng đồng."
                highlights={['CRUD bài viết', 'Publish / unpublish', 'Nhúng hyperlink ra HSU website']}
              />
            ),
          },
          {
            path: 'admin/content/gallery',
            element: (
              <FeatureShellPage
                eyebrow="Admin"
                title="Duyệt thư viện ảnh"
                description="Module duyệt link Google Drive do Alumni đóng góp trước khi hiển thị lên gallery công khai."
                highlights={['Danh sách pending', 'Approve / reject', 'Gắn album']}
              />
            ),
          },
          {
            path: 'admin/tags',
            element: (
              <FeatureShellPage
                eyebrow="Admin"
                title="Quản lý taxonomy tags"
                description="Taxonomy dùng chung cho Profile, Co-op và Job sẽ được quản lý tập trung tại đây."
                highlights={['Tạo / sửa / xóa tag', 'Áp dụng cho matching engine']}
              />
            ),
          },
        ],
      },
    ],
  },
];