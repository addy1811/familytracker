import React , { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill out all fields.");
      return;
    }
    setError(null);

    try {
      const res = await fetch("http://localhost:4000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });

      if (res.ok) {
        navigate("/login");
      } else {
        const data = await res.json();
        setError(data.error || "Signup failed.");
      }
    } catch(_) {
      setError("Network error.");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#10121b]">
      <div className="glass-container w-96 p-8 flex flex-col items-center animate-fadeIn">
        <h2 className="mb-4 text-white text-2xl font-bold tracking-wide">Create your account</h2>
        <p className="mb-4 text-gray-300 text-sm font-medium">Sign up to start your journey</p>
        <form className="flex flex-col gap-4 mt-2 w-72 sm:w-96" onSubmit={handleSignup}>
        <input
            type="text"
            placeholder="Full Name"
            className="input-dark px-4 py-2"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
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
            Sign Up
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
          Already have an account?{" "}
          <span
            className="text-teal-300 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
