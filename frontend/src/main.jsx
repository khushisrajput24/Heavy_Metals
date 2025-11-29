import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./App.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { TextSizeProvider } from "./context/TextSizeContext";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <TextSizeProvider>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </TextSizeProvider>
);
