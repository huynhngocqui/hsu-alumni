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

export function formatLongDate(value) {
  if (!value) {
    return 'Chưa xác định';
  }

  try {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function formatTime(value) {
  if (!value) {
    return '--:--';
  }

  try {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function formatDateTimeRange(startValue, endValue) {
  if (!startValue && !endValue) {
    return 'Chưa xác định thời gian';
  }

  const startDate = startValue ? new Date(startValue) : null;
  const endDate = endValue ? new Date(endValue) : null;

  if (!startDate || Number.isNaN(startDate.getTime())) {
    return formatLongDate(endValue);
  }

  if (!endDate || Number.isNaN(endDate.getTime())) {
    return `${formatLongDate(startValue)} · ${formatTime(startValue)}`;
  }

  const sameDay = startDate.toDateString() === endDate.toDateString();
  if (sameDay) {
    return `${formatLongDate(startValue)} · ${formatTime(startValue)} - ${formatTime(endValue)}`;
  }

  return `${formatLongDate(startValue)} - ${formatLongDate(endValue)}`;
}
