export function formatDate(value) {
  if (!value) {
    return 'Chưa xác định';
  }

  try {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(value));
  } catch {
    return value;
  }
}
