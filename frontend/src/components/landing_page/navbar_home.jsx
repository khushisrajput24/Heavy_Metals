import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Button } from "../ui/button";
import { LanguageDropdown } from "../layout/languageDropdown";

const NavbarHome = () => {
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
    <header className="header-container">
      <nav className="header-left">
        <div className="font-semibold">Welcome!</div>
      </nav>

      <nav className="header-right">
        <LanguageDropdown />
        <div className="header-item">
          {user ? (
            <UserButton />
          ) : (
            <Button
              onClickHandler={() => openSignIn({ redirectUrl: "/user" })}
              type="main"
              colorVariant="primary"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavbarHome;
