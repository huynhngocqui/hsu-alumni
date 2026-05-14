import { useEffect, useState } from 'react';
import EmptyState from '../../components/common/EmptyState';
import PageLayout from '../../components/common/PageLayout';
import { listPublicGallery } from '../../api/content';

function PublicGalleryPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadGallery() {
      try {
        const nextItems = await listPublicGallery();
        if (active) {
          setItems(nextItems);
        }
      } catch {
        if (active) {
          setItems([]);
        }
      }
    }

    loadGallery();
    return () => {
      active = false;
    };
  }, []);

  return (
    <PageLayout
      breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Cộng đồng Alumni' }, { label: 'Thư viện hình ảnh' }]}
      eyebrow="Cộng đồng Alumni"
      title="Thư viện hình ảnh"
      description="Gallery công khai lấy trực tiếp từ CMS đã publish."
    >
      {items.length ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="panel overflow-hidden">
              {item.image_url ? (
                <img src={item.image_url} alt={item.title} className="h-56 w-full object-cover" />
              ) : (
                <div className="h-56 bg-slate-100" />
              )}
              <div className="px-6 py-6">
                <h2 className="text-xl font-semibold text-brand-ink">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-500">{item.album_name || 'Album chung'}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
                {item.drive_url ? (
                  <a href={item.drive_url} target="_blank" rel="noreferrer noopener" className="mt-4 inline-flex text-sm font-semibold text-brand">
                    Xem nguồn Google Drive
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState
          title="Chưa có gallery"
          message="Admin chưa publish mục hình ảnh nào."
        />
      )}
    </PageLayout>
  );
}

export default PublicGalleryPage;