import { useCallback, useEffect, useMemo, useState } from 'react';
import AlumniCard from '../../components/alumni/AlumniCard';
import AlumniFilterBar from '../../components/alumni/AlumniFilterBar';
import Breadcrumb from '../../components/common/Breadcrumb';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { listAlumniPosts } from '../../api/alumni';

const DEFAULT_FILTERS = {
  search: '',
  education_level: '',
  cohort: '',
  field: '',
  major: '',
};

function AlumniCardSkeleton() {
  return (
    <div className="panel overflow-hidden">
      <div className="h-64 animate-pulse bg-slate-200" />
      <div className="space-y-4 px-6 py-6">
        <div className="h-8 w-2/3 animate-pulse rounded-full bg-slate-200" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-200" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-200" />
          <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

function getDistinctValues(items, key) {
  return [...new Set(items.map((item) => item[key]).filter(Boolean))].sort((left, right) => left.localeCompare(right, 'vi'));
}

function AlumniListPage() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const payload = await listAlumniPosts();
      const nextItems = Array.isArray(payload) ? payload : payload?.results ?? [];
      setItems(nextItems);
    } catch (nextError) {
      setItems([]);
      setError(nextError.message || 'Không thể tải danh sách alumni.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const filterOptions = useMemo(() => ({
    education_level: getDistinctValues(items, 'education_level'),
    cohort: getDistinctValues(items, 'cohort'),
    field: getDistinctValues(items, 'field'),
    major: getDistinctValues(items, 'major'),
  }), [items]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    return items.filter((item) => {
      if (normalizedSearch && !item.full_name.toLowerCase().includes(normalizedSearch)) {
        return false;
      }

      if (filters.education_level && item.education_level !== filters.education_level) {
        return false;
      }

      if (filters.cohort && item.cohort !== filters.cohort) {
        return false;
      }

      if (filters.field && item.field !== filters.field) {
        return false;
      }

      if (filters.major && item.major !== filters.major) {
        return false;
      }

      return true;
    });
  }, [filters, items]);

  return (
    <div className="page-shell space-y-8">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Cộng đồng Cựu Sinh viên Hoa Sen' }]} />

      <section className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-brand-ink sm:text-5xl">Cộng đồng Cựu Sinh viên Hoa Sen</h1>
        <p className="max-w-3xl text-base leading-8 text-slate-600">
          Những gương mặt alumni đang tiếp tục tạo dấu ấn trong nhiều lĩnh vực khác nhau. Tìm kiếm theo tên hoặc lọc theo bậc đào tạo, khóa, lĩnh vực và ngành để khám phá câu chuyện phù hợp.
        </p>
      </section>

      <AlumniFilterBar
        filters={filters}
        filterOptions={filterOptions}
        onChange={(updates) => setFilters((current) => ({ ...current, ...updates }))}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      {loading ? (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <AlumniCardSkeleton key={index} />)}
        </section>
      ) : error ? (
        <ErrorState message={error} action={loadItems} />
      ) : filteredItems.length ? (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <AlumniCard key={item.id} item={item} />
          ))}
        </section>
      ) : (
        <EmptyState
          title="Không tìm thấy kết quả"
          message="Thử thay đổi từ khóa hoặc bộ lọc để xem thêm câu chuyện alumni khác."
          action={() => setFilters(DEFAULT_FILTERS)}
          actionLabel="Xóa toàn bộ bộ lọc"
        />
      )}
    </div>
  );
}

export default AlumniListPage;