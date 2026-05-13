import { Link } from 'react-router-dom';
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

function HomePage() {
  return (
    <div className="page-shell">
      <section className="panel overflow-hidden bg-white">
        <div className="grid gap-10 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-14">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-brand-red">{heroContent.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              {heroContent.title}
            </h1>
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

            <div className="mt-8 rounded-[24px] border border-dashed border-brand/25 bg-brand-sand px-5 py-4 text-sm leading-7 text-slate-600">
              {siteMeta.heroReferenceNote}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[36px] bg-brand px-6 py-8 text-white lg:px-8 lg:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_28%)]" />
            <div className="relative">
              <div className="inline-flex rounded-full bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                Frontend UI Direction
              </div>
              <h2 className="mt-4 max-w-sm text-3xl font-semibold leading-tight text-white">
                Hero đậm thương hiệu, section rõ nhịp và điều hướng nhiều cấp nhưng vẫn dễ dùng.
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {heroContent.statCards.map((card) => (
                  <div key={card.label} className="rounded-[24px] border border-white/12 bg-white/10 px-4 py-4 backdrop-blur-sm">
                    <p className="text-2xl font-extrabold">{card.value}</p>
                    <p className="mt-2 text-sm leading-6 text-white/80">{card.label}</p>
                  </div>
                ))}
              </div>

              <ul className="mt-6 space-y-3 text-sm leading-7 text-white/84">
                {heroContent.highlights.map((item) => (
                  <li key={item} className="rounded-[20px] border border-white/12 bg-white/8 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand-red">{missionSection.eyebrow}</p>
          <h2 className="section-heading mt-4">{missionSection.title}</h2>
          <p className="section-copy mt-5">{missionSection.description}</p>
        </div>

        <div className="grid gap-4">
          {missionSection.pillars.map((pillar) => (
            <article key={pillar.title} className="panel px-5 py-5">
              <h3 className="text-lg font-semibold text-brand-ink">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.description}</p>
            </article>
          ))}
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

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="panel px-6 py-7">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand-red">Trải nghiệm cùng Alumni</p>
          <h2 className="section-heading mt-4">Các điểm chạm nên được diễn giải như một hệ trải nghiệm, không phải danh sách text phẳng.</h2>
          <div className="mt-6 grid gap-4">
            {experienceItems.map((item) => (
              <article key={item.title} className="rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-5">
                <h3 className="text-lg font-semibold text-brand-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="panel px-6 py-7">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand-red">Lợi ích khi tham gia</p>
          <h2 className="section-heading mt-4">Benefit section cần đủ trực quan để người dùng hiểu ngay giá trị gia nhập cộng đồng.</h2>
          <div className="mt-6 grid gap-4">
            {benefitItems.map((item) => (
              <article key={item.title} className="rounded-[22px] bg-brand-sand px-5 py-5">
                <h3 className="text-lg font-semibold text-brand-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
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
  );
}

export default HomePage;
