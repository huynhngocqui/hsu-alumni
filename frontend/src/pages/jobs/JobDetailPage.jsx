import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { applyToJob, getJobListing, listJobApplications } from '../../api/jobs';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import PageLayout from '../../components/common/PageLayout';
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
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState('');

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

  const isOwner = Boolean(isAuthenticated && listing && String(user?.id) === String(listing.owner));

  useEffect(() => {
    let active = true;

    async function loadApplications() {
      if (!isOwner) {
        setApplications([]);
        setApplicationsError('');
        return;
      }

      try {
        setApplicationsLoading(true);
        const response = await listJobApplications(id);
        if (active) {
          setApplications(response);
          setApplicationsError('');
        }
      } catch (requestError) {
        if (active) {
          setApplicationsError(requestError.message || 'Không thể tải danh sách ứng viên.');
        }
      } finally {
        if (active) {
          setApplicationsLoading(false);
        }
      }
    }

    loadApplications();

    return () => {
      active = false;
    };
  }, [id, isOwner]);

  const handleApply = async (event) => {
    event.preventDefault();
    if (submitting) {
      return;
    }

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
      setListing((current) =>
        current ? { ...current, applications_count: (current.applications_count || 0) + 1 } : current,
      );
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

  const canApply = Boolean(isAuthenticated && user && !isOwner);

  return (
    <PageLayout
      breadcrumbItems={[
        { label: 'Trang chủ', to: '/' },
        { label: 'Việc làm & Kết nối' },
        { label: 'Hoa Sen Job', to: '/viec-lam-ket-noi/hoa-sen-job' },
        { label: listing.job_name },
      ]}
      eyebrow="Việc làm & Kết nối"
      title={listing.job_name}
      description={listing.job_description || 'Chưa có mô tả chi tiết cho vị trí này.'}
      aside={
        <div className="space-y-6">
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
              {listing.employment_type ? (
                <div>
                  <dt className="font-semibold text-brand-ink">Hình thức làm việc</dt>
                  <dd className="mt-1">{listing.employment_type}</dd>
                </div>
              ) : null}
              {listing.work_location ? (
                <div>
                  <dt className="font-semibold text-brand-ink">Địa điểm làm việc</dt>
                  <dd className="mt-1">{listing.work_location}</dd>
                </div>
              ) : null}
              <div>
                <dt className="font-semibold text-brand-ink">Lượt ứng tuyển</dt>
                <dd className="mt-1">{listing.applications_count || 0}</dd>
              </div>
              {listing.application_deadline ? (
                <div>
                  <dt className="font-semibold text-brand-ink">Hạn ứng tuyển</dt>
                  <dd className="mt-1">{listing.application_deadline}</dd>
                </div>
              ) : null}
              <div>
                <dt className="font-semibold text-brand-ink">Ngày đăng</dt>
                <dd className="mt-1">{formatDate(listing.created_at)}</dd>
              </div>
            </dl>
            <Link to="/viec-lam-ket-noi/hoa-sen-job" className="btn-secondary mt-6">
              Quay lại danh sách
            </Link>
          </div>

          {isOwner ? (
            <div className="panel px-6 py-8">
              <h2 className="text-xl font-semibold">Ứng viên đã ứng tuyển</h2>
              {applicationsLoading ? (
                <p className="mt-4 text-sm text-slate-500">Đang tải danh sách ứng viên...</p>
              ) : applicationsError ? (
                <p className="mt-4 text-sm text-red-600">{applicationsError}</p>
              ) : applications.length ? (
                <div className="mt-5 space-y-4">
                  {applications.map((application) => (
                    <article key={application.id} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                      <h3 className="font-semibold text-brand-ink">{application.applicant_name || 'Ứng viên'}</h3>
                      {application.applicant_email ? (
                        <p className="mt-1 text-sm text-slate-500">{application.applicant_email}</p>
                      ) : null}
                      {application.cover_note ? (
                        <p className="mt-3 text-sm leading-6 text-slate-600">{application.cover_note}</p>
                      ) : null}
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                        {application.cv_file ? (
                          <a className="font-semibold text-brand" href={application.cv_file} target="_blank" rel="noreferrer">
                            Xem CV
                          </a>
                        ) : null}
                        <span className="text-slate-500">{formatDate(application.created_at)}</span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-7 text-slate-600">Chưa có ứng viên nào ứng tuyển tin này.</p>
              )}
            </div>
          ) : null}

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
                <label className="block">
                  <span className="input-label">Portfolio</span>
                  <input className="input-field" name="portfolio_url" type="url" placeholder="https://..." />
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
        </div>
      }
      panelContent={
        <div>
          <p className="text-lg font-medium text-slate-700">{listing.job_position}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
            {listing.employment_type ? <span>{listing.employment_type}</span> : null}
            {listing.work_location ? <span>{listing.work_location}</span> : null}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(listing.category_tags || []).map((tag) => (
              <span key={tag} className="rounded-full bg-brand-sand px-3 py-1 text-xs font-semibold text-brand">
                {tag}
              </span>
            ))}
          </div>
        </div>
      }
    />
  );
}

export default JobDetailPage;
