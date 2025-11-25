import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ChevronDown,
  ChartArea,
  Map,
  BarChart2,
  Info,
  Calculator,
} from "lucide-react";
import Dropdown from "../../dashboard/dropdown";

export const NavBar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleAnalysisClick = (e) => {
    navigate("/user/analysis"); // Navigate to Analysis page
    setOpen((prev) => !prev); // Toggle dropdown
  };

  const linkBaseClass =
    "flex items-center gap-3 px-2 py-2 rounded transition-colors whitespace-nowrap";

  return (
    <nav className="flex flex-col gap-2 mt-6 bg-white w-[100%]">
      <NavLink
        to="/user"
        end
        className={({ isActive }) =>
          `${linkBaseClass} ${
            isActive
              ? "bg-[#0e9486] text-white"
              : "text-[#0c7d72] hover:underline"
          }`
        }
      >
        <LayoutDashboard size={20} strokeWidth={1.8} />
        Dashboard
      </NavLink>

      <NavLink
        to="/user/calculate_hmpi"
        className={({ isActive }) =>
          `${linkBaseClass} ${
            isActive
              ? "bg-[#0e9486] text-white"
              : "text-[#0c7d72] hover:underline"
          }`
        }
      >
        <Calculator size={20} strokeWidth={1.8} />
        Calculate
      </NavLink>

      <div
        className={`${linkBaseClass} flex items-center justify-between cursor-pointer ${
          window.location.pathname === "/user/analysis"
            ? "bg-[#0e9486] text-white"
            : "text-[#0c7d72] hover:underline"
        }`}
        onClick={handleAnalysisClick}
      >
        <div className="flex items-center gap-2">
          <ChartArea size={20} strokeWidth={1.8} />
          <span>Analysis</span>
        </div>

        <ChevronDown
          size={16}
          className={`transform transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>
      {open && (
        <div className="ml-6">
          <Dropdown />
        </div>
      )}

      <NavLink
        to="/user/map"
        className={({ isActive }) =>
          `${linkBaseClass} ${
            isActive
              ? "bg-[#0e9486] text-white"
              : "text-[#0c7d72] hover:underline"
          }`
        }
      >
        <Map size={20} strokeWidth={1.8} />
        Map
      </NavLink>

      <NavLink
        to="/user/reports"
        className={({ isActive }) =>
          `${linkBaseClass} ${
            isActive
              ? "bg-[#0e9486] text-white"
              : "text-[#0c7d72] hover:underline"
          }`
        }
      >
        <BarChart2 size={20} strokeWidth={1.8} />
        Reports
      </NavLink>

      <NavLink
        to="/user/about_us"
        className={({ isActive }) =>
          `${linkBaseClass} ${
            isActive
              ? "bg-[#0e9486] text-white"
              : "text-[#0c7d72] hover:underline"
          }`
        }
      >
        <Info size={20} strokeWidth={1.8} />
        About Us
      </NavLink>
    </nav>
  );
};
