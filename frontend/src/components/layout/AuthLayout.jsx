import { Link, Outlet } from 'react-router-dom';
import BrandImage from '../common/BrandImage';
import { siteMeta } from '../../config/site';

function AuthLayout() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-brand-sand px-4 py-10 bg-type-1'>
      <div className='w-full max-w-xl flex items-center justify-center flex-col gap-6'>
        <div className='flex gap-8'>
          <Link to="/"> 
            <BrandImage
              src={siteMeta.brandAssets?.navbar?.compactLogo}
              className="h-24"
              fallback={<div className="">Alumni</div>}
            />
          </Link>

          <Link to="/" className='flex items-center'> 
            <BrandImage
              src={siteMeta.brandAssets?.navbar?.alumniLogo}
              className="h-20"
              style={{ filter: 'brightness(0) invert(1)' }}
              fallback={<div className="">Alumni</div>}
            />
          </Link>
        </div>

        <div className="w-full">
          <div className="grid overflow-hidden rounded-[32px] border border-white/50 bg-white shadow-panel lg:grid-cols-[0fr_1.15fr]">
            <div className="hidden bg-brand p-3 text-white lg:flex lg:flex-col lg:justify-between"></div>

            <section className="p-4 sm:p-6 lg:p-7">
              <Outlet />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
