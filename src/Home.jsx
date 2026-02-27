import React from "react";
import GlobeSection from "./GlobalSection";
import { useNavigate } from "react-router-dom";
import Starfield from "./Components/StarField";
export default function Home({ user, handleLogin, handleLogout }) {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-space-img flex flex-col justify-center items-center overflow-hidden">
  <Starfield
        speedFactor={0.08}           // Tune as you like
        backgroundColor="#06061a"    // Deep black/blue
        starColor={[255, 255, 255]}  // White stars
        starCount={4000}             // Number of stars
      />
      {/* Profile/Login */}
      <div className="absolute top-6 right-8 z-10">
        {user ? (
          <div className="flex items-center space-x-3">
            <img
              src={user.photoURL}
              alt="Profile"
              className="rounded-full w-10 h-10 border-2 border-white"
            />
            <button
              onClick={handleLogout}
              className="p-2 bg-white text-black rounded hover:bg-gray-200 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="p-2 bg-white text-black rounded-full shadow hover:bg-gray-200 transition"
          >
            Login
          </button>
        )}
      </div>

      {/* Rotating Globe in Space */}
      <GlobeSection />

      {/* Title and Subtitle */}
      <div className="flex items-center justify-center gap-2 welcome-fade">
  <span className="text-4xl animate-pulse">✨</span>
  <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-tr from-blue-200 via-cyan-400 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
    Welcome to Momento
  </h1>
  <span className="text-4xl animate-pulse">✨</span>
</div>



      {/* Get Started Button */}
      <button
        onClick={() => navigate("/signup")}
        className="mt-8 px-8 py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition z-10"
      >
        Get Started
      </button>
    </div>
  );
}

