import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { createJobListing } from '../../api/jobs';
import { listTags } from '../../api/tags';
import PageLayout from '../../components/common/PageLayout';

function JobPostPage() {
  const navigate = useNavigate();
  const [availableTags, setAvailableTags] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      job_name: '',
      job_position: '',
      employment_type: '',
      work_location: '',
      application_deadline: '',
      job_description: '',
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
        application_deadline: values.application_deadline || null,
        category_tags: values.category_tags
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      };
      const response = await createJobListing(payload);
      navigate(`/viec-lam-ket-noi/hoa-sen-job/${response.id}`);
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Không thể đăng tin tuyển dụng.' });
    }
  });

  return (
    <PageLayout
      breadcrumbItems={[
        { label: 'Trang chủ', to: '/' },
        { label: 'Việc làm & Kết nối' },
        { label: 'Hoa Sen Job', to: '/viec-lam-ket-noi/hoa-sen-job' },
        { label: 'Đăng tin tuyển dụng' },
      ]}
      eyebrow="Hoa Sen Job"
      title="Đăng tin tuyển dụng"
      description="Alumni có thể đăng cơ hội việc làm để hệ thống matching với những ứng viên đang bật trạng thái tìm việc."
      actions={
        <Link to="/viec-lam-ket-noi/hoa-sen-job" className="btn-secondary">
          Quay lại danh sách
        </Link>
      }
    >
      <section className="panel px-6 py-8 lg:px-10">
        <form className="grid gap-6 lg:grid-cols-2" onSubmit={onSubmit}>
          <label>
            <span className="input-label">Tên công việc</span>
            <input className="input-field" {...register('job_name', { required: true })} />
          </label>
          <label>
            <span className="input-label">Chức vụ</span>
            <input className="input-field" {...register('job_position', { required: true })} />
          </label>
          <label>
            <span className="input-label">Hình thức làm việc</span>
            <select className="input-field" {...register('employment_type', { required: true })}>
              <option value="">Chọn hình thức</option>
              <option value="Toàn thời gian">Toàn thời gian</option>
              <option value="Bán thời gian">Bán thời gian</option>
              <option value="Thực tập">Thực tập</option>
              <option value="Freelance">Freelance</option>
              <option value="Theo dự án">Theo dự án</option>
            </select>
          </label>
          <label>
            <span className="input-label">Địa điểm làm việc</span>
            <input className="input-field" placeholder="VD: Quận 1, TP.HCM / Remote" {...register('work_location', { required: true })} />
          </label>
          <label>
            <span className="input-label">Hạn ứng tuyển</span>
            <input className="input-field" type="date" {...register('application_deadline')} />
          </label>
          <label className="lg:col-span-2">
            <span className="input-label">Mô tả công việc</span>
            <textarea className="input-field min-h-36" {...register('job_description')} />
          </label>
          <label className="lg:col-span-2">
            <span className="input-label">Category tags</span>
            <input
              className="input-field"
              placeholder="Technology, Marketing, F&B"
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
              {isSubmitting ? 'Đang đăng...' : 'Đăng tin tuyển dụng'}
            </button>
          </div>
        </form>
      </section>
    </PageLayout>
  );
}

export default JobPostPage;
