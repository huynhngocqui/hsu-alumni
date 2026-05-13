import { Link } from 'react-router-dom';
import PageLayout from '../../components/common/PageLayout';

function NotFoundPage() {
  return (
    <PageLayout
      breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: '404' }]}
      eyebrow="404"
      title="Trang bạn tìm không tồn tại."
      description="Route hiện chưa được cấu hình hoặc đường dẫn không hợp lệ. Bạn có thể quay về trang chủ hoặc mở dashboard nếu đã đăng nhập."
      actions={
        <>
          <Link to="/" className="btn-primary">
            Về trang chủ
          </Link>
          <Link to="/dashboard" className="btn-secondary">
            Mở dashboard
          </Link>
        </>
      }
    />
  );
}

export default NotFoundPage;
