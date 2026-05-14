import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import PageLayout from '../common/PageLayout';

function normalizeFormValues(fields, item = {}) {
  return fields.reduce((accumulator, field) => {
    accumulator[field.name] = item[field.name] ?? field.defaultValue ?? '';
    return accumulator;
  }, {});
}

function AdminCrudPage({
  breadcrumbItems,
  eyebrow,
  title,
  description,
  fields,
  listItems,
  createItem,
  updateItem,
  deleteItem,
  emptyMessage,
}) {
  const defaultValues = useMemo(() => normalizeFormValues(fields), [fields]);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const refreshItems = async () => {
    const nextItems = await listItems();
    setItems(nextItems);
    return nextItems;
  };

  useEffect(() => {
    refreshItems().catch(() => setItems([]));
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    try {
      setStatus({ type: '', message: '' });
      if (selectedItem) {
        await updateItem(selectedItem.id, values);
        setStatus({ type: 'success', message: 'Đã cập nhật dữ liệu.' });
      } else {
        await createItem(values);
        setStatus({ type: 'success', message: 'Đã tạo bản ghi mới.' });
      }

      const nextItems = await refreshItems();
      setSelectedItem(null);
      reset(defaultValues);
      if (!nextItems.length) {
        setItems([]);
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Không thể lưu dữ liệu.' });
    }
  });

  return (
    <PageLayout
      breadcrumbItems={breadcrumbItems}
      eyebrow={eyebrow}
      title={title}
      description={description}
      aside={
        <div className="rounded-[28px] bg-brand-sand px-6 py-6">
          <h2 className="text-lg font-semibold text-brand-ink">Danh sách hiện có</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">Chọn một bản ghi để chỉnh sửa hoặc xóa. Các thay đổi được ghi trực tiếp vào backend admin API.</p>
        </div>
      }
    >
      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.85fr)]">
        <form className="panel space-y-5 px-6 py-6" onSubmit={onSubmit}>
          {fields.map((field) => (
            <label key={field.name} className="block">
              <span className="input-label">{field.label}</span>
              {field.type === 'textarea' ? (
                <textarea className="input-field min-h-28" {...register(field.name)} />
              ) : field.type === 'select' ? (
                <select className="input-field" {...register(field.name)}>
                  {(field.options || []).map((option) => (
                    <option key={`${field.name}-${option.value}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input className="input-field" type={field.type || 'text'} {...register(field.name)} />
              )}
            </label>
          ))}

          {status.message ? (
            <p className={`text-sm ${status.type === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
              {status.message}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {selectedItem ? 'Lưu cập nhật' : 'Tạo mới'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setSelectedItem(null);
                reset(defaultValues);
              }}
            >
              Làm mới form
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {items.length ? (
            items.map((item) => (
              <article key={item.id} className="panel px-5 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-brand-ink">{item.title || item.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{item.slug || item.album_name || item.alumni_name || item.status}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {item.status || 'ACTIVE'}
                  </span>
                </div>
                {item.excerpt || item.description ? <p className="mt-3 text-sm leading-7 text-slate-600">{item.excerpt || item.description}</p> : null}
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="text-sm font-semibold text-brand"
                    onClick={() => {
                      setSelectedItem(item);
                      reset(normalizeFormValues(fields, item));
                    }}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    className="text-sm font-semibold text-red-600"
                    onClick={async () => {
                      try {
                        await deleteItem(item.id);
                        if (selectedItem?.id === item.id) {
                          setSelectedItem(null);
                          reset(defaultValues);
                        }
                        await refreshItems();
                      } catch (error) {
                        setStatus({ type: 'error', message: error.message || 'Không thể xóa dữ liệu.' });
                      }
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="panel px-6 py-8 text-sm text-slate-500">{emptyMessage}</div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}

export default AdminCrudPage;