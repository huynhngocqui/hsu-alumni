import { Link } from 'react-router-dom';
import { footerConfig } from '../../config/footer';
import { siteMeta } from '../../config/site';
import {
  ExternalLinkIcon,
  FacebookIcon,
  PhoneIcon,
  TikTokIcon,
  YoutubeIcon,
  ZaloIcon,
} from '../common/icons';

const socialIcons = {
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
  tiktok: TikTokIcon,
  zalo: ZaloIcon,
};

function FooterLink({ link, className, children }) {
  if (link.external) {
    return (
      <a href={link.href} target={link.target || '_blank'} rel={link.rel || 'noreferrer noopener'} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link to={link.href} className={className}>
      {children}
    </Link>
  );
}

function Footer() {
  return (
    <footer className="mt-auto bg-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_1.15fr_0.8fr_0.8fr]">
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">{footerConfig.brand.eyebrow}</p>
              <h2 className="text-3xl font-extrabold uppercase tracking-[0.04em]">{footerConfig.brand.title}</h2>
              <div className="h-1.5 w-24 rounded-full bg-brand-red" />
            </div>

            <p className="max-w-md text-sm leading-7 text-white/76">{footerConfig.brand.description}</p>
            <p className="max-w-md text-xs leading-6 text-white/55">{siteMeta.footerReferenceNote}</p>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-white">Thông tin liên hệ</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-white/82">
                {footerConfig.campuses.map((campus) => (
                  <li key={campus.label}>
                    <span className="font-semibold text-white">{campus.label}:</span> {campus.value}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3">
              {footerConfig.hotlines.map((item) => (
                <a
                  key={item.value}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-2 text-sm font-semibold text-white hover:bg-white/14"
                >
                  <PhoneIcon className="h-4 w-4" />
                  {item.label}: {item.value}
                </a>
              ))}
            </div>
          </div>

          {footerConfig.groups.map((group) => (
            <div key={group.groupTitle}>
              <h3 className="text-lg font-semibold text-white">{group.groupTitle}</h3>
              {group.type === 'app-list' ? (
                <div className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <FooterLink
                      key={link.id}
                      link={link}
                      className="flex rounded-[20px] border border-white/15 bg-white/8 px-4 py-3 transition hover:bg-white/12"
                    >
                      <span>
                        <span className="block text-sm font-semibold text-white">{link.label}</span>
                        <span className="mt-1 block text-xs text-white/62">{link.meta}</span>
                      </span>
                    </FooterLink>
                  ))}
                </div>
              ) : (
                <ul className="mt-4 space-y-3 text-sm text-white/80">
                  {group.links.map((link) => {
                    const SocialIcon = socialIcons[link.icon];

                    return (
                      <li key={link.id}>
                        <FooterLink
                          link={link}
                          className="inline-flex items-center gap-2 transition hover:text-white"
                        >
                          {group.type === 'social' && SocialIcon ? <SocialIcon className="h-5 w-5 text-white" /> : null}
                          <span>{link.label}</span>
                          {link.external && group.type !== 'social' ? <ExternalLinkIcon className="h-3.5 w-3.5" /> : null}
                        </FooterLink>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/12 pt-5 text-sm text-white/62 lg:flex lg:items-center lg:justify-between">
          <p>{footerConfig.copyright}</p>
          <p className="mt-3 lg:mt-0">{footerConfig.referenceNote || siteMeta.footerReferenceNote}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
