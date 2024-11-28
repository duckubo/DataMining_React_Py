import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const TrendSeasonalChart = ({ ticket }) => {
    const [data, setData] = useState({ prices: [], trend: [], seasonal: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/stock-data?ticket=${ticket}`);
                const stockData = await response.json();
                formatData(stockData);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        fetchData();
    }, [ticket]);

    const formatData = (stockData) => {
        const { df_day, trend, seasonal } = stockData;

        const formattedPrices = df_day.map(item => ({
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
        })).slice(-200);


        setData({ prices: formattedPrices, trend: formattedTrend, seasonal: formattedSeasonal });
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                    title: `Giá Đóng Cửa của Cổ Phiếu ${ticket}`,
                    xaxis: { title: 'Ngày' },
                    yaxis: { title: 'Giá Đóng Cửa' },
                    width: 600,
                    height: 500,
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
                    title: `Xu Hướng của Cổ Phiếu ${ticket}`,
                    xaxis: {
                        title: 'Ngày',
                        tickmode: 'auto',   // Tự động phân phối nhãn trục x
                        nticks: 10
                    },
                    yaxis: { title: 'Giá Xu Hướng' },
                    width: 600,
                    height: 500,
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
                    title: `Mùa Vụ của Cổ Phiếu ${ticket}`,
                    xaxis: { title: 'Ngày' },
                    yaxis: { title: 'Giá Mùa Vụ' },
                    width: 600,
                    height: 500,
                }}
            />
        </div>
    );
};

export default TrendSeasonalChart;
