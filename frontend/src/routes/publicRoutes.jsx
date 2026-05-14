import { Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import FeatureShellPage from '../components/common/FeatureShellPage';
import HomePage from '../pages/home/HomePage';
import PublicContentPage from '../pages/content/PublicContentPage';
import PublicGalleryPage from '../pages/content/PublicGalleryPage';
import PublicStoriesPage from '../pages/content/PublicStoriesPage';
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
        element: <PublicContentPage pageSlug="dinh-huong-hoat-dong" eyebrow="Giới thiệu" title="Định hướng hoạt động Alumni" description="Nội dung giới thiệu được quản lý từ CMS public pages." breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Giới thiệu' }, { label: 'Định hướng hoạt động' }]} />,
      },
      {
        path: 'cong-dong-alumni/chinh-sach-alumni',
        element: <PublicContentPage pageSlug="chinh-sach-alumni" eyebrow="Cộng đồng Alumni" title="Chính sách Alumni" description="Chính sách, quyền lợi và nguyên tắc tham gia mạng lưới Alumni HSU." breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Cộng đồng Alumni' }, { label: 'Chính sách Alumni' }]} />,
      },
      { path: 'cong-dong-alumni/chinh-sach', element: <Navigate to="/cong-dong-alumni/chinh-sach-alumni" replace /> },
      {
        path: 'cong-dong-alumni/ban-lien-lac',
        element: <PublicContentPage pageSlug="ban-lien-lac" eyebrow="Cộng đồng Alumni" title="Thông tin Ban liên lạc" description="Danh sách Ban liên lạc và thông tin liên hệ chính thức." breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Cộng đồng Alumni' }, { label: 'Thông tin Ban liên lạc' }]} />,
      },
      {
        path: 'cong-dong-alumni/cuu-sinh-vien-tieu-bieu',
        element: <PublicStoriesPage category="OUTSTANDING" eyebrow="Cộng đồng Alumni" title="Cựu sinh viên tiêu biểu" description="Danh mục nội dung vinh danh các alumni tiêu biểu được publish từ CMS." breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Cộng đồng Alumni' }, { label: 'Cựu sinh viên tiêu biểu' }]} />,
      },
      { path: 'cong-dong-alumni/csv-tieu-bieu', element: <Navigate to="/cong-dong-alumni/cuu-sinh-vien-tieu-bieu" replace /> },
      {
        path: 'cong-dong-alumni/cau-chuyen-thanh-cong',
        element: <PublicStoriesPage category="SUCCESS" eyebrow="Cộng đồng Alumni" title="Câu chuyện thành công" description="Những câu chuyện truyền cảm hứng từ cộng đồng alumni được publish từ CMS." breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Cộng đồng Alumni' }, { label: 'Câu chuyện thành công' }]} />,
      },
      {
        path: 'cong-dong-alumni/thu-vien-hinh-anh',
        element: <PublicGalleryPage />,
      },
      { path: 'dich-vu-alumni/hoa-sen-coop', element: <CoopListPage /> },
      { path: 'dich-vu-alumni/hoa-sen-coop/:id', element: <CoopDetailPage /> },
      {
        path: 'dich-vu-alumni/hoa-sen-shop',
        element: (
          <FeatureShellPage
            breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Dịch vụ Alumni' }, { label: 'Hoa Sen Shop' }]}
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
            breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Dịch vụ Alumni' }, { label: 'Hoa Sen Courses' }]}
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
