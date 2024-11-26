import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

// Dữ liệu tương quan giả lập cho 4 mã cổ phiếu


// Nhãn cho các mã cổ phiếu


const Heatmap = () => {
    const [correlationData, setData] = useState([]);
    const [features, setFeature] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/stock-data');
                const stockData = await response.json();
                const formattedData = formatData(stockData);
                const correlationData = formattedData.map(obj => Object.values(obj));
                setData(correlationData);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        fetchData();
    }, []);

    const formatData = (stockData) => {
        const { data2 } = stockData;
        let formattedData = [];

        // Combine train data into one array with corresponding labels
        data2.forEach((item) => {
            formattedData.push({
                'Open-High': item['Open-High'],
                'Open-Low': item['Open-Low'], // Đảm bảo sử dụng dấu gạch ngang chính xác
                'Close-High': item['Close-High'], // Sửa tên key cho đúng
                'Close-Low': item['Close-Low'],
                'High-Low': item['High-Low'],
                'Open-Close': item['Open-Close'] // Đảm bảo sử dụng key đúng tên
            });

        });
        const features = Object.keys(data2[0]).filter(key => key);
        setFeature(features)
        console.log(formattedData);

        // Giới hạn 30 phần tử cuối cùng
        return formattedData
    };
    return (
        <Plot
            data={[
                {
                    z: correlationData,
                    x: features,
                    y: features,
                    type: 'heatmap',
                    colorscale: 'Plasma', // Thay đổi màu sắc nếu cần
                    colorbar: {
                        title: 'Tương quan',
                    },
                },
            ]}
            layout={{
                title: 'Heatmap to visualize the correlation among different Daily price columns for AAPL stocks',
                xaxis: {
                    title: '',
                },
                yaxis: {
                    title: '',
                },
                width: 800,
                height: 600,
            }}
        />
    );
};

export default Heatmap;
