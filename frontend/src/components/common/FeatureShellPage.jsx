import PageLayout from './PageLayout';

function FeatureShellPage({ eyebrow, title, description, highlights = [], actions = null, breadcrumbItems = [] }) {
  return (
    <PageLayout
      breadcrumbItems={breadcrumbItems.length ? breadcrumbItems : [{ label: 'Trang chủ', to: '/' }, { label: title }]}
      eyebrow={eyebrow}
      title={title}
      description={description}
      actions={actions}
      aside={
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
      }
    />
  );
}

export default FeatureShellPage;
