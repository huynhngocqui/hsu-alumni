function AuthPageHeading({ title, description, children = null }) {
  return (
    <div className="border-b border-slate-100 pb-4">
      <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-brand-ink sm:text-3xl">{title}</h1>
      {description ? <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p> : null}
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

export default AuthPageHeading;