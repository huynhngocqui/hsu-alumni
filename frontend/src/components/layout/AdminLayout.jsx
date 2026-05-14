import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import AdminHeader from '../admin/AdminHeader';
import AdminSidebar from '../admin/AdminSidebar';
import {
  CalendarIcon,
  ChartBarIcon,
  DocumentIcon,
  FolderIcon,
  ImageIcon,
  TagIcon,
  UsersIcon,
} from '../common/icons';

const adminSections = [
  {
    label: 'Điều phối',
    items: [
      { to: '/admin', label: 'Tổng quan', icon: ChartBarIcon },
      { to: '/admin/users', label: 'Người dùng', icon: UsersIcon },
    ],
  },
  {
    label: 'Nội dung mới',
    items: [
      { to: '/admin/tin-tuc', label: 'Tin tức', icon: DocumentIcon },
      { to: '/admin/su-kien', label: 'Sự kiện', icon: CalendarIcon },
      { to: '/admin/tin-tuc/danh-muc', label: 'Danh mục tin tức', icon: FolderIcon },
      { to: '/admin/cong-dong-alumni', label: 'Cộng đồng Alumni', icon: UsersIcon },
    ],
  },
  {
    label: 'CMS hiện có',
    items: [
      { to: '/admin/content/articles', label: 'Bài viết legacy', icon: DocumentIcon },
      { to: '/admin/content/stories', label: 'Alumni stories', icon: ImageIcon },
      { to: '/admin/content/gallery', label: 'Thư viện ảnh', icon: ImageIcon },
      { to: '/admin/tags', label: 'Tags', icon: TagIcon },
    ],
  },
];

function AdminLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const allItems = adminSections.flatMap((section) => section.items);
  const activeItem = allItems.find((item) => location.pathname === item.to)
    || allItems.find((item) => location.pathname.startsWith(`${item.to}/`));

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#f8fbff_0%,_#eef4fb_38%,_#e7edf8_100%)] text-slate-900">
      <AdminSidebar
        sections={adminSections}
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-[290px]">
        <AdminHeader
          title={activeItem?.label || 'HSU Alumni CMS'}
          description="Hệ quản trị nội dung cho tin tức, sự kiện và cộng đồng cựu sinh viên Hoa Sen."
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="px-4 pb-8 pt-6 sm:px-6 lg:px-8 xl:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
