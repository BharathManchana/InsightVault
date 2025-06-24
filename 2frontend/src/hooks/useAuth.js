import { useState, useEffect } from "react";
import api from "../api";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const res = await api.get("/users/current-user");
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
    await api.post("/users/login", { username, password });
    await refreshUser();
  }

  async function logout() {
    await api.post("/users/logout");
    setUser(null);
  }

  return { user, loading, login, logout, refreshUser };
}