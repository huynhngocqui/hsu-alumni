import BrandImage from '../common/BrandImage';
import MarkdownContent from '../common/MarkdownContent';

function AlumniArticleContent({ content, galleryImages = [] }) {
  const hasContent = Boolean(content?.trim());
  const hasGallery = Array.isArray(galleryImages) && galleryImages.length > 0;

  return (
    <div className="page-shell pt-8 lg:pt-10">
      <article id="alumni-article-content" className="mx-auto w-full max-w-[780px]">
        {hasContent ? (
          <div className="space-y-6 text-[1rem] leading-8 text-slate-700">
            <MarkdownContent content={content} />
          </div>
        ) : (
          <div className="panel px-6 py-8 text-sm leading-7 text-slate-500">
            Nội dung bài viết đang được cập nhật.
          </div>
        )}

        {hasGallery ? (
          <section className="mt-10 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-red">Hình ảnh nổi bật</p>
              <h2 className="mt-3 text-2xl font-bold text-brand-ink">Khoảnh khắc trong hành trình alumni</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {galleryImages.map((imageUrl, index) => (
                <BrandImage
                  key={`${imageUrl}-${index}`}
                  src={imageUrl}
                  alt={`${index + 1}. ${imageUrl}`}
                  loading="lazy"
                  className="h-64 w-full rounded-[20px] object-cover"
                  fallback={<div className="h-64 w-full rounded-[20px] bg-slate-100" />}
                />
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </div>
  );
}

export default AlumniArticleContent;