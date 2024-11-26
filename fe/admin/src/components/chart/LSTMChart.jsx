import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const Trend = ({ticket}) => {
    const [actualData, setActualData] = useState([]);
    const [predictedData, setPredictedData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/get-lstm-data?ticket=${ticket}`);
                const stockData = await response.json();
                if (stockData) {
                    formatData(stockData); // Gọi hàm formatData
                } else {
                    console.error('Dữ liệu không hợp lệ hoặc không có dữ liệu');
                }
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        fetchData();
    }, [ticket]);

    const formatData = (stockData) => {
        // Giả sử stockData là mảng chứa các đối tượng có `Actual`, `Predicted`
        const formattedActual = stockData.map(item => item.Actual);
        const formattedPredicted = stockData.map(item => item.Predicted);

        setActualData(formattedActual);  // Cập nhật dữ liệu thực tế
        setPredictedData(formattedPredicted);  // Cập nhật dữ liệu dự đoán
    };

    // Chỉ số (index) sẽ được sử dụng làm trục x
    const index = [...Array(actualData.length).keys()]; // Tạo mảng các chỉ số index

    return (
        <div>
            {/* Biểu đồ Giới thiệu ARIMA */}
            <Plot
                data={[
                    {
                        x: index, // Dữ liệu trục x (Chỉ số)
                        y: actualData, // Dữ liệu trục y (Giá trị thực tế)
                        type: 'scatter', // Kiểu biểu đồ (line chart)
                        mode: 'lines', // Vẽ đường
                        name: 'Giá trị Thực tế', // Tên biểu đồ
                        line: { color: 'green' }, // Màu đường thực tế
                    },
                    {
                        x: index, // Dữ liệu trục x (Chỉ số)
                        y: predictedData, // Dữ liệu trục y (Giá trị dự đoán)
                        type: 'scatter', // Kiểu biểu đồ (line chart)
                        mode: 'lines', // Vẽ đường
                        name: 'Giá trị Dự đoán', // Tên biểu đồ
                        line: { color: 'red' }, // Màu đường dự đoán
                    }
                ]}
                layout={{
                    title: 'So sánh Giá trị Thực tế và Dự đoán LSTM', // Tiêu đề biểu đồ
                    xaxis: { title: 'Index' }, // Tiêu đề trục x
                    yaxis: { title: 'Giá trị' }, // Tiêu đề trục y
                    width: 800, // Chiều rộng biểu đồ
                    height: 400, // Chiều cao biểu đồ
                }}
            />
        </div>
    );
};

export default Trend;
