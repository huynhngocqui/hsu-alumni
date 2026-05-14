import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createAdminStory, updateAdminStory } from '../../api/admin';
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
    story_category: item?.story_category || 'SUCCESS',
    alumni_name: item?.alumni_name || '',
    company_name: item?.company_name || '',
    role_title: item?.role_title || '',
    excerpt: item?.excerpt || '',
    body: item?.body || '',
    featured_image_url: item?.featured_image_url || '',
    status: item?.status || 'DRAFT',
    published_at: toDateTimeLocal(item?.published_at),
  };
}

function StoryForm({ initial, onSaved, onCancel }) {
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
    setFormError('');
  }, [initial, reset]);

  const featuredImageUrl = watch('featured_image_url');
  const bodyValue = watch('body');

  const insertImageIntoBody = (url) => {
    if (!url) {
      return;
    }

    const nextValue = bodyValue?.trim()
      ? `${bodyValue.trim()}\n\n![Hinh minh hoa](${url})`
      : `![Hinh minh hoa](${url})`;

    setValue('body', nextValue, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      setFormError('');
      const payload = {
        ...values,
        body: normalizeMarkdownMediaUrls(values.body),
        featured_image_url: resolveMediaUrl(values.featured_image_url),
        published_at: values.published_at ? new Date(values.published_at).toISOString() : null,
      };

      const savedItem = initial?.id
        ? await updateAdminStory(initial.id, payload)
        : await createAdminStory(payload);

      onSaved?.(savedItem, initial?.id ? 'updated' : 'created');
      if (!initial) {
        reset(buildDefaultValues(null));
      }
    } catch (error) {
      setFormError(error.message || 'Không thể lưu alumni story.');
    }
  });

  return (
    <form className="space-y-6 rounded-[30px] border border-slate-200 bg-white px-6 py-6 shadow-[0_18px_36px_rgba(15,23,42,0.06)]" onSubmit={onSubmit}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-red">Story editor</p>
          <h2 className="mt-2 text-2xl font-semibold text-brand-ink">{initial ? 'Chỉnh sửa alumni story' : 'Tạo alumni story mới'}</h2>
        </div>
        {initial ? <button type="button" className="btn-secondary" onClick={onCancel}>Tạo mới</button> : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <label className="block lg:col-span-2">
          <span className="input-label">Tiêu đề câu chuyện</span>
          <input className="input-field" {...register('title', { required: 'Vui lòng nhập tiêu đề.' })} />
          {errors.title ? <p className="input-error">{errors.title.message}</p> : null}
        </label>

        <label className="block">
          <span className="input-label">Slug</span>
          <input className="input-field" {...register('slug')} placeholder="Có thể để trống để backend tự sinh" />
        </label>

        <label className="block">
          <span className="input-label">Chuyên mục</span>
          <select className="input-field" {...register('story_category', { required: true })}>
            <option value="SUCCESS">Câu chuyện thành công</option>
            <option value="OUTSTANDING">Cựu sinh viên tiêu biểu</option>
          </select>
        </label>

        <label className="block">
          <span className="input-label">Tên alumni</span>
          <input className="input-field" {...register('alumni_name', { required: 'Vui lòng nhập tên alumni.' })} />
          {errors.alumni_name ? <p className="input-error">{errors.alumni_name.message}</p> : null}
        </label>

        <label className="block">
          <span className="input-label">Chức danh</span>
          <input className="input-field" {...register('role_title')} />
        </label>

        <label className="block lg:col-span-2">
          <span className="input-label">Doanh nghiệp / tổ chức</span>
          <input className="input-field" {...register('company_name')} />
        </label>

        <label className="block lg:col-span-2">
          <span className="input-label">Tóm tắt</span>
          <textarea className="input-field min-h-28" {...register('excerpt', { required: 'Vui lòng nhập tóm tắt.' })} />
          {errors.excerpt ? <p className="input-error">{errors.excerpt.message}</p> : null}
        </label>

        <div className="space-y-4">
          <ImageUploadField
            label="Ảnh đại diện / ảnh đầu bài"
            currentUrl={featuredImageUrl}
            onUploaded={(url) => setValue('featured_image_url', url, { shouldDirty: true })}
            description="Ảnh này hiển thị ở card list và phần đầu của trang chi tiết."
          />
          <label className="block">
            <span className="input-label">Featured image URL</span>
            <input className="input-field" {...register('featured_image_url')} />
          </label>
        </div>

        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
          <div>
            <h3 className="text-lg font-semibold text-brand-ink">Ảnh chèn nội dung</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">Upload ảnh và chèn ngay vào nội dung markdown của trang detail.</p>
          </div>
          <ImageUploadField compact onUploaded={insertImageIntoBody} uploadLabel="Upload ảnh nội dung" />
        </div>
      </div>

      <RichTextEditor label="Nội dung câu chuyện" value={bodyValue} onChange={(value) => setValue('body', value, { shouldDirty: true, shouldValidate: true })} minHeightClass="min-h-[320px]" />

      <div className="grid gap-5 lg:grid-cols-2">
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
      </div>

      {formError ? <p className="input-error">{formError}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : initial ? 'Cập nhật câu chuyện' : 'Tạo câu chuyện'}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            reset(buildDefaultValues(initial));
            setFormError('');
          }}
        >
          Khôi phục form
        </button>
      </div>
    </form>
  );
}

export default StoryForm;