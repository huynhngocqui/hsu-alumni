import { Link } from 'react-router-dom';
import BrandImage from '../common/BrandImage';
import { CalendarIcon, ClockIcon, LocationIcon } from '../common/icons';
import { formatDateTimeRange } from '../../utils/formatDate';

function EventCard({ item }) {
  const statusTone = item.event_status === 'PAST'
    ? 'bg-slate-100 text-slate-600'
    : 'bg-sky-50 text-sky-700';

  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_38px_rgba(16,35,69,0.08)]">
      <Link to={`/su-kien/${item.slug}`} className="block">
        <div className="relative">
          <BrandImage
            src={item.banner_url}
            alt={item.title}
            className="h-64 w-full object-cover"
            fallback={<div className="h-64 bg-slate-100" />}
          />
          <span className={`absolute left-5 top-5 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${statusTone}`}>
            {item.event_status === 'PAST' ? 'Đã diễn ra' : 'Sắp diễn ra'}
          </span>
        </div>
      </Link>

      <div className="space-y-4 px-6 py-6">
        <h3 className="text-2xl font-semibold leading-tight text-brand-ink">
          <Link to={`/su-kien/${item.slug}`}>{item.title}</Link>
        </h3>

        <div className="space-y-2 text-sm text-slate-500">
          <p className="flex items-start gap-2">
            <CalendarIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{formatDateTimeRange(item.start_date_time, item.end_date_time)}</span>
          </p>
          <p className="flex items-start gap-2">
            <ClockIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{item.event_status === 'PAST' ? 'Sự kiện đã hoàn thành' : 'Đang mở đăng ký'}</span>
          </p>
          <p className="flex items-start gap-2">
            <LocationIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{item.location || 'Đang cập nhật địa điểm'}</span>
          </p>
        </div>

        <p className="text-sm leading-7 text-slate-600">{item.excerpt || 'Nội dung đang được cập nhật.'}</p>

        <Link to={`/su-kien/${item.slug}`} className="inline-flex items-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-panel hover:bg-brand-dark">
          Xem chi tiết sự kiện
        </Link>
      </div>
    </article>
  );
}

export default EventCard;