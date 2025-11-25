import { NavLink } from "react-router-dom";
import { Logo } from "../ui/sidebar/logo";
import { NavBar } from "../ui/sidebar/navbar";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

const Sidebar = () => {
  const linkBaseClass =
    "flex items-center justify-center gap-3 px-4 py-2 rounded transition-colors whitespace-nowrap";

  return (
    <aside className="bg-white shadow-md h-screen w-[18%] flex flex-col justify-between p-4 fixed left-0 top-0">
      <div>
        <Logo color="#225ca3" />
        <NavBar />
      </div>
      {/* <NavLink to="/logout" className="sidebar-logout">
        <LogOut size={20} strokeWidth={2} />
        Log Out
      </NavLink> */}
    </aside>
  );
};

export default Sidebar;
