import { Link } from 'react-router-dom';
import BrandImage from '../../components/common/BrandImage';
import { siteMeta } from '../../config/site';
import { ArrowRightIcon, ExternalLinkIcon } from '../../components/common/icons';
import {
  achievementItems,
  alumniStories,
  benefitItems,
  eventItems,
  experienceItems,
  heroContent,
  joinSection,
  missionSection,
  newsItems,
  serviceLinks,
} from './home.config';

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
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand-red">Cộng đồng Alumni</p>
              <h2 className="section-heading mt-4">Câu chuyện Alumni cần có đủ khoảng trắng, hình dung nhân vật và CTA xem thêm rõ ràng.</h2>
            </div>
            <Link to="/cong-dong-alumni/cau-chuyen-thanh-cong" className="btn-secondary gap-2">
              <span>Xem câu chuyện</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {alumniStories.map((story, index) => (
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
                <Link to="/cong-dong-alumni/cuu-sinh-vien-tieu-bieu" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                  Xem thêm
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="panel px-6 py-7">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand-red">Tin tức</p>
                <h2 className="section-heading mt-4">Tin tức cần hỗ trợ featured item và danh sách card ngắn cùng một nhịp thị giác.</h2>
              </div>
              <a
                href="https://www.hoasen.edu.vn/tin-tuc/"
                target="_blank"
                rel="noreferrer noopener"
                className="hidden items-center gap-2 text-sm font-semibold text-brand lg:inline-flex"
              >
                Xem tất cả
                <ExternalLinkIcon className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-6 space-y-4">
              {newsItems.map((item) => (
                <article key={item.title} className="rounded-[22px] border border-slate-200 px-5 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-red">{item.category}</p>
                  <h3 className="mt-3 text-lg font-semibold text-brand-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="panel px-6 py-7">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand-red">Sự kiện</p>
                <h2 className="section-heading mt-4">Event section nên có ngày, địa điểm và điểm nhấn CTA đủ rõ để quét nhanh.</h2>
              </div>
              <a
                href="https://www.hoasen.edu.vn/event/"
                target="_blank"
                rel="noreferrer noopener"
                className="hidden items-center gap-2 text-sm font-semibold text-brand lg:inline-flex"
              >
                Xem tất cả
                <ExternalLinkIcon className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-6 space-y-4">
              {eventItems.map((item) => (
                <article key={item.title} className="rounded-[22px] bg-brand-sand px-5 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-red">{item.date}</p>
                  <h3 className="mt-3 text-lg font-semibold text-brand-ink">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{item.location}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[36px] bg-brand px-6 py-8 text-white lg:px-10 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/72">{joinSection.eyebrow}</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {joinSection.title}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/80">{joinSection.description}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                {joinSection.actions.map((action, index) => (
                  <ActionLink
                    key={action.label}
                    item={action}
                    className={index === 0 ? 'inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-ink' : 'inline-flex items-center gap-2 rounded-full border border-white/24 px-6 py-3 text-sm font-semibold text-white'}
                  >
                    <span>{action.label}</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </ActionLink>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {joinSection.checklist.map((item) => (
                <div key={item} className="rounded-[22px] border border-white/14 bg-white/10 px-5 py-4 text-sm leading-7 text-white/85">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
