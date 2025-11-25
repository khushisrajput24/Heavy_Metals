import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Enhanced ExportReport to handle:
 * - Robust export readiness
 * - Better alerts and logging
 * - Feedback to caller via setExporting
 * @param {string} sampleId  - The sample ID
 * @param {function} setExporting (callback for UI state)
 */
export const ExportReport = async (
  sampleId = "GW-001",
  setExporting = () => {}
) => {
  try {
    // Start exporting process
    setExporting(true);

    // Ensure the report content exists before continuing
    const reportElement = document.getElementById("report-content");

    if (!reportElement) {
      setExporting(false);
      alert(
        "Report content not found! Please ensure your content is loaded and visible."
      );
      return;
    }

    // Check if content is visible
    if (reportElement.offsetHeight === 0 || reportElement.offsetWidth === 0) {
      setExporting(false);
      alert(
        "The report content is not visible. Please check if it's properly rendered."
      );
      return;
    }

    // Wait for a little extra time for rendering charts/canvases
    console.log("Waiting for 5 seconds to allow for full render...");
    await new Promise((resolve) => setTimeout(resolve, 5000)); // You can tweak the time as needed

     // -------------------
    // FIX: Sanitize unsupported OKLCH colors for html2canvas
    const sanitizeColors = () => {
      document.querySelectorAll("*").forEach((el) => {
        const style = window.getComputedStyle(el);
        ["color", "backgroundColor", "borderColor"].forEach((prop) => {
          const val = style[prop];
          if (val && val.includes("oklch")) {
            el.style[prop] = "rgba(0,0,0,0.2)"; // fallback to black
          }
        });
      });
    };
    sanitizeColors();
    // -------------------


    // Render the report content to canvas
    const canvas = await html2canvas(reportElement, {
      scale: 2, // Increased for better quality
      useCORS: true, // Allow cross-origin images to be included
      allowTaint: false, // Try without tainting if images are not loading
      backgroundColor: "#ffffff",
      windowWidth: reportElement.scrollWidth,
      windowHeight: reportElement.scrollHeight,
    });

    // Check if the canvas is empty or not properly generated
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      setExporting(false);
      alert(
        "There was an issue rendering the report. Please check the content or try again."
      );
      return;
    }

    // Prepare PDF dimensions (A4 size)
    const PDF_WIDTH_MM = 210;
    const PDF_HEIGHT_MM = 297;
    const MARGIN = 10;
    const HEADER_HEIGHT = 15;
    const FOOTER_HEIGHT = 10;
    const CONTENT_HEIGHT =
      PDF_HEIGHT_MM - HEADER_HEIGHT - FOOTER_HEIGHT - 2 * MARGIN;

    // Helper to draw header and footer for each page
    const drawHeaderAndFooter = (pdf, pageNumber, sampleId = "GW-001") => {
      pdf.setFontSize(16);
      pdf.setTextColor(50, 150, 255);
      const title = "JalDhatu HMPI Analysis Report";
      const titleWidth = pdf.getTextWidth(title);
      const titleX = (PDF_WIDTH_MM - titleWidth) / 2;
      pdf.text(title, titleX, MARGIN + 5);

      pdf.setDrawColor(200, 200, 200);
      pdf.line(MARGIN, MARGIN + 10, PDF_WIDTH_MM - MARGIN, MARGIN + 10);

      pdf.setFontSize(8);
      pdf.setTextColor(150);

      const footerText = `Sample ID: ${sampleId} | Date: ${new Date().toLocaleDateString(
        "en-GB"
      )}`;
      pdf.text(footerText, MARGIN, PDF_HEIGHT_MM - MARGIN + 5);

      const pageNumText = `Page ${pageNumber}`;
      const pageNumWidth = pdf.getTextWidth(pageNumText);
      const pageNumX = PDF_WIDTH_MM - MARGIN - pageNumWidth;
      pdf.text(pageNumText, pageNumX, PDF_HEIGHT_MM - MARGIN + 5);
    };

    // Begin PDF generation
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = PDF_WIDTH_MM - 2 * MARGIN;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pxPerMm = canvas.height / imgHeight;
    const pageHeightPx = CONTENT_HEIGHT * pxPerMm;
    let renderedHeight = 0;
    let pageNumber = 1;

    // Slicing canvas into multiple pages if necessary
    while (renderedHeight < canvas.height) {
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(
        pageHeightPx,
        canvas.height - renderedHeight
      );

      const ctx = pageCanvas.getContext("2d");
      ctx.drawImage(
        canvas,
        0,
        renderedHeight,
        canvas.width,
        pageCanvas.height,
        0,
        0,
        canvas.width,
        pageCanvas.height
      );

      const imgData = pageCanvas.toDataURL("image/png");

      if (pageNumber > 1) pdf.addPage(); // Add new page after first
      drawHeaderAndFooter(pdf, pageNumber, sampleId);
      pdf.addImage(
        imgData,
        "PNG",
        MARGIN,
        MARGIN + HEADER_HEIGHT,
        imgWidth,
        CONTENT_HEIGHT
      );

      renderedHeight += pageHeightPx;
      pageNumber++;
    }

    // Save the generated PDF
    const filename = `JalDhatu_HMPI_Report_${
      typeof sampleId === "string" ? sampleId : "Sample"
    }.pdf`;
    pdf.save(filename);

    // Finish exporting process and notify user
    setExporting(false);
    alert("Report exported successfully!");
  } catch (error) {
    setExporting(false);
    alert(
      "PDF generation failed. Please check the browser console for more details and try again."
    );
    console.error("PDF generation failed:", error);
  }
};
