import ImageGallerySection from '../common/ImageGallerySection';

function EventGallery({ images = [] }) {
  return <ImageGallerySection images={images} eyebrow="Khoảnh khắc" title="Thư viện hình ảnh sự kiện" imageAltPrefix="Hình ảnh sự kiện" />;
}

export default EventGallery;