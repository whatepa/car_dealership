import { useState } from "react";

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ username: data.username, role: data.role }));
        onLogin(data);
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 mb-6 bg-zinc-800 rounded-lg shadow-md border border-zinc-700">
      <h2 className="mb-6 text-2xl font-bold text-center text-white">Admin Login</h2>

      {error && (
        <div className="p-3 mb-4 text-red-300 bg-red-900 rounded border border-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-zinc-300">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 w-full rounded border border-zinc-600 bg-zinc-700 text-white focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-bold text-zinc-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 w-full rounded border border-zinc-600 bg-zinc-700 text-white focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 w-full font-bold text-white bg-blue-500 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-4 text-sm text-center text-zinc-400">
        <p>Demo credentials:</p>
        <p>Username: admin</p>
        <p>Password: admin123</p>
      </div>
    </div>
  );
};

export default LoginForm;
