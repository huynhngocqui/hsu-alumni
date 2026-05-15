import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import BrandImage from '../../components/common/BrandImage';
import ImageGallerySection from '../../components/common/ImageGallerySection';
import MarkdownContent from '../../components/common/MarkdownContent';
import RelatedNewsSidebar from '../../components/news/RelatedNewsSidebar';
import { getNewsPostDetail } from '../../api/news';
import { useSeoMetadata } from '../../hooks/useSeoMetadata';
import { formatDate } from '../../utils/formatDate';

function NewsDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lang, setLang] = useState('vi');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    getNewsPostDetail(slug)
      .then((payload) => {
        if (active) {
          setPost(payload);
          setLang('vi');
        }
      })
      .catch((nextError) => {
        if (active) {
          setPost(null);
          setError(nextError.message || 'Không thể tải bài viết tin tức.');
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
    title: post?.seo_title || post?.title,
    description: post?.seo_description || post?.excerpt,
    image: post?.og_image_url || post?.thumbnail_url,
  });

  const articleContent = useMemo(() => {
    if (!post) {
      return '';
    }

    if (lang === 'en' && post.content_en?.trim()) {
      return post.content_en;
    }

    return post.content_vi;
  }, [lang, post]);

  if (loading) {
    return <div className="page-shell"><LoadingState title="Đang tải bài viết tin tức" /></div>;
  }

  if (!post) {
    return (
      <div className="page-shell">
        <EmptyState title="Không tìm thấy bài viết" message={error || 'Bài viết không tồn tại hoặc chưa được xuất bản.'} action={() => window.history.back()} actionLabel="Quay lại" />
      </div>
    );
  }

  return (
    <div className="page-shell gap-8">
      <Breadcrumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Tin tức', to: '/tin-tuc' },
          { label: post.title },
        ]}
      />

      <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_48px_rgba(16,35,69,0.1)]">
        <BrandImage
          src={post.thumbnail_url}
          alt={post.title}
          className="h-[280px] w-full object-cover sm:h-[360px] lg:h-[420px]"
          fallback={<div className="h-[280px] bg-slate-100 sm:h-[360px] lg:h-[420px]" />}
        />
        <div className="space-y-5 px-6 py-8 lg:px-10 lg:py-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand-sand px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-ink">{post.category?.name || 'Tin tức'}</span>
            <span className="text-sm text-slate-400">{formatDate(post.published_at)}</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-ink sm:text-5xl">{post.title}</h1>
          <p className="max-w-4xl text-base leading-8 text-slate-600">{post.excerpt || 'Nội dung đang được cập nhật.'}</p>

          <div className="flex flex-wrap gap-3">
            <Link to="/tin-tuc" className="btn-secondary">Quay lại danh sách</Link>
            {post.content_en?.trim() ? (
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
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <article className="rounded-[30px] border border-slate-200 bg-white px-6 py-8 shadow-[0_18px_36px_rgba(16,35,69,0.06)] lg:px-10 lg:py-10">
          <MarkdownContent content={articleContent} />
        </article>

        <RelatedNewsSidebar categories={post.related_categories || []} items={post.related_news || []} />
      </section>

      {/* <ImageGallerySection
        images={post.gallery_images || []}
        eyebrow="Gallery ảnh"
        title="Hình ảnh trong bài viết"
        imageAltPrefix="Hình ảnh tin tức"
      /> */}
    </div>
  );
}

export default NewsDetailPage;