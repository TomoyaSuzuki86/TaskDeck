import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type AuthUser = {
  uid: string;
  name: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loginWithGoogle: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loginWithGoogle: () =>
        setUser({
          uid: 'local-google-user',
          name: 'Task Deck User',
          email: 'user@example.com',
        }),
      logout: () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
