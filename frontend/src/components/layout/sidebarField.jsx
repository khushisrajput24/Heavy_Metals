import { Logo } from "../ui/sidebar/logo";
import { NavBarField } from "../ui/sidebar/navField";

const SidebarField = () => {
  return (
    <aside className="bg-white shadow-md h-screen w-[18%] flex flex-col justify-between p-4 fixed left-0 top-0">
      <div>
        <Logo color="#225ca3" />
        <NavBarField />
      </div>
    </aside>
  );
};

export default SidebarField;
