import BrandImage from '../common/BrandImage';
import { CalendarIcon, ClockIcon, ExternalLinkIcon, LocationIcon } from '../common/icons';
import { formatDateTimeRange, formatLongDate, formatTime } from '../../utils/formatDate';

function EventHero({ event }) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_48px_rgba(16,35,69,0.1)]">
      <div className="grid gap-0 xl:grid-cols-[1.15fr_0.85fr]">
        <BrandImage
          src={event.banner_url}
          alt={event.title}
          className="h-full min-h-[340px] w-full object-cover"
          fallback={<div className="min-h-[340px] bg-slate-100" />}
        />

        <div className="flex flex-col justify-between bg-[linear-gradient(180deg,#0b4da2_0%,#08214a_100%)] px-6 py-8 text-white sm:px-8 lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">{event.event_status === 'PAST' ? 'Sự kiện đã diễn ra' : 'Sự kiện nổi bật'}</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">{event.title}</h1>
            <p className="mt-5 text-sm leading-7 text-white/80">{event.excerpt || 'Nội dung sự kiện đang được cập nhật.'}</p>
          </div>

          <div className="mt-8 space-y-3 text-sm text-white/82">
            <p className="flex items-start gap-3">
              <CalendarIcon className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{formatLongDate(event.start_date_time)}</span>
            </p>
            <p className="flex items-start gap-3">
              <ClockIcon className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{formatDateTimeRange(event.start_date_time, event.end_date_time)} ({formatTime(event.start_date_time)} - {formatTime(event.end_date_time)})</span>
            </p>
            <p className="flex items-start gap-3">
              <LocationIcon className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{event.location || 'Đang cập nhật địa điểm'}</span>
            </p>
          </div>

          {event.registration_url ? (
            <div className="mt-8">
              <a href={event.registration_url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-ink">
                <span>Đăng ký tham gia</span>
                <ExternalLinkIcon className="h-4 w-4" />
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default EventHero;