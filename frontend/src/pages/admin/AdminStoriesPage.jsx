import AdminCrudPage from '../../components/admin/AdminCrudPage';
import { createAdminStory, deleteAdminStory, listAdminStories, updateAdminStory } from '../../api/admin';

const fields = [
  { name: 'title', label: 'Tiêu đề câu chuyện', type: 'text', defaultValue: '' },
  { name: 'alumni_name', label: 'Tên alumni', type: 'text', defaultValue: '' },
  { name: 'company_name', label: 'Doanh nghiệp', type: 'text', defaultValue: '' },
  { name: 'role_title', label: 'Chức danh', type: 'text', defaultValue: '' },
  { name: 'excerpt', label: 'Tóm tắt', type: 'textarea', defaultValue: '' },
  { name: 'body', label: 'Nội dung', type: 'textarea', defaultValue: '' },
  { name: 'featured_image_url', label: 'Featured image URL', type: 'url', defaultValue: '' },
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

function AdminStoriesPage() {
  return (
    <AdminCrudPage
      breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Admin', to: '/admin' }, { label: 'Alumni stories' }]}
      eyebrow="Admin"
      title="Quản lý alumni stories"
      description="CRUD cho câu chuyện thành công và hồ sơ cựu sinh viên tiêu biểu trên CMS."
      fields={fields}
      listItems={listAdminStories}
      createItem={createAdminStory}
      updateItem={updateAdminStory}
      deleteItem={deleteAdminStory}
      emptyMessage="Chưa có alumni story nào."
    />
  );
}

export default AdminStoriesPage;