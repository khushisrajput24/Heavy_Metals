import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export const ProtectedRoute = ({ children }) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (!user) {
    return (
      <Navigate
        to="/"
        replace
        state={{ authError: "You need to log in first." }}
      />
    );
  }

  return children;
};
