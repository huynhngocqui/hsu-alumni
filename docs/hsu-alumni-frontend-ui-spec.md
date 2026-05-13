# HSU Alumni Frontend UI/UX Specification

## 1. Muc dich va nguyen tac

- Frontend moi phai bam visual style cua website HSU Alumni: https://www.hoasen.edu.vn/alumni/
- Header/navigation submenu can tham khao them cach to chuc menu da cap cua website chinh HSU: https://www.hoasen.edu.vn/
- Khong sao chep source code truc tiep tu website tham khao.
- Chi tham khao visual style, layout, mau sac, font, logo placement, icon style, section structure, spacing, card pattern, interaction va responsive behavior.
- Neu can dung logo, icon, hinh anh chinh thuc thi phai lay asset duoc stakeholder xac nhan.
- Neu khong xac dinh duoc chinh xac font, icon set, token mau hoac animation goc tu website tham khao thi phai ghi ro: "Chua du thong tin de ket luan chinh xac, can xac nhan voi UI/UX hoac stakeholder."

## 2. Hien trang repo va khoang cach can xu ly

| Hang muc | Hien trang repo | Yeu cau dich | Tac dong |
| --- | --- | --- | --- |
| Header | `Navbar.jsx` dang dung menu phang, khong co submenu/mobile drawer | Header sticky/light, menu da cap, hover/focus/keyboard | Can refactor lai toan bo navigation shell |
| Footer | `Footer.jsx` dang la placeholder 3 cot, co noi dung chua xac minh | Footer nhieu cot theo HSU Alumni, co dia chi, hotline, tien ich, social, app links | Can thay bang config-driven footer |
| Home page | `HomePage.jsx` dang la shell generic | Hero, mission, achievement, benefit, alumni stories, news, events, join section theo pattern HSU Alumni | Can redesign home page |
| Brand tokens | `tailwind.config.cjs` dang nghieng ve mau do dam/maroon | Can tham khao bo brand blue/red/white cua HSU Alumni | Can doi semantic token va utility classes |
| Route slug | Mot so route noi bo khac voi route mapping moi | Can chot slug than thien, breadcrumb va active match dung theo navigation moi | Can normalize public routes |
| Nav/Footer data | Dang hardcode truc tiep trong component | Can tach ra `frontend/src/config/*` | Bat buoc doi sang config/data layer |
| Job navigation | Repo hien co internal Job module, nhung navigation moi uu tien external HSU Career link | Can business chot internal hay external la luong chinh | Open question quan trong |

## 3. Frontend UI Reference Summary

| Khu vuc giao dien | Website tham khao | Pattern can tham khao | Cach ap dung cho project moi | Component lien quan | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| Brand shell | HSU Alumni | Nen sang, khoi xanh dam lon, nhan dien logo ro, khoang trang rong | Dung cho overall page shell, hero, footer va CTA quan trong | AppLayout, Header, Footer, HeroSection | Khong copy asset neu chua duoc cap phep |
| Header utility | HSU Alumni | Thanh dau trang gon, logo trung tam/de nhin, icon tim kiem/menu/utility | Tao `TopBar` nhe neu can hotline/search/language | TopBar, Header | Co the an/bien doi tren mobile |
| Main navigation | HSU main | Menu cha + submenu/mega submenu theo nhom, de scan | Dung cho desktop dropdown va mobile accordion | MainNavigation, DropdownMenu, MobileMenu | Bat buoc accessible bang keyboard |
| Hero banner | HSU Alumni | Banner xanh dam, headline trang in dam, visual lon, CTA ro | Trang chu va page landing nen co hero section ro rang | HeroSection | Exact hero art phu thuoc asset duoc duyet |
| Mission/intro | HSU Alumni | Section mo dau co heading lon, copy ngan, CTA | Dung cho gioi thieu, dinh huong hoat dong, policy CTA | MissionSection, SectionHeader | Co the dung anh + text 2 cot |
| Achievement/news cards | HSU Alumni | Card co anh lon, tieu de dam, ngay/category, link xem them | Dung cho thanh tuu, tin tuc, su kien, alumni stories | AchievementSection, NewsCard, EventCard, AlumniCard | Uu tien card image-first |
| Benefit/experience | HSU Alumni | Grid 3 cot, moi card la 1 loi ich/trai nghiem | Dung cho loi ich tham gia, mentoring, ket noi doanh nghiep | BenefitSection, ExperienceSection, BenefitCard, ExperienceCard | Icon/hinh can dong bo style |
| Join section | HSU Alumni | Form CTA o cuoi page, co visual ho tro | Dung cho join alumni/contact form | JoinAlumniSection, JoinAlumniForm | Can co loading/success/error state |
| Footer | HSU Alumni | Footer xanh dam, nhieu cot, dia chi, hotline, tien ich, social, app badge | Build footer config-driven va verified content | Footer, FooterColumn, SocialLinks, AppDownloadLinks | Noi dung tham khao can stakeholder xac nhan |

## 4. Frontend UI Direction

