import React, { useState, useEffect } from 'react';
const StockInfo = ({ ticket }) => {
    const [stockData, setStockData] = useState({
        open: '0.00',
        high: '0.00',
        low: '0.00',
        close: '0.00',
        volume: '0'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Giả định API trả về kết quả dự đoán
                const response = await fetch('http://localhost:5000/api/stock-info', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nm: ticket }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setStockData({
                            open: data.newest.open,
                            high: data.newest.high,
                            low: data.newest.low,
                            close: data.newest.close,
                            volume: data.newest.volume
                        });
                    } 
                } else {
                    console.error('Error fetching stock data:', response.status);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [ticket]);
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
