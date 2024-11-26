import './dashboard.css';
import React, { useState, useEffect } from 'react';
import TimeSeriesChart1M from '../../components/chart/TimeSeriesChart1M';
import CandlestickChart from '../../components/chart/CandlestickChart';
import Heatmap from '../../components/chart/Heatmap';
import TrendSeasonalChart from '../../components/chart/TrendSeasonalChart';
import TweetBox from '../../components/twitter/TweetBox';
import EmbedWidgetTickerTape from '../../components/embed/EmbedWidgetTickerTape';
export default function DashBoard() {

    const [data, setData] = useState([]);

    // Fetch stock data từ Flask API
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

    // Format dữ liệu cho TimeSeriesChart1M
    const formatData = (stockData) => {
        const { data } = stockData;
        let formattedData = [];

        data.forEach((item) => {
            const dateOnly = new Date(item.datetime).toISOString().split('T')[0]; // Chuyển datetime thành YYYY-MM-DD
            formattedData.push({ name: dateOnly, close: item.close });
        });

        // Giới hạn 365 phần tử cuối cùng
        return formattedData.slice(-100);
    };

    return (
        <div className='dashboard'>
            <EmbedWidgetTickerTape />
            <div className='divide'>
                <div className='appl'>
                    <TimeSeriesChart1M data={data} />
                </div>
                <div className='googl'>
                    <TimeSeriesChart1M data={data} />
                </div>
                <div className="amzn">
                    <TimeSeriesChart1M data={data} />
                </div>
            </div>
            <CandlestickChart />
            <TimeSeriesChart1M data={data} />
            <TrendSeasonalChart />
            <div className='homeWidgets'>
                <Heatmap />
                <TweetBox />
            </div>
        </div>
    );
}
