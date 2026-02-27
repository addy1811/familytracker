import React, { useState, useEffect, useRef } from "react";
import AVATAR from "./assets/avatar.jpg";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { centroid } from "@turf/turf";
import L from "leaflet";
import MemoryCarousel from "./MemoryCarousel";
import socket from "./socket/socket"; 

const pinIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

export default function Memory({ user, refreshUser, onLogout }) {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [memories, setMemories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  /* ------------------ GEOJSON ------------------ */
  useEffect(() => {
    fetch("/countries.geojson")
      .then(res => res.json())
      .then(setGeoJsonData)
      .catch(console.error);
  }, []);

  /* ------------------ FETCH MEMORIES ------------------ */
  useEffect(() => {
    fetch("http://localhost:4000/api/memories", { credentials: "include" })
      .then(res => res.json())
      .then(setMemories)
      .catch(console.error);
  }, []);

  /* ------------------ SOCKET SETUP ------------------ */
  useEffect(() => {
    if (!user) return;

    socket.connect(); // 🔌 connect

    socket.on("memory:created", (memory) => {
      setMemories(prev => [...prev, memory]);
    });

    socket.on("memory:deleted", ({ id }) => {
      setMemories(prev => prev.filter(m => m.id !== Number(id)));
    });

    return () => {
      socket.off("memory:created");
      socket.off("memory:deleted");
      socket.disconnect(); // 🔌 cleanup
    };
  }, [user]);

  /* ------------------ DELETE MEMORY ------------------ */
  const deleteMemory = async (id) => {
    if (!window.confirm("Delete this memory?")) return;

    const res = await fetch(
      `http://localhost:4000/api/memories/${id}`,
      { method: "DELETE", credentials: "include" }
    );

    if (res.ok) {
      setMemories(prev => prev.filter(m => m.id !== id));
    }
  };

  /* ------------------ MAP HELPERS ------------------ */
  function getCountryCentroid(countryName) {
    if (!geoJsonData) return null;

    const feature = geoJsonData.features.find(
      f => f.properties.name?.toLowerCase() === countryName.toLowerCase()
    );

    if (!feature) return null;

    const center = centroid(feature);
    return [
      center.geometry.coordinates[1],
      center.geometry.coordinates[0]
    ];
  }

  const memoriesByCountry = memories.reduce((acc, memory) => {
    if (!acc[memory.country]) acc[memory.country] = [];
    acc[memory.country].push(memory);
    return acc;
  }, {});

  return (
    <div className="relative min-h-screen bg-[#161a26] overflow-hidden">
      {/* Top right user dropdown */}
      <div ref={dropdownRef} className="absolute top-4 right-4 z-30">
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center gap-1 w-[52px] justify-center"
        >
           <div className="w-10 h-10 flex-shrink-0">
          <img src = {user?.photo_url || AVATAR}
              alt = "profile"
              className="w-10 h-10 rounded-full object-cover border-2"
              onError={ (e) => {
                e.currentTarget.src = AVATAR;
              }}
          />
          </div>
          <svg
            className={`w-4 h-4 text-yellow-400 transition-transform duration-200 ${
        dropdownOpen ? "rotate-180" : "rotate-0"
      }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
           
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-black/70 backdrop-blur-md rounded-md shadow-lg py-2 origin-top-right">
             <button
                   onClick={() => navigate("/editProfile")}
                   className="block w-full text-left px-4 py-2 text-yellow-400 hover:bg-yellow-500 hover:text-black transition rounded"
                  >
               Edit Profile
                 </button>
            <button
              onClick={() => {
                onLogout();
                navigate("/")
              }}
              className="block w-full text-left px-4 py-2 text-yellow-400 hover:bg-yellow-500 hover:text-white transition rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Floating Create button */}
      <button
        onClick={() => navigate("/create-memory")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 bg-yellow-400/90 text-black font-semibold rounded-full px-6 py-3 shadow-lg backdrop-blur-md transition hover:bg-yellow-500 hover:shadow-yellow-400/60"
      >
        + Create Memories
      </button>

      {/* Map Section */}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        scrollWheelZoom={true}
        style={{
          height: "100vh",
          width: "100vw",
          filter: "brightness(1.15) contrast(1.1)"
        }}
        attributionControl={false}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        {geoJsonData && (
          <GeoJSON
            data={geoJsonData}
            style={() => ({
              weight: 1,
              color: "#ffd700",
              opacity: 0.7,
              fillOpacity: 0,
              filter: "drop-shadow(0 0 12px #ffd700cc)"
            })}
          />
        )}

        {/* ✅ Country Markers with grouped memories */}
        {geoJsonData &&
          Object.entries(memoriesByCountry).map(([country, memoryList]) => {
            const coords = getCountryCentroid(country);
            if (!coords) return null;

            return (
              <Marker key={country} position={coords} icon={pinIcon}>
                <Popup>
                <MemoryCarousel images={memoryList} onDelete={deleteMemory} />
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>

      {/* Title */}
      <div className="absolute inset-x-0 top-0 flex flex-col items-center mt-4 z-10">
  <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center pointer-events-auto">
    World of Memories
  </h1>
</div>

    </div>
  );
}