| Hang muc | Dinh huong de xuat | Cach ap dung | Ghi chu |
| --- | --- | --- | --- |
| Mau sac chu dao | Tham khao nhom mau xanh dam/royal blue, trang, do nhan dien, accent vang nho tu HSU Alumni | Dung semantic token nhu `brandPrimary`, `brandSurface`, `brandAccent`, `textPrimary`, `borderSubtle` thay vi hardcode theo tung component | Chua du thong tin de ket luan ma mau chinh xac, can stakeholder xac nhan |
| Font / typography | Sans-serif hien dai, heading in dam, uppercase eyebrow, body text sach va de doc | H1-H2 dam, body 16-18px tren desktop, metadata 12-14px, uppercase label/cohort/category | Chua du thong tin de ket luan font chinh xac, can stakeholder xac nhan |
| Button style | CTA primary noi bat, radius mem/pill, secondary outline/light surface, inline arrow link | Dung 3 cap `Button`, `LinkButton`, `ExternalLink` | Can co hover, focus, disabled, loading |
| Card style | Card uu tien image-first, bo goc mem, shadow nhe, metadata ro | News/Event/Alumni/Benefit cards dung he thong card thong nhat | Uu tien ratio anh on dinh |
| Section layout | Container lon, section spacing rong, background xen ke giua trang va xanh | Build `SectionContainer` + `SectionHeader`, cho phep theme `light`, `brand`, `muted` | Tranh don qua nhieu card vao 1 viewport |
| Header style | Sticky/light header, logo ro, menu da cap, CTA utility | Header can co desktop dropdown + mobile drawer | HSU main site la reference cho menu da cap |
| Footer style | Footer full-width, background brand, nhieu cot noi dung, social va app badges | Footer phai data-driven va co thong tin verified | Noi dung tham khao tu HSU Alumni, can stakeholder xac nhan truoc khi chot |
| Icon style | Icon line/simple, dong bo, de nhan dien, uu tien official icon set hoac SVG custom | Social, utility, benefit card, breadcrumb chevron | Chua du thong tin de ket luan icon set chinh xac |
| Image style | Hero image lon, card image ro net, portrait alumni nhe, crop on dinh | Dung object-fit, ratio chuan theo tung card type | Asset anh can duoc phe duyet |
| Form style | Form sach, label ro, khoang cach rong, visual ho tro ben canh neu la CTA section | Join form, contact form, recruitment form dung primitive chung | Bat buoc success/error/loading state |
| Responsive style | Desktop dropdown, tablet co lai 2 cot, mobile hamburger/drawer + accordion submenu | Layout grid can collapse co chu dinh | Uu tien touch target va readability |
| Animation / transition | Chuyen dong nhe, fade/slide/stagger nho, dropdown mo mem | Dung cho menu, card hover, hero reveal, modal/lightbox | Khong dung motion qua tay |

## 5. Navigation Mapping

| Nav ID | Menu cha | Menu con | Internal/External | URL/path | Page lien quan | Component lien quan | Active state | Responsive behavior | Ghi chu |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NAV-001 | Trang chu | - | Internal | / | HomePage | Header, MainNavigation | Active khi route la `/` | Desktop item, mobile first-level item | Route public |
| NAV-002 | Gioi thieu | Dinh huong hoat dong | Internal | /gioi-thieu/dinh-huong-hoat-dong | ActivityDirectionPage | DropdownMenu, Breadcrumb | Active khi route prefix `/gioi-thieu` | Desktop dropdown, mobile accordion | Can breadcrumb |
| NAV-003 | Tin tuc & Su kien | Tin tuc | External | https://www.hoasen.edu.vn/tin-tuc/ | ExternalNewsLink | DropdownMenu, ExternalLink | Khong active theo router noi bo | Desktop dropdown, mobile accordion | Mo tab moi neu stakeholder dong y |
| NAV-004 | Tin tuc & Su kien | Su kien | External | https://www.hoasen.edu.vn/event/ | ExternalEventsLink | DropdownMenu, ExternalLink | Khong active theo router noi bo | Desktop dropdown, mobile accordion | Mo tab moi neu stakeholder dong y |
| NAV-005 | Cong dong Alumni | Chinh sach Alumni | Internal | /cong-dong-alumni/chinh-sach-alumni | AlumniPolicyPage | DropdownMenu, Breadcrumb | Active khi route prefix `/cong-dong-alumni` | Desktop dropdown, mobile accordion | Hien repo dang dung slug khac |
| NAV-006 | Cong dong Alumni | Thong tin ban lien lac | Internal | /cong-dong-alumni/ban-lien-lac | AlumniBoardPage | DropdownMenu, Breadcrumb | Active khi route prefix `/cong-dong-alumni` | Desktop dropdown, mobile accordion | Nen co card contact/role |
| NAV-007 | Cong dong Alumni | Cuu sinh vien tieu bieu | Internal | /cong-dong-alumni/cuu-sinh-vien-tieu-bieu | OutstandingAlumniPage | DropdownMenu, Breadcrumb | Active khi route prefix `/cong-dong-alumni` | Desktop dropdown, mobile accordion | Hien repo dang dung slug viet tat |
| NAV-008 | Cong dong Alumni | Cau chuyen thanh cong | Internal | /cong-dong-alumni/cau-chuyen-thanh-cong | SuccessStoriesPage | DropdownMenu, Breadcrumb | Active khi route prefix `/cong-dong-alumni` | Desktop dropdown, mobile accordion | Nen tach listing/detail |
| NAV-009 | Cong dong Alumni | Thu vien hinh anh | Internal | /cong-dong-alumni/thu-vien-hinh-anh | GalleryPage | DropdownMenu, Breadcrumb | Active khi route prefix `/cong-dong-alumni` | Desktop dropdown, mobile accordion | Can lightbox neu co gallery lon |
| NAV-010 | Viec lam & Ket noi | Co hoi viec lam | External | https://career.hoasen.edu.vn/ | ExternalCareerLink | DropdownMenu, ExternalLink | Khong active theo router noi bo | Desktop dropdown, mobile accordion | Mau thuan voi internal Job module hien tai |
| NAV-011 | Viec lam & Ket noi | Career Webinars | External | https://career.hoasen.edu.vn/tin-tuc-35A52D92 | ExternalCareerWebinarsLink | DropdownMenu, ExternalLink | Khong active theo router noi bo | Desktop dropdown, mobile accordion | External |
| NAV-012 | Viec lam & Ket noi | Dang tin tuyen dung | External | https://career.hoasen.edu.vn/tin-tuc-35A52D92 | ExternalRecruitmentLink | DropdownMenu, ExternalLink | Khong active theo router noi bo | Desktop dropdown, mobile accordion | Can PO xac nhan external hay internal |
| NAV-013 | Dich vu Alumni | Hoa Sen COOP | Internal | /dich-vu-alumni/hoa-sen-coop | CoopListPage | DropdownMenu, Breadcrumb | Active khi route prefix `/dich-vu-alumni/hoa-sen-coop` | Desktop dropdown, mobile accordion | Route da ton tai |
| NAV-014 | Dich vu Alumni | Hoa Sen Shop | Internal | /dich-vu-alumni/hoa-sen-shop | ShopLandingPage | DropdownMenu, Breadcrumb | Active khi route prefix `/dich-vu-alumni/hoa-sen-shop` | Desktop dropdown, mobile accordion | Chua co pham vi nghiep vu ro |
| NAV-015 | Dich vu Alumni | Hoa Sen Courses | Internal | /dich-vu-alumni/hoa-sen-courses | CoursesLandingPage | DropdownMenu, Breadcrumb | Active khi route prefix `/dich-vu-alumni/hoa-sen-courses` | Desktop dropdown, mobile accordion | Chua co pham vi nghiep vu ro |
| NAV-016 | Dich vu Alumni | Thu vien Hoa Sen | External | https://library.hoasen.edu.vn/ | ExternalLibraryLink | DropdownMenu, ExternalLink | Khong active theo router noi bo | Desktop dropdown, mobile accordion | External |
| NAV-017 | Dich vu Alumni | Ho tro Co so vat chat | External | https://www.hoasen.edu.vn/so-tay-sinh-vien/trai-nghiem-co-so-hoc-tap/ | ExternalFacilitySupportLink | DropdownMenu, ExternalLink | Khong active theo router noi bo | Desktop dropdown, mobile accordion | External |

