import { Bell, ArrowRight, Languages } from "lucide-react";
import { UserButton, useUser, useClerk } from "@clerk/clerk-react";
import { useMemo } from "react";
import "./layout.css";
import { Button } from "../ui/button";
import { LanguageDropdown } from "./languageDropdown";
import { Notifications } from "./notifications";

export const Header = ({ userName, children }) => {
  const { user } = useUser();
  const { openSignIn } = useClerk();

  // Time-based greeting
  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Random greeting (but stable)
  const greetings = ["Welcome", "Good to see you", "Glad you're here", "Hello"];
  const randomGreeting = useMemo(
    () => greetings[Math.floor(Math.random() * greetings.length)],
    []
  );

  // Page-specific UX messages
  const pageMessages = {
    Analysis: "Let’s dive into the insights.",
    Methodology: "Here’s how everything works behind the scenes.",
    Suggestion: "Let’s explore some smart recommendations.",
    Reports: "Recent reports about the data.",
    Map: "Let’s visualize the data.",
    "About Us": "Learn more about who we are.",
  };

  return (
    <header className="header-container">
      <nav className="header-left">
        <div className="header-head">
          {children === "Dashboard" && children}
        </div>

        <div className="font-semibold">
          {children === "Dashboard" ? (
            <>
              {timeGreeting}, {randomGreeting} {userName}! How’s your day going?
            </>
          ) : (
            <>
              {timeGreeting} {userName} <br />
              {pageMessages[children] || "Let's get started."}
            </>
          )}
        </div>
      </nav>

      <nav className="header-right">
        <Notifications />
        <LanguageDropdown />

        {user ? (
          <UserButton />
        ) : (
          <Button
            onClickHandler={openSignIn}
            type="main"
            colorVariant="primary"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </nav>
    </header>
  );
};
