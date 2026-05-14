import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listDashboardMatches } from '../../api/matching';
import PageLayout from '../../components/common/PageLayout';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../hooks/useAuth';

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState({ job_matches: [], coop_matches: [] });

  useEffect(() => {
    let active = true;

    async function loadMatches() {
      try {
        const response = await listDashboardMatches();
        if (active) {
          setMatches(response);
        }
      } catch {
        if (active) {
          setMatches({ job_matches: [], coop_matches: [] });
        }
      }
    }

    loadMatches();
    return () => {
      active = false;
    };
  }, []);

  const matchSections = [
    {
      key: 'coop_matches',
      title: 'Gợi ý Hoa Sen Co-op',
      description: 'Co-op được xếp hạng theo độ trùng khớp giữa lĩnh vực quan tâm và category tags.',
    },
    {
      key: 'job_matches',
      title: 'Gợi ý việc làm',
      description: 'Job phù hợp sẽ hiển thị khi bạn bật trạng thái tìm việc và hoàn thiện tags hồ sơ.',
    },
  ];

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
            {matches[section.key]?.length ? (
              <div className="space-y-3">
                {matches[section.key].map((item) => (
                  <article key={`${section.key}-${item.id}`} className="panel px-5 py-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-brand-ink">{item.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
                      </div>
                      <span className="rounded-full bg-brand-sand px-3 py-1 text-xs font-semibold text-brand">
                        Match {item.score}/5
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.matched_tags.map((tag) => (
                        <span key={`${item.id}-${tag}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Link to={item.url} className="text-sm font-semibold text-brand">
                        Xem chi tiết
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Chưa có gợi ý"
                message="Cập nhật thêm lĩnh vực quan tâm hoặc bật trạng thái tìm việc để tăng độ phủ matching."
                actionLabel="Hoàn thiện hồ sơ"
                action={() => navigate('/ho-so')}
              />
            )}
          </div>
        ))}
      </section>
    </PageLayout>
  );
}

export default DashboardPage;
