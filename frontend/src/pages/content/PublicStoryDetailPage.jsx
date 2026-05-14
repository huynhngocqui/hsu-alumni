import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import BrandImage from '../../components/common/BrandImage';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import MarkdownContent from '../../components/common/MarkdownContent';
import { getPublicStoryDetail, listPublicStories } from '../../api/content';
import StoryCard from '../../components/stories/StoryCard';
import { useSeoMetadata } from '../../hooks/useSeoMetadata';
import { formatDate } from '../../utils/formatDate';

const storyConfigByCategory = {
  OUTSTANDING: {
    eyebrow: 'Cộng đồng Alumni',
    listLabel: 'Cựu sinh viên tiêu biểu',
    listPath: '/cong-dong-alumni/cuu-sinh-vien-tieu-bieu',
  },
  SUCCESS: {
    eyebrow: 'Cộng đồng Alumni',
    listLabel: 'Câu chuyện thành công',
    listPath: '/cong-dong-alumni/cau-chuyen-thanh-cong',
  },
};

function PublicStoryDetailPage() {
  const { slug } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadStory() {
      setLoading(true);
      try {
        const nextStory = await getPublicStoryDetail(slug);
        if (active) {
          setStory(nextStory);
          setFailed(false);
          // Load related of same category
          try {
            const items = await listPublicStories(nextStory.story_category);
            const allItems = Array.isArray(items) ? items : items?.results ?? [];
            if (active) setRelated(allItems.filter((s) => s.slug !== slug).slice(0, 3));
          } catch {
            if (active) setRelated([]);
          }
        }
      } catch {
        if (active) {
          setStory(null);
          setFailed(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStory();
    return () => {
      active = false;
    };
  }, [slug]);

  const config = storyConfigByCategory[story?.story_category] || {
    eyebrow: 'Cộng đồng Alumni',
    listLabel: 'Alumni stories',
    listPath: '/cong-dong-alumni/cau-chuyen-thanh-cong',
  };

  useSeoMetadata({
    title: story?.title,
    description: story?.excerpt || story?.alumni_name,
    image: story?.featured_image_url,
  });

  if (loading) {
    return <div className="page-shell"><LoadingState title="Đang tải câu chuyện..." /></div>;
  }

  if (!story) {
    return (
      <div className="page-shell">
        <EmptyState
          title="Không tìm thấy alumni story"
          message={failed ? 'Nội dung không tồn tại hoặc chưa được publish.' : 'Đang tải nội dung câu chuyện...'}
        />
      </div>
    );
  }

  return (
    <div className="page-shell gap-8">
      <Breadcrumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Cộng đồng Alumni' },
          { label: config.listLabel, to: config.listPath },
          { label: story.title },
        ]}
      />

      <header className="space-y-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-red">{config.listLabel}</p>
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-brand-ink sm:text-5xl">{story.title}</h1>
        <p className="text-sm text-slate-500">
          {formatDate(story.published_at)}
          {story.alumni_name ? ` · ${story.alumni_name}` : ''}
          {story.role_title ? ` · ${story.role_title}` : ''}
          {story.company_name ? ` · ${story.company_name}` : ''}
        </p>
        {story.excerpt ? <p className="mx-auto max-w-3xl text-base leading-8 text-slate-600">{story.excerpt}</p> : null}
        <div className="flex justify-center">
          <Link to={config.listPath} className="btn-secondary">Quay lại danh sách</Link>
        </div>
      </header>

      <article className="rounded-[30px] border border-slate-200 bg-white px-6 py-8 shadow-[0_18px_36px_rgba(16,35,69,0.06)] lg:px-10 lg:py-10">
        {story.featured_image_url ? (
          <div className="mb-8 overflow-hidden rounded-[28px]">
            <BrandImage
              src={story.featured_image_url}
              alt={story.title}
              className="h-[260px] w-full object-cover sm:h-[340px] lg:h-[460px]"
              fallback={<div className="h-[260px] bg-slate-100 sm:h-[340px] lg:h-[460px]" />}
            />
          </div>
        ) : null}

        <div className="mx-auto max-w-4xl">
          <MarkdownContent content={story.body || story.excerpt || 'Nội dung đang được cập nhật.'} />
        </div>
      </article>

      {related.length > 0 ? (
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-red">Bài viết liên quan</p>
              <h2 className="mt-2 text-2xl font-semibold text-brand-ink">Câu chuyện cùng chuyên mục</h2>
            </div>
            <Link to={config.listPath} className="text-sm font-semibold text-brand-ink hover:text-brand">Xem tất cả</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {related.map((rel) => (
              <StoryCard key={rel.id} item={rel} detailBasePath={config.listPath} compact />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default PublicStoryDetailPage;