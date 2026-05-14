import { useEffect, useState } from 'react';
import EmptyState from '../../components/common/EmptyState';
import PageLayout from '../../components/common/PageLayout';
import { listPublicStories } from '../../api/content';

function PublicStoriesPage({ category, eyebrow, title, description, breadcrumbItems }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadStories() {
      try {
        const nextItems = await listPublicStories(category);
        if (active) {
          setItems(nextItems);
        }
      } catch {
        if (active) {
          setItems([]);
        }
      }
    }

    loadStories();
    return () => {
      active = false;
    };
  }, [category]);

  return (
    <PageLayout
      breadcrumbItems={breadcrumbItems}
      eyebrow={eyebrow}
      title={title}
      description={description}
    >
      {items.length ? (
        <section className="grid gap-5 lg:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="panel overflow-hidden">
              {item.featured_image_url ? (
                <img src={item.featured_image_url} alt={item.title} className="h-56 w-full object-cover" />
              ) : null}
              <div className="px-6 py-6 lg:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-red">{item.story_category}</p>
                <h2 className="mt-3 text-2xl font-semibold text-brand-ink">{item.title}</h2>
                <p className="mt-3 text-sm text-slate-500">{item.alumni_name}{item.role_title ? ` · ${item.role_title}` : ''}{item.company_name ? ` · ${item.company_name}` : ''}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.excerpt || item.body}</p>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState
          title="Chưa có alumni story"
          message="Admin chưa publish nội dung cho chuyên mục này."
        />
      )}
    </PageLayout>
  );
}

export default PublicStoriesPage;