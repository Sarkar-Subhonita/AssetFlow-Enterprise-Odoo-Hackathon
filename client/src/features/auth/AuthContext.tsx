// Holds the logged-in user for the whole app. On mount, it silently
// checks /auth/me (via the session cookie) to restore the session
// after a page refresh.
import { createContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthContextType } from '../../types/auth.types';
import {
  loginRequest,
  signupRequest,
  logoutRequest,
  meRequest,
} from '../../services/authService';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    meRequest()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const loggedInUser = await loginRequest(email, password);
    setUser(loggedInUser);
  };

  const signup = async (name: string, email: string, password: string) => {
    const newUser = await signupRequest(name, email, password);
    setUser(newUser);
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
