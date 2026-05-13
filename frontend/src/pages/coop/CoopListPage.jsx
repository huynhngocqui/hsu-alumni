import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listCoopListings } from '../../api/coop';
import { listTags } from '../../api/tags';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import PageLayout from '../../components/common/PageLayout';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatDate';

function CoopListPage() {
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
          listCoopListings(
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
          setError(requestError.message || 'Không thể tải danh sách Co-op.');
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
    return <div className="page-shell"><LoadingState title="Đang tải danh sách Co-op" /></div>;
  }

  if (error) {
    return <div className="page-shell"><ErrorState message={error} /></div>;
  }

  return (
    <PageLayout
      breadcrumbItems={[
        { label: 'Trang chủ', to: '/' },
        { label: 'Dịch vụ Alumni' },
        { label: 'Hoa Sen COOP' },
      ]}
      eyebrow="Dịch vụ Alumni"
      title="Hoa Sen COOP"
      description="Khám phá sản phẩm, dịch vụ và ưu đãi được đăng bởi cộng đồng Alumni. Kết quả có thể lọc theo category tag và tìm kiếm theo từ khóa."
      actions={
        isAuthenticated ? (
          <Link to="/dich-vu-alumni/hoa-sen-coop/dang-moi" className="btn-primary">
            Đăng Co-op mới
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
              placeholder="Tìm theo tên sản phẩm, dịch vụ hoặc doanh nghiệp"
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
                    <Link to={`/dich-vu-alumni/hoa-sen-coop/${listing.id}`}>{listing.name}</Link>
                  </h2>
                  <p className="mt-2 text-sm font-medium text-slate-500">{listing.business_name}</p>
                </div>
                <span className="rounded-full bg-brand-sand px-3 py-1 text-xs font-semibold text-brand">
                  {formatDate(listing.created_at)}
                </span>
              </div>
              <p className="text-sm leading-7 text-slate-600">
                {listing.description || 'Chưa có mô tả chi tiết cho bài Co-op này.'}
              </p>
              <div className="flex flex-wrap gap-2">
                {(listing.category_tags || []).map((tag) => (
                  <span key={tag} className="rounded-full border border-brand/15 px-3 py-1 text-xs font-semibold text-brand-ink">
                    {tag}
                  </span>
                ))}
              </div>
              <Link to={`/dich-vu-alumni/hoa-sen-coop/${listing.id}`} className="btn-secondary mt-auto">
                Xem chi tiết
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState
          title="Chưa có bài Co-op phù hợp"
          message="Hãy thử đổi bộ lọc hoặc quay lại sau khi cộng đồng có thêm bài đăng mới."
        />
      )}
    </PageLayout>
  );
}

export default CoopListPage;
