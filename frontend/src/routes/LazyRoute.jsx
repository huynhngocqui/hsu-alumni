import { Suspense } from 'react';
import LoadingState from '../components/common/LoadingState';

function LazyRoute({ component: Component }) {
  return (
    <Suspense fallback={<div className="page-shell"><LoadingState title="Đang tải trang" /></div>}>
      <Component />
    </Suspense>
  );
}

export default LazyRoute;