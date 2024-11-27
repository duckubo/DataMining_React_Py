import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const TrendSeasonalChart = ({ data, ticker }) => {
    console.log(data);

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
                    title: `Giá Đóng Cửa của Cổ Phiếu ${ticker}`,
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
                    title: `Xu Hướng của Cổ Phiếu ${ticker}`,
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
                    title: `Mùa Vụ của Cổ Phiếu ${ticker}`,
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
