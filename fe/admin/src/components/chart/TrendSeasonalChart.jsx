import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const TrendSeasonalChart = () => {
    const [data, setData] = useState({ prices: [], trend: [], seasonal: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/stock-data');
                const stockData = await response.json();
                formatData(stockData);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        fetchData();
    }, []);

    const formatData = (stockData) => {
        const { data: stockPrices, trend, seasonal } = stockData;

        // Format lại dữ liệu
        const formattedPrices = stockPrices.map(item => ({

            date: new Date(item.datetime).toISOString().split('T')[0],
            close: item.close
        })).slice(-365);

        const formattedTrend = trend.map((item, index) => ({
            date: formattedPrices[index]?.date,  // Sử dụng cùng ngày với giá đóng cửa
            value: item.trend
        })).slice(-365);

        const formattedSeasonal = seasonal.map((item, index) => ({
            date: formattedPrices[index]?.date,  // Sử dụng cùng ngày với giá đóng cửa
            value: item.seasonal
        })).slice(-365);

        setData({ prices: formattedPrices, trend: formattedTrend, seasonal: formattedSeasonal });
    };

    return (
        <div>
            {/* Biểu đồ Giá Đóng Cửa */}
            <Plot
                data={[
                    {
                        x: data.prices.map(item => item.date),
                        y: data.prices.map(item => item.close),
                        type: 'scatter',
                        mode: 'lines',
                        name: 'Giá Đóng Cửa',
                        line: { color: 'blue' },
                    }
                ]}
                layout={{
                    title: 'Giá Đóng Cửa của Cổ Phiếu AAPL',
                    xaxis: { title: 'Ngày' },
                    yaxis: { title: 'Giá Đóng Cửa' },
                    width: 1000,
                    height: 400,
                }}
            />

            {/* Biểu đồ Xu Hướng */}
            <Plot
                data={[
                    {
                        x: data.trend.map(item => item.date),
                        y: data.trend.map(item => item.value),
                        type: 'scatter',
                        mode: 'lines',
                        name: 'Xu Hướng',
                        line: { color: 'orange' },
                    }
                ]}
                layout={{
                    title: 'Xu Hướng của Cổ Phiếu AAPL',
                    xaxis: {
                        title: 'Ngày',
                        tickmode: 'auto',   // Tự động phân phối nhãn trục x
                        nticks: 10
                    },
                    yaxis: { title: 'Giá Xu Hướng' },
                    width: 1000,
                    height: 400,
                }}
            />

            {/* Biểu đồ Mùa Vụ */}
            <Plot
                data={[
                    {
                        x: data.seasonal.map(item => item.date),
                        y: data.seasonal.map(item => item.value),
                        type: 'scatter',
                        mode: 'lines',
                        name: 'Mùa Vụ',
                        line: { color: 'green' },
                    }
                ]}
                layout={{
                    title: 'Mùa Vụ của Cổ Phiếu AAPL',
                    xaxis: { title: 'Ngày' },
                    yaxis: { title: 'Giá Mùa Vụ' },
                    width: 2000,
                    height: 400,
                }}
            />
        </div>
    );
};

export default TrendSeasonalChart;
