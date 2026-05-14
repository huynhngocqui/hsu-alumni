import { useEffect, useMemo, useState } from 'react';
import EmptyState from '../../components/common/EmptyState';
import PageLayout from '../../components/common/PageLayout';
import PaginationControls from '../../components/common/PaginationControls';
import NewsSearchBar from '../../components/news/NewsSearchBar';
import { listPublicStories } from '../../api/content';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import StoryCard from '../../components/stories/StoryCard';

function PublicStoriesPage({ category, eyebrow, title, description, breadcrumbItems, detailBasePath, pageSize = 9 }) {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebouncedValue(searchValue, 250);

  useEffect(() => {
    let active = true;

    async function loadStories() {
      try {
        const nextItems = await listPublicStories(category);
        if (active) {
          setItems(nextItems);
          setCurrentPage(1);
        }
      } catch {
        if (active) {
          setItems([]);
          setCurrentPage(1);
        }
      }
    }

    loadStories();
    return () => {
      active = false;
    };
  }, [category]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = debouncedSearch.trim().toLowerCase();
    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => [
      item.title,
      item.alumni_name,
      item.role_title,
      item.company_name,
      item.excerpt,
      item.body,
    ].some((value) => (value || '').toLowerCase().includes(normalizedQuery)));
  }, [debouncedSearch, items]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const visibleItems = filteredItems.slice(startIndex, startIndex + pageSize);

  return (
    <PageLayout
      breadcrumbItems={breadcrumbItems}
      eyebrow={eyebrow}
      title={title}
      description={description}
      panelContent={
        <NewsSearchBar
          value={searchValue}
          onChange={(value) => {
            setSearchValue(value);
            setCurrentPage(1);
          }}
          resultsLabel={`Hiển thị ${visibleItems.length} / ${filteredItems.length} câu chuyện`}
        />
      }
    >
      {!items.length ? (
        <EmptyState
          title="Chưa có alumni story"
          message="Admin chưa publish nội dung cho chuyên mục này."
        />
      ) : !filteredItems.length ? (
        <EmptyState
          title="Không tìm thấy câu chuyện phù hợp"
          message="Hãy thử đổi từ khóa tìm kiếm để tìm alumni story phù hợp hơn."
          action={() => setSearchValue('')}
          actionLabel="Xóa tìm kiếm"
        />
      ) : (
        <section className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item) => (
              <StoryCard key={item.id} item={item} detailBasePath={detailBasePath} compact />
            ))}
          </div>
          <PaginationControls currentPage={safeCurrentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </section>
      )}
    </PageLayout>
  );
}

export default PublicStoriesPage;