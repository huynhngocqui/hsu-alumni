import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { changePassword } from '../../api/users';
import PageLayout from '../../components/common/PageLayout';

function ChangePasswordPage() {
  const [status, setStatus] = useState({ type: '', message: '' });
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = handleSubmit(async (values) => {
    if (values.new_password !== values.confirm_password) {
      setStatus({ type: 'error', message: 'Mật khẩu xác nhận chưa khớp.' });
      return;
    }

    try {
      await changePassword(values);
      reset();
      setStatus({ type: 'success', message: 'Đổi mật khẩu thành công.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Không thể đổi mật khẩu.' });
    }
  });

  return (
    <PageLayout
      breadcrumbItems={[
        { label: 'Trang chủ', to: '/' },
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Hồ sơ cá nhân', to: '/ho-so' },
        { label: 'Đổi mật khẩu' },
      ]}
      eyebrow="Bảo mật"
      title="Đổi mật khẩu"
      description="Cập nhật mật khẩu để bảo vệ tài khoản Alumni và giữ quyền truy cập an toàn trên các luồng hồ sơ, Co-op và việc làm."
    >
      <section className="panel max-w-3xl px-6 py-8 lg:px-10">
        <form className="space-y-5" onSubmit={onSubmit}>
          <label className="block">
            <span className="input-label">Mật khẩu hiện tại</span>
            <input className="input-field" type="password" {...register('old_password', { required: true })} />
          </label>
          <label className="block">
            <span className="input-label">Mật khẩu mới</span>
            <input className="input-field" type="password" {...register('new_password', { required: true, minLength: 8 })} />
          </label>
          <label className="block">
            <span className="input-label">Xác nhận mật khẩu mới</span>
            <input className="input-field" type="password" {...register('confirm_password', { required: true, minLength: 8 })} />
          </label>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button type="submit" className="btn-primary">
              Cập nhật mật khẩu
            </button>
            <Link to="/ho-so" className="btn-secondary">
              Quay lại hồ sơ
            </Link>
          </div>
          {status.message ? (
            <p className={`text-sm ${status.type === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
              {status.message}
            </p>
          ) : null}
        </form>
      </section>
    </PageLayout>
  );
}

export default ChangePasswordPage;
