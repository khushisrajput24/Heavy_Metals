import React from "react";
import { NavLink } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Hero = () => {
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    // Only run when Clerk user data is loaded
    if (isLoaded && user) {
      navigate("/user");
    }
  }, [isLoaded, user, navigate]);
  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex flex-col items-center justify-center text-center text-gray-900 px-6 sm:px-10 overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, #0D9486 0%, #2EB87A 50%, #9CD97B 100%)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20"></div>

      <main className="relative z-10 max-w-3xl mx-auto flex flex-col items-center justify-center">
        {/* TOP BUTTON */}
        <NavLink
          onClick={() => openSignIn({ redirectUrl: "/user" })}
          className="mb-8"
        >
          <div className="border border-white text-white text-xs rounded-full px-5 py-2 hover:bg-white/10 transition cursor-pointer">
            Explore Water Quality Insights
          </div>
        </NavLink>

        {/* Subtitle */}
        <p className="mt-5 text-white/90 max-w-xl mx-auto text-base sm:text-lg">
          Scientific Data, Simplified
        </p>

        {/* Title */}
        <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl text-white leading-tight">
          Your Central Platform for HMPI{" "}
          <span className="text-gray-900">Analysis & Reporting</span>
        </h1>

        {/* Description */}
        <p className="mt-5 text-white/90 max-w-xl mx-auto text-base sm:text-lg">
          Calculate HMPI, explore contamination maps, and generate detailed
          environmental reports—all in one place.
        </p>

        {/* SECOND BUTTON */}
        <NavLink
          onClick={() => openSignIn({ redirectUrl: "/user" })}
          className="mt-10"
        >
          <div className="bg-white text-[#0D9486] px-8 py-3 rounded-full text-sm font-semibold hover:bg-gray-100 transition shadow-md cursor-pointer">
            Explore Tools
          </div>
        </NavLink>
      </main>

      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default Hero;
