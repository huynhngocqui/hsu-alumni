function FeatureShellPage({ eyebrow, title, description, highlights = [], actions = null }) {
  return (
    <div className="page-shell">
      <section className="panel overflow-hidden">
        <div className="grid gap-8 px-6 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
          <div>
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">{eyebrow}</p>
            ) : null}
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{description}</p>
            {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
          </div>

          <div className="rounded-[28px] bg-brand-ink px-6 py-8 text-white">
            <h2 className="text-lg font-semibold">Trạng thái triển khai</h2>
            <p className="mt-3 text-sm leading-7 text-white/75">
              Page shell đã sẵn sàng để nối API, state server và workflow nghiệp vụ trong các vòng implementation tiếp theo.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/85">
              {highlights.map((item) => (
                <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FeatureShellPage;
