import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BrandImage from '../../components/common/BrandImage';
import { siteMeta } from '../../config/site';
import { ArrowRightIcon, ExternalLinkIcon } from '../../components/common/icons';
import { listAlumniPosts } from '../../api/alumni';
import { listPublicStories } from '../../api/content';
import { listEvents } from '../../api/events';
import { listNewsPosts } from '../../api/news';
import {
  achievementItems,
  alumniStories,
  benefitItems,
  eventItems,
  experienceItems,
  heroContent,
  joinSection,
  newsItems,
  serviceLinks,
} from './home.config';

function formatDate(value) {
  if (!value) {
    return 'Sắp cập nhật';
  }

  return new Date(value).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function ActionLink({ item, className, children }) {
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer noopener" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link to={item.href} className={className}>
      {children}
    </Link>
  );
}

function storyDetailPath(story) {
  const basePath = story.story_category === 'OUTSTANDING'
    ? '/cong-dong-alumni/cuu-sinh-vien-tieu-bieu'
    : '/cong-dong-alumni/cau-chuyen-thanh-cong';

  return story.slug ? `${basePath}/${story.slug}` : basePath;
}

function fallbackStoryCards() {
  return alumniStories.map((story, index) => ({
    name: story.name,
    role: story.role,
    summary: story.summary,
    href: index === 0 ? '/cong-dong-alumni/cuu-sinh-vien-tieu-bieu' : '/cong-dong-alumni/cau-chuyen-thanh-cong',
  }));
}

function fallbackAlumniCards() {
  return [
    {
      full_name: 'Anh Dinh Hung',
      position: 'Cựu sinh viên Kinh doanh quốc tế',
      short_description: 'Nếu chọn một từ để mô tả hành trình của mình, tôi chọn chữ chuyển hóa bởi đó là sự chuyển mình từ những trải nghiệm rất thật.',
      avatar_url: '',
      slug: '',
    },
    {
      full_name: 'Chị Lê Thị Thùy Trang',
      position: 'Quản trị kinh doanh',
      short_description: 'Hành trình từ HSU đến môi trường làm việc hiện tại là chuỗi những đổi thay nhỏ, nơi tôi học được cách tôn trọng giá trị bền vững.',
      avatar_url: '',
      slug: '',
    },
    {
      full_name: 'Chị Nguyễn Thị Bảo Yến',
      position: 'Cựu sinh viên Marketing',
      short_description: 'Lựa chọn Đại học Hoa Sen bắt đầu từ mong muốn được học trong một môi trường tôn trọng khác biệt và khuyến khích hành động.',
      avatar_url: '',
      slug: '',
    },
  ];
}

