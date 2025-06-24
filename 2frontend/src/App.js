import { BrowserRouter, Routes, Route } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { user, login, logout, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <NavBar user={user} onLogout={logout} />
      <Routes>
        <Route path="/login" element={<AuthForm onSubmit={login} loading={loading} label="Login" />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Profile user={user} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div className="p-6">Welcome to InsightVault. <a href="/dashboard">Go to Dashboard</a></div>} />
      </Routes>
    </BrowserRouter>
  );
}