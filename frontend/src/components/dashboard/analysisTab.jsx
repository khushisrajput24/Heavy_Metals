import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChartArea, ChevronDown } from 'lucide-react';
import Dropdown from './dropdown';

function AnalysisLink() {
  const [open, setOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.preventDefault(); // prevent immediate navigation
    setOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col w-full">
      {/* NavLink with onClick to toggle dropdown */}
      <NavLink
        to="/analysis"
        className={({ isActive }) =>
          `${isActive
            ? 'bg-[#0e9486] text-white'
            : 'text-[#0c7d72] hover:underline'
          } flex items-center justify-between`
        }
        onClick={toggleDropdown} // toggle dropdown on click
      >
        <div className="flex items-center gap-2">
          <ChartArea size={20} strokeWidth={1.8} />
          <span>Analysis</span>
        </div>

        <ChevronDown
          size={16}
          className={`transform transition-transform duration-200 ${open ? 'rotate-180' : ''
            }`}
        />
      </NavLink>

      {/* Dropdown only shows if open */}
      {open && (
        <Dropdown />
      )}
    </div>
  );
}

export default AnalysisLink;