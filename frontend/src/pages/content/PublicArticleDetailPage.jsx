import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState';
import PageLayout from '../../components/common/PageLayout';
import { getArticleDetail } from '../../api/content';

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
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadArticle() {
      try {
        const nextArticle = await getArticleDetail(slug);
        if (active) {
          setArticle(nextArticle);
          setFailed(false);
        }
      } catch {
        if (active) {
          setArticle(null);
          setFailed(true);
        }
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
        <section className="panel px-6 py-8 text-sm leading-8 text-slate-700 lg:px-10">
          <div className="whitespace-pre-line">{article.body || article.excerpt || 'Nội dung đang được cập nhật.'}</div>
        </section>
      ) : (
        <EmptyState
          title="Không tìm thấy bài viết"
          message={failed ? 'Bài viết không tồn tại hoặc chưa được publish.' : 'Đang tải nội dung bài viết...'}
        />
      )}
    </PageLayout>
  );
}

export default PublicArticleDetailPage;