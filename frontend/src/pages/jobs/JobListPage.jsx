import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listJobListings } from '../../api/jobs';
import { listTags } from '../../api/tags';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import PageLayout from '../../components/common/PageLayout';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatDate';

function JobListPage() {
  const { isAuthenticated } = useAuth();
  const [listings, setListings] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        const [listingResponse, tagResponse] = await Promise.all([
          listJobListings(
            `?${new URLSearchParams({
              ...(search ? { search } : {}),
              ...(selectedTag ? { tag: selectedTag } : {}),
            }).toString()}`,
          ),
          listTags(),
        ]);

        if (active) {
          setListings(Array.isArray(listingResponse) ? listingResponse : listingResponse.results || []);
          setTags(tagResponse);
          setError('');
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'Không thể tải danh sách việc làm.');
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
  }, [search, selectedTag]);

  const activeTagLabel = useMemo(
    () => tags.find((item) => item.name === selectedTag)?.name || '',
    [selectedTag, tags],
  );

  const handleSearch = (event) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };

  if (loading) {
    return <div className="page-shell"><LoadingState title="Đang tải tin tuyển dụng" /></div>;
  }

  if (error) {
    return <div className="page-shell"><ErrorState message={error} /></div>;
  }

  return (
    <PageLayout
      breadcrumbItems={[
        { label: 'Trang chủ', to: '/' },
        { label: 'Việc làm & Kết nối' },
        { label: 'Hoa Sen Job' },
      ]}
      eyebrow="Việc làm & Kết nối"
      title="Hoa Sen Job"
      description="Cổng việc làm kết nối doanh nghiệp Alumni với sinh viên và cựu sinh viên. Tìm kiếm theo tên vị trí, công ty hoặc category tag."
      actions={
        isAuthenticated ? (
          <Link to="/viec-lam-ket-noi/dang-tin-tuyen-dung" className="btn-primary">
            Đăng tin tuyển dụng
          </Link>
        ) : null
      }
      panelContent={
        <>
          <form className="flex flex-col gap-4 lg:flex-row" onSubmit={handleSearch}>
            <input
              className="input-field"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Tìm theo tên công việc, vị trí hoặc doanh nghiệp"
            />
            <button type="submit" className="btn-primary lg:min-w-40">
              Tìm kiếm
            </button>
          </form>

          {tags.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold ${!selectedTag ? 'bg-brand text-white' : 'bg-brand-sand text-brand'}`}
                onClick={() => setSelectedTag('')}
              >
                Tất cả
              </button>
              {tags.map((tag) => {
                const active = selectedTag === tag.name;
                return (
                  <button
                    key={tag.id}
                    type="button"
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${active ? 'bg-brand text-white' : 'bg-brand-sand text-brand'}`}
                    onClick={() => setSelectedTag(tag.name)}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          ) : null}
        </>
      }
    >
      {(search || activeTagLabel) && (
        <div className="text-sm text-slate-500">
          Bộ lọc hiện tại: {search ? `từ khóa "${search}"` : 'không có từ khóa'}
          {activeTagLabel ? `, tag "${activeTagLabel}"` : ''}
        </div>
      )}

      {listings.length ? (
        <section className="grid gap-6 lg:grid-cols-2">
          {listings.map((listing) => (
            <article key={listing.id} className="panel flex flex-col gap-4 px-6 py-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">
                    <Link to={`/viec-lam-ket-noi/hoa-sen-job/${listing.id}`}>{listing.job_name}</Link>
                  </h2>
                  <p className="mt-2 text-sm font-medium text-slate-500">
                    {listing.job_position} • {listing.company_name}
                  </p>
                  {[listing.employment_type, listing.work_location].filter(Boolean).length ? (
                    <p className="mt-1 text-sm text-slate-500">
                      {[listing.employment_type, listing.work_location].filter(Boolean).join(' • ')}
                    </p>
                  ) : null}
                </div>
                <span className="rounded-full bg-brand-sand px-3 py-1 text-xs font-semibold text-brand">
                  {formatDate(listing.created_at)}
                </span>
              </div>
              <p className="text-sm leading-7 text-slate-600">
                {listing.job_description || 'Chưa có mô tả chi tiết cho vị trí này.'}
              </p>
              <div className="flex flex-wrap gap-2">
                {(listing.category_tags || []).map((tag) => (
                  <span key={tag} className="rounded-full border border-brand/15 px-3 py-1 text-xs font-semibold text-brand-ink">
                    {tag}
                  </span>
                ))}
              </div>
              <Link to={`/viec-lam-ket-noi/hoa-sen-job/${listing.id}`} className="btn-secondary mt-auto">
                Xem chi tiết
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState
          title="Chưa có tin tuyển dụng phù hợp"
          message="Hãy thử đổi từ khóa, thay tag lọc hoặc quay lại sau khi có bài đăng mới."
        />
      )}
    </PageLayout>
  );
}

export default JobListPage;
