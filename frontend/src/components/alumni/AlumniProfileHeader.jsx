import BrandImage from '../common/BrandImage';

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-brand-ink">{value || 'Đang cập nhật'}</p>
    </div>
  );
}

function AlumniProfileHeader({ alumni, lang = 'vi', onLangToggle, onConnect }) {
  const hasEnglishContent = Boolean(alumni.content_en?.trim());

  const handleConnect = () => {
    if (onConnect) {
      onConnect();
      return;
    }

    document.getElementById('alumni-article-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="bg-[#EAF0FB]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="overflow-hidden rounded-[32px] bg-[#EEF3FD] shadow-[0_24px_56px_rgba(16,35,69,0.12)]">
          <div className="grid gap-0 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div className="bg-[#DDE7F8] px-6 py-6 sm:px-8 lg:px-10 lg:py-10">
              <BrandImage
                src={alumni.avatar_url}
                alt={alumni.full_name}
                loading="lazy"
                className="h-full min-h-[340px] w-full rounded-[28px] bg-[#D4E0F6] object-cover object-top"
                fallback={<div className="h-full min-h-[340px] w-full rounded-[28px] bg-[#D4E0F6]" />}
              />
            </div>

            <div className="relative bg-white px-6 py-7 sm:px-8 lg:px-10 lg:py-10">
              {hasEnglishContent ? (
                <div className="absolute right-6 top-6 inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-semibold lg:right-8 lg:top-8">
                  <button
                    type="button"
                    className={`rounded-full px-3 py-1 ${lang === 'vi' ? 'bg-brand text-white' : 'text-slate-500'}`}
                    onClick={() => onLangToggle?.('vi')}
                  >
                    VI
                  </button>
                  <button
                    type="button"
                    className={`rounded-full px-3 py-1 ${lang === 'en' ? 'bg-brand text-white' : 'text-slate-500'}`}
                    onClick={() => onLangToggle?.('en')}
                  >
                    EN
                  </button>
                </div>
              ) : null}

              <h1 className="max-w-3xl pr-24 text-4xl font-extrabold tracking-tight text-brand-ink sm:text-[2.6rem]">
                {alumni.full_name}
              </h1>
              <p className="mt-3 text-lg font-semibold text-brand-ink">{alumni.position}</p>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600">{alumni.short_description || 'Bài viết alumni đang được cập nhật nội dung.'}</p>

              <div className="mt-6 grid gap-5 border-y border-slate-200 py-6 sm:grid-cols-2 lg:max-w-3xl">
                <InfoItem label="Đơn vị công tác" value={alumni.company} />
                <InfoItem label="Bậc đào tạo" value={alumni.education_level} />
                <InfoItem label="Ngành" value={alumni.major} />
                <InfoItem label="Niên khóa" value={alumni.cohort} />
              </div>

              <button type="button" className="btn-primary mt-6" onClick={handleConnect}>
                Kết nối
              </button>

              <span className="absolute bottom-4 right-4 rounded-sm bg-brand-red px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white lg:bottom-6 lg:right-6">
                Người nổi bật
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AlumniProfileHeader;