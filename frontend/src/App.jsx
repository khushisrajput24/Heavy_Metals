import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/layout/layout";
import { Dashboard } from "./pages/dashboard";
import { AboutUs } from "./pages/about_us";
import { Reports } from "./pages/reports";
import { Map } from "./pages/map";
import { CalculateHMPI } from "./pages/calculate";
import { Settings } from "./pages/settings";
import { Analysis } from "./pages/analysis";
import { Methodology } from "./components/analysis/methodology";
import { Suggestion } from "./components/analysis/suggestions";
import LandingPage from "./pages/landing_page";
import NotFound from "./pages/not_found";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { DashboardField } from "./pages/dashboardField";
import { InputData } from "./pages/inputData";
import { LayoutField } from "./components/layout/layoutField";
import BulkReport from "./components/calculate/bulkReport";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },

  // ================= USER PANEL ==================
  {
    path: "/user",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard />, handle: { header: "Dashboard" } },

      {
        path: "about_us",
        element: <AboutUs />,
        handle: { header: "About Us" },
      },

      { path: "reports", element: <Reports />, handle: { header: "Reports" } },

      { path: "map", element: <Map />, handle: { header: "Map" } },

      {
        path: "calculate_hmpi",
        element: <CalculateHMPI />,
        handle: { header: "Calculate HMPI" },
      },

      {
        path: "analysis",
        element: <Analysis />,
        handle: { header: "Analysis" },
      },

      {
        path: "analysis/methodology",
        element: <Methodology />,
        handle: { header: "Methodology" },
      },

      {
        path: "analysis/suggestions/:contaminant",
        element: <Suggestion />,
        handle: { header: "Suggestions" },
      },

      {
        path: "settings",
        element: <Settings />,
        handle: { header: "Settings" },
      },
      {
        path: "analysis/bulk-report",
        element: <BulkReport />,
        handle: { header: "Bulk Report" },
      },
    ],
  },

  // ================= FIELD WORKER PANEL ==================
  {
    path: "/field_work",
    element: (
      <ProtectedRoute>
        <LayoutField /> {/* If field workers also use the same layout */}
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardField />,
        handle: { header: "Dashboard" },
      },
      {
        path: "about_us",
        element: <AboutUs />,
        handle: { header: "About Us" },
      },
      {
        path: "input_data",
        element: <InputData />,
        handle: { header: "Input Data" },
      },
    ],
  },

  // ================= NOT FOUND ==================
  {
    path: "*",
    element: <NotFound />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
