import React, { useState } from 'react';

export default function StockChart({ symbol = "AAPL" }) {
    const [timeFrame, setTimeFrame] = useState('week'); // 'week' or 'month'

    // Dummy data for demonstration
    const weeklyData = [
        { day: 'Mon', price: 148.50 },
        { day: 'Tue', price: 149.20 },
        { day: 'Wed', price: 150.75 },
        { day: 'Thu', price: 149.80 },
        { day: 'Fri', price: 150.25 },
        { day: 'Sat', price: 151.10 },
        { day: 'Sun', price: 150.90 }
    ];

    const monthlyData = [
        { period: 'Week 1', price: 147.30 },
        { period: 'Week 2', price: 149.50 },
        { period: 'Week 3', price: 148.90 },
        { period: 'Week 4', price: 150.25 }
    ];

    const currentData = timeFrame === 'week' ? weeklyData : monthlyData;
    const maxPrice = Math.max(...currentData.map(d => d.price));
    const minPrice = Math.min(...currentData.map(d => d.price));

    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            margin: '20px 0',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
        }}>
            {/* Header with title and toggle */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <h3 style={{
                    margin: '0',
                    color: '#113F67',
                    fontSize: '1.5rem',
                    fontWeight: '700'
                }}>
                    {symbol} Stock Chart
                </h3>
                
                {/* Toggle Button */}
                <div style={{
                    display: 'flex',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    padding: '4px'
                }}>
                    <button
                        onClick={() => setTimeFrame('week')}
                        style={{
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: timeFrame === 'week' ? '#113F67' : 'transparent',
                            color: timeFrame === 'week' ? 'white' : '#6b7280',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Week
                    </button>
                    <button
                        onClick={() => setTimeFrame('month')}
                        style={{
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: timeFrame === 'month' ? '#113F67' : 'transparent',
                            color: timeFrame === 'month' ? 'white' : '#6b7280',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Month
                    </button>
                </div>
            </div>

            {/* Line Chart Visualization */}
            <div style={{
                height: '300px',
                position: 'relative',
                padding: '10px 0',
                borderTop: '1px solid #e5e7eb',
                borderBottom: '1px solid #e5e7eb'
            }}>
                {/* Chart Container */}
                <div style={{
                    position: 'relative',
                    height: '220px',
                    margin: '30px 40px 20px 40px'
                }}>
                    {/* Grid Lines */}
                    {[0, 25, 50, 75, 100].map(line => (
                        <div key={line} style={{
                            position: 'absolute',
                            top: `${line}%`,
                            left: '0',
                            right: '0',
                            height: '1px',
                            backgroundColor: '#f3f4f6',
                            zIndex: '1'
                        }} />
                    ))}
                    
                    {/* SVG for Line Chart */}
                    <svg 
                        width="100%" 
                        height="100%" 
                        style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }}
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        {/* Line Path */}
                        <path
                            d={currentData.map((dataPoint, index) => {
                                const x = (index / (currentData.length - 1)) * 90 + 5; // Keep within 5-95% range
                                const heightPercentage = ((dataPoint.price - minPrice) / (maxPrice - minPrice)) * 70 + 15; // Keep within 15-85% range
                                const y = 100 - heightPercentage;
                                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                            }).join(' ')}
                            stroke="#113F67"
                            strokeWidth="0.8"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                        />
                        
                        {/* Data Points */}
                        {currentData.map((dataPoint, index) => {
                            const x = (index / (currentData.length - 1)) * 90 + 5;
                            const heightPercentage = ((dataPoint.price - minPrice) / (maxPrice - minPrice)) * 70 + 15;
                            const y = 100 - heightPercentage;
                            
                            return (
                                <g key={index}>
                                    {/* Point Circle */}
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r="1.2"
                                        fill="#113F67"
                                        stroke="white"
                                        strokeWidth="0.3"
                                        vectorEffect="non-scaling-stroke"
                                    />
                                </g>
                            );
                        })}
                    </svg>
                    
                    {/* Price Labels positioned outside SVG */}
                    {currentData.map((dataPoint, index) => {
                        const x = (index / (currentData.length - 1)) * 90 + 5;
                        const heightPercentage = ((dataPoint.price - minPrice) / (maxPrice - minPrice)) * 70 + 15;
                        const y = 100 - heightPercentage;
                        
                        return (
                            <div
                                key={index}
                                style={{
                                    position: 'absolute',
                                    left: `${x}%`,
                                    top: `${y - 8}%`,
                                    transform: 'translateX(-50%)',
                                    fontSize: '0.7rem',
                                    color: '#113F67',
                                    fontWeight: '600',
                                    backgroundColor: 'rgba(255,255,255,0.8)',
                                    padding: '2px 4px',
                                    borderRadius: '3px',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                ${dataPoint.price.toFixed(1)}
                            </div>
                        );
                    })}
                </div>
                
                {/* X-axis Labels */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '10px',
                    padding: '0 40px'
                }}>
                    {currentData.map((dataPoint, index) => (
                        <div key={index} style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            fontWeight: '500',
                            textAlign: 'center',
                            flex: '1'
                        }}>
                            {dataPoint.day || dataPoint.period}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chart Info */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '15px',
                fontSize: '0.9rem',
                color: '#6b7280'
            }}>
                <span>
                    <strong>High:</strong> ${maxPrice.toFixed(2)}
                </span>
                <span>
                    <strong>Low:</strong> ${minPrice.toFixed(2)}
                </span>
                <span>
                    <strong>Period:</strong> {timeFrame === 'week' ? 'Last 7 Days' : 'Last 4 Weeks'}
                </span>
            </div>
        </div>
    );
}
