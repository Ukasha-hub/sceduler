import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Landing() {
  const images = [
    "https://plus.unsplash.com/premium_photo-1691223714387-a74006933ffb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YnJvYWRjYXN0fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
    "https://images.unsplash.com/photo-1595520467722-98c9fd0f8fbd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJyb2FkY2FzdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
    "https://images.unsplash.com/photo-1693328394659-e0782c606d25?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnJvYWRjYXN0fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // auto-slide every 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      
      {/* ✅ Carousel Section */}
      <div className="w-full h-[450px] overflow-hidden relative">
        <img
          src={images[currentIndex]}
          alt="banner"
          className="w-full h-full object-cover transition-all duration-700"
        />
      </div>

      {/* ✅ Website Name */}
      <div className="text-center mt-10">
        <h1 className="text-4xl font-bold ">Sysnova Broadcast</h1>
        <p className="text-gray-600 mt-2">Organize. Manage. Deliver.</p>

        <Link to="/login">
          <button className="mt-5 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Login
          </button>
        </Link>
      </div>

      {/* ✅ 4 Cards Row */}
      <div className="mt-12 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

        {/* Reusable cards */}
        
          <div
        
            className="bg-white shadow-md p-6 rounded-xl hover:shadow-xl transition cursor-pointer"
          >
            <h2 className="text-xl font-semibold">Feature </h2>
            <p className="text-gray-500 mt-2">
              Short description of what this feature does.
            </p>

            <Link to="/login">
              <button className="mt-4 px-4 py-2 w-full bg-blue-600 text-white rounded hover:bg-blue-700">
                Explore
              </button>
            </Link>
          </div>

          <div
        
            className="bg-white shadow-md p-6 rounded-xl hover:shadow-xl transition cursor-pointer"
          >
            <h2 className="text-xl font-semibold">Digital Asset Management </h2>
            <p className="text-gray-500 mt-2">
              Short description of what this feature does.
            </p>

            <Link to="/login">
              <button className="mt-4 px-4 py-2 w-full bg-blue-600 text-white rounded hover:bg-blue-700">
                Explore
              </button>
            </Link>
          </div>

          <div
        
            className="bg-white shadow-md p-6 rounded-xl hover:shadow-xl transition cursor-pointer"
          >
            <h2 className="text-xl font-semibold">Scheduler </h2>
            <p className="text-gray-500 mt-2">
              Short description of what this feature does.
            </p>

            <Link to="/login">
              <button className="mt-4 px-4 py-2 w-full bg-blue-600 text-white rounded hover:bg-blue-700">
                Explore
              </button>
            </Link>
          </div>

          <div
        
            className="bg-white shadow-md p-6 rounded-xl hover:shadow-xl transition cursor-pointer"
          >
            <h2 className="text-xl font-semibold">Rundown </h2>
            <p className="text-gray-500 mt-2">
              Short description of what this feature does.
            </p>

            <Link to="/login">
              <button className="mt-4 px-4 py-2 w-full bg-blue-600 text-white rounded hover:bg-blue-700">
                Explore
              </button>
            </Link>
          </div>
      
      </div>
    </div>
  );
}
