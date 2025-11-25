import { CircleCheckBig } from "lucide-react";

export const Compliance = () => {
  return (
    <div className="about-card compliance-card">
      <div className="card-header-icon">
        <h2 className="section-title">
          <CircleCheckBig className="icon title" />
          Regulatory Standards & Compliance
        </h2>
      </div>
      <p className="subtitle compliance-subtitle">
        Our calculations are based on internationally recognized water quality
        standards
      </p>
      <div className="standards-list">
        <a
          href="https://www.who.int/publications/i/item/9789241549950"
          target="_blank"
          rel="noopener noreferrer"
          className="standard-item"
        >
          <CircleCheckBig className="check-icon" />
          <p>WHO Guidelines for Drinking Water Quality (2017)</p>
        </a>

        <a
          href="https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations"
          target="_blank"
          rel="noopener noreferrer"
          className="standard-item"
        >
          <CircleCheckBig className="check-icon" />
          <p>EPA National Primary Drinking Water Standards</p>
        </a>

        {/* <a
                                href="https://eur-lex.europa.eu/eli/dir/2020/2184/oj"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="standard-item"
                            >
                                <CircleCheckBig className="check-icon" />
                                <p>EU Drinking Water Directive 2020/2184</p>
                            </a> */}

        <a
          href="https://cpcb.nic.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="standard-item"
        >
          <CircleCheckBig className="check-icon" />
          <p>Central Pollution Control Board</p>
        </a>

        <a
          href="https://www.bis.gov.in/productdetails/is/10500"
          target="_blank"
          rel="noopener noreferrer"
          className="standard-item"
        >
          <CircleCheckBig className="check-icon" />
          <p>Indian Standard IS 10500:2012</p>
        </a>

        {/* <a
                                href="https://www.nhmrc.gov.au/about-us/publications/australian-drinking-water-guidelines"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="standard-item"
                            >
                                <CircleCheckBig className="check-icon" />
                                <p>Australian Drinking Water Guidelines</p>
                            </a> */}

        <a
          href="https://cgwb.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="standard-item"
        >
          <CircleCheckBig className="check-icon" />
          <p>Central Ground Water Board</p>
        </a>
      </div>
    </div>
  );
};