## 6. Route Mapping

| Route ID | Menu cha | Menu con | Internal/External | URL/path | Page component de xuat | Layout | Data source | SEO title de xuat | SEO description de xuat | Ghi chu |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ROUTE-001 | Trang chu | - | Internal | / | HomePage | MainLayout | CMS + static section config + API aggregate | HSU Alumni | Cong dong Cuu sinh vien Dai hoc Hoa Sen | Cong dong cuu sinh vien, tin tuc, su kien, loi ich va ket noi Alumni HSU | Landing page chinh |
| ROUTE-002 | Gioi thieu | Dinh huong hoat dong | Internal | /gioi-thieu/dinh-huong-hoat-dong | ActivityDirectionPage | MainLayout + Breadcrumb | CMS/static content | Dinh huong hoat dong HSU Alumni | Dinh huong, su menh va muc tieu ket noi cong dong Alumni HSU | SEO content page |
| ROUTE-003 | Cong dong Alumni | Chinh sach Alumni | Internal | /cong-dong-alumni/chinh-sach-alumni | AlumniPolicyPage | MainLayout + Breadcrumb | CMS/static content | Chinh sach Alumni HSU | Chinh sach tham gia, quyen loi va nguyen tac dong hanh cung cong dong Alumni HSU | Can normalize slug |
| ROUTE-004 | Cong dong Alumni | Thong tin ban lien lac | Internal | /cong-dong-alumni/ban-lien-lac | AlumniBoardPage | MainLayout + Breadcrumb | CMS | Thong tin Ban lien lac Alumni HSU | Danh sach ban lien lac, dau moi lien he va thong tin ket noi chinh thuc | |
| ROUTE-005 | Cong dong Alumni | Cuu sinh vien tieu bieu | Internal | /cong-dong-alumni/cuu-sinh-vien-tieu-bieu | OutstandingAlumniPage | MainLayout + Breadcrumb | CMS listing | Cuu sinh vien tieu bieu HSU | Goc vinh danh nhung guong mat Alumni tieu bieu cua Dai hoc Hoa Sen | Nen co listing + detail |
| ROUTE-006 | Cong dong Alumni | Cau chuyen thanh cong | Internal | /cong-dong-alumni/cau-chuyen-thanh-cong | SuccessStoriesPage | MainLayout + Breadcrumb | CMS listing | Cau chuyen thanh cong Alumni HSU | Nhung hanh trinh truyen cam hung tu cong dong cuu sinh vien Hoa Sen | Nen co listing + detail |
| ROUTE-007 | Cong dong Alumni | Thu vien hinh anh | Internal | /cong-dong-alumni/thu-vien-hinh-anh | GalleryPage | MainLayout + Breadcrumb | CMS/gallery API | Thu vien hinh anh Alumni HSU | Hinh anh hoat dong, su kien va ky niem cua cong dong Alumni Hoa Sen | Can empty state |
| ROUTE-008 | Dich vu Alumni | Hoa Sen COOP | Internal | /dich-vu-alumni/hoa-sen-coop | CoopListPage | MainLayout + Breadcrumb | Coop API + tags API | Hoa Sen COOP | San ket noi san pham, dich vu va uu dai tu cong dong Alumni Hoa Sen | Route da ton tai |
| ROUTE-009 | Dich vu Alumni | Hoa Sen Shop | Internal | /dich-vu-alumni/hoa-sen-shop | ShopLandingPage | MainLayout + Breadcrumb | CMS/static until clarified | Hoa Sen Shop | Dich vu mua sam/uu dai danh cho cong dong Alumni Hoa Sen | Chua ro la internal hay external |
| ROUTE-010 | Dich vu Alumni | Hoa Sen Courses | Internal | /dich-vu-alumni/hoa-sen-courses | CoursesLandingPage | MainLayout + Breadcrumb | CMS/static until clarified | Hoa Sen Courses | Cac khoa hoc va uu dai hoc tap danh cho Alumni Hoa Sen | Chua ro la internal hay external |
| ROUTE-011 | Tin tuc & Su kien | Tin tuc | External | https://www.hoasen.edu.vn/tin-tuc/ | ExternalLink | N/A | HSU website | Tin tuc HSU | External news destination | Khong render page noi bo |
| ROUTE-012 | Tin tuc & Su kien | Su kien | External | https://www.hoasen.edu.vn/event/ | ExternalLink | N/A | HSU website | Su kien HSU | External events destination | Khong render page noi bo |
| ROUTE-013 | Viec lam & Ket noi | Co hoi viec lam | External | https://career.hoasen.edu.vn/ | ExternalLink | N/A | HSU Career website | Co hoi viec lam HSU | External career destination | Mau thuan voi internal Job module |
| ROUTE-014 | Viec lam & Ket noi | Career Webinars | External | https://career.hoasen.edu.vn/tin-tuc-35A52D92 | ExternalLink | N/A | HSU Career website | Career Webinars HSU | External career webinars destination | External |
| ROUTE-015 | Viec lam & Ket noi | Dang tin tuyen dung | External | https://career.hoasen.edu.vn/tin-tuc-35A52D92 | ExternalLink | N/A | HSU Career website | Dang tin tuyen dung HSU | External recruitment destination | Can chot voi PO |
| ROUTE-016 | Dich vu Alumni | Thu vien Hoa Sen | External | https://library.hoasen.edu.vn/ | ExternalLink | N/A | HSU Library website | Thu vien Hoa Sen | External library destination | External |
| ROUTE-017 | Dich vu Alumni | Ho tro Co so vat chat | External | https://www.hoasen.edu.vn/so-tay-sinh-vien/trai-nghiem-co-so-hoc-tap/ | ExternalLink | N/A | HSU website | Ho tro Co so vat chat | External support destination | External |

