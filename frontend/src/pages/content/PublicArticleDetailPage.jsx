import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import PageLayout from '../../components/common/PageLayout';
import { getArticleDetail, listArticles } from '../../api/content';

const articleTypeConfig = {
  NEWS: {
    eyebrow: 'Tin tức & Sự kiện',
    listPath: '/tin-tuc-su-kien/tin-tuc',
    listLabel: 'Tin tức',
  },
  EVENT: {
    eyebrow: 'Tin tức & Sự kiện',
    listPath: '/tin-tuc-su-kien/su-kien',
    listLabel: 'Sự kiện',
  },
  WEBINAR: {
    eyebrow: 'Việc làm & Kết nối',
    listPath: '/viec-lam-ket-noi/career-webinars',
    listLabel: 'Career Webinars',
  },
};

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

function PublicArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadArticle() {
      setLoading(true);
      try {
        const nextArticle = await getArticleDetail(slug);
        if (active) {
          setArticle(nextArticle);
          setFailed(false);
          // Load related once we know the type
          try {
            const allOfType = await listArticles({ article_type: nextArticle.article_type, limit: 4 });
            const items = Array.isArray(allOfType) ? allOfType : allOfType?.results ?? [];
            if (active) setRelated(items.filter((a) => a.slug !== slug).slice(0, 3));
          } catch {
            if (active) setRelated([]);
          }
        }
      } catch {
        if (active) {
          setArticle(null);
          setFailed(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadArticle();
    return () => {
      active = false;
    };
  }, [slug]);

  const config = articleTypeConfig[article?.article_type] || {
    eyebrow: 'Tin tức & Sự kiện',
    listPath: '/tin-tuc-su-kien/tin-tuc',
    listLabel: 'Bài viết',
  };

  return (
    <PageLayout
      breadcrumbItems={[
        { label: 'Trang chủ', to: '/' },
        { label: config.eyebrow },
        { label: config.listLabel, to: config.listPath },
        { label: article?.title || 'Chi tiết bài viết' },
      ]}
      eyebrow={config.eyebrow}
      title={article?.title || 'Chi tiết bài viết'}
      description={article ? `Ngày đăng: ${formatDate(article.published_at)}` : 'Đang tải bài viết...'}
      actions={
        article ? (
          <>
            <Link to={config.listPath} className="btn-secondary">
              Quay lại danh sách
            </Link>
            {article.external_url ? (
              <a href={article.external_url} target="_blank" rel="noreferrer noopener" className="btn-primary">
                Xem nguồn ngoài
              </a>
            ) : null}
          </>
        ) : null
      }
    >
      {article ? (
        <>
          <section className="panel px-6 py-8 text-sm leading-8 text-slate-700 lg:px-10">
            <div className="whitespace-pre-line">{article.body || article.excerpt || 'Nội dung đang được cập nhật.'}</div>
          </section>

          {related.length > 0 ? (
            <section className="mt-10">
              <h2 className="text-xl font-semibold text-brand-ink">Bài viết liên quan</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-3">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`${config.listPath}/${rel.slug}`}
                    className="panel block overflow-hidden transition-shadow hover:shadow-lg"
                  >
                    {rel.featured_image_url ? (
                      <img src={rel.featured_image_url} alt={rel.title} className="h-40 w-full object-cover" />
                    ) : (
                      <div className="h-40 bg-slate-100" />
                    )}
                    <div className="px-5 py-5">
                      <h3 className="line-clamp-2 text-base font-semibold text-brand-ink">{rel.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-500">{rel.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : (
        loading ? (
          <LoadingState title="Đang tải bài viết..." />
        ) : (
          <EmptyState
            title="Không tìm thấy bài viết"
            message={failed ? 'Bài viết không tồn tại hoặc chưa được publish.' : 'Đang tải nội dung bài viết...'}
          />
        )
      )}
    </PageLayout>
  );
}

export default PublicArticleDetailPage;