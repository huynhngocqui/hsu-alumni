import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import PaginationControls from '../../components/common/PaginationControls';
import LoadingState from '../../components/common/LoadingState';
import EventCard from '../../components/events/EventCard';
import NewsSearchBar from '../../components/news/NewsSearchBar';
import { listEvents } from '../../api/events';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useSeoMetadata } from '../../hooks/useSeoMetadata';

const eventStatusOptions = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'UPCOMING', label: 'Sắp diễn ra' },
  { value: 'PAST', label: 'Đã diễn ra' },
];

function EventListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [payload, setPayload] = useState({ count: 0, page: 1, total_pages: 1, results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const search = searchParams.get('search') || '';
  const eventStatus = searchParams.get('event_status') || 'UPCOMING';
  const page = Number(searchParams.get('page') || '1');
  const debouncedSearch = useDebouncedValue(search, 300);

  useSeoMetadata({
    title: 'Sự kiện Alumni Hoa Sen',
    description: 'Khám phá các sự kiện alumni, chương trình homecoming và webinar kết nối cộng đồng Hoa Sen.',
  });

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    listEvents({ search: debouncedSearch, event_status: eventStatus === 'ALL' ? '' : eventStatus, page, limit: 9 })
      .then((nextPayload) => {
        if (active) {
          setPayload(nextPayload);
        }
      })
      .catch((nextError) => {
        if (active) {
          setPayload({ count: 0, page: 1, total_pages: 1, results: [] });
          setError(nextError.message || 'Không thể tải danh sách sự kiện.');
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
  }, [debouncedSearch, eventStatus, page]);

  const updateSearchParams = (nextValues) => {
    const mergedValues = { search, event_status: eventStatus, page, ...nextValues };
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
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Sự kiện' }]} />

      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand-red">Sự kiện Alumni</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-brand-ink sm:text-5xl">Lịch sự kiện chính thức của cộng đồng cựu sinh viên Hoa Sen</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">Trang sự kiện mới dùng dữ liệu event chuyên biệt với banner, thời gian, địa điểm, CTA đăng ký và gallery hậu kỳ.</p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-[0_16px_32px_rgba(16,35,69,0.06)] lg:min-w-[240px]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Sự kiện hiển thị</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-brand-ink">{payload.count}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">Sự kiện theo bộ lọc thời gian và tìm kiếm hiện tại.</p>
        </div>
      </section>

      <NewsSearchBar
        value={search}
        onChange={(value) => updateSearchParams({ search: value, page: 1 })}
        resultsLabel={`Hiển thị ${payload.results?.length || 0} / ${payload.count} sự kiện`}
      />

      <div className="flex flex-wrap gap-3">
        {eventStatusOptions.map((option) => (
          <button
            key={option.value || 'all'}
            type="button"
            className={eventStatus === option.value ? 'btn-primary' : 'btn-secondary'}
            onClick={() => updateSearchParams({ event_status: option.value, page: 1 })}
          >
            {option.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState title="Đang tải sự kiện" />
      ) : error ? (
        <ErrorState message={error} action={() => updateSearchParams({ page })} />
      ) : !payload.results?.length ? (
        <EmptyState
          title="Chưa có sự kiện phù hợp"
          message="Không tìm thấy sự kiện theo bộ lọc hiện tại. Hãy thử xóa bộ lọc hoặc đổi từ khóa tìm kiếm."
          action={() => setSearchParams(new URLSearchParams())}
          actionLabel="Xóa bộ lọc"
        />
      ) : (
        <section className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {payload.results.map((item) => (
              <EventCard key={item.id} item={item} />
            ))}
          </div>
          <PaginationControls currentPage={payload.page} totalPages={payload.total_pages} onPageChange={(nextPage) => updateSearchParams({ page: nextPage })} />
        </section>
      )}
    </div>
  );
}

export default EventListPage;