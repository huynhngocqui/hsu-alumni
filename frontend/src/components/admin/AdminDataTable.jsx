function StatusPill({ value }) {
  const label = value || 'DRAFT';
  const tone = label === 'PUBLISHED'
    ? 'bg-emerald-50 text-emerald-700'
    : label === 'ARCHIVED' || label === 'PAST'
      ? 'bg-slate-100 text-slate-600'
      : label === 'UPCOMING'
        ? 'bg-sky-50 text-sky-700'
        : 'bg-amber-50 text-amber-700';

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{label}</span>;
}

function renderCellValue(column, row) {
  if (column.render) {
    return column.render(row);
  }

  if (column.type === 'status') {
    return <StatusPill value={row[column.key]} />;
  }

  return row[column.key] ?? '—';
}

function MobileRow({ row, columns }) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_14px_32px_rgba(15,23,42,0.05)] lg:hidden">
      <div className="space-y-3">
        {columns.map((column) => (
          <div key={`${row.id}-${column.key}`} className="flex items-start justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{column.label}</span>
            <div className="min-w-0 text-right text-sm text-slate-700">{renderCellValue(column, row)}</div>
          </div>
        ))}
      </div>
    </article>
  );
}

function AdminDataTable({ columns = [], rows = [], emptyState = null }) {
  if (!rows.length) {
    return emptyState;
  }

  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <MobileRow key={row.id} row={row} columns={columns} />
      ))}

      <div className="hidden overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_36px_rgba(15,23,42,0.06)] lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/90">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="align-top">
                  {columns.map((column) => (
                    <td key={`${row.id}-${column.key}`} className="px-5 py-4 text-sm text-slate-700">
                      {renderCellValue(column, row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDataTable;