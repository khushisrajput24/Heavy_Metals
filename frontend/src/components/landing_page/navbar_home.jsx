import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Button } from "../ui/button";
import { LanguageDropdown } from "../layout/languageDropdown";
import { TextResize } from "../ui/TestResize";

const NavbarHome = () => {
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null); // <-- reference for outside click

  useEffect(() => {
    if (isLoaded && user) {
      navigate("/user");
    }
  }, [isLoaded, user, navigate]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="header-container">
      <nav className="header-left">
        <div className="font-semibold">Welcome!</div>
      </nav>

      <nav className="header-right">
        <TextResize />
        <LanguageDropdown />

        <div className="header-item">
          {!user && (
            <div className="relative" ref={dropdownRef}>
              <Button
                type="main"
                colorVariant="primary"
                onClickHandler={() => setOpen((prev) => !prev)}
              >
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border z-50">
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => openSignIn({ redirectUrl: "/field_work" })}
                  >
                    Field Worker
                  </div>

                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => openSignIn({ redirectUrl: "/user" })}
                  >
                    User
                  </div>
                </div>
              )}
            </div>
          )}

          {user && <UserButton />}
        </div>
      </nav>
    </header>
  );
};

export default NavbarHome;
