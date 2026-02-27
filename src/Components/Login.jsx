import React , {useState }from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password })
    });
  
    if (!res.ok) {
      setError("Invalid credentials");
      return;
    }
    socket.connect();

    navigate("/memory", { replace: true });
  };

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#10121b]">
      <div className="glass-container w-96 p-8 flex flex-col items-center animate-fadeIn">
        <h2 className="mb-4 text-white text-2xl font-bold tracking-wide">Welcome back</h2>
        <p className="mb-4 text-gray-300 text-sm font-medium">Sign in to your account</p>
        <form className="flex flex-col gap-4 mt-2 w-72 sm:w-96" onSubmit={handleLogin}>
        <input
            type="email"
            placeholder="Email"
            className="input-dark px-4 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-dark px-4 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="mt-2 glow-btn w-full py-2 rounded-lg text-white font-semibold"
          >
            Log In
          </button>
        </form>
        <div className="w-full flex flex-col items-center gap-2 mt-6">
          <button className="flex w-full items-center gap-2 py-2 rounded-md bg-[#232733] text-gray-100 justify-center hover:bg-[#293140] transition">
            <span className="text-lg">G</span> Continue with Google
          </button>
          <button className="flex w-full items-center gap-2 py-2 rounded-md bg-[#232733] text-gray-100 justify-center hover:bg-[#293140] transition">
            <span className="text-lg">X</span> Continue with X
          </button>
        </div>
        <p className="mt-6 text-gray-400 text-sm">
          Don't have an account?{" "}
          <span
            className="text-teal-300 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
