import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createAdminNewsPost, updateAdminNewsPost } from '../../api/admin';
import { normalizeMarkdownMediaUrls, resolveMediaUrl } from '../../utils/media';
import ImageUploadField from '../common/ImageUploadField';
import RichTextEditor from './RichTextEditor';

function toDateTimeLocal(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

function buildDefaultValues(item) {
  return {
    title: item?.title || '',
    slug: item?.slug || '',
    category_id: item?.category?.id ? String(item.category.id) : '',
    excerpt: item?.excerpt || '',
    thumbnail_url: item?.thumbnail_url || '',
    content_vi: item?.content_vi || '',
    content_en: item?.content_en || '',
    status: item?.status || 'DRAFT',
    is_featured: Boolean(item?.is_featured),
    sort_order: item?.sort_order ?? 0,
    seo_title: item?.seo_title || '',
    seo_description: item?.seo_description || '',
    og_image_url: item?.og_image_url || '',
    published_at: toDateTimeLocal(item?.published_at),
  };
}

function NewsForm({ initial, categories = [], onSaved, onCancel }) {
  const [galleryImages, setGalleryImages] = useState(initial?.gallery_images || []);
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: buildDefaultValues(initial) });

  useEffect(() => {
    reset(buildDefaultValues(initial));
    setGalleryImages(initial?.gallery_images || []);
    setFormError('');
  }, [initial, reset]);

  const thumbnailUrl = watch('thumbnail_url');
  const ogImageUrl = watch('og_image_url');
  const contentVi = watch('content_vi');
  const contentEn = watch('content_en');

  const onSubmit = handleSubmit(async (values) => {
    try {
      setFormError('');
      const payload = {
        ...values,
        category_id: Number(values.category_id),
        thumbnail_url: resolveMediaUrl(values.thumbnail_url),
        og_image_url: resolveMediaUrl(values.og_image_url),
        content_vi: normalizeMarkdownMediaUrls(values.content_vi),
        content_en: normalizeMarkdownMediaUrls(values.content_en),
        sort_order: Number(values.sort_order || 0),
        is_featured: Boolean(values.is_featured),
        gallery_images: galleryImages.map((image) => resolveMediaUrl(image)).filter(Boolean),
        published_at: values.published_at ? new Date(values.published_at).toISOString() : null,
      };

      const savedItem = initial
        ? await updateAdminNewsPost(initial.id, payload)
        : await createAdminNewsPost(payload);

      onSaved?.(savedItem, initial ? 'updated' : 'created');
      if (!initial) {
        reset(buildDefaultValues(null));
        setGalleryImages([]);
      }
    } catch (error) {
      setFormError(error.message || 'Không thể lưu bài viết tin tức.');
    }
  });

  return (
    <form className="space-y-6 rounded-[30px] border border-slate-200 bg-white px-6 py-6 shadow-[0_18px_36px_rgba(15,23,42,0.06)]" onSubmit={onSubmit}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-red">Editor</p>
          <h2 className="mt-2 text-2xl font-semibold text-brand-ink">{initial ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</h2>
        </div>
        {initial ? <button type="button" className="btn-secondary" onClick={onCancel}>Tạo mới</button> : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <label className="block lg:col-span-2">
          <span className="input-label">Tiêu đề bài viết</span>
          <input className="input-field" {...register('title', { required: 'Vui lòng nhập tiêu đề.' })} />
          {errors.title ? <p className="input-error">{errors.title.message}</p> : null}
        </label>

        <label className="block">
          <span className="input-label">Slug</span>
          <input className="input-field" {...register('slug')} placeholder="Có thể để trống để backend tự sinh" />
        </label>

        <label className="block">
          <span className="input-label">Danh mục</span>
          <select className="input-field" {...register('category_id', { required: 'Vui lòng chọn danh mục.' })}>
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          {errors.category_id ? <p className="input-error">{errors.category_id.message}</p> : null}
        </label>

        <label className="block lg:col-span-2">
          <span className="input-label">Mô tả ngắn</span>
          <textarea className="input-field min-h-28" {...register('excerpt', { required: 'Vui lòng nhập mô tả ngắn.' })} />
          {errors.excerpt ? <p className="input-error">{errors.excerpt.message}</p> : null}
        </label>

        <ImageUploadField label="Ảnh thumbnail" currentUrl={thumbnailUrl} onUploaded={(url) => setValue('thumbnail_url', url, { shouldDirty: true })} />
        <ImageUploadField label="Ảnh OG/SEO" currentUrl={ogImageUrl} onUploaded={(url) => setValue('og_image_url', url, { shouldDirty: true })} uploadLabel="Tải ảnh OG" />
      </div>

      <RichTextEditor label="Nội dung tiếng Việt" value={contentVi} onChange={(value) => setValue('content_vi', value, { shouldDirty: true })} />
      <RichTextEditor label="Nội dung tiếng Anh" value={contentEn} onChange={(value) => setValue('content_en', value, { shouldDirty: true })} />

      {/* <div className="space-y-3 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-brand-ink">Gallery ảnh</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">Danh sách ảnh bổ sung hiển thị trong bài viết chi tiết.</p>
          </div>
          <button type="button" className="btn-secondary" onClick={() => setGalleryImages((current) => [...current, ''])}>Thêm ảnh</button>
        </div>

        <div className="space-y-3">
          {galleryImages.map((image, index) => (
            <div key={`news-gallery-${index}`} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_auto] lg:items-start">
              <input
                className="input-field"
                value={image}
                onChange={(event) => {
                  const nextItems = [...galleryImages];
                  nextItems[index] = event.target.value;
                  setGalleryImages(nextItems);
                }}
                placeholder="Dán URL ảnh gallery"
              />
              <ImageUploadField compact currentUrl={image} onUploaded={(url) => {
                const nextItems = [...galleryImages];
                nextItems[index] = url;
                setGalleryImages(nextItems);
              }} uploadLabel="Upload" />
              <button type="button" className="btn-secondary h-fit" onClick={() => setGalleryImages((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Xóa</button>
            </div>
          ))}
        </div>
      </div> */}

      <div className="grid gap-5 lg:grid-cols-2">
        <label className="block">
          <span className="input-label">SEO title</span>
          <input className="input-field" {...register('seo_title')} />
        </label>
        <label className="block">
          <span className="input-label">SEO description</span>
          <textarea className="input-field min-h-28" {...register('seo_description')} />
        </label>
        <label className="block">
          <span className="input-label">Trạng thái</span>
          <select className="input-field" {...register('status')}>
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </label>
        <label className="block">
          <span className="input-label">Ngày publish</span>
          <input className="input-field" type="datetime-local" {...register('published_at')} />
        </label>
        <label className="block">
          <span className="input-label">Sort order</span>
          <input className="input-field" type="number" {...register('sort_order')} />
        </label>
        <label className="flex items-center gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/20" {...register('is_featured')} />
          Đánh dấu bài viết nổi bật
        </label>
      </div>

      {formError ? <p className="input-error">{formError}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Đang lưu...' : initial ? 'Cập nhật bài viết' : 'Tạo bài viết'}</button>
        <button type="button" className="btn-secondary" onClick={() => {
          reset(buildDefaultValues(initial));
          setGalleryImages(initial?.gallery_images || []);
          setFormError('');
        }}>
          Khôi phục form
        </button>
      </div>
    </form>
  );
}

export default NewsForm;