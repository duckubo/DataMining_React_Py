import React, { useEffect, useState } from 'react';
import SentimentChart from './SentimentChart';
import TweetBox from '../twitter/TweetBox';
import fore from '../../assets/images/fore.png';

// Sample data to replace `tw_list` and `forecast_set`
// Replace these with actual data from props or API calls

function SentimentAnalysisCard({ quote }) {
    return (
        <div className="col-lg-6">
            <div className="card">
                <div className="card-title" style={{ marginLeft: '100px' }}>
                    <h4>SENTIMENT ANALYSIS FOR {quote} TWEETS</h4>
                </div>
                <div className="sales-chart">
                    <SentimentChart />
                </div>
            </div>
        </div>
    );
}

function PredictedPriceCard({ quote }) {
    const [forecastData, setForecastData] = useState([]);

    useEffect(() => {
        const fetchForecastData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/get-forecast?ticket=${quote}`);
                const data = await response.json();
                setForecastData(data);
            } catch (error) {
                console.error("Error fetching forecast data:", error);
            }
        };

        fetchForecastData();
    }, [quote]); // Thêm quote làm dependency

    if (forecastData.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="col-lg-6">
            <div className="card">
                <div className="card-title">
                    <h4>PREDICTED {quote} PRICE FOR THE NEXT 7 DAYS</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th style={{ width: '300px', textAlign: 'center' }}>Close</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div>
                                            <a href={`https://finance.yahoo.com/quote/${quote}`}>
                                                <img
                                                    style={{ padding: '0px', width: '300px', height: '400px' }}
                                                    src={fore} // Đảm bảo URL hình ảnh hợp lệ
                                                    alt="Forcast For 7 Days"
                                                />
                                            </a>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '25px', width: '300px', textAlign: 'center' }}>
                                        {forecastData.map((item, index) => (
                                            <div key={index}>
                                                {parseFloat(item['Forecasted Value']).toFixed(2)} $ 
                                                <br />
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
const PolarityAndRecommendation = ({ tw_pol, idea, quote, decision }) => {
    return (
        <div className="overall_popularity" style={{ display: 'flex', gap: '30px' }}>
            {/* OVERALL POLARITY */}
            <div className="col-md-4" style={{ backgroundColor: 'rgb(46, 204, 113) ', padding: '20px' ,width: '30%'}}>
                <div className="card bg-success p-20">
                    <div className="media widget-ten">
                        <div className="media-left meida media-middle">
                            <span>
                                <i className="ti-location-pin f-s-40"></i>
                            </span>
                        </div>
                        <div className="media-body media-text-right" style={{ textAlign: 'right' }}>
                            <h2 className="color-white text-white">Overall Positive{tw_pol}</h2>
                            <p className="m-b-0 text-white" >OVERALL TWEETS POLARITY</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-lg-8" style={{ backgroundColor: '#3498db ', padding: '20px' }}>
                <div className="card bg-primary p-20" >
                    <div className="media widget-ten" >
                        <div className="media-left meida media-middle">
                            <span>
                                <i className="ti-comment f-s-40"></i>
                            </span>
                        </div>
                        <div className="media-body media-text-right" style={{ textAlign: 'right' }}>
                            <h2 className="color-white text-white" style={{ textAlign: 'left' }}>
                                According to the ML Predictions & Sentiment Analysis of the Tweets, a {idea} in {quote} stock is expected ={'>'} BUY {decision}
                            </h2>
                            <p className="m-b-0 text-white" >RECOMMENDATION</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
function SentimentComponent({ quote }) {
    return (
        <div className="" style={{ width :'100%', paddingBottom: '30px', margin:  'auto'}}>
            <TweetBox quote={quote} />
            <div style={{ display: 'flex' }}>
                <SentimentAnalysisCard quote={quote} />
                <PredictedPriceCard quote={quote} />
            </div>
            <PolarityAndRecommendation />
        </div>
    );
}

export default SentimentComponent;
