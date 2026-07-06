import React from "react";
import {
  GoogleMap,
  HeatmapLayer,
  Circle,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { jsPDF } from "jspdf";

import logoImage from "../../assets/images/logo.png";
import { reportsData } from "../../utils/constants";
import { formatReportForDownload } from "../../utils/functions/getReport";

const containerStyle = { width: "100%", height: "500px" };
const center = { lat: 28.7041, lng: 77.1025 };

const statusColors = {
  Alert: "orange",
  Critical: "#ff5c5c",
  Safe: "#52d17a",
};

export const EnhancedGeoTag = () => {
  const googleMapsApiKey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey,
    libraries: ["visualization"],
    version: "3.64",
  });

  const [hovered, setHovered] = React.useState(null);

  const dataPoints = React.useMemo(() => {
    if (!isLoaded) return [];
    const google = window.google;
    return reportsData.map((item) => ({
      location: new google.maps.LatLng(item.lat, item.lng),
      weight: item.hpi,
    }));
  }, [isLoaded]);

  // ================== PDF DOWNLOAD FUNCTION ==================
  const handleDownloadReport = (reportData) => {
    const finalReportData = formatReportForDownload(reportData);
    const doc = new jsPDF();

    const pageMargin = 5;
    const pageContentWidth = 210 - 2 * pageMargin;
    const marginLeft = pageMargin + 5;
    const rightColX = marginLeft + pageContentWidth / 2 + 5;
    const boxWidth = pageContentWidth / 2 - 5;
    const labelWidth = 35;
    const valueWidth = boxWidth - labelWidth - 5;
    const lineHeight = 6;
    const contentPadding = 2;
    let currentY = 10;

    // PAGE BORDER
    doc.rect(pageMargin, pageMargin, pageContentWidth, 297 - 2 * pageMargin);

    const drawItem = (x, y, label, value) => {
      doc.setFont("helvetica", "bold");
      doc.text(label + ":", x + contentPadding, y);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(String(value), valueWidth);
      doc.text(lines, x + labelWidth + contentPadding, y);
      return lineHeight * Math.max(lines.length, 1);
    };

    const drawBoxHeader = (x, y, title) => {
      doc.setFillColor(52, 189, 172);
      doc.rect(x, y, boxWidth, lineHeight, "F");
      doc.setTextColor(255);
      doc.setFont("helvetica", "bold");
      doc.text(title, x + contentPadding, y + 4.5);
      doc.setTextColor(0);
    };

    // HEADER
    doc.addImage(logoImage, "PNG", marginLeft, currentY, 10, 15);
    doc.setFontSize(18);
    doc.text(
      "Ground Water Unified Heavy Metal Index",
      marginLeft + 15,
      currentY + 5
    );
    doc.setFontSize(11);
    doc.text("Sample Information", marginLeft + 15, currentY + 12);
    currentY += 18;

    const sampleId = `GW-${reportData.region
      .substring(0, 3)
      .toUpperCase()}`;
    doc.text(`Sample ID: ${sampleId}`, marginLeft, currentY);
    currentY += 10;

    // LOCATION BOX
    drawBoxHeader(marginLeft, currentY, "Location Details");
    let y1 = currentY + 10;
    y1 += drawItem(marginLeft, y1, "Coordinates", finalReportData.Coordinates);
    y1 += drawItem(marginLeft, y1, "Place", finalReportData.Place);
    doc.rect(marginLeft, currentY, boxWidth, y1 - currentY + 5);

    // HMPI BOX
    drawBoxHeader(rightColX, currentY, "HMPI Values");
    let y2 = currentY + 10;
    y2 += drawItem(
      rightColX,
      y2,
      "HPI Value",
      finalReportData["HPI Value"]
    );
    y2 += drawItem(
      rightColX,
      y2,
      "HEI Value",
      finalReportData["HEI Value"]
    );
    y2 += drawItem(
      rightColX,
      y2,
      "MI Value",
      finalReportData["MI Value"]
    );
    y2 += drawItem(
      rightColX,
      y2,
      "Cd Value",
      finalReportData["Cd Value"]
    );
    doc.rect(rightColX, currentY, boxWidth, y2 - currentY + 5);

    currentY = Math.max(y1, y2) + 8;

    // ASSESSMENT
    drawBoxHeader(marginLeft, currentY, "Assessment");
    let y3 = currentY + 10;
    y3 += drawItem(marginLeft, y3, "Risk", finalReportData.Risk);
    y3 += drawItem(
      marginLeft,
      y3,
      "Root Cause",
      finalReportData["Root Cause"]
    );
    y3 += drawItem(marginLeft, y3, "Suggestion", finalReportData.Suggestion);
    doc.rect(marginLeft, currentY, boxWidth, y3 - currentY + 5);

    // ================== ✅ UNIFIED COLORED BOX + LEGEND ==================
    const unifiedBoxY = currentY;
    const ciValue = Number(finalReportData["CI Value"] || 0);

    let boxColor = [82, 209, 122];
    let statusText = "Safe";

    if (ciValue >= 0.9) {
      boxColor = [255, 92, 92];
      statusText = "Critical";
    } else if (ciValue >= 0.5) {
      boxColor = [255, 204, 0];
      statusText = "Alert";
    }

    doc.rect(rightColX, unifiedBoxY, boxWidth, y3 - currentY + 5);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Unified Value",
      rightColX + boxWidth / 2,
      unifiedBoxY + 12,
      { align: "center" }
    );

    doc.setFillColor(...boxColor);
    doc.rect(rightColX + 20, unifiedBoxY + 20, boxWidth - 40, 12, "F");

    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.text(
      ciValue.toFixed(2),
      rightColX + boxWidth / 2,
      unifiedBoxY + 29,
      { align: "center" }
    );

    doc.setFontSize(10);
    doc.text(
      statusText,
      rightColX + boxWidth / 2,
      unifiedBoxY + 42,
      { align: "center" }
    );

    // ================== ✅ STATUS LEGEND ==================
    let legendStartY = unifiedBoxY + 50;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Status Legend",
      rightColX + boxWidth / 2,
      legendStartY,
      { align: "center" }
    );

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.setFillColor(82, 209, 122);
    doc.circle(rightColX + 25, legendStartY + 8, 2, "F");
    doc.text("Safe  (< 0.5)", rightColX + 32, legendStartY + 9);

    doc.setFillColor(255, 204, 0);
    doc.circle(rightColX + 25, legendStartY + 16, 2, "F");
    doc.text("Alert  (0.5 - 0.9)", rightColX + 32, legendStartY + 17);

    doc.setFillColor(255, 92, 92);
    doc.circle(rightColX + 25, legendStartY + 24, 2, "F");
    doc.text("Critical  (>= 0.9)", rightColX + 32, legendStartY + 25);

    // FOOTER
    doc.setFontSize(10);
    doc.setTextColor(51, 51, 255);
    doc.text("JalDhatu", 105, 280, { align: "center" });

    doc.save(`${reportData.region}_HMPI_Report.pdf`);
  };

  const handleButtonFixedClick = (e, reportData) => {
    e.stopPropagation();
    handleDownloadReport(reportData);
  };

  // ================== MAP RENDER ==================
  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
      <HeatmapLayer data={dataPoints} />

      {reportsData.map((item) => (
        <Circle
          key={item.region}
          center={{ lat: item.lat, lng: item.lng }}
          radius={700}
          options={{
            strokeColor: statusColors[item.status],
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: statusColors[item.status],
            fillOpacity: 0.5,
          }}
          onMouseOver={() => setHovered(item)}
          onMouseOut={() => setHovered(null)}
        />
      ))}

      {hovered && (
        <InfoWindow
          position={{ lat: hovered.lat, lng: hovered.lng }}
          onCloseClick={() => setHovered(null)}
        >
          <div>
            <button
              style={{
                backgroundColor: "#1B5E20",
                color: "white",
                padding: "8px 12px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                marginBottom: "10px",
              }}
              onClick={(e) => handleButtonFixedClick(e, hovered)}
            >
              Download PDF Report
            </button>
            <br />
            <b>{hovered.region}</b>
            <br />
            <strong>Unified Value:</strong> {hovered.ci}
            <br />
            <strong>Analysis:</strong> {hovered.ml}
            <br />
            <strong>Root Cause:</strong>{" "}
            <span style={{ color: statusColors[hovered.status] }}>
              {hovered.cause}
            </span>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : null;
};
