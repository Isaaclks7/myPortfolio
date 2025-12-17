import { useState } from "react";
import { ChevronLeft, ChevronRight } from "@deemlol/next-icons";
import Image from "next/image"
import useThemeStore from "@/stores";

export default function PhotoViewer({ photos }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { darkMode, toggleDarkMode } = useThemeStore()

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  if (!photos || photos.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex justify-center items-center gap-6">
        <button
          onClick={prevPhoto}
          className={`top-1/2 left-2 h-full ${darkMode ? "text-white hover:bg-white/20" : "text-black hover:bg-black/20"} p-2 rounded-full  transition`}
        >
          <ChevronLeft size={24} />
        </button>
        {photos[currentIndex].endsWith(".mp4") ? 
          <video
            src={photos[currentIndex]}
            className="w-40 h-40 sm:w-60 sm:h-60 rounded-lg rotate-270 object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
          :
          <Image
            className="w-40 h-40 sm:w-60 sm:h-60 rounded-lg object-cover"
            src={photos[currentIndex]}
            alt={`Photo ${currentIndex + 1}`}
            width={100}
            height={100}
            
          />
        }
        <button
          onClick={nextPhoto}
          className={`top-1/2 left-2 h-full ${darkMode ? "text-white hover:bg-white/20" : "text-black hover:bg-black/20"} p-2 rounded-full  transition`}
        >
          <ChevronRight size={24} />
        </button>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  );
}
