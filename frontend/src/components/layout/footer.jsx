import React from "react";
import { NavLink } from "react-router-dom";
import LogoImg from "../../assets/images/logo.png";
import { Logo } from "../ui/sidebar/logo";

export const Footer = () => {
  const linkBaseClass = "text-sm block";

  return (
    <footer
      className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-white"
      style={{ backgroundColor: "#0d9486" }}
    >
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-white/20 pb-6">
        {/* Left Section */}
        <div className="md:max-w-96">
          <Logo color="white" />

          <p className="mt-6 text-sm opacity-90 leading-relaxed">
            JalDhatu is a scientific platform that analyzes groundwater quality
            by calculating heavy-metal indices, contamination levels, and
            water-risk metrics. Our mission is to make groundwater assessment
            simple, accessible, and accurate.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex items-start md:justify-end gap-20">
          {/* Explore Section */}
          <div>
            <h2 className="font-semibold mb-5 text-white">Explore</h2>
            <ul className="text-sm space-y-2 opacity-90">
              <li>
                <NavLink
                  to="/user/about_us"
                  className={({ isActive }) =>
                    `${linkBaseClass} ${
                      isActive
                        ? "bg-[#0e9486] text-white"
                        : "text-white hover:underline"
                    }`
                  }
                >
                  About Us
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/user/calculate_hmpi"
                  className={({ isActive }) =>
                    `${linkBaseClass} ${
                      isActive
                        ? "bg-[#0e9486] text-white"
                        : "text-white hover:underline"
                    }`
                  }
                >
                  Calculate
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/user/analysis"
                  className={({ isActive }) =>
                    `${linkBaseClass} ${
                      isActive
                        ? "bg-[#0e9486] text-white"
                        : "text-white hover:underline"
                    }`
                  }
                >
                  Analysis
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/user/map"
                  className={({ isActive }) =>
                    `${linkBaseClass} ${
                      isActive
                        ? "bg-[#0e9486] text-white"
                        : "text-white hover:underline"
                    }`
                  }
                >
                  Map
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/user/reports"
                  className={({ isActive }) =>
                    `${linkBaseClass} ${
                      isActive
                        ? "bg-[#0e9486] text-white"
                        : "text-white hover:underline"
                    }`
                  }
                >
                  Reports
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="font-semibold mb-5 text-white">Get in touch</h2>
            <div className="text-sm space-y-2 opacity-90">
              <p>+91-9001900111</p>
              <p>support@jalDhatu.in</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <p className="pt-4 text-center text-xs md:text-sm pb-5 opacity-80">
        © 2025{" "}
        <NavLink to="/user" className="font-medium text-white hover:underline">
          JalDhatu
        </NavLink>{" "}
        . All Rights Reserved.
      </p>
    </footer>
  );
};
