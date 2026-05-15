import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { createCoopListing } from '../../api/coop';
import { listTags } from '../../api/tags';
import PageLayout from '../../components/common/PageLayout';

function CoopPostPage() {
  const navigate = useNavigate();
  const [availableTags, setAvailableTags] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      image_url: '',
      category_tags: '',
    },
  });

  const tagValue = watch('category_tags');

  useEffect(() => {
    async function loadTags() {
      try {
        const response = await listTags();
        setAvailableTags(response);
      } catch {
        setAvailableTags([]);
      }
    }

    loadTags();
  }, []);

  const toggleTag = (tag) => {
    const current = tagValue
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const next = current.includes(tag)
      ? current.filter((item) => item !== tag)
      : [...current, tag];

    setValue('category_tags', next.join(', '), { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      const payload = {
        ...values,
        category_tags: values.category_tags
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      };
      const response = await createCoopListing(payload);
      navigate(`/dich-vu-alumni/hoa-sen-coop/${response.id}`);
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Không thể đăng bài Co-op.' });
    }
  });

  return (
    <PageLayout
      breadcrumbItems={[
        { label: 'Trang chủ', to: '/' },
        { label: 'Dịch vụ Alumni' },
        { label: 'Hoa Sen COOP', to: '/dich-vu-alumni/hoa-sen-coop' },
        { label: 'Đăng bài Co-op' },
      ]}
      eyebrow="Hoa Sen Co-op"
      title="Đăng bài Co-op mới"
      description="Alumni có thể đăng sản phẩm, dịch vụ hoặc ưu đãi để hệ thống tìm các thành viên có lĩnh vực quan tâm phù hợp."
      actions={
        <Link to="/dich-vu-alumni/hoa-sen-coop" className="btn-secondary">
          Quay lại danh sách
        </Link>
      }
    >
      <section className="panel px-6 py-8 lg:px-10">
        <form className="grid gap-6 lg:grid-cols-2" onSubmit={onSubmit}>
          <label>
            <span className="input-label">Tên sản phẩm / dịch vụ</span>
            <input className="input-field" {...register('name', { required: true })} />
          </label>
          <label>
            <span className="input-label">Link ảnh minh họa</span>
            <input className="input-field" type="url" placeholder="https://..." {...register('image_url')} />
          </label>
          <label className="lg:col-span-2">
            <span className="input-label">Mô tả</span>
            <textarea className="input-field min-h-36" {...register('description')} />
          </label>
          <label className="lg:col-span-2">
            <span className="input-label">Category tags</span>
            <input
              className="input-field"
              placeholder="F&B, Technology, Marketing Service"
              {...register('category_tags', { required: true })}
            />
          </label>

          {availableTags.length ? (
            <div className="lg:col-span-2 flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const active = tagValue.split(',').map((item) => item.trim()).includes(tag.name);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${active ? 'bg-brand text-white' : 'bg-brand-sand text-brand'}`}
                    onClick={() => toggleTag(tag.name)}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          ) : null}

          {status.message ? <p className="lg:col-span-2 text-sm text-red-600">{status.message}</p> : null}

          <div className="lg:col-span-2">
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Đang đăng...' : 'Đăng bài Co-op'}
            </button>
          </div>
        </form>
      </section>
    </PageLayout>
  );
}

export default CoopPostPage;
