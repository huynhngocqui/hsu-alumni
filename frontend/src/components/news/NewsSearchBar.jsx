import { SearchIcon } from '../common/icons';

function NewsSearchBar({ value, onChange, resultsLabel }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_36px_rgba(16,35,69,0.06)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full lg:max-w-xl">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon className="h-4 w-4" />
          </span>
          <input
            type="search"
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            placeholder="Tìm theo tiêu đề hoặc nội dung bài viết"
            className="input-field pl-11"
          />
        </label>
        <p className="text-sm text-slate-500">{resultsLabel}</p>
      </div>
    </div>
  );
}

export default NewsSearchBar;