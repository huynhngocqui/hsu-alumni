import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  closeOwnerCoopListing,
  deleteOwnerCoopListing,
  duplicateOwnerCoopListing,
  listOwnerCoopListings,
} from '../../api/coop';
import {
  closeOwnerJobListing,
  deleteOwnerJobListing,
  duplicateOwnerJobListing,
  listJobApplications,
  listOwnerJobListings,
  updateOwnerJobListing,
} from '../../api/jobs';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import PageLayout from '../../components/common/PageLayout';
import { formatDate } from '../../utils/formatDate';

const statusLabels = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  CLOSED: 'Closed',
  ARCHIVED: 'Archived',
};

function buildQuery({ search, status, type }) {
  const params = new URLSearchParams({
    ...(search ? { search } : {}),
    ...(status ? { status } : {}),
    ...(type && type !== 'all' ? { type } : {}),
  }).toString();
  return params ? `?${params}` : '';
}

function normalizePost(item, type) {
  return {
    ...item,
    type,
    title: type === 'job' ? item.job_name : item.name,
    subtitle: type === 'job' ? `${item.company_name} · ${item.job_position}` : item.business_name,
    detailPath:
      type === 'job'
        ? `/viec-lam-ket-noi/hoa-sen-job/${item.id}`
        : `/dich-vu-alumni/hoa-sen-coop/${item.id}`,
  };
}