function getInitials(value = '') {
  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function SectionMoreLink({ to, label = 'Xem tất cả' }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-ink">
      <span>{label}</span>
      <span className="inline-flex h-6 w-6 items-center justify-center bg-brand text-white">
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}

const summaryClampStyle = {
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

function HomepageAlumniCard({ item }) {
  const href = item.slug ? `/cong-dong-alumni/${item.slug}` : '/cong-dong-alumni';

  return (
    <article className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_38px_rgba(16,35,69,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(16,35,69,0.12)]">
      <div className="bg-[#E6ECF9] p-4">
        <BrandImage
          src={item.avatar_url}
          alt={item.full_name}
          className="aspect-[1/1] w-full bg-[#DDE5F7] object-cover object-top"
          fallback={
            <div className="flex aspect-[1/1] w-full items-center justify-center bg-[#DDE5F7] text-3xl font-extrabold tracking-[0.08em] text-brand/25">
              {getInitials(item.full_name) || 'HSU'}
            </div>
          }
        />
      </div>

      <div className="space-y-3 px-6 py-5">
        <div>
          <h3 className="text-[2rem] font-extrabold leading-none text-brand-ink">{item.full_name}</h3>
          <p className="mt-3 text-[1.05rem] font-semibold leading-6 text-brand-ink">{item.position}</p>
        </div>

        <p className="text-base leading-8 text-slate-600" style={summaryClampStyle}>
          {item.short_description || 'Nội dung đang được cập nhật.'}
        </p>

        <Link to={href} className="inline-flex items-center gap-2 text-base font-semibold text-brand-ink hover:text-brand">
          <span>Xem thêm</span>
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function BenefitIcon({ type }) {
  if (type === 'community') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
        <path d="M8 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.5 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.5 18a3.5 3.5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M13.5 18a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'career') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
        <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="4" y="7" width="16" height="11.5" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 11.5h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10.5 14.5h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
      <path d="M6.5 10h11v9a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 10V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 6.5V5.75A1.75 1.75 0 0 1 9.75 4h4.5A1.75 1.75 0 0 1 16 5.75v.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 10h16V8.75A1.75 1.75 0 0 0 18.25 7h-12.5A1.75 1.75 0 0 0 4 8.75V10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function HomePage() {
  const heroBanner = siteMeta.brandAssets?.home?.heroBanner;
  const commBanner = siteMeta.brandAssets?.home?.commBanner;
  const benefitImages = [siteMeta.brandAssets?.home?.icon, siteMeta.brandAssets?.home?.icon1, siteMeta.brandAssets?.home?.icon2];
  const [newsFeed, setNewsFeed] = useState(newsItems);
  const [eventFeed, setEventFeed] = useState(eventItems);
  const [alumniDirectory, setAlumniDirectory] = useState(fallbackAlumniCards);
  const [communityStories, setCommunityStories] = useState(fallbackStoryCards);

  useEffect(() => {
    let active = true;

    async function loadFeeds() {
      try {
        const [newsResponse, eventResponse, storyResponse, alumniResponse] = await Promise.all([
          listNewsPosts({ limit: 3 }),
          listEvents({ limit: 3, event_status: 'UPCOMING' }),
          listPublicStories(),
          listAlumniPosts(),
        ]);

        if (!active) {
          return;
        }

        const nextNewsItems = Array.isArray(newsResponse) ? newsResponse : newsResponse?.results ?? [];
        if (nextNewsItems.length) {
          setNewsFeed(
            nextNewsItems.map((item, index) => ({
              title: item.title,
              category: item.category?.name || 'Tin tức',
              description: item.excerpt || 'Nội dung đang được cập nhật.',
              href: `/tin-tuc/${item.slug}`,
              image: item.thumbnail_url || (index === 0 ? heroBanner : commBanner),
            }))
          );
        }

        const nextEventItems = Array.isArray(eventResponse) ? eventResponse : eventResponse?.results ?? [];
        if (nextEventItems.length) {
          setEventFeed(
            nextEventItems.map((item, index) => ({
              title: item.title,
              date: formatDate(item.start_date_time || item.published_at),
              location: item.location || 'Đang cập nhật địa điểm',
              href: `/su-kien/${item.slug}`,
              image: item.banner_url || (index === 0 ? heroBanner : commBanner),
            }))
          );
        }

        const alumniItems = Array.isArray(alumniResponse) ? alumniResponse : alumniResponse?.results ?? [];
        if (alumniItems.length) {
          setAlumniDirectory(alumniItems.slice(0, 3));
        }

        if (Array.isArray(storyResponse) && storyResponse.length) {
          setCommunityStories(
            storyResponse.slice(0, 3).map((item) => ({
              name: item.alumni_name || item.title,
              role: item.role_title
                ? `${item.story_category === 'OUTSTANDING' ? 'Cựu sinh viên tiêu biểu' : 'Câu chuyện thành công'} · ${item.role_title}`
                : item.story_category === 'OUTSTANDING'
                  ? 'Cựu sinh viên tiêu biểu'
                  : 'Câu chuyện thành công',
              summary: item.excerpt || item.body || 'Nội dung đang được cập nhật.',
              href: storyDetailPath(item),
            }))
          );
        }
      } catch {
        if (active) {
          setNewsFeed(newsItems);
          setEventFeed(eventItems);
          setAlumniDirectory(fallbackAlumniCards());
          setCommunityStories(fallbackStoryCards());
        }
      }
    }

    loadFeeds();
    return () => {
      active = false;
    };
  }, []);

  const featuredNews = newsFeed[0];
  const secondaryNews = newsFeed.slice(1);
  const joinMajors = ['Quản trị kinh doanh', 'Marketing', 'Công nghệ thông tin', 'Thiết kế', 'Ngôn ngữ'];

  return (
    <div className='space-y-12'>
      <section className="bg-white">
        <BrandImage
          src={heroBanner}
          alt="HSU Alumni hero banner"
          className="block h-full w-full object-cover"
          fallback={<div className="flex h-64 items-center justify-center bg-gray-200 text-gray-500">Hero banner</div>}
        />
      </section>

      <div className="page-shell space-y-12">
        <section className="bg-white">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <h3 className="mt-4 text-4xl font-extrabold tracking-tight text-brand-ink">
                {heroContent.title}
              </h3>
              <p className="mt-6 text-base leading-8 text-slate-600">{heroContent.description}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <ActionLink item={heroContent.primaryAction} className="btn-primary gap-2">
                  <span>{heroContent.primaryAction.label}</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </ActionLink>
                <ActionLink item={heroContent.secondaryAction} className="btn-secondary gap-2">
                  <span>{heroContent.secondaryAction.label}</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </ActionLink>
              </div>
            </div>

            <div className="bg-white overflow-hidden rounded-[10px]">
              <BrandImage
                src={commBanner}
                alt="HSU Alumni hero banner"
                className="block h-full w-full object-cover"
                fallback={<div className="flex h-64 items-center justify-center bg-gray-200 text-gray-500">Hero banner</div>}
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand-red">Thành tựu & dấu ấn</p>
              <h2 className="section-heading mt-4">Những nhóm nội dung cần được đẩy lên bằng visual đậm và card rõ ràng.</h2>
            </div>
            <Link to="/cong-dong-alumni/cuu-sinh-vien-tieu-bieu" className="btn-secondary gap-2">
              <span>Xem thêm</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {achievementItems.map((item, index) => (
              <article key={item.title} className="panel overflow-hidden">
                <div className={`h-44 ${index === 0 ? 'bg-[linear-gradient(135deg,#0457b8_0%,#0d2a67_100%)]' : index === 1 ? 'bg-[linear-gradient(135deg,#0d2a67_0%,#163d86_100%)]' : 'bg-[linear-gradient(135deg,#1f62bf_0%,#19408d_100%)]'} p-6 text-white`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/72">{item.meta}</p>
                  <h3 className="mt-4 max-w-xs text-2xl font-semibold leading-tight">{item.title}</h3>
                </div>
                <div className="px-6 py-6">
                  <p className="text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="bg-[#EEF4FB]">
        <div className="page-shell">
            <div className="text-center">
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-brand-ink sm:text-[2.35rem]">
                Trải nghiệm cùng Alumni
              </h2>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {experienceItems.map((item) => (
                <article key={item.title} className="overflow-hidden rounded-[22px] bg-white p-3 pb-6 shadow-[0_18px_38px_rgba(16,35,69,0.08)]">
                  <BrandImage
                    src={commBanner}
                    alt={item.title}
                    className="h-48 w-full rounded-[16px] object-cover"
                    fallback={
                      <div className="flex h-48 w-full items-center justify-center rounded-[16px] bg-slate-200 text-sm font-medium text-slate-500">
                        Community banner
                      </div>
                    }
                  />
                  <div className="px-2 pb-2 pt-5">
                    <h3 className="text-[1.45rem] font-extrabold leading-tight text-brand-ink">{item.title}</h3>
                    <p className="mt-3 text-base leading-8 text-slate-600">{item.description}</p>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </div>

      <div className="bg-[#DDEAFF]">
        <div className="page-shell">
          <div className="text-center">
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-brand-ink sm:text-[2.35rem]">
              Lợi ích khi tham gia
            </h2>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
             {benefitItems.map((item, index) => (
                <article
                  key={item.title}
                  className="overflow-hidden rounded-[22px] bg-white px-3 py-6 shadow-[0_18px_38px_rgba(16,35,69,0.08)]"
                >
                  <div className="flex justify-center">
                  <BrandImage
                    src={benefitImages[index]}
                    alt={item.title}
                    className="h-[80px] w-[80px] rounded-full object-cover"
                    fallback={
                      <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-500">
                        Benefit banner
                      </div>
                    }
                  />
                  </div>

                  <div className="px-2 pb-2 pt-5 text-center">
                    <h3 className="text-[1.45rem] font-extrabold leading-tight text-brand-ink">
                      {item.title}
                    </h3>

                    <p className="mt-4 text-base text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </div>
            
      <div className="page-shell space-y-12">
        <section className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand-red">Kết nối cộng đồng</p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-brand-ink">Cộng đồng Alumni</h2>
            </div>
            <SectionMoreLink to="/cong-dong-alumni" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {alumniDirectory.map((item) => (
              <HomepageAlumniCard key={item.slug || item.full_name} item={item} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand-red">Dịch vụ Alumni</p>
              <h2 className="section-heading mt-4">Các dịch vụ và tiện ích nên được nhóm thành một cụm điều hướng trực quan, dễ scan trên cả desktop lẫn mobile.</h2>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {serviceLinks.map((service) => (
              <ActionLink key={service.title} item={service} className="panel flex h-full flex-col px-5 py-6 transition hover:-translate-y-1 hover:shadow-2xl">
                <span className="inline-flex w-fit rounded-full bg-brand-sand px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-brand-red">
                  Service
                </span>
                <h3 className="mt-4 text-xl font-semibold text-brand-ink">{service.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{service.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                  Khám phá
                  {service.external ? <ExternalLinkIcon className="h-4 w-4" /> : <ArrowRightIcon className="h-4 w-4" />}
                </span>
              </ActionLink>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand-red">Câu chuyện Alumni</p>
              <h2 className="section-heading mt-4">Những lát cắt truyền cảm hứng từ cộng đồng cựu sinh viên Hoa Sen.</h2>
            </div>
            <SectionMoreLink to="/cong-dong-alumni/cau-chuyen-thanh-cong" label="Xem câu chuyện" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {communityStories.map((story, index) => (
              <article key={story.name} className="panel flex flex-col px-6 py-6">
                <div className="flex items-center gap-4">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full text-lg font-extrabold ${index === 0 ? 'bg-brand-sand text-brand' : index === 1 ? 'bg-[#e8f0fb] text-brand-dark' : 'bg-[#eef5ff] text-brand-red'}`}>
                    {story.name
                      .split(' ')
                      .slice(-2)
                      .map((part) => part.charAt(0))
                      .join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-brand-ink">{story.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{story.role}</p>
                  </div>
                </div>
                <p className="mt-5 flex-1 text-sm leading-7 text-slate-600">{story.summary}</p>
                <Link to={story.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                  Xem thêm
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[36px] bg-[linear-gradient(180deg,#0457B8_0%,#0457B8_58%,#EDF4FF_58%,#EDF4FF_100%)]">
          <div className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            <div className="rounded-[30px] bg-white px-5 py-5 shadow-[0_22px_42px_rgba(16,35,69,0.1)] lg:px-6 lg:py-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-brand-ink">Tin tức</h2>
                </div>
                <SectionMoreLink to="/tin-tuc" />
              </div>

              {featuredNews ? (
                <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.22fr)_minmax(300px,0.78fr)]">
                  <article className="min-w-0">
                    <BrandImage
                      src={featuredNews.image || heroBanner}
                      alt={featuredNews.title}
                      className="h-[260px] w-full rounded-[16px] object-cover lg:h-[320px]"
                      fallback={<div className="h-[260px] w-full rounded-[16px] bg-slate-200 lg:h-[320px]" />}
                    />
                    <div className="mt-4 space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-red">{featuredNews.category || 'Tin tức Alumni'}</p>
                      <h3 className="text-xl font-extrabold leading-tight text-brand-ink lg:text-[1.5rem]">{featuredNews.title}</h3>
                      <p className="text-sm leading-7 text-slate-600">{featuredNews.description}</p>
                      {featuredNews.href ? (
                        <Link to={featuredNews.href} className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
                          Xem chi tiết
                          <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                      ) : null}
                    </div>
                  </article>

                  <div className="space-y-4">
                    {secondaryNews.map((item, index) => (
                      <article key={item.title} className="grid gap-4 border-b border-slate-200 pb-4 last:border-b-0 last:pb-0 sm:grid-cols-[120px_minmax(0,1fr)]">
                        <BrandImage
                          src={item.image || (index % 2 === 0 ? commBanner : heroBanner)}
                          alt={item.title}
                          className="h-[88px] w-full rounded-[12px] object-cover"
                          fallback={<div className="h-[88px] w-full rounded-[12px] bg-slate-200" />}
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-red">{item.category || 'Hoạt động Alumni'}</p>
                          <h3 className="mt-2 text-sm font-bold leading-6 text-brand-ink">{item.title}</h3>
                          {item.href ? (
                            <Link to={item.href} className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-brand">
                              Xem thêm
                              <ArrowRightIcon className="h-3.5 w-3.5" />
                            </Link>
                          ) : null}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-brand-ink">Sự kiện</h2>
            </div>
            <SectionMoreLink to="/su-kien" label="Xem thêm" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {eventFeed.map((item, index) => (
              <article key={item.title} className="max-w-[280px] overflow-hidden rounded-[18px] border border-slate-200 bg-white p-2 shadow-[0_14px_30px_rgba(16,35,69,0.08)]">
                <BrandImage
                  src={item.image || (index === 0 ? heroBanner : commBanner)}
                  alt={item.title}
                  className="h-[170px] w-full rounded-[12px] object-cover"
                  fallback={<div className="h-[170px] w-full rounded-[12px] bg-slate-200" />}
                />
                <div className="px-3 pb-3 pt-4">
                  <h3 className="text-base font-bold leading-6 text-brand-ink">{item.title}</h3>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="inline-flex rounded-[6px] bg-brand px-3 py-1 text-xs font-semibold text-white">
                      {item.date}
                    </span>
                    {item.href ? (
                      <Link to={item.href} className="inline-flex items-center gap-1 text-xs font-semibold text-brand">
                        Chi tiết
                        <ArrowRightIcon className="h-3.5 w-3.5" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[34px] bg-brand px-6 py-8 text-white lg:px-10 lg:py-10">
          <span className="absolute left-6 top-6 h-4 w-4 bg-brand-red" />
          <span className="absolute left-10 top-10 h-3 w-12 bg-[#0BB6FF]" />
          <span className="absolute bottom-5 left-0 h-4 w-24 bg-[#0BB6FF]" />
          <span className="absolute bottom-0 right-0 h-5 w-5 bg-[#F7D600]" />
          <span className="absolute bottom-5 right-8 h-4 w-16 bg-[#0BB6FF]" />
          <span className="absolute bottom-9 right-0 h-4 w-8 bg-brand-red" />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white">{joinSection.eyebrow}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">
                Để lại thông tin để Alumni HSU kết nối bạn với cộng đồng, hoạt động nổi bật và các cơ hội nghề nghiệp phù hợp.
              </p>

              <form className="mt-6 grid gap-3 sm:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
                <input className="rounded-[8px] border border-white/15 bg-white px-4 py-3 text-sm text-brand-ink outline-none placeholder:text-slate-400" placeholder="Họ và tên *" />
                <input className="rounded-[8px] border border-white/15 bg-white px-4 py-3 text-sm text-brand-ink outline-none placeholder:text-slate-400" placeholder="Email" />
                <input className="rounded-[8px] border border-white/15 bg-white px-4 py-3 text-sm text-brand-ink outline-none placeholder:text-slate-400" placeholder="Số điện thoại *" />
                <input className="rounded-[8px] border border-white/15 bg-white px-4 py-3 text-sm text-brand-ink outline-none placeholder:text-slate-400" placeholder="Khóa *" />
                <select className="rounded-[8px] border border-white/15 bg-white px-4 py-3 text-sm text-brand-ink outline-none">
                  <option value="">Ngành *</option>
                  {joinMajors.map((major) => (
                    <option key={major} value={major}>{major}</option>
                  ))}
                </select>
                <input className="rounded-[8px] border border-white/15 bg-white px-4 py-3 text-sm text-brand-ink outline-none placeholder:text-slate-400" placeholder="Năm tốt nghiệp *" />
                <input className="rounded-[8px] border border-white/15 bg-white px-4 py-3 text-sm text-brand-ink outline-none placeholder:text-slate-400 sm:col-span-2" placeholder="Công việc hiện tại *" />
                <button type="submit" className="rounded-[8px] bg-brand-red px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 sm:col-span-2">
                  Đăng ký tư vấn
                </button>
              </form>
            </div>

            <div className="overflow-hidden rounded-[10px] bg-white/12 p-3 backdrop-blur-sm">
              <BrandImage
                src={commBanner}
                alt="Gia nhập cộng đồng Alumni"
                className="h-full min-h-[300px] w-full rounded-[8px] object-cover"
                fallback={<div className="h-full min-h-[300px] w-full rounded-[8px] bg-white/20" />}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
