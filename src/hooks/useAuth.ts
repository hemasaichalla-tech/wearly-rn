import { useState } from "react";
import { signIn, signUp, signOut, getUserProfile } from "../services/authService";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
    } catch (e: any) {
      setError(e.message || "Login failed");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    setLoading(true);
    setError(null);
    try {
      await signUp(email, password, username);
    } catch (e: any) {
      setError(e.message || "Registration failed");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut();
    } finally {
      setLoading(false);
    }
  };

  return { login, register, logout, loading, error, setError };
}
