import './dashboard.css';
import React, { useState, useEffect } from 'react';
import CandlestickChart1D from '../../components/chart/CandlestickChart1D';
import CandlestickChart1H from '../../components/chart/CandlestickChart1H';
import CandlestickChart1M from '../../components/chart/CandlestickChart1M';
import Heatmap from '../../components/chart/Heatmap';
import TrendSeasonalChart from '../../components/chart/TrendSeasonalChart';
import TweetBox from '../../components/twitter/TweetBox';
import EmbedWidgetTickerTape from '../../components/embed/EmbedWidgetTickerTape';
import StockInfo from '../../components/stockInfo/StockInfo';
import ArimaChart from '../../components/chart/ArimaChart';
import LSTMChart from '../../components/chart/LSTMChart';
import LinearChart from '../../components/chart/LinearChart';
export default function DashBoard() {

    const [dataDay_aapl, setDataDay_aapl] = useState([]);
    const [dataWeek_aapl, setDataWeek_aapl] = useState([]);
    const [dataMonth_aapl, setDataMonth_aapl] = useState([]);
    const [dataDay_googl, setDataDay_googl] = useState([]);
    const [dataWeek_googl, setDataWeek_googl] = useState([]);
    const [dataMonth_googl, setDataMonth_googl] = useState([]);
    const [dataDay_amzn, setDataDay_amzn] = useState([]);
    const [dataWeek_amzn, setDataWeek_amzn] = useState([]);
    const [dataMonth_amzn, setDataMonth_amzn] = useState([]);
    const [data_aapl, setData_aapl] = useState({ prices: [], trend: [], seasonal: [] });
    const [data_googl, setData_googl] = useState({ prices: [], trend: [], seasonal: [] });
    const [data_amzn, setData_amzn] = useState({ prices: [], trend: [], seasonal: [] });
    const [correlationData_aapl, setcCorrelationData_aapl] = useState([]);
    const [correlationData_googl, setcCorrelationData_googl] = useState([]);
    const [correlationData_amzn, setcCorrelationData_amzn] = useState([]);
    const [features, setFeature] = useState([]);
    const [stockData_aapl, setStockData_aapl] = useState({});
    const [stockData_googl, setStockData_googl] = useState({});
    const [stockData_amzn, setStockData_amzn] = useState({});

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

        const fetchData_Info = async () => {
            try {
                // Giả định API trả về kết quả dự đoán
                const response = await fetch('http://localhost:5000/api/stock-info');
                if (response.ok) {
                    const data = await response.json();
                    formatData_Info(data);
                } else {
                    console.error('Error fetching stock data:', response.status);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData_Info();
    }, []);

    const formatData = (stockData) => {
        const { df_aapl_day, df_aapl_week, df_aapl_month, trend_aapl, seasonal_aapl } = stockData;
        const { df_googl_day, df_googl_week, df_googl_month, trend_googl, seasonal_googl } = stockData;
        const { df_amzn_day, df_amzn_week, df_amzn_month, trend_amzn, seasonal_amzn } = stockData;

        var formattedDataDay_aapl = [],
            formattedDataDay_googl = [],
            formattedDataDay_amzn = [];
        var formattedDataWeek_aapl = [],
            formattedDataWeek_googl = [],
            formattedDataWeek_amzn = [];
        var formattedDataMonth_aapl = [],
            formattedDataMonth_googl = [],
            formattedDataMonth_amzn = [];

        // Combine train data into one array with corresponding labels
        df_aapl_day.forEach((item) => {
            const dateOnly = new Date(item.datetime).toISOString().split('T')[0]; // Chuyển datetime thành chuỗi YYYY-MM-DD
            formattedDataDay_aapl.push({ name: dateOnly, close: item.close, open: item.open, high: item.high, low: item.low });
        });

        df_aapl_week.forEach((item) => {
            const dateOnly = new Date(item.datetime).toISOString().split('T')[0]; // Chuyển datetime thành chuỗi YYYY-MM-DD
            formattedDataWeek_aapl.push({ name: dateOnly, close: item.close, open: item.open, high: item.high, low: item.low });
        });
        df_aapl_month.forEach((item) => {
            const dateOnly = new Date(item.datetime).toISOString().split('T')[0]; // Chuyển datetime thành chuỗi YYYY-MM-DD
            formattedDataMonth_aapl.push({ name: dateOnly, close: item.close, open: item.open, high: item.high, low: item.low });
        });

        df_googl_day.forEach((item) => {
            const dateOnly = new Date(item.datetime).toISOString().split('T')[0]; // Chuyển datetime thành chuỗi YYYY-MM-DD
            formattedDataDay_googl.push({ name: dateOnly, close: item.close, open: item.open, high: item.high, low: item.low });
        });

        df_googl_week.forEach((item) => {
            const dateOnly = new Date(item.datetime).toISOString().split('T')[0]; // Chuyển datetime thành chuỗi YYYY-MM-DD
            formattedDataWeek_googl.push({ name: dateOnly, close: item.close, open: item.open, high: item.high, low: item.low });
        });
        df_googl_month.forEach((item) => {
            const dateOnly = new Date(item.datetime).toISOString().split('T')[0]; // Chuyển datetime thành chuỗi YYYY-MM-DD
            formattedDataMonth_googl.push({ name: dateOnly, close: item.close, open: item.open, high: item.high, low: item.low });
        });

        df_amzn_day.forEach((item) => {
            const dateOnly = new Date(item.datetime).toISOString().split('T')[0]; // Chuyển datetime thành chuỗi YYYY-MM-DD
            formattedDataDay_amzn.push({ name: dateOnly, close: item.close, open: item.open, high: item.high, low: item.low });
        });

        df_amzn_week.forEach((item) => {
            const dateOnly = new Date(item.datetime).toISOString().split('T')[0]; // Chuyển datetime thành chuỗi YYYY-MM-DD
            formattedDataWeek_amzn.push({ name: dateOnly, close: item.close, open: item.open, high: item.high, low: item.low });
        });
        df_amzn_month.forEach((item) => {
            const dateOnly = new Date(item.datetime).toISOString().split('T')[0]; // Chuyển datetime thành chuỗi YYYY-MM-DD
            formattedDataMonth_amzn.push({ name: dateOnly, close: item.close, open: item.open, high: item.high, low: item.low });
        });

        const formattedPrices_aapl = df_aapl_day.map(item => ({
            date: new Date(item.datetime).toISOString().split('T')[0],
            close: item.close
        })).slice(-365);

        const formattedPrices_googl = df_googl_day.map(item => ({
            date: new Date(item.datetime).toISOString().split('T')[0],
            close: item.close
        })).slice(-365);

        const formattedPrices_amzn = df_amzn_day.map(item => ({
            date: new Date(item.datetime).toISOString().split('T')[0],
            close: item.close
        })).slice(-365);

        const formattedTrend_aapl = trend_aapl.map((item, index) => ({
            date: formattedPrices_aapl[index]?.date,  // Sử dụng cùng ngày với giá đóng cửa
            value: item.trend
        })).slice(-365);

        const formattedTrend_googl = trend_googl.map((item, index) => ({
            date: formattedPrices_googl[index]?.date,  // Sử dụng cùng ngày với giá đóng cửa
            value: item.trend
        })).slice(-365);

        const formattedTrend_amzn = trend_amzn.map((item, index) => ({
            date: formattedPrices_amzn[index]?.date,  // Sử dụng cùng ngày với giá đóng cửa
            value: item.trend
        })).slice(-365);

        const formattedSeasonal_aapl = seasonal_aapl.map((item, index) => ({
            date: formattedPrices_aapl[index]?.date,  // Sử dụng cùng ngày với giá đóng cửa
            value: item.seasonal
        })).slice(-200);
        const formattedSeasonal_googl = seasonal_googl.map((item, index) => ({
            date: formattedPrices_googl[index]?.date,  // Sử dụng cùng ngày với giá đóng cửa
            value: item.seasonal
        })).slice(-200);
        const formattedSeasonal_amzn = seasonal_amzn.map((item, index) => ({
            date: formattedPrices_amzn[index]?.date,  // Sử dụng cùng ngày với giá đóng cửa
            value: item.seasonal
        })).slice(-200);


        setDataDay_aapl(formattedDataDay_aapl.slice(-50));
        setDataWeek_aapl(formattedDataDay_aapl.slice(-50));
        setDataMonth_aapl(formattedDataDay_aapl);

        setDataDay_googl(formattedDataDay_googl.slice(-50));
        setDataWeek_googl(formattedDataDay_googl.slice(-50));
        setDataMonth_googl(formattedDataDay_googl);

        setDataDay_amzn(formattedDataDay_amzn.slice(-50));
        setDataWeek_amzn(formattedDataDay_amzn.slice(-50));
        setDataMonth_amzn(formattedDataDay_amzn);

        setData_aapl({ prices: formattedPrices_aapl, trend: formattedTrend_aapl, seasonal: formattedSeasonal_aapl });
        setData_googl({ prices: formattedPrices_googl, trend: formattedTrend_googl, seasonal: formattedSeasonal_googl });
        setData_amzn({ prices: formattedPrices_amzn, trend: formattedTrend_amzn, seasonal: formattedSeasonal_amzn });

        const { heatmap_aapl, heatmap_googl, heatmap_amzn } = stockData;
        let formattedData_appl = [];
        let formattedData_googl = [];
        let formattedData_amzn = [];

        // Combine train data into one array with corresponding labels
        heatmap_aapl.forEach((item) => {
            formattedData_appl.push({
                'Open-High': item['Open-High'],
                'Open-Low': item['Open-Low'], // Đảm bảo sử dụng dấu gạch ngang chính xác
                'Close-High': item['Close-High'], // Sửa tên key cho đúng
                'Close-Low': item['Close-Low'],
                'High-Low': item['High-Low'],
                'Open-Close': item['Open-Close'] // Đảm bảo sử dụng key đúng tên
            });

        });
        heatmap_googl.forEach((item) => {
            formattedData_googl.push({
                'Open-High': item['Open-High'],
                'Open-Low': item['Open-Low'], // Đảm bảo sử dụng dấu gạch ngang chính xác
                'Close-High': item['Close-High'], // Sửa tên key cho đúng
                'Close-Low': item['Close-Low'],
                'High-Low': item['High-Low'],
                'Open-Close': item['Open-Close'] // Đảm bảo sử dụng key đúng tên
            });

        });
        heatmap_amzn.forEach((item) => {
            formattedData_amzn.push({
                'Open-High': item['Open-High'],
                'Open-Low': item['Open-Low'], // Đảm bảo sử dụng dấu gạch ngang chính xác
                'Close-High': item['Close-High'], // Sửa tên key cho đúng
                'Close-Low': item['Close-Low'],
                'High-Low': item['High-Low'],
                'Open-Close': item['Open-Close'] // Đảm bảo sử dụng key đúng tên
            });

        });
        const features = Object.keys(heatmap_aapl[0]).filter(key => key);
        setFeature(features)

        const correlationData_aapl = formattedData_appl.map(obj => Object.values(obj));
        setcCorrelationData_aapl(correlationData_aapl);

        const correlationData_googl = formattedData_googl.map(obj => Object.values(obj));
        setcCorrelationData_googl(correlationData_googl);

        const correlationData_amzn = formattedData_amzn.map(obj => Object.values(obj));
        setcCorrelationData_amzn(correlationData_amzn);
        // Giới hạn 30 phần tử cuối cùng
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Giả định API trả về kết quả dự đoán
                const response = await fetch('http://localhost:5000/api/stock-info');
                if (response.ok) {
                    const data = await response.json();
                    formatData(data);
                } else {
                    console.error('Error fetching stock data:', response.status);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);
    const formatData_Info = (data) => {
        const { newest_aapl, newest_googl, newest_amzn } = data;

        setStockData_aapl({
            open: newest_aapl.open,
            high: newest_aapl.high,
            low: newest_aapl.low,
            close: newest_aapl.close,
            volume: newest_aapl.volume
        });
        setStockData_googl({
            open: newest_googl.open,
            high: newest_googl.high,
            low: newest_googl.low,
            close: newest_googl.close,
            volume: newest_googl.volume
        });

        setStockData_amzn({
            open: newest_amzn.open,
            high: newest_amzn.high,
            low: newest_amzn.low,
            close: newest_amzn.close,
            volume: newest_amzn.volume
        });


    }
    return (
        <div className='dashboard'>
            <EmbedWidgetTickerTape />
            <div className='divide'>
                <div className='appl'>
                    <StockInfo stockData={stockData_aapl} />
                    <CandlestickChart1M data={dataDay_aapl} ticker='APPLE' />
                    <CandlestickChart1H data={dataWeek_aapl} ticker='APPLE' />
                    <CandlestickChart1D data={dataMonth_aapl} ticker='APPLE' />
                    <TrendSeasonalChart data={data_aapl} ticker='APPLE' />
                    <div className="chart-box">
                        <div className="card-title">
                            <h4>CORRELATION MAP APPLE</h4>
                        </div>
                        <Heatmap correlationData={correlationData_aapl} features={features} ticker={"AAPL"} />
                    </div>
                    <div className="chart-box">
                        <div className="card-title">
                            <h4>ARIMA MODEL ACCURACY APPLE</h4>
                        </div>
                        <ArimaChart ticket={"AAPL"} />
                    </div>
                    <div className="chart-box">
                        <div className="card-title">
                            <h4>LSTM MODEL ACCURACY AAPL</h4>
                        </div>
                        <LSTMChart ticket={"AAPL"} />
                    </div>
                </div>
                <div className='googl'>
                    <StockInfo stockData={stockData_googl} />
                    <CandlestickChart1M data={dataDay_googl} ticker='GOOGLE' />
                    <CandlestickChart1H data={dataWeek_googl} ticker='GOOGLE' />
                    <CandlestickChart1D data={dataMonth_googl} ticker='GOOGLE' />
                    <TrendSeasonalChart data={data_googl} ticker='GOOGLE' />
                    <div className="chart-box">
                        <div className="card-title">
                            <h4>CORRELATION MAP GOOGLE</h4>
                        </div>
                        <Heatmap correlationData={correlationData_googl} features={features} ticker={"GOOG"} />
                    </div>
                    <div className="chart-box">
                        <div className="card-title">
                            <h4>ARIMA MODEL ACCURACY GOOGLE</h4>
                        </div>
                        <ArimaChart ticket={"GOOG"} />
                    </div>
                    <div className="chart-box">
                        <div className="card-title">
                            <h4>LSTM MODEL ACCURACY GOOG</h4>
                        </div>
                        <LSTMChart ticket={"GOOG"} />
                    </div>
                </div>
                <div className="amzn">
                    <StockInfo stockData={stockData_amzn} />
                    <CandlestickChart1M data={dataDay_amzn} ticker='AMAZON' />
                    <CandlestickChart1H data={dataWeek_amzn} ticker='AMAZON' />
                    <CandlestickChart1D data={dataMonth_amzn} ticker='AMAZON' />
                    <TrendSeasonalChart data={data_amzn} ticker='AMAZON' />
                    <div className="chart-box">
                        <div className="card-title">
                            <h4>CORRELATION MAP AMAZON</h4>
                        </div>
                        <Heatmap correlationData={correlationData_amzn} features={features} ticker={"AMZN"} />
                    </div>
                    <div className="chart-box">
                        <div className="card-title">
                            <h4>ARIMA MODEL ACCURACY AMZN</h4>
                        </div>
                        <ArimaChart ticket={"AMZN"} />
                    </div>
                    <div className="chart-box">
                        <div className="card-title">
                            <h4>LSTM MODEL ACCURACY AMZN</h4>
                        </div>
                        <LSTMChart ticket={"AMZN"} />
                    </div>
                </div>
            </div>

            <div className='homeWidgets'>

                <TweetBox />
            </div>
        </div>
    );
}
