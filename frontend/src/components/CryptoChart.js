import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import moment from 'moment';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CryptoChart = ({ data, symbol }) => {
    const [priceHistory, setPriceHistory] = useState([]);
    const [timestamps, setTimestamps] = useState([]);
    const chartRef = useRef(null);

    useEffect(() => {
        if (data && data.price) {
            // Add new price data point
            setPriceHistory(prev => {
                const newHistory = [...prev, parseFloat(data.price)];
                // Keep only the last 20 data points
                if (newHistory.length > 20) {
                    return newHistory.slice(newHistory.length - 20);
                }
                return newHistory;
            });

            // Add new timestamp
            setTimestamps(prev => {
                const newTimestamps = [...prev, moment(data.timestamp).format('HH:mm:ss')];
                // Keep only the last 20 timestamps
                if (newTimestamps.length > 20) {
                    return newTimestamps.slice(newTimestamps.length - 20);
                }
                return newTimestamps;
            });
        }
    }, [data]);

    const chartData = {
        labels: timestamps,
        datasets: [
            {
                label: `${symbol || 'Crypto'} Price (USD)`,
                data: priceHistory,
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    callback: function (value) {
                        return '$' + value.toFixed(2);
                    }
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `${symbol || 'Cryptocurrency'} Price History`
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Price: $${parseFloat(context.raw).toFixed(2)}`;
                    }
                }
            }
        }
    };

    return (
        <div style={{ height: '400px', width: '100%' }}>
            <Line ref={chartRef} data={chartData} options={options} />
        </div>
    );
};

export default CryptoChart;