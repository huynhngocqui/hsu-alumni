import AdminCrudPage from '../../components/admin/AdminCrudPage';
import { createAdminArticle, deleteAdminArticle, listAdminArticles, updateAdminArticle } from '../../api/admin';

const fields = [
  { name: 'title', label: 'Tiêu đề', type: 'text', defaultValue: '' },
  { name: 'excerpt', label: 'Tóm tắt', type: 'textarea', defaultValue: '' },
  { name: 'body', label: 'Nội dung', type: 'textarea', defaultValue: '' },
  {
    name: 'article_type',
    label: 'Loại bài viết',
    type: 'select',
    defaultValue: 'NEWS',
    options: [
      { label: 'Tin tức', value: 'NEWS' },
      { label: 'Sự kiện', value: 'EVENT' },
      { label: 'Career Webinar', value: 'WEBINAR' },
      { label: 'Trang nội dung', value: 'PAGE' },
    ],
  },
  { name: 'external_url', label: 'External URL', type: 'url', defaultValue: '' },
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

function AdminArticlesPage() {
  return (
    <AdminCrudPage
      breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Admin', to: '/admin' }, { label: 'Quản lý bài viết CMS' }]}
      eyebrow="Admin"
      title="Quản lý bài viết CMS"
      description="Quản trị bài viết Tin tức, Sự kiện, Career Webinars và các landing page nội bộ."
      fields={fields}
      listItems={listAdminArticles}
      createItem={createAdminArticle}
      updateItem={updateAdminArticle}
      deleteItem={deleteAdminArticle}
      emptyMessage="Chưa có bài viết CMS nào."
    />
  );
}

export default AdminArticlesPage;