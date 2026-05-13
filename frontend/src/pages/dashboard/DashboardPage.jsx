import { Link } from 'react-router-dom';
import PageLayout from '../../components/common/PageLayout';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../hooks/useAuth';

const matchSections = [
  {
    title: 'Gợi ý Hoa Sen Co-op',
    description: 'Danh sách này sẽ lấy từ matching engine khi Co-op listing mới có tag phù hợp.',
  },
  {
    title: 'Gợi ý việc làm',
    description: 'Danh sách job phù hợp sẽ hiển thị ở đây khi Alumni bật trạng thái tìm việc và hoàn thiện tags.',
  },
];

function DashboardPage() {
  const { user } = useAuth();

  return (
    <PageLayout
      breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Dashboard' }]}
      eyebrow="Dashboard"
      title={`Xin chào, ${user?.full_name || 'Alumni'}.`}
      description="Dashboard đã sẵn sàng để ghép dữ liệu hồ sơ, danh sách gợi ý Co-op/Job và thông báo. Ở giai đoạn hiện tại, hệ thống ưu tiên hoàn thiện hồ sơ để phục vụ matching."
      aside={
        <div className="rounded-[28px] bg-brand-sand p-6">
          <h2 className="text-lg font-semibold">Checklist cá nhân</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>Hoàn thiện thông tin công ty hiện tại và vị trí.</li>
            <li>Chọn lĩnh vực quan tâm để bật auto-matching.</li>
            <li>Kiểm tra thông báo mới và theo dõi tin tuyển dụng phù hợp.</li>
          </ul>
          <Link to="/ho-so" className="btn-primary mt-6">
            Cập nhật hồ sơ ngay
          </Link>
        </div>
      }
    >
      <section className="grid gap-6 lg:grid-cols-2">
        {matchSections.map((section) => (
          <div key={section.title} className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold">{section.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{section.description}</p>
            </div>
            <EmptyState
              title="Chưa có gợi ý"
              message="Khi backend matching hoàn tất, danh sách gợi ý cá nhân hóa sẽ hiển thị tại đây."
              actionLabel="Hoàn thiện hồ sơ"
              action={() => {}}
            />
          </div>
        ))}
      </section>
    </PageLayout>
  );
}

export default DashboardPage;
