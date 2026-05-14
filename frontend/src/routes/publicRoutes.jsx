import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import LazyRoute from './LazyRoute';

const AlumniDetailPage = lazy(() => import('../pages/alumni/AlumniDetailPage'));
const AlumniListPage = lazy(() => import('../pages/alumni/AlumniListPage'));
const EventDetailPage = lazy(() => import('../pages/events/EventDetailPage'));
const EventListPage = lazy(() => import('../pages/events/EventListPage'));
const HomePage = lazy(() => import('../pages/home/HomePage'));
const PublicArticleDetailPage = lazy(() => import('../pages/content/PublicArticleDetailPage'));
const PublicArticleListPage = lazy(() => import('../pages/content/PublicArticleListPage'));
const PublicContentPage = lazy(() => import('../pages/content/PublicContentPage'));
const PublicGalleryPage = lazy(() => import('../pages/content/PublicGalleryPage'));
const PublicStoryDetailPage = lazy(() => import('../pages/content/PublicStoryDetailPage'));
const PublicStoriesPage = lazy(() => import('../pages/content/PublicStoriesPage'));
const CoopDetailPage = lazy(() => import('../pages/coop/CoopDetailPage'));
const CoopListPage = lazy(() => import('../pages/coop/CoopListPage'));
const JobDetailPage = lazy(() => import('../pages/jobs/JobDetailPage'));
const JobListPage = lazy(() => import('../pages/jobs/JobListPage'));
const NewsDetailPage = lazy(() => import('../pages/news/NewsDetailPage'));
const NewsListPage = lazy(() => import('../pages/news/NewsListPage'));
const LegacySlugRedirectPage = lazy(() => import('../pages/shared/LegacySlugRedirectPage'));
const NotFoundPage = lazy(() => import('../pages/shared/NotFoundPage'));

