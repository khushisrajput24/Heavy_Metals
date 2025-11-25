import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center text-center text-white px-6 sm:px-10"
      style={{
        backgroundImage: "linear-gradient(to bottom, #0D9486 0%, #2EB87A 50%, #9CD97B 100%)",
      }}
    >
      <h1 className="text-8xl md:text-9xl font-extrabold text-white drop-shadow-lg">
        404
      </h1>

      <div className="h-1 w-20 rounded-full bg-white my-6 md:my-8"></div>

      <p className="text-2xl md:text-3xl font-semibold text-gray-900">
        Page Not Found
      </p>

      <p className="text-sm md:text-base mt-4 text-white/90 max-w-md">
        The page you’re looking for might have been removed, renamed, or is
        temporarily unavailable.
      </p>

      <div className="flex items-center gap-4 mt-8">
        <Link
          to="/"
          className="bg-white text-[#0D9486] hover:bg-gray-100 px-7 py-2.5 rounded-full font-medium active:scale-95 transition-all"
        >
          Return Home
        </Link>

        {/* <Link
          to="/contact"
          className="border border-white text-white hover:bg-white/10 px-7 py-2.5 rounded-full font-medium active:scale-95 transition-all"
        >
          Contact Support
        </Link> */}
      </div>
    </section>
  );
};

export default NotFound;
