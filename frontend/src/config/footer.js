import { socialLinks } from './socialLinks';

export const footerConfig = {
  brand: {
    eyebrow: 'HSU Alumni',
    title: 'Đại học Hoa Sen',
    description:
      'Cổng kết nối cộng đồng cựu sinh viên, dịch vụ Alumni và những cơ hội đồng hành cùng hệ sinh thái Hoa Sen.',
  },
  campuses: [
    {
      label: 'Trụ sở chính',
      value: '08 Nguyễn Văn Tráng, Phường Bến Thành, TP. Hồ Chí Minh',
    },
    {
      label: 'CS Cao Thắng',
      value: '93 Cao Thắng, Phường Bàn Cờ, TP. Hồ Chí Minh',
    },
    {
      label: 'CS Thành Thái',
      value: '7/1 Thành Thái, Phường Diên Hồng, TP. Hồ Chí Minh',
    },
    {
      label: 'CS Quang Trung',
      value: 'Lô 10, Đường số 3, Công viên Phần mềm Quang Trung, Phường Trung Mỹ Tây, TP. Hồ Chí Minh',
    },
  ],
  hotlines: [
    {
      label: 'Hotline',
      value: '028 7300 7272',
      href: 'tel:02873007272',
    },
    {
      label: 'Tư vấn',
      value: '028 7309 1991',
      href: 'tel:02873091991',
    },
  ],
  groups: [
    {
      groupTitle: 'Tiện ích khác',
      type: 'link-list',
      links: [
        { id: 'footer-home', label: 'Trang chủ', href: '/', external: false },
        {
          id: 'footer-direction',
          label: 'Định hướng hoạt động',
          href: '/gioi-thieu/dinh-huong-hoat-dong',
          external: false,
        },
        {
          id: 'footer-policy',
          label: 'Chính sách Alumni',
          href: '/cong-dong-alumni/chinh-sach-alumni',
          external: false,
        },
        {
          id: 'footer-coop',
          label: 'Hoa Sen COOP',
          href: '/dich-vu-alumni/hoa-sen-coop',
          external: false,
        },
        {
          id: 'footer-library',
          label: 'Thư viện Hoa Sen',
          href: 'https://library.hoasen.edu.vn/',
          external: true,
          target: '_blank',
          rel: 'noreferrer noopener',
        },
        {
          id: 'footer-contact',
          label: 'Liên hệ',
          href: 'https://www.hoasen.edu.vn/lien-he/',
          external: true,
          target: '_blank',
          rel: 'noreferrer noopener',
        },
      ],
    },
    {
      groupTitle: 'Theo dõi',
      type: 'social',
      links: socialLinks,
    },
    {
      groupTitle: 'Tải ứng dụng',
      type: 'app-list',
      links: [
        {
          id: 'app-store',
          label: 'App Store',
          meta: 'Ứng dụng HSU',
          href: 'https://apps.apple.com/vn/app/hoa-sen/id1324439055?l=vi',
          external: true,
          target: '_blank',
          rel: 'noreferrer noopener',
        },
        {
          id: 'google-play',
          label: 'Google Play',
          meta: 'Ứng dụng HSU',
          href: 'https://play.google.com/store/apps/details?id=vn.edu.hoasen.htttql&hl=en_US&gl=US',
          external: true,
          target: '_blank',
          rel: 'noreferrer noopener',
        },
      ],
    },
  ],
  copyright: 'Bản quyền thuộc về Trường Đại học Hoa Sen.',
};