import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { registerUser } from '../../api/auth';
import { lookupPeopleSoftProfile } from '../../api/integrations';
import AuthPageHeading from '../../components/auth/AuthPageHeading';
import { registerSchema } from '../../validation/registerSchema';

function RegisterPage() {
  const [status, setStatus] = useState({ type: '', message: '' });
  const [lookupState, setLookupState] = useState({ type: '', message: '', profile: null });
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const applySchemaErrors = (values) => {
    const parsed = registerSchema.safeParse(values);
    if (parsed.success) {
      return parsed.data;
    }

    parsed.error.issues.forEach((issue) => {
      const fieldName = issue.path[0];
      if (fieldName) {
        setError(fieldName, { type: 'manual', message: issue.message });
      }
    });
    return null;
  };

  const runPeopleSoftLookup = async () => {
    const identifiers = {
      identity_id: getValues('identity_id'),
      student_id: getValues('student_id'),
      email: getValues('email'),
    };

    const response = await lookupPeopleSoftProfile(identifiers);
    const profile = response.profile;
    for (const [fieldName, value] of Object.entries(profile)) {
      if (fieldName === 'peoplesoft_id' || value == null) {
        continue;
      }
      setValue(fieldName, value, { shouldDirty: true, shouldValidate: true });
    }

    setLookupState({
      type: 'success',
      message: `Đã xác thực hồ sơ PeopleSoft: ${profile.peoplesoft_id}`,
      profile,
    });
    return profile;
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      setStatus({ type: '', message: '' });
      clearErrors();
      const parsedValues = applySchemaErrors(values);
      if (!parsedValues) {
        return;
      }

      await runPeopleSoftLookup();
      await registerUser(parsedValues);
      setStatus({
        type: 'success',
        message: 'Đăng ký thành công. Hệ thống sẽ gửi email thiết lập mật khẩu khi tài khoản được xác thực.',
      });
    } catch (error) {
      if (error?.payload && typeof error.payload === 'object' && !Array.isArray(error.payload)) {
        Object.entries(error.payload).forEach(([fieldName, fieldValue]) => {
          if (['detail', 'error', 'message'].includes(fieldName)) {
            return;
          }

          const message = Array.isArray(fieldValue) ? fieldValue[0] : fieldValue;
          if (typeof message === 'string') {
            setError(fieldName, { type: 'server', message });
          }
        });
      }
      setStatus({ type: 'error', message: error.message || 'Không thể gửi đăng ký.' });
    }
  });

  return (
    <div>
      <AuthPageHeading
        title="Tạo tài khoản Alumni"
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
          {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email.message}</p> : null}
        </label>
        <label>
          <span className="input-label">Số điện thoại</span>
          <input className="input-field" {...register('phone_number', { required: 'Bắt buộc nhập số điện thoại.' })} />
          {errors.phone_number ? <p className="mt-2 text-sm text-red-600">{errors.phone_number.message}</p> : null}
        </label>
        <label>
          <span className="input-label">CCCD/CMND</span>
          <input className="input-field" {...register('identity_id', { required: 'Bắt buộc nhập CCCD/CMND.' })} />
          {errors.identity_id ? <p className="mt-2 text-sm text-red-600">{errors.identity_id.message}</p> : null}
        </label>
        <label>
          <span className="input-label">Mã số sinh viên</span>
          <input className="input-field" {...register('student_id')} />
          {errors.student_id ? <p className="mt-2 text-sm text-red-600">{errors.student_id.message}</p> : null}
        </label>
        <label>
          <span className="input-label">Ngành học</span>
          <input className="input-field" {...register('major', { required: 'Bắt buộc nhập ngành học.' })} />
          {errors.major ? <p className="mt-2 text-sm text-red-600">{errors.major.message}</p> : null}
        </label>
        <label>
          <span className="input-label">Bậc đào tạo</span>
          <input className="input-field" {...register('academic_degree', { required: 'Bắt buộc nhập bậc đào tạo.' })} />
          {errors.academic_degree ? <p className="mt-2 text-sm text-red-600">{errors.academic_degree.message}</p> : null}
        </label>
        <label>
          <span className="input-label">Hệ đào tạo</span>
          <input className="input-field" {...register('mode_of_study', { required: 'Bắt buộc nhập hệ đào tạo.' })} />
          {errors.mode_of_study ? <p className="mt-2 text-sm text-red-600">{errors.mode_of_study.message}</p> : null}
        </label>
        <label>
          <span className="input-label">Năm nhập học</span>
          <input className="input-field" type="number" {...register('intake_year', { required: 'Bắt buộc nhập năm nhập học.' })} />
          {errors.intake_year ? <p className="mt-2 text-sm text-red-600">{errors.intake_year.message}</p> : null}
        </label>
        <label>
          <span className="input-label">Năm tốt nghiệp</span>
          <input className="input-field" type="number" {...register('graduation_year', { required: 'Bắt buộc nhập năm tốt nghiệp.' })} />
          {errors.graduation_year ? <p className="mt-2 text-sm text-red-600">{errors.graduation_year.message}</p> : null}
        </label>

        <div className="md:col-span-2">
          <div className="rounded-2xl border border-dashed border-brand/30 bg-brand-sand/70 px-4 py-3 text-sm text-slate-600">
            Demo PeopleSoft records hiện hỗ trợ tra cứu nhanh với CCCD: `079203009999`, `079203008888`, `079203007777`.
          </div>
        </div>

        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="btn-secondary"
            onClick={async () => {
              try {
                setStatus({ type: '', message: '' });
                clearErrors();
                await runPeopleSoftLookup();
              } catch (error) {
                setLookupState({ type: 'error', message: error.message || 'Không tìm thấy hồ sơ PeopleSoft.', profile: null });
              }
            }}
          >
            Tra cứu PeopleSoft
          </button>
          {lookupState.message ? (
            <p className={`text-sm ${lookupState.type === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
              {lookupState.message}
            </p>
          ) : null}
        </div>

        {lookupState.profile ? (
          <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
            Hồ sơ đối chiếu: {lookupState.profile.full_name} {lookupState.profile.last_name} · {lookupState.profile.major} · khóa {lookupState.profile.intake_year}-{lookupState.profile.graduation_year}
          </div>
        ) : null}

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
