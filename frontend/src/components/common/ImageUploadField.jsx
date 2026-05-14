import { useId, useState } from 'react';
import { uploadAdminMedia } from '../../api/admin';
import BrandImage from './BrandImage';

function ImageUploadField({
  label,
  currentUrl = '',
  onUploaded,
  description = 'Hỗ trợ JPG, PNG hoặc WEBP.',
  uploadLabel = 'Tải ảnh lên',
  compact = false,
}) {
  const inputId = useId();
  const [status, setStatus] = useState({ uploading: false, error: '' });

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setStatus({ uploading: true, error: '' });
    try {
      const payload = await uploadAdminMedia(file);
      onUploaded?.(payload.url);
      setStatus({ uploading: false, error: '' });
    } catch (error) {
      setStatus({ uploading: false, error: error.message || 'Không thể tải ảnh lên.' });
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      {label ? <span className="input-label">{label}</span> : null}

      {currentUrl ? (
        <div className={compact ? 'overflow-hidden rounded-[20px] border border-slate-200 bg-slate-50 p-2' : 'overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50 p-3'}>
          <BrandImage
            src={currentUrl}
            alt={label || 'Uploaded image'}
            loading="lazy"
            className={compact ? 'h-28 w-full rounded-[16px] object-cover' : 'h-56 w-full rounded-[18px] object-cover'}
            fallback={<div className={compact ? 'h-28 rounded-[16px] bg-slate-100' : 'h-56 rounded-[18px] bg-slate-100'} />}
          />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor={inputId} className="btn-secondary cursor-pointer">
          {status.uploading ? 'Đang tải...' : uploadLabel}
        </label>
        <input id={inputId} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} disabled={status.uploading} />
        <span className="text-xs leading-6 text-slate-500">{description}</span>
      </div>

      {status.error ? <p className="input-error">{status.error}</p> : null}
    </div>
  );
}

export default ImageUploadField;