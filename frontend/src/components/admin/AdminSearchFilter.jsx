import { SearchIcon } from '../common/icons';

function AdminSearchFilter({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Tìm kiếm...',
  filters = [],
  actionLabel,
  onAction,
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_36px_rgba(15,23,42,0.06)] sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <label className="relative block w-full xl:max-w-md">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon className="h-4 w-4" />
          </span>
          <input
            type="search"
            className="input-field pl-11"
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder={searchPlaceholder}
          />
        </label>

        <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-end">
          {filters.map((filter) => (
            <label key={filter.name} className="block min-w-[180px]">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{filter.label}</span>
              <select className="input-field" value={filter.value} onChange={(event) => filter.onChange?.(event.target.value)}>
                {filter.options.map((option) => (
                  <option key={`${filter.name}-${option.value}`} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          ))}

          {actionLabel ? (
            <button type="button" className="btn-primary self-end lg:self-auto" onClick={onAction}>
              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AdminSearchFilter;