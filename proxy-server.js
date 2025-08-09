const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api/stocks/:ticker', async (req, res) => {
  const ticker = req.params.ticker;

  try {
    const response = await axios.get(
      `https://marketdata.neueda.com/API/StockFeed/GetStockPricesForSymbol/${ticker}`
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.listen(4000, () => {
  console.log('Proxy server running on port 4000');
});
