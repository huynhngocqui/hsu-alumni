import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/auth';
import AuthPageHeading from '../../components/auth/AuthPageHeading';
import { useAuth } from '../../hooks/useAuth';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setError('');
      const response = await loginUser(values);
      login(
        response.user || {
          full_name: response.full_name || values.email,
          email: response.email || values.email,
          role: response.role || 'ALUMNI',
        },
      );
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.message || 'Không thể đăng nhập.');
    }
  });

  return (
    <div>
      <AuthPageHeading
        eyebrow="Xác thực"
        title="Đăng nhập tài khoản Alumni"
        description="Sử dụng email cá nhân đã đăng ký để truy cập dashboard, hồ sơ và các tính năng matching."
      />

      <form className="mt-8 space-y-5" onSubmit={onSubmit}>
        <label className="block">
          <span className="input-label">Email</span>
          <input className="input-field" type="email" {...register('email', { required: true })} />
        </label>
        <label className="block">
          <span className="input-label">Mật khẩu</span>
          <input className="input-field" type="password" {...register('password', { required: true })} />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
          <Link to="/quen-mat-khau" className="text-sm font-medium text-brand">
            Quên mật khẩu?
          </Link>
        </div>
      </form>

      <p className="mt-8 text-sm text-slate-600">
        Chưa có tài khoản?{' '}
        <Link to="/dang-ky" className="font-semibold text-brand">
          Đăng ký thành viên
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
