const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

//Proxy Server

// First API — Get stock prices
app.get('/api/currentStockValue/:ticker', async (req, res) => {
  const ticker = req.params.ticker;

  try {
    const response = await axios.get(
      `https://marketdata.neueda.com/API/StockFeed/GetStockPricesForSymbol/${ticker}`
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error fetching company info' });
  }
});



// Second API — Get previous stock value (In Period)
app.get('/api/prevStockValue/:ticker', async (req, res) => {
  const ticker = req.params.ticker;
  const periodNumber = req.query.periodNumber; 

  if (!periodNumber) {
    return res.status(400).json({ error: 'periodNumber query parameter is required' });
  }

  try {
    const response = await axios.get(
      `https://marketdata.neueda.com/API/StockFeed/GetOpenCloseMinMaxForSymbolAndPeriodNumber/${ticker}?PeriodNumber=${periodNumber}`
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error fetching stock data' });
  }
});


// Third API - Get history of stock prices
app.get('/api/chartValues/:ticker', async (req, res) => {
  const ticker = req.params.ticker;
  const noOfValues = req.query.noOfValues;

  if (!noOfValues) {
    return res.status(400).json({ error: 'noOfValues query parameter is required' });
  }

  if(noOfValues > 5000) {
    return res.status(400).json({ error: 'noOfValues must be 5000 or less' });
  }

  try {
    const response = await axios.get(
      `https://marketdata.neueda.com/API/StockFeed/GetStockPricesForSymbol/${ticker}?HowManyValues=${noOfValues}`
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error fetching stock chart data' });
  }
});

app.listen(4000, () => {
  console.log('Proxy server running on port 4000');
});