import { useEffect, useRef, useState } from 'react';
import EmptyState from '../../components/common/EmptyState';
import GalleryLightbox from '../../components/common/GalleryLightbox';
import PageLayout from '../../components/common/PageLayout';
import PaginationControls from '../../components/common/PaginationControls';
import { contributeGalleryLink, listPublicGallery } from '../../api/content';

const PAGE_SIZE = 6;

const EMPTY_FORM = { title: '', contributor_name: '', image_url: '', drive_url: '', description: '' };

function PublicGalleryPage() {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openIndex, setOpenIndex] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitState, setSubmitState] = useState({ type: '', message: '' });
  const formRef = useRef(null);

  useEffect(() => {
    let active = true;

    async function loadGallery() {
      try {
        const nextItems = await listPublicGallery();
        if (active) {
          setItems(nextItems);
          setCurrentPage(1);
        }
      } catch {
        if (active) setItems([]);
      }
    }

    loadGallery();
    return () => { active = false; };
  }, []);

  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const pageItems = items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Map page-local index → global index for lightbox
  const toGlobalIndex = (localIdx) => (currentPage - 1) * PAGE_SIZE + localIdx;
  const toLocalIndex = (globalIdx) => globalIdx - (currentPage - 1) * PAGE_SIZE;

  function handlePrev() {
    if (openIndex === null) return;
    if (openIndex > 0) setOpenIndex(openIndex - 1);
  }

  function handleNext() {
    if (openIndex === null) return;
    if (openIndex < items.length - 1) setOpenIndex(openIndex + 1);
  }

  async function handleContribute(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setSubmitState({ type: 'error', message: 'Vui lòng nhập tiêu đề ảnh.' });
      return;
    }
    try {
      setSubmitState({ type: '', message: '' });
      await contributeGalleryLink(form);
      setForm(EMPTY_FORM);
      setSubmitState({ type: 'success', message: 'Đóng góp đã được ghi nhận và đang chờ admin duyệt. Cảm ơn bạn!' });
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      setSubmitState({ type: 'error', message: err.message || 'Không thể gửi đóng góp. Vui lòng thử lại.' });
    }
  }

  return (
    <PageLayout
      breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Cộng đồng Alumni' }, { label: 'Thư viện hình ảnh' }]}
      eyebrow="Cộng đồng Alumni"
      title="Thư viện hình ảnh"
      description="Gallery công khai lấy trực tiếp từ CMS đã publish."
    >
      {items.length ? (
        <>
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {pageItems.map((item, localIdx) => (
              <article
                key={item.id}
                className="panel cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
                onClick={() => setOpenIndex(toGlobalIndex(localIdx))}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setOpenIndex(toGlobalIndex(localIdx))}
                aria-label={`Mở ảnh: ${item.title}`}
              >
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="h-56 w-full object-cover" />
                ) : (
                  <div className="h-56 bg-slate-100" />
                )}
                <div className="px-6 py-6">
                  <h2 className="text-xl font-semibold text-brand-ink">{item.title}</h2>
                  <p className="mt-2 text-sm text-slate-500">{item.album_name || 'Album chung'}</p>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              </article>
            ))}
          </section>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => { setCurrentPage(page); setOpenIndex(null); }}
          />

          <GalleryLightbox
            items={items}
            openIndex={openIndex}
            onClose={() => setOpenIndex(null)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </>
      ) : (
        <EmptyState
          title="Chưa có gallery"
          message="Admin chưa publish mục hình ảnh nào."
        />
      )}

      {/* Contribution form — always visible */}
      <section ref={formRef} className="mt-12 panel px-6 py-8 lg:px-10">
        <h2 className="text-xl font-semibold text-brand-ink">Đóng góp ảnh vào thư viện</h2>
        <p className="mt-2 text-sm text-slate-500">Ảnh của bạn sẽ được admin xét duyệt trước khi hiển thị công khai.</p>
        <form className="mt-6 grid gap-5 lg:grid-cols-2" onSubmit={handleContribute}>
          <label>
            <span className="input-label">Tiêu đề ảnh *</span>
            <input
              className="input-field"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Ví dụ: Lễ tốt nghiệp K18 — Hoa Sen 2024"
            />
          </label>
          <label>
            <span className="input-label">Tên người đóng góp</span>
            <input
              className="input-field"
              value={form.contributor_name}
              onChange={(e) => setForm((f) => ({ ...f, contributor_name: e.target.value }))}
              placeholder="Họ tên hoặc để trống"
            />
          </label>
          <label>
            <span className="input-label">Link ảnh (URL)</span>
            <input
              className="input-field"
              type="url"
              value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              placeholder="https://drive.google.com/..."
            />
          </label>
          <label>
            <span className="input-label">Link album Google Drive</span>
            <input
              className="input-field"
              type="url"
              value={form.drive_url}
              onChange={(e) => setForm((f) => ({ ...f, drive_url: e.target.value }))}
              placeholder="https://drive.google.com/..."
            />
          </label>
          <label className="lg:col-span-2">
            <span className="input-label">Mô tả ngắn</span>
            <textarea
              className="input-field min-h-24"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Bối cảnh, sự kiện, năm tổ chức..."
            />
          </label>
          <div className="flex flex-col gap-3 lg:col-span-2 lg:flex-row lg:items-center">
            <button type="submit" className="btn-primary">Gửi đóng góp</button>
            {submitState.message ? (
              <p className={`text-sm ${submitState.type === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
                {submitState.message}
              </p>
            ) : null}
          </div>
        </form>
      </section>
    </PageLayout>
  );
}

export default PublicGalleryPage;