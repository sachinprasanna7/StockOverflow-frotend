import {React, useState, useEffect} from "react";
import bootstrap from "bootstrap/dist/css/bootstrap.min.css";
import WebFont from 'webfontloader';
import StockChart from '../cards/StockChart';
WebFont.load({
    google: {
      families: ['Mozilla Headline:200-700']
    }
});

export default function StocksInfo(){
    const dummyData = [
        { symbol: "AAPL", companyName: "Apple Inc.", price: 150.25}
    ];
    return (
        <div style={{ marginLeft: "250px", padding: "5px", width: `calc(100vw - 300px)`, boxSizing: 'border-box' }}>
            <h2 
                style={{
                    textAlign: "center",
                    fontFamily: "'Mozilla Headline', sans-serif'",
                    fontWeight: "900",
                    fontSize: "2.9rem",
                    marginBottom: "10px",
                    color: "#113F67"
                    }}
                >
                {dummyData[0].companyName} ({dummyData[0].symbol})
            </h2>
            <div style={{
                textAlign: "center",
                fontSize: "2.2rem",
                fontWeight: "600",
            }}>
                <p style={{                
                    color: "#113F67",
                }}>Price: ${dummyData[0].price.toFixed(2)}</p>
            </div>
            {/* Stock Chart Component */}
            <StockChart symbol={dummyData[0].symbol} />           
        </div>
    )
}