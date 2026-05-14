import { useEffect, useMemo, useState } from 'react';
import { deleteAdminStory, listAdminStories } from '../../api/admin';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import DashboardStats from '../../components/admin/DashboardStats';
import StoryForm from '../../components/admin/StoryForm';
import StoryTable from '../../components/admin/StoryTable';
import ConfirmModal from '../../components/common/ConfirmModal';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import ToastStack from '../../components/common/ToastStack';
import { useToastQueue } from '../../hooks/useToastQueue';

function AdminStoriesPage() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { items: toasts, pushToast, removeToast } = useToastQueue();

  const refreshItems = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = await listAdminStories();
      setItems(Array.isArray(payload) ? payload : payload?.results || []);
    } catch (nextError) {
      setItems([]);
      setError(nextError.message || 'Không thể tải danh sách alumni stories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshItems();
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch = !normalizedQuery || [
        item.title,
        item.alumni_name,
        item.role_title,
        item.company_name,
        item.excerpt,
      ].some((value) => (value || '').toLowerCase().includes(normalizedQuery));

      const matchesStatus = !statusFilter || item.status === statusFilter;
      const matchesCategory = !categoryFilter || item.story_category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [categoryFilter, items, search, statusFilter]);

  const stats = useMemo(() => ([
    { label: 'Tổng story', value: items.length, description: 'Bao gồm cả cựu sinh viên tiêu biểu và câu chuyện thành công.' },
    { label: 'Published', value: items.filter((item) => item.status === 'PUBLISHED').length, meta: 'LIVE' },
    { label: 'Tiêu biểu', value: items.filter((item) => item.story_category === 'OUTSTANDING').length, meta: 'OUTSTANDING' },
    { label: 'Thành công', value: items.filter((item) => item.story_category === 'SUCCESS').length, meta: 'SUCCESS' },
  ]), [items]);

  return (
    <>
      <ToastStack items={toasts} onDismiss={removeToast} />
      <div className="space-y-8">
        <DashboardStats items={stats} />

        <AdminSearchFilter
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Tìm theo tiêu đề, alumni hoặc phần tóm tắt"
          filters={[
            {
              name: 'story_category',
              label: 'Chuyên mục',
              value: categoryFilter,
              onChange: setCategoryFilter,
              options: [
                { value: '', label: 'Tất cả chuyên mục' },
                { value: 'OUTSTANDING', label: 'Cựu sinh viên tiêu biểu' },
                { value: 'SUCCESS', label: 'Câu chuyện thành công' },
              ],
            },
            {
              name: 'status',
              label: 'Trạng thái',
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: '', label: 'Tất cả' },
                { value: 'PUBLISHED', label: 'PUBLISHED' },
                { value: 'DRAFT', label: 'DRAFT' },
                { value: 'ARCHIVED', label: 'ARCHIVED' },
              ],
            },
          ]}
          actionLabel="Tạo story mới"
          onAction={() => setSelectedItem(null)}
        />

        {error && !items.length && !loading ? <ErrorState message={error} action={refreshItems} /> : null}
        {loading && !items.length ? <LoadingState title="Đang tải alumni stories" /> : null}

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.04fr)_minmax(420px,0.96fr)]">
          <StoryTable
            items={filteredItems}
            onEdit={(item) => {
              setSelectedItem(item);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDelete={setDeleteTarget}
          />

          <StoryForm
            initial={selectedItem}
            onCancel={() => setSelectedItem(null)}
            onSaved={async (_savedItem, actionType) => {
              await refreshItems();
              pushToast({
                type: 'success',
                title: actionType === 'created' ? 'Đã tạo mới' : 'Đã cập nhật',
                message: actionType === 'created' ? 'Alumni story đã được tạo.' : 'Alumni story đã được cập nhật.',
              });
            }}
          />
        </section>
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Xóa alumni story"
        message={deleteTarget ? `Bạn sắp xóa nội dung “${deleteTarget.title}”. Thao tác này không thể hoàn tác.` : ''}
        confirmLabel="Xóa câu chuyện"
        isConfirming={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) {
            return;
          }

          try {
            setIsDeleting(true);
            await deleteAdminStory(deleteTarget.id);
            await refreshItems();
            setSelectedItem((current) => current?.id === deleteTarget.id ? null : current);
            pushToast({ type: 'success', title: 'Đã xóa', message: 'Alumni story đã được xóa.' });
            setDeleteTarget(null);
          } catch (nextError) {
            pushToast({ type: 'error', title: 'Xóa thất bại', message: nextError.message || 'Không thể xóa alumni story.' });
          } finally {
            setIsDeleting(false);
          }
        }}
      />
    </>
  );
}

export default AdminStoriesPage;