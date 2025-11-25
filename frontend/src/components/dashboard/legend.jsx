export const StatusLegend = ({ statusLabels }) => {
    // Ensure that the array contains exactly three values
    if (statusLabels.length !== 3) {
        return <div>Error: You must pass exactly 3 status labels!</div>;
    }

    return (
        <div className="card">
            <div className="card-title">Status Legend</div>
            <div className="status-legend-list">
                {statusLabels.map((label, index) => {
                    let statusClass = '';
                    if (index === 0) {
                        statusClass = 'positive';  // Safe
                    } else if (index === 1) {
                        statusClass = 'negative';  // Alert
                    } else if (index === 2) {
                        statusClass = 'critical';  // Critical
                    }

                    return (
                        <div className="status-legend-item" key={index}>
                            <div className={`status-dot ${statusClass}`}></div>
                            <div className="card-label">{label}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
