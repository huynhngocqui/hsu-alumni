import { Link } from 'react-router-dom';
import { ArrowRightIcon, ExternalLinkIcon } from './icons';

function BreadcrumbItem({ item, isLast }) {
  const className = `inline-flex items-center gap-1 transition ${
    isLast ? 'font-semibold text-brand-ink' : 'text-slate-500 hover:text-brand-ink'
  }`;

  if (item.to && !isLast) {
    if (item.external) {
      return (
        <a href={item.to} target={item.target || '_blank'} rel={item.rel || 'noreferrer noopener'} className={className}>
          <span>{item.label}</span>
          <ExternalLinkIcon className="h-3.5 w-3.5" />
        </a>
      );
    }

    return (
      <Link to={item.to} className={className}>
        {item.label}
      </Link>
    );
  }

  return (
    <span className={className} aria-current={isLast ? 'page' : undefined}>
      {item.label}
    </span>
  );
}

function Breadcrumb({ items = [] }) {
  if (!items.length) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
              {index > 0 ? <ArrowRightIcon className="h-3.5 w-3.5 text-slate-300" /> : null}
              <BreadcrumbItem item={item} isLast={isLast} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;