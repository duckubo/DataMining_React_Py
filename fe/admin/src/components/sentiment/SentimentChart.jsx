import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const SentimentChart = () => {
    const [sentimentData, setSentimentData] = useState({
        labels: ['Positive', 'Negative', 'Neutral'],
        values: [50.3, 27.0, 13.7],
    });

    // Dữ liệu này có thể được lấy từ API hoặc tính toán trong ứng dụng của bạn
    useEffect(() => {
        // Nếu bạn muốn lấy dữ liệu từ API, có thể làm ở đây
        // axios.get('/api/sentiment')...
    }, []);

    return (
        <div style={{ width: '600px', height: '600px', marginRight: '200px', marginLeft: '100px' }}>
            <Plot
                data={[
                    {
                        type: 'pie',
                        labels: sentimentData.labels,
                        values: sentimentData.values,
                        textinfo: 'percent+label',  // Hiển thị % và tên
                        hoverinfo: 'label+percent', // Hiển thị khi hover
                        marker: {
                            colors: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(153, 102, 255, 0.8)'], // Màu sắc cho từng loại sentiment
                        },
                    },
                ]}
                layout={{
                    title: 'Sentiment Analysis',
                    showlegend: true,  // Hiển thị legend
                    width: 600,
                    height: 600,
                }}
            />
        </div>
    );
};

export default SentimentChart;
