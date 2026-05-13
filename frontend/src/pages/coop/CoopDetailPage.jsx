import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCoopListing } from '../../api/coop';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import { formatDate } from '../../utils/formatDate';

function CoopDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadListing() {
      try {
        setLoading(true);
        const response = await getCoopListing(id);
        if (active) {
          setListing(response);
          setError('');
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'Không thể tải chi tiết Co-op.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadListing();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <div className="page-shell"><LoadingState title="Đang tải bài Co-op" /></div>;
  }

  if (error) {
    return <div className="page-shell"><ErrorState message={error} /></div>;
  }

  return (
    <div className="page-shell">
      <section className="panel overflow-hidden">
        <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Hoa Sen Co-op</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">{listing.name}</h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">{listing.description || 'Chưa có mô tả chi tiết.'}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {(listing.category_tags || []).map((tag) => (
                <span key={tag} className="rounded-full bg-brand-sand px-3 py-1 text-xs font-semibold text-brand">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <aside className="rounded-[28px] bg-brand-ink px-6 py-8 text-white">
            <h2 className="text-xl font-semibold">Thông tin nhà cung cấp</h2>
            <dl className="mt-6 space-y-4 text-sm text-white/85">
              <div>
                <dt className="font-semibold">Doanh nghiệp</dt>
                <dd className="mt-1">{listing.business_name}</dd>
              </div>
              <div>
                <dt className="font-semibold">Người đăng</dt>
                <dd className="mt-1">{listing.owner_name}</dd>
              </div>
              <div>
                <dt className="font-semibold">Ngày đăng</dt>
                <dd className="mt-1">{formatDate(listing.created_at)}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/dich-vu-alumni/hoa-sen-coop" className="btn-secondary">
                Quay lại danh sách
              </Link>
              <Link to="/dang-nhap" className="btn-primary">
                Đăng nhập để kết nối
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default CoopDetailPage;
