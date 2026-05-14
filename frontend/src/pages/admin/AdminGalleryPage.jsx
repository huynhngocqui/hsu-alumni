import AdminCrudPage from '../../components/admin/AdminCrudPage';
import { createAdminGalleryItem, deleteAdminGalleryItem, listAdminGalleryItems, updateAdminGalleryItem } from '../../api/admin';

const fields = [
  { name: 'title', label: 'Tiêu đề', type: 'text', defaultValue: '' },
  { name: 'album_name', label: 'Album', type: 'text', defaultValue: '' },
  { name: 'description', label: 'Mô tả', type: 'textarea', defaultValue: '' },
  { name: 'image_url', label: 'Image URL', type: 'url', defaultValue: '' },
  { name: 'drive_url', label: 'Google Drive URL', type: 'url', defaultValue: '' },
  { name: 'contributor_name', label: 'Người đóng góp', type: 'text', defaultValue: '' },
  {
    name: 'status',
    label: 'Trạng thái',
    type: 'select',
    defaultValue: 'DRAFT',
    options: [
      { label: 'Draft', value: 'DRAFT' },
      { label: 'Published', value: 'PUBLISHED' },
      { label: 'Archived', value: 'ARCHIVED' },
    ],
  },
];

function AdminGalleryPage() {
  return (
    <AdminCrudPage
      breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Admin', to: '/admin' }, { label: 'Duyệt thư viện ảnh' }]}
      eyebrow="Admin"
      title="Duyệt thư viện ảnh"
      description="Quản lý các mục gallery, liên kết Google Drive và album hiển thị công khai."
      fields={fields}
      listItems={listAdminGalleryItems}
      createItem={createAdminGalleryItem}
      updateItem={updateAdminGalleryItem}
      deleteItem={deleteAdminGalleryItem}
      emptyMessage="Chưa có mục gallery nào."
    />
  );
}

export default AdminGalleryPage;