## 7. Footer Requirements

### 7.1 Cau truc noi dung footer de xuat

- Nhom 1: Logo / nhan dien HSU hoac HSU Alumni.
- Nhom 2: Thong tin Truong Dai hoc Hoa Sen / HSU Alumni.
- Nhom 3: Dia chi cac co so.
- Nhom 4: Hotline.
- Nhom 5: Tien ich khac.
- Nhom 6: Theo doi / social links.
- Nhom 7: App download links neu duoc stakeholder phe duyet.
- Nhom 8: Copyright.

### 7.2 Quy dinh footer

- Layout tham khao footer HSU Alumni: full-width, background brand blue, text sang, chia cot ro rang.
- Hotline nen la element noi bat, co the dung pill hoac text emphasis nhu website tham khao.
- Utility links, social links va app badges khong duoc hardcode trong JSX.
- Footer content phai doc tu config/data layer.
- Neu su dung noi dung dia chi, hotline, social links, app links tu website HSU Alumni thi phai ghi ro: "Noi dung tham khao tu website HSU Alumni, can stakeholder xac nhan truoc khi trien khai chinh thuc."
- Khong tu y bo sung email, so dien thoai, social link chua duoc xac thuc.

## 8. Frontend Page/Section Mapping

| Page | Route | Section can co | Component su dung | Data source | Loading/empty/error state | SEO notes | UI reference tu HSU Alumni |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Trang chu | / | Header, Hero, Mission, Achievement, Experience, Benefit, AlumniCommunity, News, Events, JoinAlumni, Footer | Header, HeroSection, MissionSection, AchievementSection, ExperienceSection, BenefitSection, AlumniCommunitySection, NewsSection, EventsSection, JoinAlumniSection, Footer | CMS + API aggregate + static config | Loading cho sections async, empty state cho news/events/alumni list, error state cho feed section | H1 duy nhat, co internal linking sang cong dong/dich vu | HSU Alumni home page |
| Dinh huong hoat dong | /gioi-thieu/dinh-huong-hoat-dong | Header, Breadcrumb, HeroIntro, Mission/Content, CTA, Footer | Header, Breadcrumb, PageLayout, MissionSection, LinkButton, Footer | CMS/static | Loading neu dung CMS, fallback content neu chua co du lieu | SEO content page | Intro/mission pattern |
| Chinh sach Alumni | /cong-dong-alumni/chinh-sach-alumni | Header, Breadcrumb, HeroIntro, RichContent, Related CTA, Footer | Header, Breadcrumb, PageLayout, SectionHeader, JoinAlumniSection, Footer | CMS/static | Loading cho CMS, empty state neu chua co content | SEO content page, internal link sang join | Content page pattern |
| Thong tin Ban lien lac | /cong-dong-alumni/ban-lien-lac | Header, Breadcrumb, Intro, Contact grid, CTA, Footer | Header, Breadcrumb, PageLayout, CardGrid, ContactCard, Footer | CMS | Loading, empty state neu chua co danh sach | Internal link sang contact/join | Content + card pattern |
| Cuu sinh vien tieu bieu | /cong-dong-alumni/cuu-sinh-vien-tieu-bieu | Header, Breadcrumb, ListingHero, Filter, Alumni grid, Pagination, Footer | Header, Breadcrumb, SectionHeader, AlumniCard, Pagination, Footer | CMS listing | Loading, empty, error bat buoc | SEO listing page + detail linking | Cong dong Alumni section |
| Cau chuyen thanh cong | /cong-dong-alumni/cau-chuyen-thanh-cong | Header, Breadcrumb, ListingHero, Story grid/list, Pagination, Footer | Header, Breadcrumb, AlumniStorySection, AlumniCard, Pagination, Footer | CMS listing | Loading, empty, error bat buoc | SEO listing page + detail linking | Cong dong Alumni + Thanh tuu |
| Thu vien hinh anh | /cong-dong-alumni/thu-vien-hinh-anh | Header, Breadcrumb, Gallery hero, Gallery grid, Lightbox, Footer | Header, Breadcrumb, GallerySection, ImageCard, ModalLightbox, Footer | Gallery API/CMS | Loading, empty, error bat buoc | Alt text va structured captions neu co | Gallery pattern |
| Hoa Sen COOP | /dich-vu-alumni/hoa-sen-coop | Header, Breadcrumb, HeroIntro, Search/filter, Listing grid, CTA, Footer | Header, Breadcrumb, PageLayout, FormField, Tag, CardGrid, Footer | Coop API + tags API | Loading, empty, error da bat dau co trong repo | SEO landing/listing | Benefit/card + service listing pattern |
| Hoa Sen Shop | /dich-vu-alumni/hoa-sen-shop | Header, Breadcrumb, HeroIntro, Benefit/offer sections, CTA, Footer | Header, Breadcrumb, PageLayout, BenefitSection, Footer | CMS/static | Loading neu CMS, empty neu chua co noi dung | SEO content/service page | Service landing pattern |
| Hoa Sen Courses | /dich-vu-alumni/hoa-sen-courses | Header, Breadcrumb, HeroIntro, Course benefit, CTA, Footer | Header, Breadcrumb, PageLayout, BenefitSection, Footer | CMS/static | Loading neu CMS, empty neu chua co noi dung | SEO content/service page | Service landing pattern |
| Internal Job module (existing repo) | /viec-lam-ket-noi/hoa-sen-job | Header, Breadcrumb, HeroIntro, Search/filter, Listing, CTA, Footer | Header, Breadcrumb, PageLayout, FormField, Tag, CardGrid, Footer | Job API + tags API | Loading, empty, error da bat dau co trong repo | SEO neu business giu lai route noi bo | Khong nam trong navigation moi, can PO chot |

## 9. Frontend Component Mapping

### 9.1 Layout va Navigation

