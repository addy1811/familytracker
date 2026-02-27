import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

export default function MemoryCarousel({ images = [], onDelete }) {
  const [index, setIndex] = useState(0);

  if (!images.length) return <p className="text-white">No images</p>;

  const handleNext = () =>
    setIndex((prev) => (prev + 1) % images.length);

  const handlePrev = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);

  const current = images[index];

  return (
    <div className="relative w-72 h-60 bg-white/10 border-2 border-yellow-400 rounded-xl overflow-hidden shadow-xl backdrop-blur-sm">
      
      {/* ✅ Animated Image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={current.id}
          src={current.photo_url}
          alt="memory"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className="absolute w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Description */}
      <div className="absolute bottom-0 w-full bg-black/60 text-white text-sm p-2">
        {current.description || "No description"}
      </div>

      {/* ⬅️ ➡️ Navigation */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 p-1 rounded-full hover:bg-yellow-500 transition"
          >
            <ChevronLeft className="text-white w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 p-1 rounded-full hover:bg-yellow-500 transition"
          >
            <ChevronRight className="text-white w-5 h-5" />
          </button>
        </>
      )}

      {/* 🗑 Delete button (non-intrusive) */}
      {onDelete && (
        <button
          onClick={() => onDelete(current.id)}
          className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-700 text-white p-1 rounded-full transition"
          title="Delete memory"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}