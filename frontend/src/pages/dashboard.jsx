import "../App.css";
import { KeyMetrics } from "../components/dashboard/key_metrics";
import { StatusLegend } from "../components/dashboard/legend";
import MapAndCharts from "../components/dashboard/map";
import { DelhiHeatMap } from "../components/graphs/geoTag";
import { RecentReports } from "../components/dashboard/recent_reports";
import { SearchFilter } from "../components/dashboard/searchfilter";

export const Dashboard = () => {
  return (
    <div>
      {/* Main header and description */}
      <div className="main-header-wrapper">
        <div className="main-header">Environmental Monitoring</div>
        <div className="main-text">
          Visualize and analyze heavy metal pollution indices across different
          regions and time periods.
        </div>
      </div>

      {/* Main content with two columns */}
      <div className="flex flex-row space-x-4">
        <div className="flex w-[75%] flex-col space-y-1 mx-2">
          {/*Search bar and filters to be added here*/}
          <SearchFilter />
          {/* Map and Charts to be added here */}
          <DelhiHeatMap />
        </div>
        <div className="flex w-[25%] flex-col space-y-1 mx-2">
          {/* Key Metrics to be added here */}
          <KeyMetrics />
          {/* Status Legend to be added here */}
          <StatusLegend statusLabels={["Safe", "Alert", "Critical"]} />
        </div>
      </div>
      {/* Recent Reports to be added here */}
      <RecentReports />
    </div>
  );
};
