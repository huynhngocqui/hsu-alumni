import AdminDataTable from './AdminDataTable';
import BrandImage from '../common/BrandImage';
import EmptyState from '../common/EmptyState';
import { EditIcon, TrashIcon } from '../common/icons';
import { formatDate } from '../../utils/formatDate';

function NewsTable({ items = [], onEdit, onDelete }) {
  const columns = [
    {
      key: 'title',
      label: 'Bài viết',
      render: (row) => (
        <div className="flex min-w-[220px] items-start gap-3">
          <BrandImage src={row.thumbnail_url} alt={row.title} className="h-14 w-14 rounded-[18px] object-cover" fallback={<div className="h-14 w-14 rounded-[18px] bg-slate-100" />} />
          <div>
            <p className="font-semibold text-brand-ink">{row.title}</p>
            <p className="mt-1 text-xs text-slate-400">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Danh mục',
      render: (row) => row.category?.name || '—',
    },
    {
      key: 'published_at',
      label: 'Ngày publish',
      render: (row) => formatDate(row.published_at),
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

  return <AdminDataTable columns={columns} rows={items} emptyState={<EmptyState title="Chưa có bài viết tin tức" message="Tạo bài viết đầu tiên để route `/tin-tuc` có dữ liệu hiển thị." />} />;
}

export default NewsTable;