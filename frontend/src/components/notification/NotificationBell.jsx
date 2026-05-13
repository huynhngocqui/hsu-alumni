import { useContext, useState } from 'react';
import { NotificationContext } from '../../context/NotificationContext';
import { BellIcon } from '../common/icons';

function NotificationBell() {
  const { items, unreadCount, markAllAsRead } = useContext(NotificationContext);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand/15 bg-white text-brand-ink hover:border-brand/30 hover:bg-brand-sand"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Mở danh sách thông báo"
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount ? (
          <span className="absolute -right-1 -top-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-brand px-1 text-xs font-semibold text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="panel absolute right-0 top-14 z-20 w-80 p-4" role="dialog" aria-label="Thông báo">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Thông báo</h3>
            <button type="button" className="text-sm text-brand" onClick={markAllAsRead}>
              Đánh dấu đã đọc
            </button>
          </div>

          {items.length ? (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold">{item.title}</h4>
                    {!item.read ? <span className="h-2 w-2 rounded-full bg-brand" /> : null}
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{item.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
              Chưa có thông báo mới.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default NotificationBell;
