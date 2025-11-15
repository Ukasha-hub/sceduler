import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Landing() {
  const images = [
    "https://plus.unsplash.com/premium_photo-1691223714387-a74006933ffb?auto=format&fit=crop&q=60&w=1200",
    "https://images.unsplash.com/photo-1595520467722-98c9fd0f8fbd?auto=format&fit=crop&q=60&w=1200",
    "https://images.unsplash.com/photo-1693328394659-e0782c606d25?auto=format&fit=crop&q=60&w=1200",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">

      {/* ⭐ CAROUSEL */}
      <div className="relative w-full h-[480px] overflow-hidden">
        <img
          src={images[currentIndex]}
          alt="banner"
          className="w-full h-full object-cover transition-opacity duration-700"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20"></div>

        {/* Text on top */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
  
  {/* GLASS BACKGROUND WRAPPER */}
  <div className="bg-white/10 backdrop-blur-md rounded-2xl px-10 py-8 shadow-lg">
    
    <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
      Sysnova Broadcast
    </h1>

    <p className="text-lg mt-3 font-light tracking-wide text-white opacity-90">
      Organize • Manage • Deliver
    </p>

    <Link to="/login">
      <button className="mt-6 px-7 py-3 bg-white/20 backdrop-blur-md border border-white/40 rounded-xl text-white font-semibold hover:bg-white/30 transition">
        Login
      </button>
    </Link>
  </div>
</div>
      </div>

      {/* ⭐ FEATURE CARDS */}
      <div className="max-w-7xl mx-auto mt-16 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {[
          { title: "Feature", text: "Short description of what this feature does." },
          { title: "Digital Asset Management", text: "Manage media efficiently and securely." },
          { title: "Scheduler", text: "Automate and control broadcast schedules." },
          { title: "Rundown", text: "Organize show flow with precision." },
        ].map((card, index) => (
          <div
            key={index}
            className="bg-white/70 backdrop-blur-md border border-gray-200 shadow-xl p-6 rounded-2xl hover:shadow-2xl transition-all"
          >
            <h2 className="text-2xl font-semibold text-gray-800">{card.title}</h2>
            <p className="text-gray-600 mt-3">{card.text}</p>

            <Link to="/login">
              <button className="mt-5 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Explore
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* Bottom spacing */}
      <div className="h-16"></div>
    </div>
  );
}
