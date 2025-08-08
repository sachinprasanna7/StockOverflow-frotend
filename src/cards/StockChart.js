import React, { useState } from 'react';

// Helper function to get current period (copied from TimePeriod.js)
function getPeriodFromTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
  const period = Math.floor(totalSeconds / 20) + 1;
  return period;
}

// Generate mock historical data for periods
function generatePeriodData(periodsToShow, currentPeriod) {
    const data = [];
    const basePrice = 150.25; // Base stock price
    
    for (let i = periodsToShow - 1; i >= 0; i--) {
        const periodNumber = currentPeriod - i;
        // Generate some realistic price variation (±5% from base)
        const variation = (Math.sin(periodNumber * 0.1) * 0.05 + Math.random() * 0.02 - 0.01);
        const price = basePrice * (1 + variation);
        
        data.push({
            period: periodNumber > 0 ? periodNumber : 1,
            price: Math.max(price, 1) // Ensure price is positive
        });
    }
    
    return data;
}

export default function StockChart({ symbol = "AAPL" }) {
    const [periodsToShow, setPeriodsToShow] = useState(10); // Default to last 10 periods
    const currentPeriod = getPeriodFromTime();
    const currentData = generatePeriodData(periodsToShow, currentPeriod);
    const maxPrice = Math.max(...currentData.map(d => d.price));
    const minPrice = Math.min(...currentData.map(d => d.price));

    // Predefined common period options
    const commonPeriods = [5, 10, 20, 50, 100, 200, 500, 1000];

    // Generate Y-axis labels
    const generateYAxisLabels = () => {
        const priceRange = maxPrice - minPrice;
        const stepSize = priceRange / 4; // 5 labels (0, 25, 50, 75, 100%)
        const labels = [];
        
        for (let i = 0; i <= 4; i++) {
            const price = minPrice + (stepSize * i);
            labels.push({
                value: price,
                position: 100 - (i * 25) // Invert for display (0% = bottom, 100% = top)
            });
        }
        return labels.reverse(); // Top to bottom order
    };

    const yAxisLabels = generateYAxisLabels();

    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            margin: '20px 0',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
        }}>
            {/* Header with title and period selection */}
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
                
                {/* Period Selection Dropdown */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#f8f9fa',
                    padding: '8px 12px',
                    borderRadius: '8px'
                }}>
                    <label style={{
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        color: '#113F67',
                        whiteSpace: 'nowrap'
                    }}>
                        Last
                    </label>
                    <select
                        value={periodsToShow}
                        onChange={(e) => setPeriodsToShow(parseInt(e.target.value))}
                        style={{
                            padding: '4px 8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                            color: '#113F67',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            outline: 'none',
                            minWidth: '60px'
                        }}
                    >
                        {commonPeriods.map(period => (
                            <option key={period} value={period}>
                                {period}
                            </option>
                        ))}
                    </select>
                    <span style={{
                        fontSize: '0.85rem',
                        color: '#6b7280',
                        whiteSpace: 'nowrap'
                    }}>
                        periods
                    </span>
                </div>
            </div>

            {/* Line Chart Visualization */}
            <div style={{
                height: '320px',
                position: 'relative',
                padding: '20px 0',
                borderTop: '1px solid #e5e7eb',
                borderBottom: '1px solid #e5e7eb'
            }}>
                {/* Chart Container */}
                <div style={{
                    position: 'relative',
                    height: '240px',
                    margin: '20px 60px 20px 80px' // More left margin for Y-axis labels
                }}>
                    {/* Y-axis Labels */}
                    {yAxisLabels.map((label, index) => (
                        <div key={index} style={{
                            position: 'absolute',
                            left: '-70px',
                            top: `${label.position}%`,
                            transform: 'translateY(-50%)',
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            fontWeight: '500',
                            textAlign: 'right',
                            width: '60px'
                        }}>
                            ${label.value.toFixed(2)}
                        </div>
                    ))}
                    
                    {/* Grid Lines */}
                    {[0, 20, 40, 60, 80, 100].map(line => (
                        <div key={line} style={{
                            position: 'absolute',
                            top: `${line}%`,
                            left: '0',
                            right: '0',
                            height: '1px',
                            backgroundColor: line === 0 || line === 100 ? '#d1d5db' : '#f3f4f6',
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
                        {/* Gradient Definition */}
                        <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#113F67" stopOpacity="0.1"/>
                                <stop offset="100%" stopColor="#113F67" stopOpacity="0"/>
                            </linearGradient>
                        </defs>
                        
                        {/* Area under line */}
                        <path
                            d={currentData.map((dataPoint, index) => {
                                const x = (index / (currentData.length - 1)) * 95 + 2.5;
                                const heightPercentage = ((dataPoint.price - minPrice) / (maxPrice - minPrice)) * 80 + 10;
                                const y = 100 - heightPercentage;
                                if (index === 0) return `M ${x} ${y}`;
                                if (index === currentData.length - 1) return `L ${x} ${y} L ${x} 100 L 2.5 100 Z`;
                                return `L ${x} ${y}`;
                            }).join(' ')}
                            fill="url(#lineGradient)"
                        />
                        
                        {/* Line Path */}
                        <path
                            d={currentData.map((dataPoint, index) => {
                                const x = (index / (currentData.length - 1)) * 95 + 2.5;
                                const heightPercentage = ((dataPoint.price - minPrice) / (maxPrice - minPrice)) * 80 + 10;
                                const y = 100 - heightPercentage;
                                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                            }).join(' ')}
                            stroke="#113F67"
                            strokeWidth="0.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                        />
                        
                        {/* Data Points - Simple, no interaction */}
                        {currentData.map((dataPoint, index) => {
                            const x = (index / (currentData.length - 1)) * 95 + 2.5;
                            const heightPercentage = ((dataPoint.price - minPrice) / (maxPrice - minPrice)) * 80 + 10;
                            const y = 100 - heightPercentage;
                            
                            return (
                                <circle
                                    key={index}
                                    cx={x}
                                    cy={y}
                                    r="0.8"
                                    fill="#113F67"
                                    stroke="white"
                                    strokeWidth="0.2"
                                    vectorEffect="non-scaling-stroke"
                                />
                            );
                        })}
                    </svg>
                </div>
                
                {/* X-axis Labels */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '10px',
                    padding: '0 60px 0 80px' // Match the chart container margins
                }}>
                    {currentData.map((dataPoint, index) => {
                        // Show labels more intelligently based on data size
                        let showLabel = false;
                        if (periodsToShow <= 10) {
                            showLabel = true; // Show all labels for small datasets
                        } else if (periodsToShow <= 50) {
                            showLabel = index % 5 === 0 || index === currentData.length - 1; // Every 5th
                        } else {
                            showLabel = index % Math.ceil(periodsToShow / 8) === 0 || index === currentData.length - 1; // ~8 labels max
                        }
                        
                        return (
                            <div key={index} style={{
                                fontSize: '0.7rem',
                                color: showLabel ? '#6b7280' : 'transparent',
                                fontWeight: '500',
                                textAlign: 'center',
                                flex: '1',
                                minWidth: '0'
                            }}>
                                {showLabel ? `P${dataPoint.period}` : ''}
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* Chart Info */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '20px',
                padding: '15px 0',
                borderTop: '1px solid #f3f4f6',
                fontSize: '0.9rem',
                color: '#6b7280',
                flexWrap: 'wrap',
                gap: '20px',
                minHeight: '24px'
            }}>
                <span style={{ 
                    minWidth: 'fit-content',
                    padding: '4px 8px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    fontWeight: '500'
                }}>
                    <strong style={{ color: '#113F67' }}>High:</strong> ${maxPrice.toFixed(2)}
                </span>
                <span style={{ 
                    minWidth: 'fit-content',
                    padding: '4px 8px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    fontWeight: '500'
                }}>
                    <strong style={{ color: '#113F67' }}>Low:</strong> ${minPrice.toFixed(2)}
                </span>
                <span style={{ 
                    minWidth: 'fit-content',
                    padding: '4px 8px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    fontWeight: '500'
                }}>
                    <strong style={{ color: '#113F67' }}>Range:</strong> {periodsToShow} periods
                </span>
            </div>
        </div>
    );
}
