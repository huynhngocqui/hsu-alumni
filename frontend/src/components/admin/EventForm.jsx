import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createAdminEvent, updateAdminEvent } from '../../api/admin';
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
    excerpt: item?.excerpt || '',
    banner_url: item?.banner_url || '',
    start_date_time: toDateTimeLocal(item?.start_date_time),
    end_date_time: toDateTimeLocal(item?.end_date_time),
    location: item?.location || '',
    content_vi: item?.content_vi || '',
    content_en: item?.content_en || '',
    registration_url: item?.registration_url || '',
    status: item?.status || 'DRAFT',
    is_featured: Boolean(item?.is_featured),
    sort_order: item?.sort_order ?? 0,
    seo_title: item?.seo_title || '',
    seo_description: item?.seo_description || '',
    og_image_url: item?.og_image_url || '',
    published_at: toDateTimeLocal(item?.published_at),
  };
}

function EventForm({ initial, onSaved, onCancel }) {
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

  const bannerUrl = watch('banner_url');
  const ogImageUrl = watch('og_image_url');
  const contentVi = watch('content_vi');
  const contentEn = watch('content_en');

  const onSubmit = handleSubmit(async (values) => {
    if (new Date(values.end_date_time) < new Date(values.start_date_time)) {
      setFormError('Thời gian kết thúc phải sau thời gian bắt đầu.');
      return;
    }

    try {
      setFormError('');
      const payload = {
        ...values,
        banner_url: resolveMediaUrl(values.banner_url),
        og_image_url: resolveMediaUrl(values.og_image_url),
        content_vi: normalizeMarkdownMediaUrls(values.content_vi),
        content_en: normalizeMarkdownMediaUrls(values.content_en),
        sort_order: Number(values.sort_order || 0),
        is_featured: Boolean(values.is_featured),
        gallery_images: galleryImages.map((image) => resolveMediaUrl(image)).filter(Boolean),
        start_date_time: new Date(values.start_date_time).toISOString(),
        end_date_time: new Date(values.end_date_time).toISOString(),
        published_at: values.published_at ? new Date(values.published_at).toISOString() : null,
      };

      const savedItem = initial
        ? await updateAdminEvent(initial.id, payload)
        : await createAdminEvent(payload);

      onSaved?.(savedItem, initial ? 'updated' : 'created');
      if (!initial) {
        reset(buildDefaultValues(null));
        setGalleryImages([]);
      }
    } catch (error) {
      setFormError(error.message || 'Không thể lưu sự kiện.');
    }
  });

  return (
    <form className="space-y-6 rounded-[30px] border border-slate-200 bg-white px-6 py-6 shadow-[0_18px_36px_rgba(15,23,42,0.06)]" onSubmit={onSubmit}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-red">Event editor</p>
          <h2 className="mt-2 text-2xl font-semibold text-brand-ink">{initial ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện mới'}</h2>
        </div>
        {initial ? <button type="button" className="btn-secondary" onClick={onCancel}>Tạo mới</button> : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <label className="block lg:col-span-2">
          <span className="input-label">Tên sự kiện</span>
          <input className="input-field" {...register('title', { required: 'Vui lòng nhập tên sự kiện.' })} />
          {errors.title ? <p className="input-error">{errors.title.message}</p> : null}
        </label>

        <label className="block">
          <span className="input-label">Slug</span>
          <input className="input-field" {...register('slug')} placeholder="Có thể để trống để backend tự sinh" />
        </label>

        <label className="block">
          <span className="input-label">Địa điểm</span>
          <input className="input-field" {...register('location', { required: 'Vui lòng nhập địa điểm.' })} />
          {errors.location ? <p className="input-error">{errors.location.message}</p> : null}
        </label>

        <label className="block lg:col-span-2">
          <span className="input-label">Mô tả ngắn</span>
          <textarea className="input-field min-h-28" {...register('excerpt', { required: 'Vui lòng nhập mô tả ngắn.' })} />
          {errors.excerpt ? <p className="input-error">{errors.excerpt.message}</p> : null}
        </label>

        <label className="block">
          <span className="input-label">Bắt đầu</span>
          <input className="input-field" type="datetime-local" {...register('start_date_time', { required: 'Vui lòng chọn thời gian bắt đầu.' })} />
          {errors.start_date_time ? <p className="input-error">{errors.start_date_time.message}</p> : null}
        </label>

        <label className="block">
          <span className="input-label">Kết thúc</span>
          <input className="input-field" type="datetime-local" {...register('end_date_time', { required: 'Vui lòng chọn thời gian kết thúc.' })} />
          {errors.end_date_time ? <p className="input-error">{errors.end_date_time.message}</p> : null}
        </label>

        <ImageUploadField label="Banner sự kiện" currentUrl={bannerUrl} onUploaded={(url) => setValue('banner_url', url, { shouldDirty: true })} />
        <ImageUploadField label="Ảnh OG/SEO" currentUrl={ogImageUrl} onUploaded={(url) => setValue('og_image_url', url, { shouldDirty: true })} uploadLabel="Tải ảnh OG" />
      </div>

      <RichTextEditor label="Nội dung tiếng Việt" value={contentVi} onChange={(value) => setValue('content_vi', value, { shouldDirty: true })} />
      <RichTextEditor label="Nội dung tiếng Anh" value={contentEn} onChange={(value) => setValue('content_en', value, { shouldDirty: true })} />

      {/* <div className="space-y-3 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-brand-ink">Gallery ảnh</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">Thư viện hậu kỳ hoặc ảnh minh họa thêm cho trang chi tiết sự kiện.</p>
          </div>
          <button type="button" className="btn-secondary" onClick={() => setGalleryImages((current) => [...current, ''])}>Thêm ảnh</button>
        </div>

        <div className="space-y-3">
          {galleryImages.map((image, index) => (
            <div key={`event-gallery-${index}`} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_auto] lg:items-start">
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
          <span className="input-label">Link đăng ký</span>
          <input className="input-field" type="url" {...register('registration_url')} />
        </label>
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
          Đánh dấu sự kiện nổi bật
        </label>
      </div>

      {formError ? <p className="input-error">{formError}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Đang lưu...' : initial ? 'Cập nhật sự kiện' : 'Tạo sự kiện'}</button>
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

export default EventForm;