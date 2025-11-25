export const KeyMetrics = () => {
    return (
        <div className="card">
            <div className="card-title">Key Metrics</div>
            <div className="card-row">
                <div className="metric-row-left">
                    <span className="card-label">Total Sampling Points</span>
                    <span className="metric-value">1,250</span>
                </div>
                <div className="status positive">+10%</div>
            </div>
            <div className="card-row">
                <div className="metric-row-left">
                    <span className="card-label">Average HMPI</span>
                    <span className="metric-value">0.75</span>
                </div>
                <div className="status negative">-5%</div>
            </div>
            <div className="card-row">
                <div className="metric-row-left">
                    <span className="card-label">Critical Points</span>
                    <span className="metric-value">50</span>
                </div>
                <div className="status negative">-15%</div>
            </div>
        </div>
    );
}