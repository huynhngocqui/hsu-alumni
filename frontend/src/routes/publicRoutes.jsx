import { Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import FeatureShellPage from '../components/common/FeatureShellPage';
import HomePage from '../pages/home/HomePage';
import CoopDetailPage from '../pages/coop/CoopDetailPage';
import CoopListPage from '../pages/coop/CoopListPage';
import JobDetailPage from '../pages/jobs/JobDetailPage';
import JobListPage from '../pages/jobs/JobListPage';
import NotFoundPage from '../pages/shared/NotFoundPage';

export const publicRoutes = [
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'gioi-thieu/dinh-huong-hoat-dong',
        element: (
          <FeatureShellPage
            eyebrow="Giới thiệu"
            title="Định hướng hoạt động Alumni"
            description="Trang này sẽ dùng để trình bày định hướng hoạt động, sứ mệnh kết nối và chính sách đồng hành cùng Alumni theo nội dung được phê duyệt."
            highlights={[
              'Có thể nâng cấp thành CMS content page ở giai đoạn kế tiếp.',
              'Phù hợp cho SEO page và route public tĩnh.',
            ]}
          />
        ),
      },
      {
        path: 'cong-dong-alumni/chinh-sach-alumni',
        element: (
          <FeatureShellPage
            eyebrow="Cộng đồng Alumni"
            title="Chính sách Alumni"
            description="Khu vực công khai để công bố chính sách, quyền lợi và nguyên tắc tham gia mạng lưới Alumni HSU."
            highlights={['Sẵn sàng nối CMS hoặc static content.', 'Route public, phù hợp để SEO.']}
          />
        ),
      },
      { path: 'cong-dong-alumni/chinh-sach', element: <Navigate to="/cong-dong-alumni/chinh-sach-alumni" replace /> },
      {
        path: 'cong-dong-alumni/ban-lien-lac',
        element: (
          <FeatureShellPage
            eyebrow="Cộng đồng Alumni"
            title="Thông tin Ban liên lạc"
            description="Trang tĩnh/CMS cho danh sách Ban liên lạc và thông tin liên hệ chính thức."
            highlights={['Admin có thể quản lý nội dung từ CMS.', 'Public route.']}
          />
        ),
      },
      {
        path: 'cong-dong-alumni/cuu-sinh-vien-tieu-bieu',
        element: (
          <FeatureShellPage
            eyebrow="Cộng đồng Alumni"
            title="Cựu sinh viên tiêu biểu"
            description="Danh mục nội dung vinh danh Alumni tiêu biểu, làm nền cho listing card và detail page theo slug."
            highlights={['Tiếp theo sẽ tách listing và detail route riêng.', 'Dữ liệu dự kiến lấy từ CMS.']}
          />
        ),
      },
      { path: 'cong-dong-alumni/csv-tieu-bieu', element: <Navigate to="/cong-dong-alumni/cuu-sinh-vien-tieu-bieu" replace /> },
      {
        path: 'cong-dong-alumni/cau-chuyen-thanh-cong',
        element: (
          <FeatureShellPage
            eyebrow="Cộng đồng Alumni"
            title="Câu chuyện thành công"
            description="Trang chuyên biệt cho success stories, phục vụ truyền thông và truyền cảm hứng trong cộng đồng Alumni."
            highlights={['Sử dụng cùng domain content nhưng route tách riêng.', 'Sẵn sàng SEO theo slug bài viết.']}
          />
        ),
      },
      {
        path: 'cong-dong-alumni/thu-vien-hinh-anh',
        element: (
          <FeatureShellPage
            eyebrow="Cộng đồng Alumni"
            title="Thư viện hình ảnh"
            description="Khung hiển thị gallery đã được tạo route riêng để chuẩn bị cho album ảnh và form đóng góp link Google Drive."
            highlights={['Public gallery.', 'Sẽ bổ sung form đóng góp ảnh cho Alumni.']}
          />
        ),
      },
      { path: 'dich-vu-alumni/hoa-sen-coop', element: <CoopListPage /> },
      { path: 'dich-vu-alumni/hoa-sen-coop/:id', element: <CoopDetailPage /> },
      {
        path: 'dich-vu-alumni/hoa-sen-shop',
        element: (
          <FeatureShellPage
            eyebrow="Dịch vụ Alumni"
            title="Hoa Sen Shop"
            description="Landing page giới thiệu các ưu đãi và dịch vụ mua sắm dành cho cộng đồng Alumni. Giai đoạn hiện tại, route được mở sẵn để gắn nội dung CMS hoặc business module khi stakeholder chốt phạm vi."
            highlights={['Public route theo navigation mới.', 'Sẵn sàng đổi từ static content sang CMS.']}
          />
        ),
      },
      {
        path: 'dich-vu-alumni/hoa-sen-courses',
        element: (
          <FeatureShellPage
            eyebrow="Dịch vụ Alumni"
            title="Hoa Sen Courses"
            description="Landing page cho các cơ hội học tập, ưu đãi khóa học và các lộ trình phát triển tiếp theo dành cho Alumni."
            highlights={['Public route theo navigation mới.', 'Sẵn sàng kết nối content API khi có scope rõ.']}
          />
        ),
      },
      { path: 'viec-lam-ket-noi/hoa-sen-job', element: <JobListPage /> },
      { path: 'viec-lam-ket-noi/hoa-sen-job/:id', element: <JobDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
