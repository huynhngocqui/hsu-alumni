import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateCurrentUserProfile } from '../../api/users';
import { useAuth } from '../../hooks/useAuth';

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [status, setStatus] = useState({ type: '', message: '' });
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
      current_company: user?.current_company || '',
      position: user?.position || '',
      interest_tags: user?.interest_tags?.join(', ') || '',
      job_seeking_status: Boolean(user?.job_seeking_status),
    },
  });

  useEffect(() => {
    reset({
      full_name: user?.full_name || '',
      email: user?.email || '',
      current_company: user?.current_company || '',
      position: user?.position || '',
      interest_tags: user?.interest_tags?.join(', ') || '',
      job_seeking_status: Boolean(user?.job_seeking_status),
    });
  }, [reset, user]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const payload = {
        full_name: values.full_name,
        current_company: values.current_company,
        position: values.position,
        job_seeking_status: Boolean(values.job_seeking_status),
        interest_tags: values.interest_tags
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      };
      const response = await updateCurrentUserProfile(payload);
      updateUser(response.user || payload);
      setStatus({ type: 'success', message: 'Đã lưu cập nhật hồ sơ.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Không thể lưu hồ sơ.' });
    }
  });

  return (
    <div className="page-shell">
      <section className="panel px-6 py-8 lg:px-10">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Hồ sơ cá nhân</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Thông tin Alumni</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Form này là khung đầu tiên cho luồng cập nhật hồ sơ, bao gồm thông tin công việc hiện tại và lĩnh vực quan tâm để phục vụ matching engine.
          </p>
        </div>

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
            <textarea
              className="input-field min-h-32"
              placeholder="Ví dụ: F&B, Technology, Marketing"
              {...register('interest_tags')}
            />
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
    </div>
  );
}

export default ProfilePage;
