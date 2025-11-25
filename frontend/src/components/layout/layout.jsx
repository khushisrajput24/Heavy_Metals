import { Outlet, useMatches } from "react-router-dom";
import Sidebar from "./sidebar";
import { Footer } from "./footer";
import { Header } from "./header";
import "./layout.css";
import { ScrollToTop } from "./scrollToTop";
import { useClerk } from "@clerk/clerk-react";

const DEFAULT_HEADER = "Dashboard";

export const Layout = () => {
  const matches = useMatches();
  const { user } = useClerk();
  const userName = user?.firstName || "User";

  const getCurrentHeader = () => {
    const matchWithHeader = matches.find(
      (match) => match.handle && match.handle.header
    );
    return matchWithHeader?.handle.header || DEFAULT_HEADER;
  };

  const currentHeader = getCurrentHeader();
  return (
    <div className="flex">
      <Sidebar />
      <div className="main-content-wrapper">
        <ScrollToTop />
        <main>
          <header>
            <Header userName={userName} children={currentHeader} />
          </header>
          <Outlet className="w-[72%]" />
        </main>
        <Footer />
      </div>
    </div>
  );
};
