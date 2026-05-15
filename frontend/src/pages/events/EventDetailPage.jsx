import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import EventGallery from '../../components/events/EventGallery';
import EventHero from '../../components/events/EventHero';
import EventCard from '../../components/events/EventCard';
import MarkdownContent from '../../components/common/MarkdownContent';
import { getEventDetail } from '../../api/events';
import { useSeoMetadata } from '../../hooks/useSeoMetadata';

function EventDetailPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lang, setLang] = useState('vi');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    getEventDetail(slug)
      .then((payload) => {
        if (active) {
          setEvent(payload);
          setLang('vi');
        }
      })
      .catch((nextError) => {
        if (active) {
          setEvent(null);
          setError(nextError.message || 'Không thể tải chi tiết sự kiện.');
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
  }, [slug]);

  useSeoMetadata({
    title: event?.seo_title || event?.title,
    description: event?.seo_description || event?.excerpt,
    image: event?.og_image_url || event?.banner_url,
  });

  const content = useMemo(() => {
    if (!event) {
      return '';
    }

    if (lang === 'en' && event.content_en?.trim()) {
      return event.content_en;
    }

    return event.content_vi;
  }, [event, lang]);

  if (loading) {
    return <div className="page-shell"><LoadingState title="Đang tải sự kiện" /></div>;
  }

  if (!event) {
    return (
      <div className="page-shell">
        <EmptyState title="Không tìm thấy sự kiện" message={error || 'Sự kiện không tồn tại hoặc chưa được xuất bản.'} action={() => window.history.back()} actionLabel="Quay lại" />
      </div>
    );
  }

  return (
    <div className="page-shell gap-8">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Sự kiện', to: '/su-kien' }, { label: event.title }]} />

      <div className="flex flex-wrap items-center gap-3">
        <Link to="/su-kien" className="btn-secondary">Quay lại danh sách sự kiện</Link>
        {event.content_en?.trim() ? (
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-sm font-semibold">
            <button type="button" className={lang === 'vi' ? 'rounded-full bg-brand px-4 py-2 text-white' : 'rounded-full px-4 py-2 text-slate-500'} onClick={() => setLang('vi')}>
              VI
            </button>
            <button type="button" className={lang === 'en' ? 'rounded-full bg-brand px-4 py-2 text-white' : 'rounded-full px-4 py-2 text-slate-500'} onClick={() => setLang('en')}>
              EN
            </button>
          </div>
        ) : null}
      </div>

      <EventHero event={event} />

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <article className="rounded-[30px] border border-slate-200 bg-white px-6 py-8 shadow-[0_18px_36px_rgba(16,35,69,0.06)] lg:px-10 lg:py-10">
          <MarkdownContent content={content} />
        </article>

        <aside className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-[0_18px_36px_rgba(16,35,69,0.06)]">
            <h2 className="text-lg font-semibold text-brand-ink">Sự kiện liên quan</h2>
            <div className="mt-4 space-y-4">
              {event.related_events?.length ? event.related_events.map((item) => (
                <EventCard key={item.id} item={item} />
              )) : (
                <p className="text-sm leading-6 text-slate-500">Chưa có sự kiện liên quan phù hợp theo nhóm trạng thái hiện tại.</p>
              )}
            </div>
          </section>
        </aside>
      </section>

      {/* <EventGallery images={event.gallery_images || []} /> */}
    </div>
  );
}

export default EventDetailPage;