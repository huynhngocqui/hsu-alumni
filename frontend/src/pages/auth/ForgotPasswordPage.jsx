import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { requestPasswordReset } from '../../api/auth';
import AuthPageHeading from '../../components/auth/AuthPageHeading';

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
      <AuthPageHeading
        title="Khôi phục quyền truy cập"
        description="Nhập email cá nhân đã đăng ký để nhận link đặt lại mật khẩu."
      />

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
