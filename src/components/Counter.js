import React from 'react';
import './Counter.css';

function Counter({ count, lastUpdate }) {
    return (
        <div className="counter-card">
            <div className="counter-header">
                <h2>Balance Change Counter</h2>
                <p className="counter-description">Tracks 1 SOL increments/decrements</p>
            </div>
            <div className="counter-display">
                <div className="counter-value">{count}</div>
            </div>
            <div className="counter-info">
                {lastUpdate ? (
                    <p className="last-update">Last update: {lastUpdate}</p>
                ) : (
                    <p className="last-update">Waiting for balance changes...</p>
                )}
            </div>
            <div className="counter-legend">
                <div className="legend-item">
                    <span className="legend-icon increase">+</span>
                    <span>Balance increased by 1 SOL</span>
                </div>
                <div className="legend-item">
                    <span className="legend-icon decrease">−</span>
                    <span>Balance decreased by 1 SOL</span>
                </div>
            </div>
        </div>
    );
}

export default Counter;
