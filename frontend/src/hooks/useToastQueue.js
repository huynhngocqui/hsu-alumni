import { useState } from 'react';

let nextToastId = 1;

export function useToastQueue() {
  const [items, setItems] = useState([]);

  const removeToast = (id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const pushToast = ({ type = 'success', title = '', message, duration = 3200 }) => {
    const id = nextToastId;
    nextToastId += 1;

    setItems((current) => [...current, { id, type, title, message }]);
    window.setTimeout(() => removeToast(id), duration);
    return id;
  };

  return {
    items,
    pushToast,
    removeToast,
  };
}