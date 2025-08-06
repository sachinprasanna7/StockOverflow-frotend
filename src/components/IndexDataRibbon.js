import React, { useState, useEffect } from "react";

export default function IndexDataRibbon() {
  const [indexData, setIndexData] = useState([
    { name: "NASDAQ", symbol: "^IXIC", value: "21015.03", change: "+1.2%", changeValue: "+285.67", loading: true },
    { name: "Dow Jones", symbol: "^DJI", value: "44107.40", change: "-0.3%", changeValue: "-132.45", loading: true },
    { name: "Russell 2000", symbol: "^RUT", value: "2218.25", change: "+0.8%", changeValue: "+17.23", loading: true },
    { name: "S&P 500", symbol: "^GSPC", value: "6321.60", change: "+0.5%", changeValue: "+29.84", loading: true },
    { name: "S&P 500 Financial", symbol: "^SP500-40", value: "6321.27", change: "+1.1%", changeValue: "+9.82", loading: true },
    { name: "S&P 500 Energy", symbol: "^SP500-10", value: "656.80", change: "-0.7%", changeValue: "-5.21", loading: true }
  ]);

  const fetchIndexData = async () => {
    try {
      // Using a free API like Alpha Vantage or Yahoo Finance alternative
      // For demo, I'll simulate API calls with random data
      const updatedData = indexData.map(index => {
        const randomChange = (Math.random() - 0.5) * 4; // Random change between -2% to +2%
        const newValue = parseFloat(index.value.replace(',', ''));
        const changeValue = (newValue * randomChange / 100).toFixed(2);
        
        return {
          ...index,
          change: `${randomChange >= 0 ? '+' : ''}${randomChange.toFixed(1)}%`,
          changeValue: `${randomChange >= 0 ? '+' : ''}${changeValue}`,
          loading: false
        };
      });
      
      setIndexData(updatedData);
      
    } catch (error) {
      console.error('Error fetching index data:', error);
      // Set loading to false even on error
      setIndexData(prev => prev.map(item => ({ ...item, loading: false })));
    }
  };

  // Fetch data on component mount and then every minute
  useEffect(() => {
    fetchIndexData(); // Initial fetch
    
    const interval = setInterval(() => {
      fetchIndexData();
    }, 30000); // 60 seconds = 1 minute
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginLeft: "250px", padding: "20px" }}>
      <div className="d-flex justify-content-between text-center mb-3">
        {indexData.map((index, i) => (
          <div key={i} className="border p-2 flex-fill mx-1 position-relative">
            {/* Loading indicator */}
            {index.loading && (
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light bg-opacity-75">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            
            {/* Main value and change info on same line */}
            <div className="fw-bold fs-6">
              {index.value}
              <span className={`ms-2 ${
                index.change.startsWith('+') 
                  ? 'text-success' 
                  : index.change.startsWith('-') 
                  ? 'text-danger' 
                  : 'text-muted'
              }`}>
                {index.changeValue} ({index.change})
              </span>
            </div>
            
            {/* Index name */}
            <small className="d-block text-muted">{index.name}</small>
          </div>
        ))}
      </div>
      
    </div>
  );
}