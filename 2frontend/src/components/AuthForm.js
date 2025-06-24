import { useState } from "react";

export default function AuthForm({ onSubmit, loading, label }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      className="max-w-xs mx-auto bg-white p-6 rounded shadow"
      onSubmit={e => {
        e.preventDefault();
        onSubmit(username, password);
      }}
    >
      <h2 className="text-xl font-bold mb-4">{label}</h2>
      <input
        type="text"
        placeholder="Username"
        className="w-full mb-3 p-2 border rounded"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full mb-3 p-2 border rounded"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button
        className="w-full bg-indigo-600 text-white p-2 rounded"
        type="submit"
        disabled={loading}
      >
        {label}
      </button>
    </form>
  );
}