import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const SpiderChart = () => {
    const [seasonData, setSeasonData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/get-season-counts-trend')  // API trả về season_counts
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
        r: [yearData.VeryLow, yearData.Low, yearData.Average, yearData.High, yearData.Spike, yearData.Ultra_High],  // Số ngày trong mùa
        theta: ['Very Low', 'Low', 'Average', 'High', 'Spike','Ultra-High'],  // Các mùa
        fill: 'toself',
        name: `Year ${yearData.year}`,  // Tên năm
    }));

    return (
        <div>
            <h2>Biểu đồ Spider Chart: Số ngày trong từng mùa theo năm</h2>
            <Plot
                data={plotData}
                layout={{
                    title: 'Số ngày trong từng mùa theo năm',
                    polar: {
                        radialaxis: {
                            visible: true,
                            range: [0, Math.max(...seasonData.flatMap(item => [item.VeryLow, item.Low, item.Average, item.High, item.Spike, item.Ultra_High]))],
                        },
                    },
                    showlegend: true,
                    width: 800,
                    height: 600,
                }}
            />
        </div>
    );
};

export default SpiderChart;
