"use client";

import Cookies from "js-cookie";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const VALID_CREDENTIALS = [
  { username: "maamu", password: "786 786" },
  { username: "admin", password: "786 786" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in (session cookie)
    const authUser = Cookies.get("auth_user");
    if (authUser) {
      setIsAuthenticated(true);
      setUsername(authUser);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const isValid = VALID_CREDENTIALS.some(
      cred => cred.username === username && cred.password === password
    );

    if (isValid) {
      setIsAuthenticated(true);
      setUsername(username);
      // Set session cookie (expires when browser closes)
      Cookies.set("auth_user", username, { expires: undefined }); // Session cookie
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    Cookies.remove("auth_user");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
