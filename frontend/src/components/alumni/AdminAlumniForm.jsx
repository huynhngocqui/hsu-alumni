import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { createAdminAlumniPost, updateAdminAlumniPost } from '../../api/alumni';
import { slugifyValue } from '../../utils/slugify';
import ImageUploadField from '../common/ImageUploadField';

const DEFAULT_VALUES = {
  full_name: '',
  slug: '',
  position: '',
  short_description: '',
  company: '',
  education_level: '',
  cohort: '',
  field: '',
  major: '',
  avatar_url: '',
  gallery_images: [],
  content_vi: '',
  content_en: '',
  status: 'DRAFT',
  sort_order: 0,
  seo_title: '',
  seo_description: '',
};

function normalizeFormValues(initial = {}) {
  return {
    ...DEFAULT_VALUES,
    ...initial,
    sort_order: Number.isFinite(Number(initial.sort_order)) ? Number(initial.sort_order) : 0,
    gallery_images: Array.isArray(initial.gallery_images)
      ? initial.gallery_images.map((url) => ({ url }))
      : [],
  };
}

function FieldError({ error }) {
  if (!error?.message) {
    return null;
  }

  return <p className="input-error">{error.message}</p>;
}

function SectionHeading({ title, description }) {
  return (
    <div className="space-y-1">
      <h3 className="text-lg font-semibold text-brand-ink">{title}</h3>
      {description ? <p className="text-sm leading-7 text-slate-500">{description}</p> : null}
    </div>
  );
}

