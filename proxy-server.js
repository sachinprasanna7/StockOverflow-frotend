const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

// 1️⃣ First API — Get stock prices
app.get('/api/stocks/:ticker', async (req, res) => {
  const ticker = req.params.ticker;

  try {
    const response = await axios.get(
      `https://marketdata.neueda.com/API/StockFeed/GetStockPricesForSymbol/${ticker}`
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error fetching stock prices' });
  }
});


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

app.listen(4000, () => {
  console.log('Proxy server running on port 4000');
});
app.get('/api/prevStockValue/:symbol', async (req, res) => {
  const symbol = req.params.symbol;
  const periodNumber = req.query.periodNumber;  // e.g. ?periodNumber=5

  if (!periodNumber) {
    return res.status(400).json({ error: 'periodNumber query parameter is required' });
  }

  try {
    const response = await axios.get(
      `https://marketdata.neueda.com/API/StockFeed/GetOpenCloseMinMaxForSymbolAndPeriodNumber/${symbol}?PeriodNumber=${periodNumber}`
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error fetching stock data' });
  }
});

app.listen(4000, () => {
  console.log('Proxy server running on port 4000');
});