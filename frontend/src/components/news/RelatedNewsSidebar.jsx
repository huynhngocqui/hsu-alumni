import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';

function RelatedNewsSidebar({ categories = [], items = [] }) {
  return (
    <aside className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-[0_18px_36px_rgba(16,35,69,0.06)]">
        <h2 className="text-lg font-semibold text-brand-ink">Danh mục nổi bật</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link key={category.id} to={`/tin-tuc?category=${category.slug}`} className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-brand-sand hover:text-brand-ink">
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-[0_18px_36px_rgba(16,35,69,0.06)]">
        <h2 className="text-lg font-semibold text-brand-ink">Tin liên quan</h2>
        <div className="mt-4 space-y-4">
          {items.length ? items.map((item) => (
            <Link key={item.id} to={`/tin-tuc/${item.slug}`} className="block rounded-[22px] border border-slate-100 px-4 py-4 transition hover:border-brand/20 hover:bg-brand-sand/45">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-red">{formatDate(item.published_at)}</p>
              <h3 className="mt-3 text-base font-semibold leading-7 text-brand-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.excerpt || 'Nội dung đang được cập nhật.'}</p>
            </Link>
          )) : (
            <p className="text-sm leading-6 text-slate-500">Chưa có bài viết liên quan trong cùng nhóm nội dung.</p>
          )}
        </div>
      </section>
    </aside>
  );
}

export default RelatedNewsSidebar;