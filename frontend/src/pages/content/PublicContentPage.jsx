import { useEffect, useState } from 'react';
import EmptyState from '../../components/common/EmptyState';
import PageLayout from '../../components/common/PageLayout';
import { getPublicContentPage } from '../../api/content';

function PublicContentPage({ pageSlug, eyebrow, title, description, breadcrumbItems }) {
  const [page, setPage] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadPage() {
      try {
        const nextPage = await getPublicContentPage(pageSlug);
        if (active) {
          setPage(nextPage);
          setFailed(false);
        }
      } catch {
        if (active) {
          setPage(null);
          setFailed(true);
        }
      }
    }

    loadPage();
    return () => {
      active = false;
    };
  }, [pageSlug]);

  return (
    <PageLayout
      breadcrumbItems={breadcrumbItems}
      eyebrow={eyebrow}
      title={page?.title || title}
      description={page?.excerpt || description}
    >
      {page ? (
        <section className="panel px-6 py-8 text-sm leading-8 text-slate-700 lg:px-10">
          <div className="whitespace-pre-line">{page.body}</div>
        </section>
      ) : (
        <EmptyState
          title="Chưa có nội dung CMS"
          message={failed ? 'Admin chưa publish nội dung cho trang này.' : 'Đang tải nội dung...'}
        />
      )}
    </PageLayout>
  );
}

export default PublicContentPage;