function OwnerPostManagementPage() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '', type: 'all' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const loadPosts = async () => {
    const query = buildQuery(filters);
    const [jobResponse, coopResponse] = await Promise.all([
      filters.type === 'coop' ? Promise.resolve([]) : listOwnerJobListings(query),
      filters.type === 'job' ? Promise.resolve([]) : listOwnerCoopListings(query),
    ]);
    const nextPosts = [
      ...jobResponse.map((item) => normalizePost(item, 'job')),
      ...coopResponse.map((item) => normalizePost(item, 'coop')),
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setPosts(nextPosts);
    if (selectedPost) {
      setSelectedPost(nextPosts.find((item) => item.type === selectedPost.type && item.id === selectedPost.id) || null);
    }
  };

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        setLoading(true);
        setActionError('');
        await loadPosts();
        if (active) {
          setError('');
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'Không thể tải danh sách bài đăng.');
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
  }, [filters.search, filters.status, filters.type]);

  useEffect(() => {
    let active = true;
    async function loadApplications() {
      if (!selectedPost || selectedPost.type !== 'job') {
        setApplications([]);
        return;
      }
      try {
        const response = await listJobApplications(selectedPost.id);
        if (active) {
          setApplications(response);
        }
      } catch {
        if (active) {
          setApplications([]);
        }
      }
    }
    loadApplications();
    return () => {
      active = false;
    };
  }, [selectedPost?.id, selectedPost?.type]);

  const stats = useMemo(() => {
    const openJobs = posts.filter((item) => item.type === 'job' && item.status === 'PUBLISHED').length;
    const totalApplicants = posts.reduce((sum, item) => sum + (item.applications_count || 0), 0);
    const featuredPost = [...posts].sort(
      (a, b) => (b.applications_count || 0) - (a.applications_count || 0) || (b.views_count || 0) - (a.views_count || 0),
    )[0];
    return { openJobs, totalApplicants, featuredPost };
  }, [posts]);

  const runAction = async (post, action) => {
    try {
      setActionError('');
      if (action === 'close') {
        await (post.type === 'job' ? closeOwnerJobListing(post.id) : closeOwnerCoopListing(post.id));
      }
      if (action === 'delete') {
        await (post.type === 'job' ? deleteOwnerJobListing(post.id) : deleteOwnerCoopListing(post.id));
      }
      if (action === 'duplicate') {
        await (post.type === 'job' ? duplicateOwnerJobListing(post.id) : duplicateOwnerCoopListing(post.id));
      }
      await loadPosts();
    } catch (requestError) {
      setActionError(requestError.message || 'Không thể thực hiện thao tác.');
    }
  };

  const quickEditDeadline = async (post) => {
    const nextDeadline = window.prompt('Nhập hạn ứng tuyển theo định dạng YYYY-MM-DD', post.application_deadline || '');
    if (nextDeadline == null || post.type !== 'job') {
      return;
    }
    try {
      await updateOwnerJobListing(post.id, { application_deadline: nextDeadline || null });
      await loadPosts();
    } catch (requestError) {
      setActionError(requestError.message || 'Không thể cập nhật bài đăng.');
    }
  };

  if (loading) {
    return <div className="page-shell"><LoadingState title="Đang tải trang quản lý bài đăng" /></div>;
  }

  if (error) {
    return <div className="page-shell"><ErrorState message={error} /></div>;
  }

  return (
    <PageLayout
      breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Dashboard', to: '/dashboard' }, { label: 'Quản lý bài đăng' }]}
      eyebrow="Owner / Company"
      title="Quản lý bài đăng"
      description="Theo dõi job và Co-op đã đăng, xử lý ứng viên, đóng hoặc nhân bản bài đăng khi cần."
    >
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="panel px-5 py-5">
          <p className="text-sm font-semibold text-slate-500">Job đang mở</p>
          <p className="mt-2 text-3xl font-semibold text-brand-ink">{stats.openJobs}</p>
        </div>
        <div className="panel px-5 py-5">
          <p className="text-sm font-semibold text-slate-500">Tổng applicant</p>
          <p className="mt-2 text-3xl font-semibold text-brand-ink">{stats.totalApplicants}</p>
        </div>
        <div className="panel px-5 py-5">
          <p className="text-sm font-semibold text-slate-500">Bài đăng nổi bật</p>
          <p className="mt-2 truncate text-lg font-semibold text-brand-ink">{stats.featuredPost?.title || 'Chưa có dữ liệu'}</p>
        </div>
      </section>

      <section className="panel px-5 py-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
          <input
            className="input-field"
            placeholder="Tìm theo tiêu đề, công ty, vị trí"
            value={filters.search}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
          />
          <select className="input-field" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
            <option value="">Tất cả trạng thái</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="CLOSED">Closed</option>
          </select>
          <select className="input-field" value={filters.type} onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value }))}>
            <option value="all">Tất cả loại</option>
            <option value="job">Job</option>
            <option value="coop">Co-op</option>
          </select>
        </div>
        {actionError ? <p className="mt-3 text-sm text-red-600">{actionError}</p> : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Bài đăng</th>
                  <th className="px-5 py-3">Loại</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3">Applicant</th>
                  <th className="px-5 py-3">Hạn / View</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <tr key={`${post.type}-${post.id}`} className="align-top">
                    <td className="px-5 py-4">
                      <button type="button" className="text-left font-semibold text-brand-ink" onClick={() => setSelectedPost(post)}>
                        {post.title}
                      </button>
                      <p className="mt-1 text-xs text-slate-500">{post.subtitle}</p>
                      <p className="mt-1 text-xs text-slate-400">{formatDate(post.created_at)}</p>
                    </td>
                    <td className="px-5 py-4">{post.type === 'job' ? 'Job' : 'Co-op'}</td>
                    <td className="px-5 py-4">{statusLabels[post.status] || post.status}</td>
                    <td className="px-5 py-4">{post.applications_count || 0}</td>
                    <td className="px-5 py-4">
                      <p>{post.application_deadline || 'Không có hạn'}</p>
                      <p className="text-xs text-slate-500">{post.views_count || 0} lượt xem</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link className="text-sm font-semibold text-brand" to={post.detailPath}>Xem</Link>
                        {post.type === 'job' ? (
                          <button type="button" className="text-sm font-semibold text-brand" onClick={() => quickEditDeadline(post)}>Sửa</button>
                        ) : null}
                        <button type="button" className="text-sm font-semibold text-brand" onClick={() => runAction(post, 'close')}>Đóng</button>
                        <button type="button" className="text-sm font-semibold text-brand" onClick={() => runAction(post, 'duplicate')}>Duplicate</button>
                        <button type="button" className="text-sm font-semibold text-red-600" onClick={() => runAction(post, 'delete')}>Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="panel px-5 py-5">
          <h2 className="text-xl font-semibold">Chi tiết bài đăng</h2>
          {selectedPost ? (
            <div className="mt-4">
              <p className="font-semibold text-brand-ink">{selectedPost.title}</p>
              <p className="mt-1 text-sm text-slate-500">{selectedPost.subtitle}</p>
              <div className="mt-5 space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Applicant</h3>
                {selectedPost.type !== 'job' ? (
                  <p className="text-sm text-slate-500">Co-op hiện không có luồng applicant.</p>
                ) : applications.length ? (
                  applications.map((application) => (
                    <article key={application.id} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <p className="font-semibold">{application.applicant_name}</p>
                      <p className="text-sm text-slate-500">{application.applicant_email}</p>
                      <p className="mt-2 text-xs font-semibold text-brand">{statusLabels[application.status] || application.status || 'Pending'}</p>
                      {application.cv_file ? <a className="mt-2 inline-block text-sm font-semibold text-brand" href={application.cv_file} target="_blank" rel="noreferrer">Xem CV</a> : null}
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Chưa có applicant.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">Chọn một bài đăng để xem applicant và trạng thái xử lý.</p>
          )}
        </aside>
      </section>
    </PageLayout>
  );
}

export default OwnerPostManagementPage;