function AdminAlumniForm({ initial = null, onSaved, onCancel }) {
  const [status, setStatus] = useState({ type: '', message: '' });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(initial?.id));

  const defaultValues = useMemo(() => normalizeFormValues(initial || {}), [initial]);

  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'gallery_images',
  });

  const avatarUrl = watch('avatar_url');
  const fullNameValue = watch('full_name');
  const contentViValue = watch('content_vi');
  const contentEnValue = watch('content_en');
  const slugField = register('slug', {
    required: 'Bắt buộc nhập slug.',
    pattern: {
      value: /^[a-z0-9-]+$/,
      message: 'Slug chỉ gồm chữ thường, số và dấu gạch ngang.',
    },
  });

  useEffect(() => {
    reset(defaultValues);
    setStatus({ type: '', message: '' });
    setSlugManuallyEdited(Boolean(initial?.id));
  }, [defaultValues, initial?.id, reset]);

  useEffect(() => {
    if (initial?.id || slugManuallyEdited) {
      return;
    }

    setValue('slug', slugifyValue(fullNameValue), { shouldValidate: Boolean(fullNameValue), shouldDirty: false });
  }, [fullNameValue, initial?.id, setValue, slugManuallyEdited]);

  const insertImageIntoContent = (fieldName, imageUrl) => {
    if (!imageUrl) {
      return;
    }

    const currentValue = fieldName === 'content_en' ? contentEnValue : contentViValue;
    const nextValue = currentValue?.trim()
      ? `${currentValue.trim()}\n\n![Hinh minh hoa](${imageUrl})`
      : `![Hinh minh hoa](${imageUrl})`;

    setValue(fieldName, nextValue, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      ...values,
      slug: values.slug.trim() || slugifyValue(values.full_name),
      sort_order: Number(values.sort_order) || 0,
      gallery_images: (values.gallery_images || []).map((item) => item?.url?.trim()).filter(Boolean),
    };

    try {
      setStatus({ type: '', message: '' });
      const savedItem = initial?.id
        ? await updateAdminAlumniPost(initial.id, payload)
        : await createAdminAlumniPost(payload);

      reset(normalizeFormValues(savedItem));
      setSlugManuallyEdited(Boolean(savedItem?.id));
      setStatus({
        type: 'success',
        message: initial?.id ? 'Đã cập nhật bài viết alumni.' : 'Đã tạo bài viết alumni mới.',
      });
      await onSaved?.(savedItem, initial?.id ? 'updated' : 'created');
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Không thể lưu bài viết alumni.' });
    }
  });

  return (
    <form className="panel space-y-8 px-6 py-6 lg:px-8" onSubmit={onSubmit}>
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-red">{initial?.id ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</p>
          <h2 className="mt-3 text-2xl font-bold text-brand-ink">{initial?.id ? initial.full_name : 'Bài alumni mới'}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">Quản lý hồ sơ alumni, nội dung Markdown song ngữ và hình ảnh hiển thị cho route công khai.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : initial?.id ? 'Lưu cập nhật' : 'Tạo bài viết'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              reset(defaultValues);
              setSlugManuallyEdited(Boolean(initial?.id));
              setStatus({ type: '', message: '' });
              onCancel?.();
            }}
          >
            {initial?.id ? 'Tạo bài mới' : 'Làm mới form'}
          </button>
        </div>
      </div>

      <section className="space-y-5">
        <SectionHeading title="Thông tin cơ bản" description="Các trường này xuất hiện trực tiếp trên card và hero của trang chi tiết alumni." />
        <div className="grid gap-5 md:grid-cols-2">
          <label>
            <span className="input-label">Họ tên *</span>
            <input className="input-field" {...register('full_name', { required: 'Bắt buộc nhập họ tên.' })} />
            <FieldError error={errors.full_name} />
          </label>
          <label>
            <span className="input-label">Slug *</span>
            <input
              className="input-field"
              {...slugField}
              onChange={(event) => {
                setSlugManuallyEdited(true);
                slugField.onChange(event);
              }}
            />
            <p className="input-hint">Slug sẽ được tạo tự động khi thêm mới, nhưng vẫn có thể chỉnh tay.</p>
            <FieldError error={errors.slug} />
          </label>
          <label>
            <span className="input-label">Chức danh *</span>
            <input className="input-field" {...register('position', { required: 'Bắt buộc nhập chức danh.' })} />
            <FieldError error={errors.position} />
          </label>
          <label>
            <span className="input-label">Đơn vị công tác</span>
            <input className="input-field" {...register('company')} />
          </label>
          <label className="md:col-span-2">
            <span className="input-label">Mô tả ngắn *</span>
            <textarea className="input-field min-h-28" {...register('short_description', { required: 'Bắt buộc nhập mô tả ngắn.' })} />
            <FieldError error={errors.short_description} />
          </label>
          <label>
            <span className="input-label">Thứ tự hiển thị</span>
            <input className="input-field" type="number" {...register('sort_order')} />
          </label>
          <label>
            <span className="input-label">Trạng thái *</span>
            <select className="input-field" {...register('status', { required: 'Bắt buộc chọn trạng thái.' })}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            <FieldError error={errors.status} />
          </label>
        </div>
      </section>

      <section className="space-y-5 border-t border-slate-200 pt-8">
        <SectionHeading title="Phân loại alumni" description="Dữ liệu này được dùng cho thanh lọc trên route công khai `/cong-dong-alumni`." />
        <div className="grid gap-5 md:grid-cols-2">
          <label>
            <span className="input-label">Bậc đào tạo</span>
            <input className="input-field" {...register('education_level')} />
          </label>
          <label>
            <span className="input-label">Khóa / niên khóa</span>
            <input className="input-field" {...register('cohort')} />
          </label>
          <label>
            <span className="input-label">Lĩnh vực</span>
            <input className="input-field" {...register('field')} />
          </label>
          <label>
            <span className="input-label">Ngành</span>
            <input className="input-field" {...register('major')} />
          </label>
        </div>
      </section>

      <section className="space-y-5 border-t border-slate-200 pt-8">
        <SectionHeading title="Media" description="Upload ảnh đại diện và thêm nhiều ảnh minh họa để sử dụng trong nội dung Markdown hoặc gallery phụ." />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-4">
            <ImageUploadField
              label="Ảnh đại diện"
              currentUrl={avatarUrl}
              onUploaded={(url) => setValue('avatar_url', url, { shouldValidate: true, shouldDirty: true })}
              description="Ảnh chân dung sẽ hiển thị trên card và phần đầu trang chi tiết."
            />
            <label>
              <span className="input-label">Avatar URL</span>
              <input className="input-field" type="url" placeholder="https://..." {...register('avatar_url')} />
            </label>
          </div>

          <div className="space-y-4">
            <ImageUploadField
              label="Upload thêm ảnh nội dung"
              onUploaded={(url) => append({ url })}
              compact
              description="Ảnh được thêm vào gallery và có thể dùng trong Markdown với cú pháp ![alt](url)."
            />

            <div className="space-y-3 rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-brand-ink">Gallery images</h4>
                <button type="button" className="btn-secondary px-4 py-2 text-xs" onClick={() => append({ url: '' })}>
                  Thêm URL ảnh
                </button>
              </div>

              {fields.length ? (
                <div className="space-y-3">
                  {fields.map((fieldItem, index) => (
                    <div key={fieldItem.id} className="rounded-[20px] border border-slate-200 bg-white p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Ảnh {index + 1}</p>
                        <button type="button" className="text-xs font-semibold text-red-600" onClick={() => remove(index)}>
                          Xóa ảnh
                        </button>
                      </div>
                      <input className="input-field mt-3" type="url" placeholder="https://..." {...register(`gallery_images.${index}.url`)} />
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="btn-secondary px-4 py-2 text-xs"
                          onClick={() => insertImageIntoContent('content_vi', watch(`gallery_images.${index}.url`))}
                        >
                          Chèn vào nội dung VI
                        </button>
                        <button
                          type="button"
                          className="btn-secondary px-4 py-2 text-xs"
                          onClick={() => insertImageIntoContent('content_en', watch(`gallery_images.${index}.url`))}
                        >
                          Chèn vào nội dung EN
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-7 text-slate-500">Chưa có ảnh nội dung nào. Bạn có thể upload trực tiếp hoặc thêm URL thủ công.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5 border-t border-slate-200 pt-8">
        <SectionHeading title="Nội dung bài viết" description="Hỗ trợ Markdown cho heading, đoạn văn, danh sách, blockquote, link và ảnh. Ngôn ngữ tiếng Anh là tùy chọn." />
        <div className="grid gap-5 xl:grid-cols-2">
          <label>
            <span className="input-label">Nội dung bài viết tiếng Việt *</span>
            <textarea className="input-field min-h-[320px]" {...register('content_vi', { required: 'Bắt buộc nhập nội dung tiếng Việt.' })} />
            <p className="input-hint">Ví dụ chèn ảnh: ![Tên ảnh](https://example.com/image.jpg)</p>
            <FieldError error={errors.content_vi} />
          </label>
          <label>
            <span className="input-label">Nội dung bài viết tiếng Anh</span>
            <textarea className="input-field min-h-[320px]" {...register('content_en')} />
            <p className="input-hint">Nếu có nội dung tiếng Anh, trang chi tiết sẽ hiện toggle VI / EN ở góc phải.</p>
          </label>
        </div>
      </section>

      <section className="space-y-5 border-t border-slate-200 pt-8">
        <SectionHeading title="SEO" description="Tối ưu title và description cho trang chi tiết alumni." />
        <div className="grid gap-5 md:grid-cols-2">
          <label>
            <span className="input-label">SEO title</span>
            <input className="input-field" {...register('seo_title')} />
          </label>
          <label className="md:col-span-2">
            <span className="input-label">SEO description</span>
            <textarea className="input-field min-h-24" {...register('seo_description')} />
          </label>
        </div>
      </section>

      {status.message ? (
        <p className={`text-sm ${status.type === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
          {status.message}
        </p>
      ) : null}
    </form>
  );
}

export default AdminAlumniForm;