import { Navigate, useParams } from 'react-router-dom';

function LegacySlugRedirectPage({ basePath }) {
  const { slug } = useParams();
  return <Navigate to={`${basePath}/${slug}`} replace />;
}

export default LegacySlugRedirectPage;