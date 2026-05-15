import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AlumniArticleContent from '../../components/alumni/AlumniArticleContent';
import AlumniProfileHeader from '../../components/alumni/AlumniProfileHeader';
import Breadcrumb from '../../components/common/Breadcrumb';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import { getAlumniPostDetail } from '../../api/alumni';

function AlumniDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lang, setLang] = useState('vi');

  useEffect(() => {
    let active = true;

    async function loadPost() {
      setLoading(true);
      setError('');
      try {
        const payload = await getAlumniPostDetail(slug);
        if (!active) {
          return;
        }

        setPost(payload);
        setLang('vi');
      } catch (nextError) {
        if (!active) {
          return;
        }

        setPost(null);
        setError(nextError.message || 'Không thể tải bài viết alumni.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPost();

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!post) {
      return undefined;
    }

    const previousTitle = document.title;
    let descriptionTag = document.querySelector('meta[name="description"]');
    const createdTag = !descriptionTag;

    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }

    const previousDescription = descriptionTag.getAttribute('content') || '';
    document.title = post.seo_title || post.full_name;
    descriptionTag.setAttribute('content', post.seo_description || post.short_description || post.position || post.full_name);

    return () => {
      document.title = previousTitle;
      if (createdTag) {
        descriptionTag.remove();
      } else {
        descriptionTag.setAttribute('content', previousDescription);
      }
    };
  }, [post]);

  const articleContent = useMemo(() => {
    if (!post) {
      return '';
    }

    if (lang === 'en' && post.content_en?.trim()) {
      return post.content_en;
    }

    return post.content_vi;
  }, [lang, post]);

  if (loading) {
    return <div className="page-shell"><LoadingState title="Đang tải câu chuyện alumni" /></div>;
  }

  if (!post) {
    return (
      <div className="page-shell">
        <EmptyState
          title="Không tìm thấy bài viết alumni"
          message={error || 'Bài viết không tồn tại hoặc chưa được publish.'}
          action={() => window.history.back()}
          actionLabel="Quay lại"
        />
      </div>
    );
  }

  return (
    <>
      <div className="page-shell gap-6 pb-0">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', to: '/' },
            { label: 'Cộng đồng Cựu Sinh viên Hoa Sen', to: '/cong-dong-alumni' },
            { label: post.full_name },
          ]}
        />
        <div>
          <Link to="/cong-dong-alumni" className="btn-secondary">Quay lại danh sách alumni</Link>
        </div>
      </div>

      <AlumniProfileHeader alumni={post} lang={lang} onLangToggle={setLang} />
      {/* <AlumniArticleContent content={articleContent} galleryImages={post.gallery_images} /> */}
      <AlumniArticleContent content={articleContent} />
    </>
  );
}

export default AlumniDetailPage;