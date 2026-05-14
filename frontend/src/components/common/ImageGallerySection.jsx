import BrandImage from './BrandImage';

function ImageGallerySection({
  images = [],
  eyebrow = 'Khoảnh khắc',
  title = 'Thư viện hình ảnh',
  imageAltPrefix = 'Hình ảnh',
}) {
  if (!images.length) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-red">{eyebrow}</p>
        <h2 className="mt-3 text-2xl font-semibold text-brand-ink">{title}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {images.map((image, index) => (
          <div key={`${image}-${index}`} className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-2 shadow-[0_16px_32px_rgba(16,35,69,0.06)]">
            <BrandImage
              src={image}
              alt={`${imageAltPrefix} ${index + 1}`}
              className="h-56 w-full rounded-[18px] object-cover"
              fallback={<div className="h-56 rounded-[18px] bg-slate-100" />}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ImageGallerySection;