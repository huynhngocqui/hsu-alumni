import AdminDataTable from './AdminDataTable';
import BrandImage from '../common/BrandImage';
import EmptyState from '../common/EmptyState';
import { EditIcon, TrashIcon } from '../common/icons';

const categoryLabelMap = {
  OUTSTANDING: 'Cựu sinh viên tiêu biểu',
  SUCCESS: 'Câu chuyện thành công',
};

function StoryTable({ items = [], onEdit, onDelete }) {
  const columns = [
    {
      key: 'title',
      label: 'Câu chuyện',
      render: (row) => (
        <div className="flex min-w-[220px] items-start gap-3">
          <BrandImage src={row.featured_image_url} alt={row.title} className="h-14 w-14 rounded-[18px] object-cover" fallback={<div className="h-14 w-14 rounded-[18px] bg-slate-100" />} />
          <div>
            <p className="font-semibold text-brand-ink">{row.title}</p>
            <p className="mt-1 text-xs text-slate-400">{row.alumni_name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'story_category',
      label: 'Chuyên mục',
      render: (row) => categoryLabelMap[row.story_category] || row.story_category,
    },
    {
      key: 'role_title',
      label: 'Vai trò',
      render: (row) => `${row.role_title || '—'}${row.company_name ? ` · ${row.company_name}` : ''}`,
    },
    {
      key: 'status',
      label: 'Trạng thái',
      type: 'status',
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <button type="button" className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700" onClick={() => onEdit?.(row)}>
            <EditIcon /> Chỉnh sửa
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-600" onClick={() => onDelete?.(row)}>
            <TrashIcon /> Xóa
          </button>
        </div>
      ),
    },
  ];

  return <AdminDataTable columns={columns} rows={items} emptyState={<EmptyState title="Chưa có alumni story" message="Tạo nội dung đầu tiên cho chuyên mục cựu sinh viên tiêu biểu hoặc câu chuyện thành công." />} />;
}

export default StoryTable;