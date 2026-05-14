function DashboardStats({ items = [] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article key={item.label} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-brand-ink">{item.value}</p>
            </div>
            {item.meta ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">{item.meta}</span> : null}
          </div>
          {item.description ? <p className="mt-4 text-sm leading-6 text-slate-500">{item.description}</p> : null}
        </article>
      ))}
    </section>
  );
}

export default DashboardStats;