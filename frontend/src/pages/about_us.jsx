import "../components/ui/css/about_us.css";
import { Mission } from "../components/about_us/mission";
import { Features } from "../components/about_us/features";
import { Methodology } from "../components/about_us/methodology";
import { Compliance } from "../components/about_us/compliance";
import { Impact } from "../components/about_us/impact";
import { Specifications } from "../components/about_us/specifications";

export const AboutUs = () => {
  return (
    <div>
      <main className="card">
        <div>
          <h1 className="page-title">About JalDhatu</h1>
          <p className="subtitle about-subtitle">
            A comprehensive scientific tool for assessing heavy metal pollution
            in groundwater, designed to protect public health and support
            environmental monitoring worldwide.
          </p>

          <Mission />

          <Features />

          <Methodology />

          <Compliance />

          {/* <Impact /> */}

          <Specifications />
        </div>
      </main>
    </div>
  );
};
