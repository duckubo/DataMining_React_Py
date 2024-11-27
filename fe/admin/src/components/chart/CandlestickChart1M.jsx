import Plot from 'react-plotly.js';

const CandlestickChart1M = ({ data, ticker }) => {
    return (
        <Plot
            data={[
                {
                    x: data.map(item => item.name),
                    open: data.map(item => item.open),
                    high: data.map(item => item.high),
                    low: data.map(item => item.low),
                    close: data.map(item => item.close),
                    type: 'candlestick',
                    xaxis: 'x',
                    yaxis: 'y'
                },
            ]}
            layout={{
                title: `Stock Price Movement Days ${ticker}`,
                xaxis: {
                    title: 'Date',
                    type: 'category',
                    tickmode: 'auto',   // Tự động phân phối nhãn trục x
                    nticks: 10
                },
                yaxis: {
                    title: 'Price (USD)'
                },
                width: 600,
                height: 500,
            }}
        />
    );
};

export default CandlestickChart1M;
