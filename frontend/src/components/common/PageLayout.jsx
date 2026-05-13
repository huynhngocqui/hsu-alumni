import Breadcrumb from './Breadcrumb';

function PageLayout({
  breadcrumbItems = [],
  eyebrow,
  title,
  description,
  actions = null,
  aside = null,
  panelContent = null,
  children = null,
}) {
  return (
    <div className="page-shell">
      <Breadcrumb items={breadcrumbItems} />

      <section className="panel overflow-hidden">
        <div className={`gap-8 px-6 py-8 lg:px-10 lg:py-10 ${aside ? 'grid lg:grid-cols-[1.1fr_0.9fr]' : ''}`}>
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand-red">{eyebrow}</p>
            ) : null}
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-brand-ink sm:text-5xl">{title}</h1>
            {description ? <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{description}</p> : null}
            {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
          </div>

          {aside ? <div className="min-w-0">{aside}</div> : null}
        </div>

        {panelContent ? <div className="border-t border-slate-200 bg-slate-50/75 px-6 py-6 lg:px-10">{panelContent}</div> : null}
      </section>

      {children}
    </div>
  );
}

export default PageLayout;