import { useId, useRef, useState } from 'react';
import { uploadAdminMedia } from '../../api/admin';
import MarkdownContent from '../common/MarkdownContent';

const quickInsertOptions = [
  { label: 'H2', value: '## Tiêu đề\n\n' },
  { label: 'Danh sách', value: '- Mục 1\n- Mục 2\n' },
  { label: 'Quote', value: '> Trích dẫn nổi bật\n' },
  { label: 'Link', value: '[Nhãn liên kết](https://example.com)\n' },
  { label: 'Ảnh', value: '![Mô tả ảnh](https://example.com/image.jpg)\n' },
];

function RichTextEditor({ label, value, onChange, placeholder = 'Nhập nội dung dạng markdown...', minHeightClass = 'min-h-[260px]' }) {
  const uploadInputId = useId();
  const textareaRef = useRef(null);
  const [mode, setMode] = useState('write');
  const [uploadState, setUploadState] = useState({ uploading: false, error: '' });

  const insertSnippet = (snippet) => {
    const currentValue = value || '';
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange?.(`${currentValue}${snippet}`);
      return;
    }

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const nextValue = `${currentValue.slice(0, selectionStart)}${snippet}${currentValue.slice(selectionEnd)}`;
    onChange?.(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPosition = selectionStart + snippet.length;
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadState({ uploading: true, error: '' });

    try {
      const payload = await uploadAdminMedia(file);
      insertSnippet(`\n\n![${file.name || 'Hinh minh hoa'}](${payload.url})\n\n`);
      setMode('write');
      setUploadState({ uploading: false, error: '' });
    } catch (error) {
      setUploadState({ uploading: false, error: error.message || 'Không thể tải ảnh nội dung.' });
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {label ? <span className="input-label">{label}</span> : null}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {quickInsertOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
              onClick={() => insertSnippet(option.value)}
            >
              {option.label}
            </button>
          ))}
          <label htmlFor={uploadInputId} className="cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
            {uploadState.uploading ? 'Đang tải ảnh...' : 'Upload ảnh'}
          </label>
          <input
            id={uploadInputId}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploadState.uploading}
          />
        </div>

        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 text-xs font-semibold">
          <button
            type="button"
            className={`rounded-full px-3 py-1.5 ${mode === 'write' ? 'bg-brand text-white' : 'text-slate-500'}`}
            onClick={() => setMode('write')}
          >
            Soạn thảo
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1.5 ${mode === 'preview' ? 'bg-brand text-white' : 'text-slate-500'}`}
            onClick={() => setMode('preview')}
          >
            Xem trước
          </button>
        </div>
      </div>

      {uploadState.error ? <p className="input-error">{uploadState.error}</p> : null}

      {mode === 'write' ? (
        <textarea
          ref={textareaRef}
          className={`input-field ${minHeightClass}`}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange?.(event.target.value)}
        />
      ) : (
        <div className={`rounded-[24px] border border-slate-200 bg-white px-5 py-5 text-sm leading-7 text-slate-700 ${minHeightClass}`}>
          <MarkdownContent content={value} emptyMessage="Chưa có nội dung để xem trước." />
        </div>
      )}
    </div>
  );
}

export default RichTextEditor;