| Component | Type | Muc dich | Props/data | Behavior | Responsive | Accessibility | Pattern tham khao | Page/section su dung |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AppLayout | Layout | Gom Header, main content, Footer | `children`, `theme` | Render shell toan site | Full-width, stack tren mobile | Landmark ro rang | Alumni site shell | Tat ca page public |
| PageLayout | Layout | Wrapper cho page con + breadcrumb + hero mini | `title`, `eyebrow`, `breadcrumbItems`, `children` | Tao heading zone thong nhat | Collapse spacing tren mobile | H1/H2 order ro | Alumni content page | Content/service pages |
| SectionContainer | Layout | Chuan hoa max-width va spacing tung section | `variant`, `as`, `children` | Chon background va padding theo variant | Grid collapse theo breakpoint | Khong anh huong semantics | Alumni section spacing | Moi section |
| SectionHeader | Layout | Heading + subheading + CTA cho section | `title`, `description`, `action` | Render heading thong nhat | Canh trai/center theo page | Heading levels phu hop | Alumni section heading | Home + listing |
| Header | Navigation | Shell header sticky cho logo + nav + utility | `navItems`, `utilityItems`, `cta` | Sticky, active state, dropdown trigger | Desktop horizontal, mobile drawer | `header`, `nav`, focus ring | HSU Alumni + HSU main | Moi page |
| TopBar | Navigation | Utility layer cho hotline/search/language neu can | `items`, `languageOptions` | Hien utility text/icon | Co the an tren mobile | Label ro cho icon button | HSU utility feel | Header |
| MainNavigation | Navigation | Render menu cha | `items`, `currentPath` | Hover/focus mo submenu | Collapse vao drawer tren mobile | Keyboard arrow/tab support | HSU main menu | Header |
| DropdownMenu | Navigation | Render submenu/mega submenu | `item`, `open`, `onOpenChange` | Hover, focus, click tren touch | Chuyen accordion tren mobile | `aria-expanded`, `aria-controls` | HSU main multi-level | Header |
| MobileMenu | Navigation | Drawer/menu di dong | `items`, `open`, `onClose` | Slide-in, accordion submenu | Full-screen/side drawer | Trap focus, close on Esc | Mobile HSU-style adaptation | Header mobile |
| Breadcrumb | Navigation | Dinh huong page con | `items` | Hien trail route | Wrap line tren mobile | `nav aria-label="Breadcrumb"` | Content page expectation | Tat ca page con |

### 9.2 Footer

| Component | Type | Muc dich | Props/data | Behavior | Responsive | Accessibility | Pattern tham khao | Page/section su dung |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Footer | Footer | Shell footer chinh | `footerConfig` | Render multiple content groups | Chuyen nhieu cot -> stack | Landmark `footer`, text link ro | Alumni footer | Moi page |
| FooterColumn | Footer | Gom 1 nhom noi dung footer | `title`, `children` | Render heading + list | Stack tren mobile | Heading hierarchy ro | Alumni footer columns | Footer |
| FooterContactInfo | Footer | Dia chi, hotline, campus info | `campuses`, `hotline` | Render contact block | Full width tren mobile | Tel links co label | Alumni footer contact | Footer |
| FooterLinks | Footer | Danh sach utility links | `title`, `links` | Render link groups | 1 cot tren mobile | Link text ro rang | Alumni footer utility | Footer |
| SocialLinks | Footer | Nhom social buttons | `links`, `variant` | Icon + label/link | Horizontal wrap tren mobile | Accessible label cho external link | Alumni social block | Footer, TopBar |
| AppDownloadLinks | Footer | Badge App Store / Google Play | `links` | Render app badges neu co | Stack/wrap tren mobile | Alt/label cho store badge | Alumni footer | Footer |

### 9.3 Section

| Component | Type | Muc dich | Props/data | Behavior | Responsive | Accessibility | Pattern tham khao | Page/section su dung |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| HeroSection | Section | Hero banner/intro chinh | `title`, `description`, `image`, `cta`, `stats` | Render hero image/text/CTA | Stack image-text tren mobile | 1 H1, alt ro | Alumni hero banner | Home, service landing |
| MissionSection | Section | Gioi thieu su menh/dinh huong | `title`, `content`, `cta`, `image` | Text + image / text + CTA | 2 cot -> 1 cot | Headings dung thu tu | Alumni mission block | Intro, policy |
| AchievementSection | Section | Hien thi thanh tuu/bai viet noi bat | `items`, `actionLink` | Grid/list card | 3/2/1 cot | Card link focus ro | Alumni thanh tuu | Home, alumni listing |
| ExperienceSection | Section | Trinh bay trai nghiem Alumni | `items` | Grid icon/text | 3/2/1 cot | Icon co aria-hidden hoac label | Alumni trai nghiem | Home |
| BenefitSection | Section | Trinh bay loi ich tham gia | `items` | Grid benefit cards | 3/2/1 cot | Card heading ro | Alumni loi ich | Home, services |
| AlumniCommunitySection | Section | Listing alumni tieu bieu | `items`, `actionLink` | Render portrait cards | 3/2/1 cot | Alt text cho portrait | Alumni cong dong | Home |
| AlumniStorySection | Section | Listing success stories | `items`, `actionLink` | Render story cards | 3/2/1 cot | Alt, heading, link text | Alumni cong dong/thanh tuu | Story pages |
| NewsSection | Section | News listing + featured card | `featured`, `items`, `actionLink` | Featured + side list/grid | 1 cot tren mobile | Category/date semantics | Alumni tin tuc | Home |
| EventsSection | Section | Event listing | `items`, `actionLink` | Grid/list event cards | 3/2/1 cot | Date/location text ro | Alumni su kien | Home |
| JoinAlumniSection | Section | CTA tham gia cong dong | `formConfig`, `image`, `copy` | Form submit + feedback state | Form full-width tren mobile | Label + error + status region | Alumni join section | Home, policy, contact |
| GallerySection | Section | Hien thi gallery responsive | `items`, `actionLink` | Grid + optional lightbox | 4/3/2/1 cot | Alt/caption/day la bat buoc | Gallery style | Gallery page, home teaser |

### 9.4 Card

