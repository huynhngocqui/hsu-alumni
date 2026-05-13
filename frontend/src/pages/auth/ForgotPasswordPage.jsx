import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { requestPasswordReset } from '../../api/auth';

function ForgotPasswordPage() {
  const [status, setStatus] = useState({ type: '', message: '' });
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = handleSubmit(async (values) => {
    try {
      await requestPasswordReset(values);
      setStatus({
        type: 'success',
        message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.',
      });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Không thể xử lý yêu cầu.' });
    }
  });

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Quên mật khẩu</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Khôi phục quyền truy cập</h1>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Nhập email cá nhân đã đăng ký để nhận link đặt lại mật khẩu.
      </p>

      <form className="mt-8 space-y-5" onSubmit={onSubmit}>
        <label className="block">
          <span className="input-label">Email cá nhân</span>
          <input className="input-field" type="email" {...register('email', { required: true })} />
        </label>

        {status.message ? (
          <p className={`text-sm ${status.type === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
            {status.message}
          </p>
        ) : null}

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
        </button>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