export const publicRoutes = [
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <LazyRoute component={HomePage} /> },
      {
        path: 'cong-dong-alumni',
        element: <LazyRoute component={AlumniListPage} />,
      },
      {
        path: 'cong-dong-alumni/:slug',
        element: <LazyRoute component={AlumniDetailPage} />,
      },
      {
        path: 'tin-tuc',
        element: <LazyRoute component={NewsListPage} />,
      },
      {
        path: 'tin-tuc/:slug',
        element: <LazyRoute component={NewsDetailPage} />,
      },
      {
        path: 'su-kien',
        element: <LazyRoute component={EventListPage} />,
      },
      {
        path: 'su-kien/:slug',
        element: <LazyRoute component={EventDetailPage} />,
      },
      {
        path: 'tin-tuc-su-kien/tin-tuc',
        element: <Navigate to="/tin-tuc" replace />,
      },
      {
        path: 'tin-tuc-su-kien/tin-tuc/:slug',
        element: <LazyRoute component={() => <LegacySlugRedirectPage basePath="/tin-tuc" />} />,
      },
      {
        path: 'tin-tuc-su-kien/su-kien',
        element: <Navigate to="/su-kien" replace />,
      },
      {
        path: 'tin-tuc-su-kien/su-kien/:slug',
        element: <LazyRoute component={() => <LegacySlugRedirectPage basePath="/su-kien" />} />,
      },
      {
        path: 'gioi-thieu/dinh-huong-hoat-dong',
        element: <LazyRoute component={() => <PublicContentPage pageSlug="dinh-huong-hoat-dong" eyebrow="Giới thiệu" title="Định hướng hoạt động Alumni" description="Nội dung giới thiệu được quản lý từ CMS public pages." breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Giới thiệu' }, { label: 'Định hướng hoạt động' }]} />} />,
      },
      {
        path: 'cong-dong-alumni/chinh-sach-alumni',
        element: <LazyRoute component={() => <PublicContentPage pageSlug="chinh-sach-alumni" eyebrow="Cộng đồng Alumni" title="Chính sách Alumni" description="Chính sách, quyền lợi và nguyên tắc tham gia mạng lưới Alumni HSU." breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Cộng đồng Alumni' }, { label: 'Chính sách Alumni' }]} />} />,
      },
      { path: 'cong-dong-alumni/chinh-sach', element: <Navigate to="/cong-dong-alumni/chinh-sach-alumni" replace /> },
      {
        path: 'cong-dong-alumni/ban-lien-lac',
        element: <LazyRoute component={() => <PublicContentPage pageSlug="ban-lien-lac" eyebrow="Cộng đồng Alumni" title="Thông tin Ban liên lạc" description="Danh sách Ban liên lạc và thông tin liên hệ chính thức." breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Cộng đồng Alumni' }, { label: 'Thông tin Ban liên lạc' }]} />} />,
      },
      {
        path: 'cong-dong-alumni/cuu-sinh-vien-tieu-bieu',
        element: <LazyRoute component={() => <PublicStoriesPage category="OUTSTANDING" eyebrow="Cộng đồng Alumni" title="Cựu sinh viên tiêu biểu" description="Danh mục nội dung vinh danh các alumni tiêu biểu được publish từ CMS." breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Cộng đồng Alumni' }, { label: 'Cựu sinh viên tiêu biểu' }]} detailBasePath="/cong-dong-alumni/cuu-sinh-vien-tieu-bieu" />} />,
      },
      {
        path: 'cong-dong-alumni/cuu-sinh-vien-tieu-bieu/:slug',
        element: <LazyRoute component={PublicStoryDetailPage} />,
      },
      { path: 'cong-dong-alumni/csv-tieu-bieu', element: <Navigate to="/cong-dong-alumni/cuu-sinh-vien-tieu-bieu" replace /> },
      {
        path: 'cong-dong-alumni/cau-chuyen-thanh-cong',
        element: <LazyRoute component={() => <PublicStoriesPage category="SUCCESS" eyebrow="Cộng đồng Alumni" title="Câu chuyện thành công" description="Những câu chuyện truyền cảm hứng từ cộng đồng alumni được publish từ CMS." breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Cộng đồng Alumni' }, { label: 'Câu chuyện thành công' }]} detailBasePath="/cong-dong-alumni/cau-chuyen-thanh-cong" />} />,
      },
      {
        path: 'cong-dong-alumni/cau-chuyen-thanh-cong/:slug',
        element: <LazyRoute component={PublicStoryDetailPage} />,
      },
      {
        path: 'cong-dong-alumni/thu-vien-hinh-anh',
        element: <LazyRoute component={PublicGalleryPage} />,
      },
      { path: 'dich-vu-alumni/hoa-sen-coop', element: <LazyRoute component={CoopListPage} /> },
      { path: 'dich-vu-alumni/hoa-sen-coop/:id', element: <LazyRoute component={CoopDetailPage} /> },
      {
        path: 'dich-vu-alumni/hoa-sen-shop',
        element: <LazyRoute component={() => <PublicContentPage pageSlug="hoa-sen-shop" eyebrow="Dịch vụ Alumni" title="Hoa Sen Shop" description="Ưu đãi mua sắm và các dịch vụ tri ân dành cho cộng đồng alumni." breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Dịch vụ Alumni' }, { label: 'Hoa Sen Shop' }]} />} />,
      },
      {
        path: 'dich-vu-alumni/hoa-sen-courses',
        element: <LazyRoute component={() => <PublicContentPage pageSlug="hoa-sen-courses" eyebrow="Dịch vụ Alumni" title="Hoa Sen Courses" description="Các cơ hội học tập tiếp nối và ưu đãi đào tạo dành cho alumni." breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Dịch vụ Alumni' }, { label: 'Hoa Sen Courses' }]} />} />,
      },
      { path: 'viec-lam-ket-noi/hoa-sen-job', element: <LazyRoute component={JobListPage} /> },
      { path: 'viec-lam-ket-noi/hoa-sen-job/:id', element: <LazyRoute component={JobDetailPage} /> },
      {
        path: 'viec-lam-ket-noi/career-webinars',
        element: <LazyRoute component={() => <PublicArticleListPage articleType="WEBINAR" eyebrow="Việc làm & Kết nối" title="Career Webinars" description="Danh sách webinar hướng nghiệp và kết nối nghề nghiệp cho alumni." breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Việc làm & Kết nối' }, { label: 'Career Webinars' }]} detailBasePath="/viec-lam-ket-noi/career-webinars" emptyTitle="Chưa có webinar" emptyMessage="Admin chưa publish webinar nào." />} />,
      },
      {
        path: 'viec-lam-ket-noi/career-webinars/:slug',
        element: <LazyRoute component={PublicArticleDetailPage} />,
      },
      { path: '*', element: <LazyRoute component={NotFoundPage} /> },
    ],
  },
];