| Component | Type | Muc dich | Props/data | Behavior | Responsive | Accessibility | Pattern tham khao | Page/section su dung |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NewsCard | Card | Card tin tuc | `title`, `excerpt`, `category`, `date`, `image`, `href` | Click den detail/external | Grid adapt | Alt/link ro | Alumni news cards | NewsSection |
| EventCard | Card | Card su kien | `title`, `date`, `location`, `image`, `href` | Click den detail/external | Grid adapt | Date text ro | Alumni event cards | EventsSection |
| AlumniCard | Card | Card alumni/stories | `name`, `title`, `summary`, `image`, `href` | Click den detail | Grid adapt | Portrait alt ro | Alumni cong dong cards | AlumniCommunitySection |
| BenefitCard | Card | Card loi ich | `icon`, `title`, `description` | Static/info card | Grid adapt | Icon decorative/label dung | Alumni loi ich | BenefitSection |
| ExperienceCard | Card | Card trai nghiem | `icon`, `title`, `description` | Static/info card | Grid adapt | Icon decorative/label dung | Alumni trai nghiem | ExperienceSection |
| ImageCard | Card | O anh gallery | `image`, `alt`, `caption`, `onClick` | Mo lightbox neu co | Masonry/grid adapt | Alt text bat buoc | Gallery | GallerySection |

### 9.5 Form

| Component | Type | Muc dich | Props/data | Behavior | Responsive | Accessibility | Pattern tham khao | Page/section su dung |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| JoinAlumniForm | Form | Dang ky tham gia cong dong | `fields`, `onSubmit`, `status` | Validate + submit + feedback | 2 cot -> 1 cot | Label/error/aria-live | Alumni join form | Home, CTA pages |
| ContactForm | Form | Lien he/yeu cau ket noi neu can | `fields`, `onSubmit`, `status` | Submit + success/error | Full-width tren mobile | Label/error/aria-live | HSU-style clean form | Contact/board page |
| RecruitmentPostForm | Form | Dang tin tuyen dung neu giu internal flow | `fields`, `tags`, `onSubmit` | Submit + validation | 2 cot -> 1 cot | Label/error/aria-describedby | Clean business form | Internal Job module |
| FormField | Form | Primitive input chung | `label`, `name`, `error`, `hint` | Render input/textarea wrapper | Full width | Label association ro | Shared form pattern | Moi form |
| SelectField | Form | Primitive select/chon option | `label`, `options`, `value`, `onChange` | Native/custom select | Full width | Keyboard, label, error | Shared form pattern | Moi form |
| SubmitButton | Form | Nut submit co state | `loading`, `disabled`, `children` | Show loading/disable state | Full width tren mobile neu can | Name ro rang | CTA/button pattern | Moi form |

### 9.6 UI Primitive

| Component | Type | Muc dich | Props/data | Behavior | Responsive | Accessibility | Pattern tham khao | Page/section su dung |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Button | UI Primitive | Nut co style chuan | `variant`, `size`, `icon`, `children` | Hover/focus/disabled | Touch target 44px+ | Focus visible | CTA/link style | Toan site |
| LinkButton | UI Primitive | Link dang button | `to`, `variant`, `children` | Router/internal link | Inline/wrap | Link semantics | CTA pattern | Toan site |
| ExternalLink | UI Primitive | Link ngoai co icon/target | `href`, `label`, `newTab` | Mo tab moi neu can | Inline/wrap | Accessible label khi new tab | Utility/external menu | Header, footer |
| Badge | UI Primitive | Nhan metadata/category | `label`, `tone` | Static | Wrap tot | Text contrast du | News/category chips | Cards |
| Tag | UI Primitive | Tag filter/metadata | `label`, `active`, `onClick` | Toggle/interactive | Wrap tot | Button semantics | Listing filter pattern | COOP, Job |
| Pagination | UI Primitive | Dieu huong listing pages | `page`, `count`, `onChange` | Prev/next + page list | Compact tren mobile | `aria-current` cho page active | Listing pages | Gallery/news/alumni |
| LoadingState | UI Primitive | Dang tai du lieu | `title`, `description`, `variant` | Skeleton/spinner | Adaptive | `aria-busy` neu can | Shared | Tat ca page data |
| ErrorState | UI Primitive | Bao loi tai section/page | `message`, `action` | Render retry/help CTA | Full width | Alert semantics | Shared | Tat ca page data |
| EmptyState | UI Primitive | Trang thai rong | `title`, `message`, `action` | Render fallback CTA | Full width | Text ro rang | Shared | Listing/gallery |
| Toast/Notification | UI Primitive | Phan hoi hanh dong ngan | `type`, `message` | Auto dismiss/manual close | Fixed responsive position | `aria-live` | Shared | Forms, auth |
| Modal/Lightbox | UI Primitive | Xem anh/chi tiet nhanh | `open`, `onClose`, `content` | Focus trap, Esc close | Fullscreen tren mobile | Dialog semantics | Gallery lightbox | Gallery |

## 10. Frontend Data Config de xuat

### 10.1 File config/de xuat

| File | Muc dich | Ghi chu |
| --- | --- | --- |
| `frontend/src/config/navigation.js` | Khai bao toan bo menu cha/menu con, activeMatch, external target, order | Bat buoc, thay cho hardcode trong `Navbar.jsx` |
| `frontend/src/config/footer.js` | Khai bao campus info, hotline, utility links, social links, app links, copyright | Bat buoc, thay cho hardcode trong `Footer.jsx` |
| `frontend/src/config/site.js` | Site title, default SEO, logo metadata, analytics keys, brand semantics | Khong chua secret |
| `frontend/src/config/socialLinks.js` | Tach social links neu muon reuse o TopBar/Footer | Optional neu footer config qua dai |
| `frontend/src/pages/home/home.config.js` | Static section copy va fallback content cho home | Chi dung cho content khong qua CMS |
| `frontend/src/pages/alumni/alumni.config.js` | Static config cho alumni landing/content pages | Neu chua co CMS |
| `frontend/src/api/content.js` | Service layer lay news/events/policy pages tu CMS/API | Khong fetch truc tiep trong page |
| `frontend/src/api/community.js` | Service layer cho alumni stories/board data | Khong fetch truc tiep trong page |
| `frontend/src/api/gallery.js` | Service layer cho gallery/albums | Khong fetch truc tiep trong page |

### 10.2 Navigation item shape de xuat

```js
{
  id: 'nav-005',
  label: 'Cong dong Alumni',
  path: '/cong-dong-alumni',
  external: false,
  target: '_self',
  rel: '',
  children: [],
  activeMatch: ['/cong-dong-alumni'],
  order: 5,
}
```

### 10.3 Footer config shape de xuat

```js
{
  groupTitle: 'Tien ich khac',
  links: [{ label: 'Thu vien', href: 'https://library.hoasen.edu.vn/', external: true }],
  contactInfo: {
    campuses: [],
    hotline: [],
  },
  socialLinks: [],
  appLinks: [],
  copyright: 'Ban quyen thuoc ve Truong Dai hoc Hoa Sen.',
}
```

