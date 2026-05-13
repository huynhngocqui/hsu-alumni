function AuthPageHeading({ eyebrow = 'Xác thực', title, description, children = null }) {
  return (
    <div className="border-b border-slate-100 pb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand-red">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-ink sm:text-4xl">{title}</h1>
      {description ? <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p> : null}
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

export default AuthPageHeading;