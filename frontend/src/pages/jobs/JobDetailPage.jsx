import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { applyToJob, getJobListing } from '../../api/jobs';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatDate';

function JobDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyStatus, setApplyStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadListing() {
      try {
        setLoading(true);
        const response = await getJobListing(id);
        if (active) {
          setListing(response);
          setError('');
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'Không thể tải chi tiết tuyển dụng.');
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

  const handleApply = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (!formData.get('cv_file')?.name) {
      setApplyStatus({ type: 'error', message: 'Vui lòng chọn CV trước khi ứng tuyển.' });
      return;
    }

    try {
      setSubmitting(true);
      await applyToJob(id, formData);
      event.currentTarget.reset();
      setApplyStatus({ type: 'success', message: 'Ứng tuyển thành công.' });
    } catch (requestError) {
      setApplyStatus({ type: 'error', message: requestError.message || 'Không thể gửi hồ sơ ứng tuyển.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="page-shell"><LoadingState title="Đang tải tin tuyển dụng" /></div>;
  }

  if (error) {
    return <div className="page-shell"><ErrorState message={error} /></div>;
  }

  const canApply = isAuthenticated && user?.id !== listing.owner;

  return (
    <div className="page-shell">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="panel px-6 py-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Hoa Sen Job</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">{listing.job_name}</h1>
          <p className="mt-3 text-lg font-medium text-slate-700">{listing.job_position}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {(listing.category_tags || []).map((tag) => (
              <span key={tag} className="rounded-full bg-brand-sand px-3 py-1 text-xs font-semibold text-brand">
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-6 whitespace-pre-line text-sm leading-8 text-slate-600">
            {listing.job_description || 'Chưa có mô tả chi tiết cho vị trí này.'}
          </p>
        </article>

        <aside className="space-y-6">
          <div className="panel px-6 py-8">
            <h2 className="text-xl font-semibold">Thông tin tuyển dụng</h2>
            <dl className="mt-5 space-y-4 text-sm text-slate-600">
              <div>
                <dt className="font-semibold text-brand-ink">Doanh nghiệp</dt>
                <dd className="mt-1">{listing.company_name}</dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-ink">Người đăng</dt>
                <dd className="mt-1">{listing.owner_name}</dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-ink">Ngày đăng</dt>
                <dd className="mt-1">{formatDate(listing.created_at)}</dd>
              </div>
            </dl>
            <Link to="/viec-lam-ket-noi/hoa-sen-job" className="btn-secondary mt-6">
              Quay lại danh sách
            </Link>
          </div>

          <div className="panel px-6 py-8">
            <h2 className="text-xl font-semibold">Ứng tuyển</h2>
            {!isAuthenticated ? (
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Bạn cần <Link to="/dang-nhap" className="font-semibold text-brand">đăng nhập</Link> để ứng tuyển.
              </p>
            ) : canApply ? (
              <form className="mt-5 space-y-4" onSubmit={handleApply}>
                <label className="block">
                  <span className="input-label">CV</span>
                  <input className="input-field" name="cv_file" type="file" accept=".pdf,.doc,.docx" />
                </label>
                <label className="block">
                  <span className="input-label">Lời nhắn</span>
                  <textarea className="input-field min-h-28" name="cover_note" />
                </label>
                {applyStatus.message ? (
                  <p className={`text-sm ${applyStatus.type === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
                    {applyStatus.message}
                  </p>
                ) : null}
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Đang gửi hồ sơ...' : 'Ứng tuyển ngay'}
                </button>
              </form>
            ) : (
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Bạn không thể ứng tuyển vào bài đăng của chính mình.
              </p>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}

export default JobDetailPage;
