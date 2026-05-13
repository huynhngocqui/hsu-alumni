import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { registerUser } from '../../api/auth';
import AuthPageHeading from '../../components/auth/AuthPageHeading';

function RegisterPage() {
  const [status, setStatus] = useState({ type: '', message: '' });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = handleSubmit(async (values) => {
    try {
      setStatus({ type: '', message: '' });
      await registerUser(values);
      setStatus({
        type: 'success',
        message: 'Đăng ký thành công. Hệ thống sẽ gửi email thiết lập mật khẩu khi tài khoản được xác thực.',
      });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Không thể gửi đăng ký.' });
    }
  });

  return (
    <div>
      <AuthPageHeading
        eyebrow="Đăng ký"
        title="Tạo tài khoản Alumni"
        description="Form này là khung đầu tiên cho luồng đăng ký thành viên, bao gồm các trường chính trong BRD để sau đó nối PeopleSoft lookup và validation chi tiết hơn."
      />

      <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={onSubmit}>
        <label>
          <span className="input-label">Họ và tên lót</span>
          <input className="input-field" {...register('full_name', { required: 'Bắt buộc nhập họ và tên lót.' })} />
          {errors.full_name ? <p className="mt-2 text-sm text-red-600">{errors.full_name.message}</p> : null}
        </label>
        <label>
          <span className="input-label">Tên</span>
          <input className="input-field" {...register('last_name', { required: 'Bắt buộc nhập tên.' })} />
          {errors.last_name ? <p className="mt-2 text-sm text-red-600">{errors.last_name.message}</p> : null}
        </label>
        <label>
          <span className="input-label">Email cá nhân</span>
          <input className="input-field" type="email" {...register('email', { required: 'Bắt buộc nhập email.' })} />
        </label>
        <label>
          <span className="input-label">Số điện thoại</span>
          <input className="input-field" {...register('phone_number', { required: 'Bắt buộc nhập số điện thoại.' })} />
        </label>
        <label>
          <span className="input-label">CCCD/CMND</span>
          <input className="input-field" {...register('identity_id', { required: 'Bắt buộc nhập CCCD/CMND.' })} />
        </label>
        <label>
          <span className="input-label">Mã số sinh viên</span>
          <input className="input-field" {...register('student_id')} />
        </label>
        <label>
          <span className="input-label">Ngành học</span>
          <input className="input-field" {...register('major', { required: 'Bắt buộc nhập ngành học.' })} />
        </label>
        <label>
          <span className="input-label">Bậc đào tạo</span>
          <input className="input-field" {...register('academic_degree', { required: 'Bắt buộc nhập bậc đào tạo.' })} />
        </label>
        <label>
          <span className="input-label">Hệ đào tạo</span>
          <input className="input-field" {...register('mode_of_study', { required: 'Bắt buộc nhập hệ đào tạo.' })} />
        </label>
        <label>
          <span className="input-label">Năm nhập học</span>
          <input className="input-field" type="number" {...register('intake_year', { required: 'Bắt buộc nhập năm nhập học.' })} />
        </label>
        <label>
          <span className="input-label">Năm tốt nghiệp</span>
          <input className="input-field" type="number" {...register('graduation_year', { required: 'Bắt buộc nhập năm tốt nghiệp.' })} />
        </label>

        <div className="md:col-span-2">
          <div className="rounded-2xl border border-dashed border-brand/30 bg-brand-sand/70 px-4 py-3 text-sm text-slate-600">
            Giai đoạn tiếp theo sẽ nối thêm PeopleSoft lookup theo CCCD, CAPTCHA và validation schema-based chi tiết theo business rules.
          </div>
        </div>

        {status.message ? (
          <p className={`md:col-span-2 text-sm ${status.type === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
            {status.message}
          </p>
        ) : null}

        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Đang gửi đăng ký...' : 'Gửi đăng ký'}
          </button>
          <Link to="/dang-nhap" className="btn-secondary">
            Quay lại đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
