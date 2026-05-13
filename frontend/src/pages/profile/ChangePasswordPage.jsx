import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { changePassword } from '../../api/users';

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
    <div className="page-shell">
      <section className="panel max-w-3xl px-6 py-8 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Bảo mật</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Đổi mật khẩu</h1>
        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
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
          <div className="flex items-center gap-4">
            <button type="submit" className="btn-primary">
              Cập nhật mật khẩu
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

export default ChangePasswordPage;
