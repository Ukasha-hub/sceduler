import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import archive from "../assets/archive.jpg";
import billing from "../assets/billing.jpg";
import Playout from "../assets/Playout.jpg";
import dam from "../assets/dam.jpg";
import gfx from "../assets/gfx.jpg";
import mediaHandler from "../assets/mediaHandler.jpg";
import newsroom from "../assets/newsroom.jpg";
import rundown from "../assets/rundown.jpg";
import scheduler from "../assets/scheduler.jpg";
import teleprompter from "../assets/teleprompter.jpg";

export default function Landing() {
  const images = [
    "https://plus.unsplash.com/premium_photo-1691223714387-a74006933ffb?auto=format&fit=crop&q=60&w=1200",
    "https://images.unsplash.com/photo-1595520467722-98c9fd0f8fbd?auto=format&fit=crop&q=60&w=1200",
    "https://images.unsplash.com/photo-1693328394659-e0782c606d25?auto=format&fit=crop&q=60&w=1200",
  ];

  const cards = [
    {
      title: "Playout Integration",
      desc: "Seamlessly control your broadcast output with real-time playout automation.",
      detail:
        "Seamless integration with CasparCG playout for automated scheduling, live broadcast handling, and dynamic overlay graphics.",
      img: Playout ,
    },
    {
      title: "Digital Asset Management",
      desc: "Store, organize and retrieve media assets with ease.",
      detail:
        "A centralized system for organizing, storing, and retrieving digital assets, ensuring efficient content management and workflow optimization.",
      img: dam,
    },
    {
      title: "Scheduler",
      desc: "Plan and automate 24/7 broadcast schedules effortlessly.",
      detail:
        "A 24/7 automated TV scheduling system with seamless integration for advertisements, overlays, and real-time time calculation. Supports billing automation for accurate financial tracking.",
      img: scheduler,
    },
    {
      title: "Rundown",
      desc: "Create structured show rundowns for perfect on-air execution.",
      detail:
        "A real-time rundown management system enabling precise control over live broadcasts, ensuring smooth transitions and on-the-fly adjustments.",
      img: rundown,
    },
    {
      title: "Newsroom System (NRCS)",
      desc: "Collaborate on stories, scripts, and live show coordination.",
      detail:
        "A comprehensive newsroom content management system (CMS) designed for streamlined news production, collaboration, and automation.",
      img: newsroom,
    },
    {
      title: "Online Graphics (GFX)",
      desc: "Create live on-air graphics instantly.",
      detail:
        "A real-time graphics solution for television broadcasts, including tickers, lower-thirds, aston effects, channel branding, and dynamic overlays.",
      img: gfx,
    },
    {
      title: "Media Handler",
      desc: "Process, transcode, and deliver media across platforms.",
      detail:
        "A professional-grade media management tool with advanced features like looping, queuing, pausing, and chained playback for seamless news footage handling.",
      img: mediaHandler,
    },
    {
      title: "Teleprompter System",
      desc: "Smooth, professional on-air script scrolling.",
      detail:
        "An intuitive teleprompter solution allowing news presenters to control and navigate scripts efficiently during live broadcasts.",
      img: teleprompter,
    },
    {
      title: "Archive Management",
      desc: "Long-term secure storage for all media assets.",
      detail:
        "A structured digital archive system for storing, retrieving, and managing media content with metadata tagging and efficient search capabilities.",
      img: archive,
    },
    {
      title: "Billing Automation",
      desc: "Automated invoicing and commercial scheduling.",
      detail:
        "A fully automated billing system that generates accurate invoices from as-run logs, ensuring precise financial reporting for broadcasters.",
      img: billing,
    },
  ];

  const [modalData, setModalData] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % images.length),
      3500
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">

      {/* ⭐ HERO CAROUSEL */}
      <div className="relative w-full h-[480px] overflow-hidden">
        <img
          src={images[currentIndex]}
          alt="banner"
          className="w-full h-full object-cover transition duration-700"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="bg-white/10 backdrop-blur-xl px-10 py-8 rounded-2xl shadow-lg">
            <h1 className="text-5xl font-extrabold text-white">Sysnova Broadcast</h1>
            <p className="text-lg mt-3 text-white opacity-90">Organize • Manage • Deliver</p>

            <Link to="/login">
              <button className="mt-6 px-7 py-3 bg-white/20 backdrop-blur-md border border-white/40 rounded-xl text-white font-semibold hover:bg-white/30 transition">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ⭐ FEATURE CARDS */}
      <h1 className="flex justify-center mt-5 text-5xl">Broadcast Automation Systems</h1>
      <div className="max-w-7xl mx-auto mt-16 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
         
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white/60 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl flex flex-col h-[390px] overflow-hidden hover:shadow-2xl transition"
          >
            <img src={card.img} className="h-40 w-full object-cover" />

            <div className="p-3 flex flex-col justify-between flex-grow">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{card.title}</h2>
                <p className="text-gray-600 text-sm mt-2">{card.desc}</p>
              </div>

              <button
                onClick={() => setModalData(card)}
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ⭐ CONTACT SECTION */}
<div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 mt-20">
  <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

    {/* LEFT SIDE - TEXT */}
    <div>
      <h2 className="text-4xl font-extrabold mb-4">Contact Us</h2>
      <p className="text-white/90 text-lg">
        Have questions about our broadcast solutions?  
        Our team will get back to you within 24 hours.
      </p>

      <div className="mt-8 space-y-3 text-white/90">
        <p><strong>Email:</strong> support@sysnovabroadcast.com</p>
        <p><strong>Phone:</strong> +880 1234 567 890</p>
        <p><strong>Address:</strong> Dhanmondi 2, Dhaka, Bangladesh</p>
      </div>
    </div>

    {/* RIGHT SIDE - CONTACT FORM */}
    <div className="bg-white shadow-xl rounded-2xl p-8 text-gray-800">
      <h3 className="text-2xl font-bold mb-4">Send Us a Message</h3>

      <form className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
        />
        <textarea
          rows="4"
          placeholder="Your Message"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none"
        ></textarea>

        <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
          Send Message
        </button>
      </form>
    </div>

  </div>
</div>

      <div className="h-16"></div>

      {/* 🔥 MODAL */}
      {modalData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl max-w-lg shadow-xl relative">

            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
              onClick={() => setModalData(null)}
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-gray-800">{modalData.title}</h2>
            <p className="mt-4 text-gray-700">{modalData.detail}</p>

            <button
              onClick={() => setModalData(null)}
              className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
