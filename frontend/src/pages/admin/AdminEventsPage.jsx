import { useEffect, useMemo, useState } from 'react';
import { deleteAdminEvent, listAdminEvents } from '../../api/admin';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import DashboardStats from '../../components/admin/DashboardStats';
import EventForm from '../../components/admin/EventForm';
import EventTable from '../../components/admin/EventTable';
import ConfirmModal from '../../components/common/ConfirmModal';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import ToastStack from '../../components/common/ToastStack';
import { useToastQueue } from '../../hooks/useToastQueue';

function AdminEventsPage() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [eventStatus, setEventStatus] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { items: toasts, pushToast, removeToast } = useToastQueue();

  const refreshItems = async () => {
    setLoading(true);
    setError('');

    try {
      const nextItems = await listAdminEvents({ search, status, event_status: eventStatus });
      setItems(Array.isArray(nextItems) ? nextItems : nextItems?.results || []);
    } catch (nextError) {
      setItems([]);
      setError(nextError.message || 'Không thể tải danh sách sự kiện.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshItems();
  }, [eventStatus, search, status]);

  const stats = useMemo(() => ([
    { label: 'Tổng sự kiện', value: items.length, description: 'Theo bộ lọc hiện tại ở màn hình admin.' },
    { label: 'Upcoming', value: items.filter((item) => item.event_status === 'UPCOMING').length, meta: 'LIVE' },
    { label: 'Past', value: items.filter((item) => item.event_status === 'PAST').length, meta: 'PAST' },
    { label: 'Published', value: items.filter((item) => item.status === 'PUBLISHED').length, meta: 'PUBLISHED' },
  ]), [items]);

  return (
    <>
      <ToastStack items={toasts} onDismiss={removeToast} />
      <div className="space-y-8">
        <DashboardStats items={stats} />

        <AdminSearchFilter
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Tìm sự kiện theo tên, địa điểm hoặc nội dung"
          filters={[
            {
              name: 'status',
              label: 'Publish',
              value: status,
              onChange: setStatus,
              options: [
                { value: '', label: 'Tất cả' },
                { value: 'PUBLISHED', label: 'PUBLISHED' },
                { value: 'DRAFT', label: 'DRAFT' },
                { value: 'ARCHIVED', label: 'ARCHIVED' },
              ],
            },
            {
              name: 'event_status',
              label: 'Nhóm thời gian',
              value: eventStatus,
              onChange: setEventStatus,
              options: [
                { value: '', label: 'Tất cả' },
                { value: 'UPCOMING', label: 'UPCOMING' },
                { value: 'PAST', label: 'PAST' },
              ],
            },
          ]}
          actionLabel="Tạo sự kiện mới"
          onAction={() => setSelectedItem(null)}
        />

        {error && !items.length && !loading ? <ErrorState message={error} action={refreshItems} /> : null}
        {loading && !items.length ? <LoadingState title="Đang tải danh sách sự kiện" /> : null}

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.06fr)_minmax(420px,0.94fr)]">
          <div className="space-y-4">
            <EventTable
              items={items}
              onEdit={(item) => {
                setSelectedItem(item);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDelete={setDeleteTarget}
            />
          </div>

          <EventForm
            initial={selectedItem}
            onCancel={() => setSelectedItem(null)}
            onSaved={async (_savedItem, actionType) => {
              await refreshItems();
              pushToast({
                type: 'success',
                title: actionType === 'created' ? 'Đã tạo mới' : 'Đã cập nhật',
                message: actionType === 'created' ? 'Sự kiện đã được tạo thành công.' : 'Sự kiện đã được cập nhật.',
              });
            }}
          />
        </section>
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Xóa sự kiện"
        message={deleteTarget ? `Bạn sắp xóa sự kiện “${deleteTarget.title}”. Thao tác này không thể hoàn tác.` : ''}
        confirmLabel="Xóa sự kiện"
        isConfirming={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) {
            return;
          }

          try {
            setIsDeleting(true);
            await deleteAdminEvent(deleteTarget.id);
            await refreshItems();
            setSelectedItem((current) => current?.id === deleteTarget.id ? null : current);
            pushToast({ type: 'success', title: 'Đã xóa', message: 'Sự kiện đã được xóa.' });
            setDeleteTarget(null);
          } catch (nextError) {
            pushToast({ type: 'error', title: 'Xóa thất bại', message: nextError.message || 'Không thể xóa sự kiện.' });
          } finally {
            setIsDeleting(false);
          }
        }}
      />
    </>
  );
}

export default AdminEventsPage;