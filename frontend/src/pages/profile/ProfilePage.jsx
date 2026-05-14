import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateCurrentUserProfile } from '../../api/users';
import { listTags } from '../../api/tags';
import PageLayout from '../../components/common/PageLayout';
import TagSelector from '../../components/common/TagSelector';
import { useAuth } from '../../hooks/useAuth';

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [status, setStatus] = useState({ type: '', message: '' });
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(user?.interest_tags || []);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
      current_company: user?.current_company || '',
      position: user?.position || '',
      job_seeking_status: Boolean(user?.job_seeking_status),
    },
  });

  useEffect(() => {
    reset({
      full_name: user?.full_name || '',
      email: user?.email || '',
      current_company: user?.current_company || '',
      position: user?.position || '',
      job_seeking_status: Boolean(user?.job_seeking_status),
    });
    setSelectedTags(user?.interest_tags || []);
  }, [reset, user]);

  useEffect(() => {
    listTags()
      .then((tags) => setAllTags((tags || []).map((t) => (typeof t === 'string' ? t : t.name))))
      .catch(() => {});
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const payload = {
        full_name: values.full_name,
        current_company: values.current_company,
        position: values.position,
        job_seeking_status: Boolean(values.job_seeking_status),
        interest_tags: selectedTags,
      };
      const response = await updateCurrentUserProfile(payload);
      updateUser(response.user || payload);
      setStatus({ type: 'success', message: 'Đã lưu cập nhật hồ sơ.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Không thể lưu hồ sơ.' });
    }
  });

  return (
    <PageLayout
      breadcrumbItems={[
        { label: 'Trang chủ', to: '/' },
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Hồ sơ cá nhân' },
      ]}
      eyebrow="Hồ sơ cá nhân"
      title="Thông tin Alumni"
      description="Form này là khung đầu tiên cho luồng cập nhật hồ sơ, bao gồm thông tin công việc hiện tại và lĩnh vực quan tâm để phục vụ matching engine."
    >
      <section className="panel px-6 py-8 lg:px-10">
        <form className="grid gap-6 lg:grid-cols-2" onSubmit={onSubmit}>
          <label>
            <span className="input-label">Họ tên</span>
            <input className="input-field" {...register('full_name')} />
          </label>
          <label>
            <span className="input-label">Email cá nhân</span>
            <input className="input-field bg-slate-50" type="email" readOnly {...register('email')} />
          </label>
          <label>
            <span className="input-label">Nơi làm việc hiện tại</span>
            <input className="input-field" {...register('current_company')} />
          </label>
          <label>
            <span className="input-label">Vị trí hiện tại</span>
            <input className="input-field" {...register('position')} />
          </label>
          <label className="lg:col-span-2">
            <span className="input-label">Lĩnh vực quan tâm</span>
            <div className="mt-2">
              {allTags.length ? (
                <TagSelector allTags={allTags} selected={selectedTags} onChange={setSelectedTags} />
              ) : (
                <p className="text-sm text-slate-400">Đang tải danh sách lĩnh vực...</p>
              )}
              {selectedTags.length > 0 ? (
                <p className="mt-2 text-xs text-slate-500">Đã chọn: {selectedTags.join(', ')}</p>
              ) : null}
            </div>
          </label>
          <label className="lg:col-span-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
            <input type="checkbox" className="h-4 w-4 accent-brand" {...register('job_seeking_status')} />
            Tôi đang tìm việc và muốn nhận gợi ý tuyển dụng phù hợp.
          </label>

          <div className="flex flex-col gap-3 lg:col-span-2 lg:flex-row lg:items-center">
            <button type="submit" className="btn-primary">
              Lưu hồ sơ
            </button>
            {status.message ? (
              <p className={`text-sm ${status.type === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
                {status.message}
              </p>
            ) : null}
          </div>
        </form>
      </section>
    </PageLayout>
  );
}

export default ProfilePage;
