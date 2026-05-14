import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState';
import PageLayout from '../../components/common/PageLayout';
import { listArticles } from '../../api/content';

function formatDate(value) {
  if (!value) {
    return 'Sắp cập nhật';
  }

  return new Date(value).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function PublicArticleListPage({
  articleType,
  eyebrow,
  title,
  description,
  breadcrumbItems,
  detailBasePath,
  emptyTitle,
  emptyMessage,
}) {
  const [items, setItems] = useState([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadArticles() {
      try {
        const query = `?article_type=${encodeURIComponent(articleType)}`;
        const nextItems = await listArticles(query);
        if (active) {
          setItems(nextItems);
          setFailed(false);
        }
      } catch {
        if (active) {
          setItems([]);
          setFailed(true);
        }
      }
    }

    loadArticles();
    return () => {
      active = false;
    };
  }, [articleType]);

  return (
    <PageLayout
      breadcrumbItems={breadcrumbItems}
      eyebrow={eyebrow}
      title={title}
      description={description}
    >
      {items.length ? (
        <section className="grid gap-5 lg:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="panel flex h-full flex-col px-6 py-6 lg:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-red">{formatDate(item.published_at)}</p>
              <h2 className="mt-3 text-2xl font-semibold text-brand-ink">{item.title}</h2>
              <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">{item.excerpt || 'Nội dung đang được cập nhật.'}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to={`${detailBasePath}/${item.slug}`} className="btn-primary">
                  Xem chi tiết
                </Link>
                {item.external_url ? (
                  <a href={item.external_url} target="_blank" rel="noreferrer noopener" className="btn-secondary">
                    Xem nguồn ngoài
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState
          title={emptyTitle}
          message={failed ? 'Không tải được danh sách bài viết. Vui lòng thử lại sau.' : emptyMessage}
        />
      )}
    </PageLayout>
  );
}

export default PublicArticleListPage;