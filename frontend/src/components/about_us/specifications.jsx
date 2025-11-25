import { LaptopMinimalCheck } from "lucide-react";

export const Specifications = () => {
  return (
    <div className="about-card specs-card">
      <h2 className="section-title">
        <LaptopMinimalCheck className="icon title" />
        Technical Specifications
      </h2>
      <h3 className="specs-subtitle">Heavy Metals Assessed</h3>
      <div className="metals-list">
        <span className="metal-badge">Lead (Pb)</span>
        <span className="metal-badge">Cadmium (Cd)</span>
        <span className="metal-badge"> Manganese (Mn)</span>
        <span className="metal-badge">Arsenic (As)</span>
        <span className="metal-badge">Chromium (Cr)</span>
        <span className="metal-badge">Copper (Cu)</span>
        <span className="metal-badge">Zinc (Zn)</span>
        <span className="metal-badge">Nickel (Ni)</span>
        <span className="metal-badge">Iron (Fe)</span>
        <span className="metal-badge">Selenium (Se)</span>
        <span className="metal-badge">Silver (Ag)</span>
        <span className="metal-badge">Uranium (U)</span>

      </div>
      <h3 className="specs-subtitle">Detection Limits</h3>
      <p>
        Our platform can accurately assess concentrations as low as 0.1 µg/L for
        most heavy metals, ensuring precise detection even at trace levels.
      </p>
      <h3 className="specs-subtitle">Data Security</h3>
      <p>
        All data is encrypted in transit and at rest to ensure your research
        data remains secure.
      </p>
    </div>
  );
};
