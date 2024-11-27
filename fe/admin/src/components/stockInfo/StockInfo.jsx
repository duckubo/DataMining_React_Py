import React, { useState, useEffect } from 'react';
const StockInfo = ({ stockData }) => {

    return (
        <div className="stock-info" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div className="info-box" style={{ backgroundColor: '#007bff', padding: '10px', borderRadius: '5px', flex: '1' }}>
                <h2 style={{ color: '#fff', margin: 0 }}>{stockData.open}</h2>
                <p style={{ color: '#fff', margin: 0 }}>OPEN</p>
            </div>
            <div className="info-box" style={{ backgroundColor: '#ffc107', padding: '10px', borderRadius: '5px', flex: '1' }}>
                <h2 style={{ color: '#fff', margin: 0 }}>{stockData.high}</h2>
                <p style={{ color: '#fff', margin: 0 }}>HIGH</p>
            </div>
            <div className="info-box" style={{ backgroundColor: '#28a745', padding: '10px', borderRadius: '5px', flex: '1' }}>
                <h2 style={{ color: '#fff', margin: 0 }}>{stockData.low}</h2>
                <p style={{ color: '#fff', margin: 0 }}>LOW</p>
            </div>
            <div className="info-box" style={{ backgroundColor: '#dc3545', padding: '10px', borderRadius: '5px', flex: '1' }}>
                <h2 style={{ color: '#fff', margin: 0 }}>{stockData.close}</h2>
                <p style={{ color: '#fff', margin: 0 }}>CLOSE</p>
            </div>
            <div className="info-box" style={{ backgroundColor: '#007bff', padding: '10px', borderRadius: '5px', flex: '1' }}>
                <h2 style={{ color: '#fff', margin: 0 }}>{stockData.volume}</h2>
                <p style={{ color: '#fff', margin: 0 }}>VOLUME</p>
            </div>
        </div>
    );
};

export default StockInfo;
