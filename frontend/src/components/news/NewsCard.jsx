import { Link } from 'react-router-dom';
import BrandImage from '../common/BrandImage';
import { ArrowRightIcon } from '../common/icons';
import { formatDate } from '../../utils/formatDate';

function NewsCard({ item, compact = false }) {
  return (
    <article className={`overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_38px_rgba(16,35,69,0.08)] ${compact ? '' : 'h-full'}`}>
      <Link to={`/tin-tuc/${item.slug}`} className="block">
        <BrandImage
          src={item.thumbnail_url}
          alt={item.title}
          className={compact ? 'h-52 w-full object-cover' : 'h-64 w-full object-cover'}
          fallback={<div className={compact ? 'h-52 bg-slate-100' : 'h-64 bg-slate-100'} />}
        />
      </Link>

      <div className="flex h-full flex-col px-6 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-brand-sand px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-ink">
            {item.category?.name || 'Tin tức'}
          </span>
          <span className="text-sm text-slate-400">{formatDate(item.published_at)}</span>
        </div>

        <h3 className="mt-4 text-2xl font-semibold leading-tight text-brand-ink">
          <Link to={`/tin-tuc/${item.slug}`}>{item.title}</Link>
        </h3>

        <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">{item.excerpt || 'Nội dung đang được cập nhật.'}</p>

        <Link to={`/tin-tuc/${item.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-ink hover:text-brand">
          <span>Đọc chi tiết</span>
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

export default NewsCard;