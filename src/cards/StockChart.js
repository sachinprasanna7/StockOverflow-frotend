import React, { useEffect, useState, useRef } from 'react';
import '../styles/StockChart.css';

export default function StockChart({ symbol, currentPrice, companyName }) {
    const [valuesToShow, setValuesToShow] = useState(10);
    const [currentData, setCurrentData] = useState([]);
    const [loading, setLoading] = useState(true);
    const chartRef = useRef(null);
    console.log('StockChart rendered with symbol:', symbol, 'and valuesToShow:', valuesToShow);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:4000/api/chartValues/${symbol}?noOfValues=${valuesToShow}`);
                const data = await response.json();
                console.log('Fetched chart data:', data);

                // Process the data to ensure proper sorting by timestamp
                const processedData = data
                    .map((item, index) => ({
                        ...item,
                        index: index,
                        period: item.periodNumber || index + 1
                    }))
                    .sort((a, b) => a.index - b.index);

                setCurrentData(processedData);
            } catch (error) {
                console.error('Error fetching chart data:', error);
                setCurrentData([]);
            } finally {
                setLoading(false);
            }
        };

        if (symbol) {
            console.log('Fetching data for symbol:', symbol);
            fetchData();
        }
    }, [symbol, valuesToShow]);

    if (!currentData.length) {
        // console.log(currentData)
       
        return (
            <div className="loading-container">
                {loading ? (
                    <div className="loading-text">
                        Loading chart data...
                    </div>
                ) : (
                    <div className="loading-text">
                        No data available for {symbol}
                    </div>
                )}
            </div>
        );
    }

    const prices = currentData.map(d => d.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const priceRange = maxPrice - minPrice;
    const padding = priceRange * 0.1; // 10% padding
    const chartMax = maxPrice + padding;
    const chartMin = Math.max(0, minPrice - padding);
    const chartRange = chartMax - chartMin;

    // Calculate price change
    const firstPrice = currentData[0]?.price || 0;
    const lastPrice = currentData[currentData.length - 1]?.price || 0;
    const priceChange = lastPrice - firstPrice;
    const priceChangePercent = firstPrice ? ((priceChange / firstPrice) * 100) : 0;
    const isPositive = priceChange >= 0;

    // Generate Y-axis labels
    const yAxisLabels = [];
    for (let i = 0; i <= 5; i++) {
        const value = chartMin + (chartRange * i / 5);
        yAxisLabels.push({
            value: value,
            position: 100 - (i * 20) // Invert for screen coordinates
        });
    }

    // Common period options
    const commonValues = [5, 10, 20, 50, 100, 200, 500, 1000, 2500, 5000];

    // Generate SVG path for the line
    const pathData = currentData.map((dataPoint, index) => {
        const x = (index / (currentData.length - 1)) * 100;
        const y = 100 - (((dataPoint.price - chartMin) / chartRange) * 100);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    // Generate area path (for gradient fill)
    const areaPath = `${pathData} L 100 100 L 0 100 Z`;

    // Color scheme based on performance
    const lineColor = isPositive ? '#10b981' : '#ef4444';
    const gradientColor = isPositive ? '#10b981' : '#ef4444';

    return (
        <div className="stock-chart-container">
            {/* Header */}
            <div className="chart-header border-bottom pb-2 mb-3">
                <div>
                    <h3 className="stock-title mb-1 d-flex align-items-center">
                        <span className="fw-bold text-dark me-2" style={{ fontSize: "1.5rem" }}>
                            {companyName.toUpperCase()}
                        </span>
                        <span className="badge bg-light text-secondary" style={{ fontSize: "0.85rem" }}>
                            {symbol.toUpperCase()}
                        </span>
                    </h3>
                    <div className="price-info">
                        <span className="current-price fw-medium" style={{ fontSize: "1rem", color: "#000" }}>
                            Current Trading Price: <span style={{ fontWeight: "600" }}>${currentPrice?.toFixed(2)}</span>
                        </span>
                    </div>
                </div>

                {/* Period Selection */}
                <div className="period-selector">
                    <label className="period-label">Last</label>
                    <select
                        className="period-select"
                        value={valuesToShow}
                        onChange={(e) => setValuesToShow(parseInt(e.target.value))}
                    >
                        {commonValues.map(period => (
                            <option key={period} value={period}>
                                {period}
                            </option>
                        ))}
                    </select>
                    <span className="period-text">values</span>
                </div>
            </div>

            {/* Chart Container */}
            <div className={`chart-wrapper ${isPositive ? 'positive' : 'negative'}`}>
                {/* Chart Area */}
                <div ref={chartRef} className="chart-area">
                    {/* Y-axis Labels */}
                    {yAxisLabels.map((label, index) => (
                        <div
                            key={index}
                            className="y-axis-label"
                            style={{ top: `${label.position}%` }}
                        >
                            ${label.value.toFixed(2)}
                        </div>
                    ))}

                    {/* Horizontal Grid Lines */}
                    {yAxisLabels.map((label, index) => (
                        <div
                            key={`grid-${index}`}
                            className={`grid-line ${index === 0 ? 'primary' : 'secondary'}`}
                            style={{ top: `${label.position}%` }}
                        />
                    ))}

                    {/* SVG Chart */}
                    <svg className="chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id={`gradient-${symbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={gradientColor} stopOpacity="0.3" />
                                <stop offset="50%" stopColor={gradientColor} stopOpacity="0.1" />
                                <stop offset="100%" stopColor={gradientColor} stopOpacity="0" />
                            </linearGradient>

                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Area Fill */}
                        <path
                            d={areaPath}
                            fill={`url(#gradient-${symbol})`}
                        />

                        {/* Main Line */}
                        <path
                            d={pathData}
                            stroke={lineColor}
                            strokeWidth="0.6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                            filter="url(#glow)"
                        />

                        {/* Data Points */}
                        {currentData.map((dataPoint, index) => {
                            const x = (index / (currentData.length - 1)) * 100;
                            const y = 100 - (((dataPoint.price - chartMin) / chartRange) * 100);

                            return (
                                <g key={index}>
                                    {/* <circle
                                        cx={x}
                                        cy={y}
                                        r="1.2"
                                        fill="white"
                                        stroke={lineColor}
                                        strokeWidth="0.4"
                                        vectorEffect="non-scaling-stroke"
                                    />
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r="0.6"
                                        fill={lineColor}
                                        vectorEffect="non-scaling-stroke"
                                    /> */}
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* X-axis Labels */}
                <div className="x-axis-labels">
                    {currentData.map((dataPoint, index) => {
                        // Show labels intelligently based on data size
                        let showLabel = false;
                        if (valuesToShow <= 10) {
                            showLabel = true;
                        } else if (valuesToShow <= 50) {
                            showLabel = index % Math.ceil(valuesToShow / 8) === 0 || index === currentData.length - 1;
                        } else {
                            showLabel = index % Math.ceil(valuesToShow / 6) === 0 || index === currentData.length - 1;
                        }

                        return (
                            <div key={index} className={`x-axis-label ${!showLabel ? 'hidden' : ''}`}>
                                {showLabel ? dataPoint.timeStamp || `P${dataPoint.period}` : ''}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Chart Statistics */}
            <div className="stats-grid">
                <div className="stat-item">
                    <div className="stat-label">High</div>
                    <div className="stat-value high">${maxPrice.toFixed(2)}</div>
                </div>

                <div className="stat-item">
                    <div className="stat-label">Low</div>
                    <div className="stat-value low">${minPrice.toFixed(2)}</div>
                </div>

                <div className="stat-item">
                    <div className="stat-label">Range</div>
                    <div className="stat-value neutral">${priceRange.toFixed(2)}</div>
                </div>

                <div className="stat-item">
                    <div className="stat-label">Values</div>
                    <div className="stat-value neutral">{currentData.length}</div>
                </div>

                <div className="stat-item">
                    <div className="stat-label">Volatility</div>
                    <div className={`stat-value ${priceRange > (maxPrice * 0.02) ? 'high' : 'low'}`}>
                        {((priceRange / maxPrice) * 100).toFixed(1)}%
                    </div>
                </div>
            </div>

            {/* Recent Data Points Preview */}
            {currentData.length > 0 && (
                <div className="recent-activity">
                    <h4 className="recent-activity-title">Recent Activity</h4>
                    <div className="recent-activity-data">
                        <span>
                            <strong>First:</strong> ${firstPrice.toFixed(2)} ({currentData[0]?.timeStamp})
                        </span>
                        <span>
                            <strong>Last:</strong> ${lastPrice.toFixed(2)} ({currentData[currentData.length - 1]?.timeStamp})
                        </span>
                        <span>
                            <strong>Start Period:</strong> {currentData[0]?.periodNumber}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}