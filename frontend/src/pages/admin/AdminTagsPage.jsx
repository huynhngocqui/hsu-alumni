import AdminCrudPage from '../../components/admin/AdminCrudPage';
import { createAdminTag, deleteAdminTag, listAdminTags, updateAdminTag } from '../../api/admin';

const fields = [
  { name: 'name', label: 'Tên tag', type: 'text', defaultValue: '' },
];

function AdminTagsPage() {
  return (
    <AdminCrudPage
      breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Admin', to: '/admin' }, { label: 'Quản lý taxonomy tags' }]}
      eyebrow="Admin"
      title="Quản lý taxonomy tags"
      description="Taxonomy dùng chung cho Profile, Co-op và Job được quản lý trực tiếp từ backend admin API."
      fields={fields}
      listItems={listAdminTags}
      createItem={createAdminTag}
      updateItem={updateAdminTag}
      deleteItem={deleteAdminTag}
      emptyMessage="Chưa có tag nào. Tạo tag mới để phục vụ filter và matching engine."
    />
  );
}

export default AdminTagsPage;