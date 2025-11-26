import { useState } from "react";
import { ExportReport } from "./export";
import { Button } from "../components/ui/button";
import "../components/ui/css/analysis.css";

const HandleExport = () => {
  const [exporting, setExporting] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [hasExported, setHasExported] = useState(false);
  const [isExpanded, setExpanded] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [blockchainText, setBlockchainText] = useState(""); 
  const [disableShare, setDisableShare] = useState(false); // hides checkbox + confirm after decision

  // Export button logic
  const handleExportClick = async () => {
    setExporting(true);
    try {
      await ExportReport("GW-001", setExporting);
      setHasExported(true);
      setBlockchainText(""); // reset text
    } catch (error) {
      console.error("Export failed:", error);
      setExporting(false);
    }
  };

  // Checkbox toggle
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  // Yes clicked in modal
  const handleYesClick = () => {
    setBlockchainText(
      "Thank you for agreeing! Your final calculated result will now be stored securely on Hyperledger blockchain for geotagging."
    );
    setShowConfirm(false);
    setDisableShare(true); // hide checkbox + confirm
  };

  // No clicked in modal
  const handleNoClick = () => {
    setBlockchainText(
      "Thank you! We respect your privacy concerns and assure not to store any data. Keep analysing."
    );
    setShowConfirm(false);
    setDisableShare(true); // hide checkbox + confirm
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

      {hasExported && !disableShare && (
        <div className="mt-6 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Checkbox and blockchain text */}
          <label className="inline-flex items-start gap-2 mb-3">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="w-4 h-4 mt-1"
            />
            <div>
              <div className="font-medium">
                Do you wish to share only the final calculated result with us
                to store on Hyperledger blockchain for geotagging?
              </div>

              <div className="text-sm text-gray-600 mt-1">
                {blockchainText === "" ? (
                  !isExpanded ? (
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
                      pollution levels. It ensures that the mapped pollution
                      data remains tamper-proof, transparent, and accessible
                      only to authorized authorities, while keeping researchers’ raw data private.
                    </>
                  )
                ) : (
                  <b>{blockchainText}</b>
                )}
              </div>

              <button
                className="text-sm text-blue-700 underline mt-1"
                onClick={() => setExpanded((prev) => !prev)}
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>

              {/* Confirm button */}
              <div className="mt-3">
                <Button
                  type="main"
                  colorVariant="primary"
                  onClickHandler={() => setShowConfirm(true)}
                  disabled={!isChecked}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </label>
        </div>
      )}

      {/* Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={() => setShowConfirm(false)}
            >
              &times;
            </button>

            <h3 className="text-lg font-semibold mb-3">
              Confirm Blockchain Sharing
            </h3>

            <p className="text-sm text-gray-700 mb-5">
              Are you sure you want to allow storing the final calculated result on Hyperledger blockchain?
            </p>

            <div className="flex justify-end gap-3">
              <Button type="main" colorVariant="primary" onClickHandler={handleYesClick}>
                Yes, proceed
              </Button>
              <Button type="main" colorVariant="secondary" onClickHandler={handleNoClick}>
                No, cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Show message after modal action */}
      {hasExported && blockchainText !== "" && (
        <div className="mt-4 text-sm text-gray-800 font-medium">
          {blockchainText}
        </div>
      )}
    </div>
  );
};

export default HandleExport;
