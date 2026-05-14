import AdminDataTable from './AdminDataTable';
import BrandImage from '../common/BrandImage';
import EmptyState from '../common/EmptyState';
import { EditIcon, TrashIcon } from '../common/icons';
import { formatDateTimeRange } from '../../utils/formatDate';

function EventTable({ items = [], onEdit, onDelete }) {
  const columns = [
    {
      key: 'title',
      label: 'Sự kiện',
      render: (row) => (
        <div className="flex min-w-[220px] items-start gap-3">
          <BrandImage src={row.banner_url} alt={row.title} className="h-14 w-14 rounded-[18px] object-cover" fallback={<div className="h-14 w-14 rounded-[18px] bg-slate-100" />} />
          <div>
            <p className="font-semibold text-brand-ink">{row.title}</p>
            <p className="mt-1 text-xs text-slate-400">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'schedule',
      label: 'Lịch diễn ra',
      render: (row) => formatDateTimeRange(row.start_date_time, row.end_date_time),
    },
    {
      key: 'event_status',
      label: 'Nhóm thời gian',
      type: 'status',
    },
    {
      key: 'status',
      label: 'Publish',
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

  return <AdminDataTable columns={columns} rows={items} emptyState={<EmptyState title="Chưa có sự kiện" message="Tạo sự kiện đầu tiên để route `/su-kien` có dữ liệu hiển thị." />} />;
}

export default EventTable;