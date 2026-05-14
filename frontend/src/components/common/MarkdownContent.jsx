import ReactMarkdown from 'react-markdown';
import { resolveMediaUrl } from '../../utils/media';
import BrandImage from './BrandImage';

function MarkdownContent({ content, className = '', emptyMessage = 'Chưa có nội dung để hiển thị.' }) {
  const normalizedContent = typeof content === 'string' ? content.trim() : '';

  if (!normalizedContent) {
    return <p className="text-sm leading-7 text-slate-400">{emptyMessage}</p>;
  }

  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-brand-ink first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="mt-8 text-3xl font-bold tracking-tight text-brand-ink first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="mt-7 text-2xl font-bold text-brand-ink first:mt-0">{children}</h3>,
          p: ({ children }) => <p className="mt-4 text-[1rem] leading-8 text-slate-700 first:mt-0">{children}</p>,
          ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6 text-[1rem] leading-8 text-slate-700">{children}</ul>,
          ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-[1rem] leading-8 text-slate-700">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => <blockquote className="mt-6 rounded-[24px] border-l-4 border-brand bg-brand-sand px-6 py-5 text-[1rem] leading-8 text-brand-ink">{children}</blockquote>,
          a: ({ href, children }) => {
            const resolvedHref = resolveMediaUrl(href || '');
            const isExternal = /^https?:\/\//i.test(resolvedHref) && !resolvedHref.startsWith(window?.location?.origin || '');

            return (
              <a
                href={resolvedHref || href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noreferrer noopener' : undefined}
                className="font-semibold text-brand underline decoration-brand/30 underline-offset-4"
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => (
            <BrandImage
              src={src}
              alt={alt || 'Markdown image'}
              loading="lazy"
              className="my-6 w-full rounded-[22px] object-cover"
              fallback={<div className="my-6 h-72 w-full rounded-[22px] bg-slate-100" />}
            />
          ),
          hr: () => <hr className="my-8 border-slate-200" />,
          code: ({ inline, children }) => (
            inline
              ? <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.92em] text-brand-ink">{children}</code>
              : <code className="block overflow-x-auto rounded-[20px] bg-slate-950/95 px-4 py-4 text-sm leading-7 text-slate-100">{children}</code>
          ),
          pre: ({ children }) => <pre className="mt-6 overflow-x-auto">{children}</pre>,
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownContent;