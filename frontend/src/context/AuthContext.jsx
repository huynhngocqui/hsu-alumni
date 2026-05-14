import { createContext, useEffect, useMemo, useState } from 'react';

import { getCurrentUserProfile } from '../api/users';

export const AuthContext = createContext({
  isAuthenticated: false,
  isAuthReady: false,
  user: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  refreshUser: async () => null,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function bootstrapAuthState() {
      try {
        const nextUser = await getCurrentUserProfile();
        if (active) {
          setUser(nextUser);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setIsAuthReady(true);
        }
      }
    }

    bootstrapAuthState();

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      isAuthReady,
      user,
      login: (nextUser) => {
        setUser(nextUser);
        setIsAuthReady(true);
      },
      logout: () => {
        setUser(null);
        setIsAuthReady(true);
      },
      updateUser: (updater) => {
        setUser((current) =>
          typeof updater === 'function' ? updater(current) : { ...current, ...updater },
        );
      },
      refreshUser: async () => {
        const nextUser = await getCurrentUserProfile();
        setUser(nextUser);
        setIsAuthReady(true);
        return nextUser;
      },
    }),
    [isAuthReady, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
