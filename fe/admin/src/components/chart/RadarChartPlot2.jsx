import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const RadarChartPlot = () => {
    const [seasonData, setSeasonData] = useState([]);

    // Lấy dữ liệu từ API
    useEffect(() => {
        axios.get('http://localhost:5000/api/get-season-counts-trend')
            .then(response => {
                setSeasonData(response.data);
            })
            .catch(error => {
                console.error('Có lỗi khi lấy dữ liệu:', error);
            });
    }, []);

    // Tạo các trace cho mỗi năm
    const plotData = seasonData.map((yearData) => ({
        type: 'scatterpolar',
        r: [yearData.VeryLow, yearData.Low, yearData.Average, yearData.High, yearData.Spike, yearData.Ultra_High],
        theta: ['Very Low', 'Low', 'Average', 'High', 'Spike', 'Ultra-High'],  // Các mùa
        fill: 'toself',
        name: `Year ${yearData.year}`, // Tên năm
    }));

    // Cấu hình layout chung cho các biểu đồ
    const layout = {
        polar: {
            radialaxis: {
                visible: true,
                range: [0, Math.max(...seasonData.flatMap(item => [item.VeryLow, item.Low, item.Average, item.High, item.Spike, item.Ultra_High]))],
            },
        },
        showlegend: true,
        title: 'Số ngày trong từng mùa theo năm',
        width: 800,
        height: 600,
    };

    return (
        <div>
            <h2>Biểu đồ Spider Chart: Số ngày trong từng mùa theo năm</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {seasonData.map((yearData, index) => (
                <div key={index} style={{ marginBottom: '30px' }}>
                    <h3>{`Year ${yearData.year}`}</h3>
                    <Plot
                        data={[{
                            type: 'scatterpolar',
                            r: [yearData.VeryLow, yearData.Low, yearData.Average, yearData.High, yearData.Spike, yearData.Ultra_High],
                            theta: ['Very Low', 'Low', 'Average', 'High', 'Spike', 'Ultra-High'],  // Các mùa
                            fill: 'toself',
                            name: `Year ${yearData.year}`,
                        }]}
                        layout={{
                            polar: {
                                radialaxis: {
                                    visible: true,
                                    range: [0, Math.max(...seasonData.flatMap(item => [item.VeryLow, item.Low, item.Average, item.High, item.Spike, item.Ultra_High]))],
                                },
                            },
                            showlegend: true,
                            title: `Số ngày trong từng mùa theo năm ${yearData.year}`,
                            width: 600,
                            height: 400,
                        }}
                    />
                </div>
            ))}
            </div>
        </div>
    );
};

export default RadarChartPlot;
