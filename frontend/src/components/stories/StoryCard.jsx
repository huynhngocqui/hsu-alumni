import { Link } from 'react-router-dom';
import BrandImage from '../common/BrandImage';

const categoryLabelMap = {
  OUTSTANDING: 'Cựu sinh viên tiêu biểu',
  SUCCESS: 'Câu chuyện thành công',
};

function StoryCard({ item, detailBasePath, compact = false }) {
  const detailPath = `${detailBasePath}/${item.slug}`;

  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_38px_rgba(16,35,69,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(16,35,69,0.12)]">
      <Link to={detailPath} className="block">
        <BrandImage
          src={item.featured_image_url}
          alt={item.title}
          className={compact ? 'h-56 w-full object-cover' : 'h-64 w-full object-cover'}
          fallback={<div className={compact ? 'h-56 bg-slate-100' : 'h-64 bg-slate-100'} />}
        />
      </Link>

      <div className="space-y-4 px-6 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-brand-sand px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-ink">
            {categoryLabelMap[item.story_category] || 'Alumni story'}
          </span>
          <span className="text-sm text-slate-400">{item.alumni_name}</span>
        </div>

        <div>
          <h3 className="text-2xl font-semibold leading-tight text-brand-ink">
            <Link to={detailPath}>{item.title}</Link>
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {item.role_title || 'Cộng đồng Alumni'}
            {item.company_name ? ` · ${item.company_name}` : ''}
          </p>
        </div>

        <p className="text-sm leading-7 text-slate-600">{item.excerpt || item.body || 'Nội dung đang được cập nhật.'}</p>

        <Link to={detailPath} className="inline-flex items-center text-sm font-semibold text-brand-ink hover:text-brand">
          Xem câu chuyện
        </Link>
      </div>
    </article>
  );
}

export default StoryCard;