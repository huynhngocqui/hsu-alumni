import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listJobListings } from '../../api/jobs';
import { listMyApplications, withdrawApplication } from '../../api/jobs';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import PageLayout from '../../components/common/PageLayout';
import { formatDate } from '../../utils/formatDate';

const statusLabels = {
  PENDING: 'Pending',
  INTERVIEW: 'Interview',
  REJECTED: 'Rejected',
  ACCEPTED: 'Accepted',
  WITHDRAWN: 'Withdrawn',
};

function buildQuery({ search, status }) {
  const params = new URLSearchParams({
    ...(search ? { search } : {}),
    ...(status ? { status } : {}),
  }).toString();
  return params ? `?${params}` : '';
}

function ApplicantApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const loadApplications = async () => {
    const response = await listMyApplications(buildQuery(filters));
    setApplications(response);
    setSelectedApplication((current) => {
      if (!current) {
        return response[0] || null;
      }
      return response.find((item) => item.id === current.id) || response[0] || null;
    });
  };

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        setLoading(true);
        await loadApplications();
        if (active) {
          setError('');
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'Không thể tải danh sách hồ sơ ứng tuyển.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, [filters.search, filters.status]);

  const appliedTags = useMemo(() => {
    const tags = new Set();
    applications.forEach((application) => {
      (application.listing?.category_tags || []).forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [applications]);

  useEffect(() => {
    let active = true;
    async function loadSuggestions() {
      if (!appliedTags.length) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await listJobListings(`?${new URLSearchParams({ tag: appliedTags[0] }).toString()}`);
        const appliedJobIds = new Set(applications.map((item) => String(item.job_listing)));
        if (active) {
          setSuggestions(response.filter((item) => !appliedJobIds.has(String(item.id))).slice(0, 4));
        }
      } catch {
        if (active) {
          setSuggestions([]);
        }
      }
    }
    loadSuggestions();
    return () => {
      active = false;
    };
  }, [appliedTags.join('|'), applications]);

  const handleWithdraw = async (application) => {
    try {
      setActionError('');
      const updated = await withdrawApplication(application.id);
      setApplications((current) => current.map((item) => (item.id === application.id ? { ...item, ...updated } : item)));
      setSelectedApplication((current) => (current?.id === application.id ? { ...current, ...updated } : current));
    } catch (requestError) {
      setActionError(requestError.message || 'Không thể rút hồ sơ.');
    }
  };

  if (loading) {
    return <div className="page-shell"><LoadingState title="Đang tải hồ sơ ứng tuyển" /></div>;
  }

  if (error) {
    return <div className="page-shell"><ErrorState message={error} /></div>;
  }

  return (
    <PageLayout
      breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Dashboard', to: '/dashboard' }, { label: 'Hồ sơ đã ứng tuyển' }]}
      eyebrow="Applicant"
      title="Hồ sơ đã ứng tuyển"
      description="Theo dõi các job đã apply, CV đã gửi, cover letter và tiến trình tuyển dụng."
    >
      <section className="panel px-5 py-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
          <input
            className="input-field"
            placeholder="Tìm theo công ty, vị trí, tên công việc"
            value={filters.search}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
          />
          <select className="input-field" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Pending</option>
            <option value="INTERVIEW">Interview</option>
            <option value="REJECTED">Rejected</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>
        </div>
        {actionError ? <p className="mt-3 text-sm text-red-600">{actionError}</p> : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <div className="space-y-4">
          {applications.length ? (
            applications.map((application) => (
              <article key={application.id} className="panel px-5 py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <button type="button" className="text-left" onClick={() => setSelectedApplication(application)}>
                    <h2 className="text-xl font-semibold text-brand-ink">{application.job_name}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {application.company_name} · {application.job_position}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{application.employment_type || 'Chưa cập nhật loại công việc'}</p>
                  </button>
                  <div className="text-sm lg:text-right">
                    <p className="font-semibold text-brand">{statusLabels[application.status] || application.status}</p>
                    <p className="mt-1 text-slate-500">{formatDate(application.created_at)}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  {application.cv_file ? <a className="font-semibold text-brand" href={application.cv_file} target="_blank" rel="noreferrer">Xem CV</a> : null}
                  {application.portfolio_url ? <a className="font-semibold text-brand" href={application.portfolio_url} target="_blank" rel="noreferrer">Portfolio</a> : null}
                  <button type="button" className="font-semibold text-red-600 disabled:text-slate-400" disabled={!['PENDING', 'INTERVIEW'].includes(application.status)} onClick={() => handleWithdraw(application)}>
                    Rút hồ sơ
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="panel px-5 py-8 text-sm text-slate-500">Chưa có hồ sơ ứng tuyển phù hợp.</div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="panel px-5 py-5">
            <h2 className="text-xl font-semibold">Chi tiết hồ sơ</h2>
            {selectedApplication ? (
              <div className="mt-4">
                <p className="font-semibold text-brand-ink">{selectedApplication.job_name}</p>
                <p className="mt-1 text-sm text-slate-500">{selectedApplication.company_name}</p>
                {selectedApplication.cover_note ? (
                  <div className="mt-5">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Cover letter</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{selectedApplication.cover_note}</p>
                  </div>
                ) : null}
                <div className="mt-5 space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Timeline</h3>
                  {(selectedApplication.timeline || []).map((step) => (
                    <div key={step.label} className="flex gap-3 text-sm">
                      <span className={`mt-1 h-3 w-3 rounded-full ${step.status === 'PENDING' ? 'bg-slate-300' : 'bg-brand'}`} />
                      <div>
                        <p className="font-semibold text-brand-ink">{step.label}</p>
                        {step.date ? <p className="text-slate-500">{formatDate(step.date)}</p> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Chọn một hồ sơ để xem chi tiết.</p>
            )}
          </div>

          <div className="panel px-5 py-5">
            <h2 className="text-xl font-semibold">Job gợi ý</h2>
            <div className="mt-4 space-y-3">
              {suggestions.length ? (
                suggestions.map((job) => (
                  <Link key={job.id} className="block rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3" to={`/viec-lam-ket-noi/hoa-sen-job/${job.id}`}>
                    <p className="font-semibold text-brand-ink">{job.job_name}</p>
                    <p className="mt-1 text-sm text-slate-500">{job.company_name}</p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-slate-500">Chưa có gợi ý phù hợp.</p>
              )}
            </div>
          </div>
        </aside>
      </section>
    </PageLayout>
  );
}

export default ApplicantApplicationsPage;
