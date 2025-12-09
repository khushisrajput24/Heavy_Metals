import React, { useEffect, useState } from "react";
import Hero from "../components/landing_page/Hero";
import NavbarHome from "../components/landing_page/navbar_home";
import { Footer } from "../components/layout/footer";
import { useLocation } from "react-router-dom";
import { X, TriangleAlert } from "lucide-react";
import Plan from "../components/plan";

const LandingPage = () => {
  const location = useLocation();

  const [message, setMessage] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // 1. If redirected with error → save in storage
    if (location.state?.authError) {
      localStorage.setItem("authError", location.state.authError);
    }

    // 2. Read the stored error
    const storedMessage = localStorage.getItem("authError");

    if (storedMessage) {
      setMessage(storedMessage);
      setShowToast(true);

      // Remove so it doesn't show again on refresh
      localStorage.removeItem("authError");
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen bg-white">

      <NavbarHome />

      {showToast && (
        <div className="fixed top-6 right-6 bg-red-100 text-red-700 
            px-4 py-3 rounded-xl shadow-lg border border-red-300 
            flex items-center gap-3 z-50"
        >
          <TriangleAlert className="w-5 h-5" />
          <span>{message}</span>

          <X className="w-5 h-5 cursor-pointer" onClick={() => setShowToast(false)} />
        </div>
      )}

      <Hero />
      <Plan/>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
