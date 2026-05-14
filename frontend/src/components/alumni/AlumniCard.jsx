import { Link } from 'react-router-dom';
import BrandImage from '../common/BrandImage';
import { ArrowRightIcon } from '../common/icons';

function getInitials(fullName = '') {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join(' ');
}

const clampStyle = {
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

function AlumniCard({ item }) {
  const roleText = [item.position, item.major].filter(Boolean).join(' · ');

  return (
    <article className="panel flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="bg-[#E7EEF9] p-4 sm:p-5">
        <BrandImage
          src={item.avatar_url}
          alt={item.full_name}
          loading="lazy"
          className="aspect-[4/3] w-full rounded-[20px] bg-[#DCE6F7] object-cover object-top"
          fallback={
            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-[20px] bg-[#DCE6F7] text-4xl font-extrabold tracking-[0.08em] text-brand/25">
              {getInitials(item.full_name) || 'HSU'}
            </div>
          }
        />
      </div>

      <div className="flex flex-1 flex-col px-6 py-6">
        <h2 className="text-[1.72rem] font-extrabold leading-tight text-brand-ink">{item.full_name}</h2>
        <p className="mt-2 text-sm font-semibold text-slate-700">{roleText || 'Cộng đồng Cựu sinh viên Hoa Sen'}</p>
        <p className="mt-4 text-sm leading-7 text-slate-600" style={clampStyle}>
          {item.short_description || 'Câu chuyện đang được cập nhật.'}
        </p>

        <Link to={`/cong-dong-alumni/${item.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
          <span>Xem thêm</span>
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

export default AlumniCard;