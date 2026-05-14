import BrandImage from '../common/BrandImage';

const statusClasses = {
  DRAFT: 'bg-amber-50 text-amber-700',
  PUBLISHED: 'bg-emerald-50 text-emerald-700',
  ARCHIVED: 'bg-slate-100 text-slate-600',
};

function TableRowSkeleton({ index }) {
  return (
    <tr key={`skeleton-${index}`} className="border-t border-slate-200">
      <td className="px-4 py-4"><div className="h-10 w-10 animate-pulse rounded-2xl bg-slate-200" /></td>
      <td className="px-4 py-4">
        <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-2 h-3 w-24 animate-pulse rounded-full bg-slate-200" />
      </td>
      <td className="px-4 py-4"><div className="h-4 w-28 animate-pulse rounded-full bg-slate-200" /></td>
      <td className="px-4 py-4"><div className="h-7 w-24 animate-pulse rounded-full bg-slate-200" /></td>
      <td className="px-4 py-4"><div className="h-4 w-12 animate-pulse rounded-full bg-slate-200" /></td>
      <td className="px-4 py-4"><div className="ml-auto h-8 w-32 animate-pulse rounded-full bg-slate-200" /></td>
    </tr>
  );
}

function AdminAlumniTable({ items, loading = false, onEdit, onDelete }) {
  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-brand-ink">Danh sách bài alumni</h2>
          <p className="mt-1 text-sm text-slate-500">Theo dõi trạng thái hiển thị, thứ tự và chỉnh sửa nhanh từng hồ sơ.</p>
        </div>
        <span className="rounded-full bg-brand-sand px-3 py-1 text-xs font-semibold text-brand">{items.length} bài viết</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50/80 text-xs uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="px-4 py-4 font-semibold">Ảnh</th>
              <th className="px-4 py-4 font-semibold">Alumni</th>
              <th className="px-4 py-4 font-semibold">Chức danh</th>
              <th className="px-4 py-4 font-semibold">Trạng thái</th>
              <th className="px-4 py-4 font-semibold">Thứ tự</th>
              <th className="px-4 py-4 text-right font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading && !items.length ? (
              Array.from({ length: 4 }, (_, index) => <TableRowSkeleton key={index} index={index} />)
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-t border-slate-200 align-top">
                  <td className="px-4 py-4">
                    <BrandImage
                      src={item.avatar_url}
                      alt={item.full_name}
                      loading="lazy"
                      className="h-10 w-10 rounded-2xl object-cover"
                      fallback={<div className="h-10 w-10 rounded-2xl bg-slate-100" />}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-brand-ink">{item.full_name}</p>
                    <p className="mt-1 text-xs text-slate-500">/{item.slug}</p>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{item.position}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[item.status] || statusClasses.ARCHIVED}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-semibold text-brand-ink">{item.sort_order ?? 0}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button type="button" className="btn-secondary px-4 py-2 text-xs" onClick={() => onEdit?.(item)}>
                        Sửa
                      </button>
                      <button type="button" className="btn-danger px-4 py-2 text-xs shadow-none" onClick={() => onDelete?.(item)}>
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminAlumniTable;