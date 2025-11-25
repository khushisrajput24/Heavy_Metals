import { NavLink } from "react-router-dom";
import { LayoutDashboard, CircleStar, PencilRuler } from "lucide-react";

const Dropdown = () => {
  const linkBaseClass =
    "flex items-center gap-3 px-2 py-2 rounded transition-colors whitespace-nowrap";

  return (
    <nav className="mt-2">
      <NavLink
        to="/user/analysis/methodology"
        className={({ isActive }) =>
          `${linkBaseClass} ${
            isActive
              ? "bg-[#0e9486] text-white"
              : "text-[#0c7d72] hover:underline"
          }`
        }
      >
        <PencilRuler size={18} strokeWidth={1.8} />
        Methodology
      </NavLink>

      <NavLink
        to="/user/analysis/suggestions"
        className={({ isActive }) =>
          `${linkBaseClass} ${
            isActive
              ? "bg-[#0e9486] text-white"
              : "text-[#0c7d72] hover:underline"
          }`
        }
      >
        <CircleStar size={18} strokeWidth={1.8} />
        Suggestions
      </NavLink>
    </nav>
  );
};

export default Dropdown;