## 11. HSU Alumni Frontend Style Guideline

| UI area | Pattern quan sat/tham khao | Cach ap dung cho project moi | Component lien quan | Ghi chu ky thuat |
| --- | --- | --- | --- | --- |
| Header | Header nen sang, logo noi bat, utility gon | Dung sticky header + utility zone + nav zone | Header, TopBar | Tranh nhieu hang qua phuc tap tren mobile |
| Main navigation | Menu cha ro, de scan | Dung 5 nhom chinh theo navigation moi | MainNavigation | Data-driven |
| Dropdown/submenu | Menu da cap tu HSU main | Dung dropdown hoac mega dropdown tren desktop | DropdownMenu | Keyboard support la bat buoc |
| Mobile menu | Icon/hamburger gon, menu mo tung tang | Dung drawer + accordion submenu | MobileMenu | `aria-expanded`/`aria-controls` |
| Hero | Khoi xanh dam, anh/visual lon, headline trang dam | Hero section can co visual impact va CTA ro | HeroSection | Hero art can asset duoc duyet |
| Section spacing | Khoang cach doc rong | Dung token spacing lon cho section shell | SectionContainer | De page thoang |
| Section heading | Heading lon, ro, thuong kem eyebrow | Tieu de section thong nhat toan site | SectionHeader | Heading hierarchy dung |
| Card layout | Card uu tien hinh, mo ta ngan, action ro | Thong nhat `Card` primitives | NewsCard, EventCard, AlumniCard | Ratio anh can nhat quan |
| Image style | Anh lon, crop sach, portrait ro | Dung object-fit cover va alt text day du | HeroSection, ImageCard | Asset compress hop ly |
| Button/CTA | CTA noi bat, ro primary/secondary | Dung variants, disabled/loading state | Button, LinkButton | Focus state khong duoc xoa |
| Link style | Inline link co nhan dien ro, external co dau hieu | Dung link + icon/arrow khi can | ExternalLink, FooterLinks | New-tab links can accessible label |
| Form style | Form sach, label ro, hint + feedback ro | Dung form primitive dung chung | JoinAlumniForm, FormField | Error lien ket voi field |
| News/Event listing | Card co category/date/anh/title | Dung featured + grid/list tuong doi linh hoat | NewsSection, EventsSection | External/internal mapping ro |
| Alumni story card | Anh chan dung + ten + linh vuc + tom tat | Card height can bang, CTA xem them | AlumniCard | Co the them quote ngan |
| Gallery grid | Grid responsive, uu tien anh | Dung 4/3/2/1 cot theo breakpoint | GallerySection, ImageCard | Lightbox optional |
| Footer | Blue background, nhieu cot, utility/social/app | Footer config-driven, verified content | Footer | Tranh placeholder/noi dung tu dat |
| Social icons | Icon ro, de nhan dien | Dung official asset/SVG dong bo | SocialLinks | Alt/label ro |
| Responsive behavior | Grid collapse hop ly, hero text khong tran, footer stack | Xay checklist responsive tu dau | Toan bo component system | Test desktop/tablet/mobile |

## 12. Responsive Requirements

### 12.1 Quy dinh tong quat

- Desktop: header ngang, submenu dropdown/mega dropdown.
- Tablet: grid giam so cot, giu du khoang cach va de doc.
- Mobile: hamburger/drawer, submenu accordion/collapsible.
- Hero: toi uu hinh va text, tranh crop sai thong diep.
- Card grid: ve 2 cot hoac 1 cot tuy breakpoint.
- Footer: tu nhieu cot chuyen thanh stacked layout.
- Form: full-width, touch target du lon.
- Text: khong tran dong, clamp neu can.
- Hinh anh: object-fit phu hop, khong meo.

### 12.2 Responsive checklist cho developer

- [ ] Header/navigation desktop khong vo dong o breakpoint lon.
- [ ] Dropdown submenu dung duoc voi chuot, ban phim va touch.
- [ ] Mobile menu co drawer/accordion va dong/mo on dinh.
- [ ] Hero text, CTA va image van de doc tren mobile.
- [ ] Card sections chuyen 3/2/1 cot dung theo breakpoint.
- [ ] News/events cards khong vo title/date/category tren mobile.
- [ ] Forms full-width, khoang cach field hop ly, button de cham.
- [ ] Gallery grid chuyen cot on dinh, lightbox hien thi tot tren mobile.
- [ ] Footer stack hop ly, hotline va social links van de tim.

## 13. Accessibility Requirements

- [ ] Logo co alt text ro rang.
- [ ] Hinh anh noi dung co alt text phu hop ngu canh.
- [ ] Button/link co label ro, khong chi dung icon khong ten.
- [ ] Dropdown menu dung duoc bang keyboard.
- [ ] Mobile menu co `aria-expanded`, `aria-controls`, `aria-label`.
- [ ] External link mo tab moi co accessible label thong bao.
- [ ] Form field co label hien thi ro rang.
- [ ] Error message duoc lien ket voi field neu co the.
- [ ] Mau chu/nen du tuong phan.
- [ ] Focus state visible, khong bi xoa boi custom CSS.
- [ ] Heading structure H1 -> H2 -> H3 hop ly.
- [ ] Footer link co text ro rang, khong chi la icon.

## 14. SEO Baseline cho page noi bo

