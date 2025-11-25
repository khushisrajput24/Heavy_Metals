import { useState } from "react";
import { ExportReport } from "./export";
import { Button } from "../components/ui/button";

const HandleExport = () => {
  const [exporting, setExporting] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [hasExported, setHasExported] = useState(false);
  const [isExpanded, setExpanded] = useState(false);

  // Handle export button click
  const handleExportClick = async () => {
    setExporting(true); // Start export process
    try {
      await ExportReport("GW-001", setExporting); // Assuming ExportReport is asynchronous
      setHasExported(true); // Mark export as completed
    } catch (error) {
      console.error("Export failed:", error);
      setExporting(false); // Stop the loading state in case of error
    }
  };

  // Handle checkbox change (declaration)
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle checkbox
  };

  return (
    <div>
      {/* Export Button */}
      <Button
        colorVariant="primary"
        type="main"
        onClickHandler={handleExportClick}
        disabled={exporting}
      >
        {exporting ? "Exporting..." : "Export Report"}
      </Button>

      <div>
        {/* Show Declaration Checkbox after export */}
        {hasExported && (
          <div className="card-row">
            <input
              type="checkbox"
              id="userDeclaration"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="checkbox-icon"
            />
            <div>
              <div className="metric-value">
                Do you wish to share only the final calculated result with us to
                store on hyperledger blockchain for geotagging on our site?
              </div>
              <div className="card-label">
                {!isExpanded ? (
                  <>
                    Don't worry! Your data is secure! <br />
                    Hyperledger Blockchain: It is a secure, permissioned ledger
                    used to record geo-tagged groundwater pollution data,
                    keeping it tamper-proof, transparent, and private.
                  </>
                ) : (
                  <>
                    Don't worry! Your data is secure! <br />
                    Hyperledger Blockchain, in this project, is a secure and
                    permissioned digital ledger used to record and protect
                    geo-tagged information about groundwater heavy metal
                    pollution levels. It ensures that the mapped pollution data
                    remains tamper-proof, transparent, and accessible only to
                    authorized authorities, while keeping researchers’ raw data
                    completely private.
                  </>
                )}
              </div>
              <Button
                type="support"
                colorVariant="secondary"
                onClickHandler={() => setExpanded((prevState) => !prevState)}
              >
                {isExpanded ? "Read Less" : "Read More"}
              </Button>
            </div>
          </div>
        )}

        {/* Optionally, add more UI for the next action */}
        {hasExported && isChecked && (
          <div className="metric-value">
            <p>
              Declaration confirmed! Thank you for helping us grow. <br />
              Now your results will be reflected on map geotagging to help in
              better analysis.
            </p>
            {/* Add actions after declaration confirmation */}
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleExport;
