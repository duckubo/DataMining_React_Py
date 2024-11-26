import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const CandlestickChart = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/stock-data');
                const stockData = await response.json();
                const formattedData = formatData(stockData);
                setData(formattedData);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        fetchData();
    }, []);

    const formatData = (stockData) => {
        const { data } = stockData;
        let formattedData = [];

        // Combine train data into one array with corresponding labels
        data.forEach((item) => {
            const dateOnly = new Date(item.datetime).toISOString().split('T')[0]; // Chuyển datetime thành chuỗi YYYY-MM-DD
            formattedData.push({ name: dateOnly, close: item.close, open: item.open, high: item.high, low: item.low });
        });

        // Giới hạn 30 phần tử cuối cùng
        return formattedData.slice(-365);
    };
    return (
        <Plot
            data={[
                {
                    x: data.map(item => item.name),
                    open: data.map(item => item.open),
                    high: data.map(item => item.high),
                    low: data.map(item => item.low),
                    close: data.map(item => item.close),
                    type: 'candlestick',
                    xaxis: 'x',
                    yaxis: 'y'
                },
            ]}
            layout={{
                title: 'Stock Price Movement',
                xaxis: {
                    title: 'Date',
                    type: 'category',
                    tickmode: 'auto',   // Tự động phân phối nhãn trục x
                    nticks: 10
                },
                yaxis: {
                    title: 'Price (USD)'
                },
                width: 1900,
                height: 600,
            }}
        />
    );
};

export default CandlestickChart;
