import { NavLink } from "react-router-dom";
import LogoImg from "../../../assets/images/logo.png";

export const Logo = ({ color }) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <NavLink to="/" className="flex items-center space-x-3">
        <img
          src={LogoImg}
          alt="JalDhatu Logo"
          className={`object-cover rounded-lg h-12 w-10`}
        />

        <h1
          className={`text-2xl font-semibold hover:underline text-[${color}]`}
        >
          JalDhatu
        </h1>
      </NavLink>
    </div>
  );
};
