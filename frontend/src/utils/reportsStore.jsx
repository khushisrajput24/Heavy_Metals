import { useEffect } from "react";
import { reportsData } from "../utils/constants";
import { useReportStore } from "../store/reportStore";

const ReportFetcher = () => {
    const setReports = useReportStore((state) => state.setReports);
    const reports = useReportStore((state) => state.reports);

    useEffect(() => {
        // Check if the reports array is empty and load the data.
        // It's crucial to only do this once to avoid re-initializing the state.
        if (reports.length === 0) {
            setReports(reportsData);
        }
    }, [setReports]); // Only re-run the effect if setReports changes

    return null;
};

export default ReportFetcher;