import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../api/auth';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState({ type: '', message: '' });
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = handleSubmit(async (values) => {
    if (values.password !== values.confirm_password) {
      setStatus({ type: 'error', message: 'Mật khẩu xác nhận chưa khớp.' });
      return;
    }

    try {
      await resetPassword({ token, password: values.password });
      setStatus({ type: 'success', message: 'Đặt lại mật khẩu thành công. Bạn có thể đăng nhập lại.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Không thể đặt lại mật khẩu.' });
    }
  });

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Thiết lập mật khẩu</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Tạo mật khẩu mới</h1>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Token hiện tại: <span className="font-semibold text-brand-ink">{token ? 'Đã nhận' : 'Thiếu token'}</span>
      </p>

      <form className="mt-8 space-y-5" onSubmit={onSubmit}>
        <label className="block">
          <span className="input-label">Mật khẩu mới</span>
          <input className="input-field" type="password" {...register('password', { required: true, minLength: 8 })} />
        </label>
        <label className="block">
          <span className="input-label">Xác nhận mật khẩu</span>
          <input className="input-field" type="password" {...register('confirm_password', { required: true, minLength: 8 })} />
        </label>

        {status.message ? (
          <p className={`text-sm ${status.type === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
            {status.message}
          </p>
        ) : null}

        <button type="submit" className="btn-primary" disabled={isSubmitting || !token}>
          {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
        </button>
      </form>
    </div>
  );
}

export default ResetPasswordPage;