| Page | Slug | H1 chinh | SEO title | SEO description | Breadcrumb | OG title/description | Alt text anh chinh | Internal linking |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Trang chu | / | HSU Alumni | HSU Alumni | Cong dong Cuu sinh vien Dai hoc Hoa Sen | Khong can breadcrumb | Dong bo voi hero title/copy | Banner cong dong Alumni HSU | Link sang gioi thieu, cong dong, COOP |
| Dinh huong hoat dong | /gioi-thieu/dinh-huong-hoat-dong | Dinh huong hoat dong Alumni | Dinh huong hoat dong HSU Alumni | Tong quan su menh, muc tieu va dinh huong phat trien cong dong Alumni HSU | Trang chu > Gioi thieu > Dinh huong hoat dong | Dinh huong hoat dong Alumni HSU | Visual dinh huong cong dong Alumni HSU | Link sang policy va join |
| Chinh sach Alumni | /cong-dong-alumni/chinh-sach-alumni | Chinh sach Alumni | Chinh sach Alumni HSU | Quy dinh, quyen loi va nguyen tac tham gia cong dong Alumni HSU | Trang chu > Cong dong Alumni > Chinh sach Alumni | Chinh sach Alumni HSU | Anh minh hoa chinh sach Alumni | Link sang join va board |
| Thong tin Ban lien lac | /cong-dong-alumni/ban-lien-lac | Thong tin Ban lien lac | Ban lien lac Alumni HSU | Danh sach ban lien lac va thong tin dau moi ket noi cong dong Alumni HSU | Trang chu > Cong dong Alumni > Ban lien lac | Ban lien lac Alumni HSU | Anh minh hoa ban lien lac Alumni HSU | Link sang contact/join |
| Cuu sinh vien tieu bieu | /cong-dong-alumni/cuu-sinh-vien-tieu-bieu | Cuu sinh vien tieu bieu | Cuu sinh vien tieu bieu HSU | Tong hop nhung guong mat Alumni tieu bieu cua Dai hoc Hoa Sen | Trang chu > Cong dong Alumni > Cuu sinh vien tieu bieu | Cuu sinh vien tieu bieu HSU | Chan dung Alumni tieu bieu HSU | Link sang story detail va home |
| Cau chuyen thanh cong | /cong-dong-alumni/cau-chuyen-thanh-cong | Cau chuyen thanh cong | Cau chuyen thanh cong Alumni HSU | Hanh trinh truyen cam hung tu cong dong Alumni Hoa Sen | Trang chu > Cong dong Alumni > Cau chuyen thanh cong | Cau chuyen thanh cong Alumni HSU | Anh dai dien cau chuyen Alumni HSU | Link sang alumni listing va join |
| Thu vien hinh anh | /cong-dong-alumni/thu-vien-hinh-anh | Thu vien hinh anh | Thu vien hinh anh Alumni HSU | Album hinh anh su kien va hoat dong cua cong dong Alumni Hoa Sen | Trang chu > Cong dong Alumni > Thu vien hinh anh | Thu vien hinh anh Alumni HSU | Anh su kien cong dong Alumni HSU | Link sang su kien va stories |
| Hoa Sen COOP | /dich-vu-alumni/hoa-sen-coop | Hoa Sen COOP | Hoa Sen COOP | Ket noi san pham, dich vu va uu dai tu cong dong Alumni Hoa Sen | Trang chu > Dich vu Alumni > Hoa Sen COOP | Hoa Sen COOP | Anh minh hoa dich vu Hoa Sen COOP | Link sang join/profile/login |
| Hoa Sen Shop | /dich-vu-alumni/hoa-sen-shop | Hoa Sen Shop | Hoa Sen Shop | Dac quyen mua sam va uu dai danh cho Alumni Hoa Sen | Trang chu > Dich vu Alumni > Hoa Sen Shop | Hoa Sen Shop | Anh minh hoa uu dai Hoa Sen Shop | Link sang courses/COOP |
| Hoa Sen Courses | /dich-vu-alumni/hoa-sen-courses | Hoa Sen Courses | Hoa Sen Courses | Khoa hoc va co hoi hoc tap danh cho cong dong Alumni Hoa Sen | Trang chu > Dich vu Alumni > Hoa Sen Courses | Hoa Sen Courses | Anh minh hoa hoc tap Alumni HSU | Link sang shop/COOP |

## 15. Frontend Implementation Checklist

- [ ] Chot `Frontend UI Direction` voi UI/UX va stakeholder.
- [ ] Chot logo, social icon, app badge va cac asset duoc phep su dung.
- [ ] Tach `navigation`, `footer`, `site`, `socialLinks` ra khoi component.
- [ ] Tao `AppLayout`, `PageLayout`, `SectionContainer`, `SectionHeader` dung chung.
- [ ] Refactor `Header` theo menu da cap va active state moi.
- [ ] Trien khai `DropdownMenu` desktop accessible.
- [ ] Trien khai `MobileMenu` dang drawer/accordion accessible.
- [ ] Refactor `Footer` theo multiple columns va content verified.
- [ ] Rebuild `HeroSection` cho home page theo visual direction HSU Alumni.
- [ ] Trien khai `Mission`, `Achievement`, `Experience`, `Benefit`, `AlumniCommunity`, `News`, `Events`, `JoinAlumni`, `Gallery` sections theo mapping.
- [ ] Chuan hoa he thong cards: news/event/alumni/benefit/image.
- [ ] Chuan hoa form primitives va state `loading`, `success`, `error`.
- [ ] Khong goi API truc tiep trong page neu da co service layer.
- [ ] Tao service layer cho CMS/community/gallery neu feature can du lieu dong.
- [ ] Chuan hoa `LoadingState`, `EmptyState`, `ErrorState`, `Toast/Notification`.
- [ ] Chuan hoa breadcrumb cho page con.
- [ ] Normalize route slug theo bang `Route Mapping`.
- [ ] Kiem tra responsive cho header, menu, hero, cards, forms, gallery, footer.
- [ ] Kiem tra accessibility co ban theo checklist.
- [ ] Gan SEO metadata cho tat ca page noi bo.
- [ ] Chot yeu cau tracking/analytics neu co.

## 16. Open Questions can stakeholder xac nhan

| Nhom | Cau hoi |
| --- | --- |
| Brand | Mau token chinh thuc cua HSU Alumni la gi? |
| Brand | Font family chinh thuc cua HSU/HSU Alumni la gi? |
| Asset | Logo, icon, hero image, alumni portrait va app badge se lay tu dau? |
| Navigation | Hoa Sen Job co giu route/internal module hien tai hay menu se chi tro external HSU Career? |
| Navigation | Hoa Sen Shop va Hoa Sen Courses la page noi bo hay chi la external/future scope? |
| CMS | Tin tuc va Su kien se la page noi bo hay chi la external link toi HSU website? |
| Footer | Co duoc phep su dung nguyen bo dia chi, hotline, social links va app links tu website HSU Alumni khong? |
| Localization | Co can language switch VI/EN trong pha 1 khong? |
| Analytics | Can GA/GTM/Meta Pixel hay chi can event tracking noi bo? |
| Gallery | Co can lightbox, album, download hay chi can view gallery don gian? |
