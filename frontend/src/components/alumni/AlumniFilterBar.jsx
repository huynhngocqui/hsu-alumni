import { useEffect, useState } from 'react';
import { ChevronDownIcon, SearchIcon } from '../common/icons';

function SelectField({ label, value, options, onChange }) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select className="input-field bg-white" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={`${label}-${option}`} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function AlumniFilterBar({ filters, filterOptions, onChange, onReset }) {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setSearchValue(filters.search || '');
  }, [filters.search]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (searchValue !== filters.search) {
        onChange({ search: searchValue });
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [filters.search, onChange, searchValue]);

  const hasActiveFilters = Boolean(
    (filters.search || '').trim()
      || filters.education_level
      || filters.cohort
      || filters.field
      || filters.major
  );

  return (
    <section className="panel overflow-hidden border-slate-200/90 bg-white">
      <div className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:px-6">
        <label className="relative flex-1">
          <span className="sr-only">Tìm kiếm alumni</span>
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="input-field bg-slate-50 pl-11"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Nhập tên để tìm kiếm..."
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn-secondary gap-2" onClick={() => setIsExpanded((current) => !current)}>
            <span>Bộ lọc</span>
            <ChevronDownIcon className={`h-4 w-4 transition ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          {hasActiveFilters ? (
            <button type="button" className="btn-secondary" onClick={onReset}>
              Xóa lọc
            </button>
          ) : null}
        </div>
      </div>

      <div className={`${isExpanded ? 'grid' : 'hidden'} gap-3 border-t border-slate-200/80 bg-slate-50/75 px-5 py-5 md:grid-cols-2 xl:grid-cols-4 lg:grid`}>
        <SelectField
          label="Bậc đào tạo"
          value={filters.education_level}
          options={filterOptions.education_level}
          onChange={(value) => onChange({ education_level: value })}
        />
        <SelectField
          label="Khóa"
          value={filters.cohort}
          options={filterOptions.cohort}
          onChange={(value) => onChange({ cohort: value })}
        />
        <SelectField
          label="Lĩnh vực"
          value={filters.field}
          options={filterOptions.field}
          onChange={(value) => onChange({ field: value })}
        />
        <SelectField
          label="Ngành"
          value={filters.major}
          options={filterOptions.major}
          onChange={(value) => onChange({ major: value })}
        />
      </div>
    </section>
  );
}

export default AlumniFilterBar;