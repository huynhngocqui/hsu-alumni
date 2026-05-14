import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import PaginationControls from '../../components/common/PaginationControls';
import NewsCard from '../../components/news/NewsCard';
import NewsCategoryTabs from '../../components/news/NewsCategoryTabs';
import NewsSearchBar from '../../components/news/NewsSearchBar';
import { listNewsCategories, listNewsPosts } from '../../api/news';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useSeoMetadata } from '../../hooks/useSeoMetadata';

function NewsListSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={`news-skeleton-${index}`} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_38px_rgba(16,35,69,0.06)]">
          <div className="h-52 animate-pulse bg-slate-100" />
          <div className="space-y-4 px-6 py-6">
            <div className="h-4 w-28 animate-pulse rounded-full bg-slate-100" />
            <div className="h-7 w-5/6 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-24 animate-pulse rounded-[20px] bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function NewsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [payload, setPayload] = useState({ count: 0, page: 1, total_pages: 1, results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const search = searchParams.get('search') || '';
  const activeCategory = searchParams.get('category') || '';
  const page = Number(searchParams.get('page') || '1');
  const debouncedSearch = useDebouncedValue(search, 300);

  useSeoMetadata({
    title: 'Tin tức Alumni Hoa Sen',
    description: 'Tin tức mới nhất về hoạt động HSU, hoạt động alumni, hợp tác doanh nghiệp và kết nối cộng đồng.',
  });

  useEffect(() => {
    let active = true;

    listNewsCategories()
      .then((items) => {
        if (active) {
          setCategories(Array.isArray(items) ? items : []);
        }
      })
      .catch(() => {
        if (active) {
          setCategories([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    listNewsPosts({ search: debouncedSearch, category: activeCategory, page, limit: 9 })
      .then((nextPayload) => {
        if (active) {
          setPayload(nextPayload);
        }
      })
      .catch((nextError) => {
        if (active) {
          setPayload({ count: 0, page: 1, total_pages: 1, results: [] });
          setError(nextError.message || 'Không thể tải danh sách tin tức.');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [activeCategory, debouncedSearch, page]);

  const items = payload.results || [];
  const featuredItem = items[0];
  const remainingItems = items.slice(1);

  const updateSearchParams = (nextValues) => {
    const mergedValues = {
      search,
      category: activeCategory,
      page,
      ...nextValues,
    };

    const nextParams = new URLSearchParams();
    Object.entries(mergedValues).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && String(value) !== '1') {
        nextParams.set(key, String(value));
      }
    });
    setSearchParams(nextParams);
  };

  return (
    <div className="page-shell">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Tin tức' }]} />

      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand-red">Tin tức Alumni</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-brand-ink sm:text-5xl">Cập nhật mới nhất từ cộng đồng cựu sinh viên và hệ sinh thái Hoa Sen</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">Trang tin tức mới tách riêng khỏi CMS bài viết generic để hỗ trợ phân loại rõ ràng, tối ưu SEO và tạo một trải nghiệm đọc giàu hình ảnh hơn.</p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-[0_16px_32px_rgba(16,35,69,0.06)] lg:min-w-[240px]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Tổng quan</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-brand-ink">{payload.count}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">Bài viết đã xuất bản theo bộ lọc hiện tại.</p>
        </div>
      </section>

      <NewsSearchBar
        value={search}
        onChange={(value) => updateSearchParams({ search: value, page: 1 })}
        resultsLabel={`Hiển thị ${items.length} / ${payload.count} bài viết`}
      />

      <NewsCategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onChange={(value) => updateSearchParams({ category: value, page: 1 })}
      />

      {loading ? (
        <NewsListSkeleton />
      ) : error ? (
        <ErrorState message={error} action={() => updateSearchParams({ page })} />
      ) : !items.length ? (
        <EmptyState
          title="Chưa có bài viết phù hợp"
          message="Không tìm thấy bài viết theo bộ lọc hiện tại. Hãy thử đổi từ khóa hoặc bỏ chọn danh mục."
          action={() => setSearchParams(new URLSearchParams())}
          actionLabel="Xóa bộ lọc"
        />
      ) : (
        <section className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <NewsCard key={item.id} item={item} compact />
            ))}
          </div>

          <PaginationControls
            currentPage={payload.page}
            totalPages={payload.total_pages}
            onPageChange={(nextPage) => updateSearchParams({ page: nextPage })}
          />
        </section>
      )}
    </div>
  );
}

export default NewsListPage;