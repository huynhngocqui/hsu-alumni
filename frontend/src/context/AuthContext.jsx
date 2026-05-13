import { createContext, useEffect, useMemo, useState } from 'react';

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

const STORAGE_KEY = 'hsu-alumni.auth';

function readInitialState() {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readInitialState());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      user,
      login: (nextUser) => setUser(nextUser),
      logout: () => setUser(null),
      updateUser: (updater) => {
        setUser((current) =>
          typeof updater === 'function' ? updater(current) : { ...current, ...updater },
        );
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
