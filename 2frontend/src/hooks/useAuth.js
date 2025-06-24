import { useState, useEffect } from "react";
import api from "../api";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const res = await api.get("/user/current-user");
      setUser(res.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  // Use username and password
  async function login(username, password) {
    await api.post("/user/login", { username, password });
    await refreshUser();
  }

  async function logout() {
    await api.post("/user/logout");
    setUser(null);
  }

  return { user, loading, login, logout, refreshUser };
}