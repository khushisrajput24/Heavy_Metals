import { CIML } from "./methodology/CIML";
import { Classification } from "./methodology/classification";
import { EnrichmentFactor } from "./methodology/ef";
import { Indices } from "./methodology/indices";

export const Methodology = () => {
  return (
    <div id="methodology">
      <div className="main-header-wrapper">
        <div className="main-header">Calculation Methodology</div>
        <div className="main-text">
          Technical framework for heavy metal indices and classification
        </div>
      </div>
      <div>
        {/* 1. Computation of Heavy Metal Indices */}
        <Indices />

        {/* 2. Composite Index + Machine Learning */}
        <CIML />

        {/* 3. Classification + Geotagging */}
        <Classification />

        {/* 4. Enrichment Factor & Root-Cause Analysis */}
        <EnrichmentFactor />
      </div>
    </div>
  );
};
