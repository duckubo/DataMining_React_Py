import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const TweetData = () => {
    const [tweets, setTweets] = useState([]);

    useEffect(() => {
        // URL của file CSV trên GitHub
        const url = 'https://raw.githubusercontent.com/dD2405/Twitter_Sentiment_Analysis/master/train.csv';

        // Fetch dữ liệu CSV
        fetch(url)
            .then(response => response.text())
            .then(csvData => {
                // Phân tích dữ liệu CSV
                Papa.parse(csvData, {
                    header: true, // Sử dụng hàng đầu tiên làm tiêu đề cột
                    skipEmptyLines: true,
                    complete: (result) => {
                        // Lấy tối đa 30 dòng đầu tiên và lưu vào state
                        setTweets(result.data.slice(0, 100));
                    }
                });
            })
            .catch(error => console.error('Lỗi khi fetch file CSV:', error));
    }, []);

    return (
        <div style={{
            width: '100%', height: '530px',overflowY: 'scroll' }}>
            <h2>Tweet Data</h2>
            <ul>
                {tweets.map((tweet, index) => (
                    <li key={index}>
                        {tweet.tweet || "No tweet data available"}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TweetData;
