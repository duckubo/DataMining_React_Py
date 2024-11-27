import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

// Dữ liệu tương quan giả lập cho 4 mã cổ phiếu


// Nhãn cho các mã cổ phiếu


const Heatmap = ({ correlationData, features, ticker }) => {

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
                title: `Heatmap to visualize the correlation among different <br> Daily price columns for ${ticker} stocks`,
                xaxis: {
                    title: '',
                },
                yaxis: {
                    title: '',
                },
                width: 500,
                height: 400,
            }}
        />
    );
};

export default Heatmap;
