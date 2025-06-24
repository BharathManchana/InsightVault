import { Link } from "react-router-dom";

export default function NavBar({ user, onLogout }) {
  return (
    <nav className="bg-indigo-700 text-white flex justify-between p-4 items-center">
      <div>
        <Link to="/" className="font-bold text-xl">InsightVault</Link>
      </div>
      <div>
        {user ? (
          <>
            <Link to="/dashboard" className="mx-2">Dashboard</Link>
            <Link to="/profile" className="mx-2">Profile</Link>
            <button onClick={onLogout} className="ml-4">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mx-2">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}