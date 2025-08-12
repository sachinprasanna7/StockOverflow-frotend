import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/StockManipulation.css';


export default function StockManipulation({ symbol, companyName, currentPrice }) {
    const [investmentType, setInvestmentType] = useState('SIP');
    const [showBuyForm, setShowBuyForm] = useState(false);
    const [showSellForm, setShowSellForm] = useState(false);
    const [showWatchlistForm, setShowWatchlistForm] = useState(false);
    const [showSIPForm, setShowSIPForm] = useState(false);
    const [quantity, setQuantity] = useState('');
    const [sipAmount, setSipAmount] = useState('');
    const [holdings, setHoldings] = useState(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedWatchlists, setSelectedWatchlists] = useState([]);
    const [stockData, setStockData] = useState();
    const[availableWatchlists, setAvailableWatchlists] = useState([]);
    const [userBalance, setUserBalance] = useState({
        amount: 0,
        loading: false
    });
    const [userStockMoney, setuserStockMoney] = useState({
        amount: 0,
        loading: false
    });

    // const availableWatchlists = [
    //     { id: 1, name: 'My Portfolio', description: 'Main investment portfolio' },
    //     { id: 2, name: 'Tech Stocks', description: 'Technology companies' },
    //     { id: 3, name: 'Growth Stocks', description: 'High growth potential stocks' },
    //     { id: 4, name: 'Dividend Stocks', description: 'Dividend paying companies' },
    //     { id: 5, name: 'Favorites', description: 'Most watched stocks' }
    // ];

    const clearForms = () => {
        setQuantity('');
        setSipAmount('');
        setErrors({});
        setShowBuyForm(false);
        setShowSellForm(false);
        setShowWatchlistForm(false);
        setShowSIPForm(false);
        setSelectedWatchlists([]);
    };

    const validateQuantity = (qty, isForSelling = false) => {
        const newErrors = {};

        if (!qty || qty.trim() === '') {
            newErrors.quantity = 'Quantity is required';
        } else if (isNaN(qty) || parseFloat(qty) <= 0) {
            newErrors.quantity = 'Quantity must be a positive number';
        } else if (isForSelling && parseFloat(qty) > userStockMoney) {
            newErrors.quantity = `Cannot sell more than ${userStockMoney} shares you own`;
        } else if (qty.includes('.')) {
            newErrors.quantity = 'Quantity must be a whole number';
        }
        return newErrors;
    };

    useEffect(() => {
        const getStockInformation = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/stock/symbol/${symbol}`);
                setStockData(response.data);

            } catch (error) {
                console.error("Error fetching stock information:", error);
            }
        };

        if (symbol) {
            getStockInformation();
        }
    }, [symbol]);


    useEffect(() => {
        const fetchTradingBalance = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8080/useraccount/getTradingMoney?userId=1"
                );
                setUserBalance({
                    amount: response.data.trading_money,
                    loading: false,
                });
                // console.log("Trading Balance:", response.data.trading_money);
            } catch (error) {
                console.error("Error fetching balance:", error);
                setUserBalance((prev) => ({ ...prev, loading: false }));
            }
        };

        fetchTradingBalance();
    },[stockData, symbol, currentPrice]);


    useEffect(() => {
        const getQuantityHeld = async () => {
            try {

                const portfolioRes = await fetch(`http://localhost:8080/portfolio/${stockData.symbol_id}`);

                if (!portfolioRes.ok) {
                    const portfolioData = {
                        averagePrice: 0,
                        stockQuantity: 0,
                        symbolId: stockData.symbol_id
                    };
                    setHoldings(portfolioData.stockQuantity);
                }

                else {
                    const portfolioData = await portfolioRes.json();
                    // console.log("Portfolio Data:", portfolioData);
                    setHoldings(portfolioData.stockQuantity);
                }

            } catch (error) {
                console.error("Error fetching balance:", error);
                setUserBalance((prev) => ({ ...prev, loading: false }));
            }
        };

        getQuantityHeld();

    },[userBalance, stockData]);


    const handleSIPBuy = () => {
        const validationErrors = {};
        const investmentAmount = parseFloat(sipAmount);

        if (!sipAmount || sipAmount.trim() === '') {
            validationErrors.sipAmount = 'Investment amount is required';
        } else if (isNaN(investmentAmount) || investmentAmount <= 0) {
            validationErrors.sipAmount = 'Investment amount must be a positive number';
        } else if (investmentAmount > userBalance) {
            validationErrors.sipAmount = `Insufficient balance. Available: $${userBalance}`;
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const maxShares = Math.floor(investmentAmount / currentPrice);
        const totalCost = maxShares * currentPrice;
        const remainingMoney = investmentAmount - totalCost;

        if (maxShares === 0) {
            setErrors({ sipAmount: `Investment amount too low. Minimum required: $${currentPrice.toFixed(2)}` });
            return;
        }


        setUserBalance(prev => prev - totalCost);
        setuserStockMoney(prev => prev + maxShares);

        let message = `🎉 Congratulations! You successfully bought ${maxShares} shares of ${symbol} for $${totalCost.toFixed(2)}!`;
        if (remainingMoney > 0) {
            message += ` $${remainingMoney.toFixed(2)} has been returned to your balance.`;
        }

        clearForms();
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 12000);
    };

    const handleBuy = async () => {
        const validationErrors = validateQuantity(quantity);
        const qty = parseFloat(quantity);
        const totalCost = qty * currentPrice;

        if (totalCost > userBalance) {
            validationErrors.balance = `Insufficient balance. Required: $${totalCost.toFixed(2)}, Available: $${userBalance.toFixed(2)}`;
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            // 1. Update trading money
            await axios.post("http://localhost:8080/useraccount/updateTradingMoney", {}, {
                params: {
                    userId: 1,
                    amount: totalCost,
                    isDeposit: false
                }
            });

            // 2. Update stock investments
            await axios.post("http://localhost:8080/useraccount/updateStockInvestments", {}, {
                params: {
                    userId: 1,
                    amount: totalCost,
                    isBuying: true
                }
            });

            // 3. Update portfolio
            await axios.post("http://localhost:8080/portfolio/buy", {}, {
                params: {
                    symbolId: stockData.symbol_id,
                    quantity: qty,
                    pricePerStock: currentPrice
                }
            });

            const now = new Date();
            const formattedNow = now.toISOString().slice(0, 19);
            // 4. Create order
            const orderPayload = {
                timeOrdered: formattedNow,
                timeCompleted: formattedNow,
                stock: {
                    symbol_id: stockData.symbol_id
                },
                orderType: "MARKET",
                stockQuantity: qty,
                transactionAmount: totalCost,
                orderStatus: "EXECUTED",
                buy: true
            };

            console.log("Order Payload:", orderPayload);

            await axios.post("http://localhost:8080/orders", orderPayload);

            // Update frontend state after all calls succeed
            setUserBalance(prev => prev - totalCost);
            setuserStockMoney(prev => prev + qty);
            clearForms();
            setSuccessMessage(`🎉 Congratulations! You bought ${qty} shares of ${symbol} for $${totalCost.toFixed(2)}!`);
            setTimeout(() => setSuccessMessage(''), 10000);

        } catch (error) {
            setErrors({ api: "Transaction failed. Please try again." });
        }
    };


    const handleSell = async () => {
        const validationErrors = validateQuantity(quantity, true);
        const qty = parseFloat(quantity);
        const totalEarnings = qty * currentPrice;

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            // 1. Update trading money
            await axios.post("http://localhost:8080/useraccount/updateTradingMoney", {}, {
                params: {
                    userId: 1,
                    amount: totalEarnings,
                    isDeposit: true
                }
            });

            // 2. Update stock investments
            await axios.post("http://localhost:8080/useraccount/updateStockInvestments", {}, {
                params: {
                    userId: 1,
                    amount: totalEarnings,
                    isBuying: false
                }
            });

            // 3. Update portfolio
            await axios.post("http://localhost:8080/portfolio/sell", {}, {
                params: {
                    symbolId: stockData.symbol_id,
                    quantity: qty,
                    pricePerStock: currentPrice
                }
            });

            const now = new Date();
            const formattedNow = now.toISOString().slice(0, 19);
            // 4. Create order
            const orderPayload = {
                timeOrdered: formattedNow,
                timeCompleted: formattedNow,
                stock: {
                    symbol_id: stockData.symbol_id
                },
                orderType: "MARKET",
                stockQuantity: qty,
                transactionAmount: totalEarnings,
                orderStatus: "EXECUTED",
                buy: false
            };

            console.log("Order Payload:", orderPayload);

            await axios.post("http://localhost:8080/orders", orderPayload);

            setUserBalance(prev => prev + totalEarnings);
            setuserStockMoney(prev => prev - qty);
            clearForms();
            setSuccessMessage(`🎉 Congratulations! You successfully sold ${qty} shares of ${symbol} for $${totalEarnings.toFixed(2)}!`);
            setTimeout(() => setSuccessMessage(''), 10000);

        } catch (error) {
            setErrors({ api: "Transaction failed. Please try again." });
        }
    };
    const addToWatchlist = async (watchlistId, stockSymbol) => {
        try {
            // 1️⃣ Get the symbolId from your API
            const symbolRes = await axios.get(`http://localhost:8080/api/stock/symbol/${stockSymbol}`);
            console.log(`Symbol data for ${stockSymbol}:`, symbolRes.data);
            const symbolId = symbolRes.data?.symbol_id;
            console.log(`Symbol ID for add watchlist ${stockSymbol}:`, symbolId);
            if (!symbolId) {
                throw new Error(`Symbol ID not found for ${stockSymbol}`);
            }
    
            // 2️⃣ Add the stock to the watchlist
            await axios.post(`http://localhost:8080/watchlistStocks/add`, {
                watchlistId: watchlistId,
                symbolId: symbolId
              });
    
            console.log(`✅ Added ${stockSymbol} (ID: ${symbolId}) to watchlist ${watchlistId}`);
        } catch (error) {
            console.error(`❌ Failed to add ${stockSymbol} to watchlist ${watchlistId}:`, error);
        }
    };
    useEffect(() => {
        axios.get(`http://localhost:8080/watchlist/getWatchlists`)
            .then(res => {
                const watchlists = res.data.map(wl => ({
                    id: wl.watchlistId,    
                    name: wl.watchlistName}
                ));
                console.log('Fetched watchlists:', res.data);
                setAvailableWatchlists(watchlists);})
            .catch(err => console.error("Error fetching watchlists:", err));    
    }, []);
    const handleAddToWatchlist = () => {
        if (selectedWatchlists.length === 0) {
            setErrors({ watchlist: 'Please select at least one watchlist' });
            return;
        }
    
        selectedWatchlists.forEach(id => {
            const watchlist = availableWatchlists.find(w => w.id === id);
            if (watchlist) {
                addToWatchlist(watchlist.id, symbol); // 👈 Call your function here
            }
        });
    
        const watchlistNames = selectedWatchlists
            .map(id => availableWatchlists.find(w => w.id === id)?.name)
            .join(', ');
    
        setSuccessMessage(`✅ Great! ${symbol} has been added to: ${watchlistNames}!`);
        setShowWatchlistForm(false);
        setSelectedWatchlists([]);
        setTimeout(() => setSuccessMessage(''), 10000);
    };
    

    const handleWatchlistToggle = (watchlistId) => {
        setSelectedWatchlists(prev => {
            if (prev.includes(watchlistId)) {
                return prev.filter(id => id !== watchlistId);
            } else {
                return [...prev, watchlistId];
            }
        });
        setErrors({});
    };

    const resetFormsAndState = (newType) => {
        setInvestmentType(newType);
        setQuantity('');
        setErrors({});
        setSuccessMessage('');
        setShowBuyForm(false);
        setShowSellForm(false);
        setShowWatchlistForm(false);
        setSelectedWatchlists([]);
    };

    return (
        <div className="stock-manipulation-container">
            <h3 className="stock-manipulation-title">
                Investment Options for {symbol}
            </h3>

            {/* User Info */}
            <div className="user-info-container">
                <span>
                    <strong className="balance-text">Balance: </strong>
                    {userBalance.loading ? "Loading balance..." : `$${userBalance.amount}`}
                </span>
                <span>
                    <strong>Holdings:</strong> {holdings !== null && holdings !== undefined ? holdings : "0"} shares
                </span>
                <span>
                    <strong>Current Price:</strong> ${currentPrice.toFixed(2)}
                </span>
            </div>

            {/* Investment Type Toggle */}
            <div className="investment-toggle-container">
                <div className="investment-toggle-wrapper">
                    <button
                        onClick={() => resetFormsAndState('SIP')}
                        className={`investment-toggle-btn ${investmentType === 'SIP' ? 'active' : 'inactive'}`}
                    >
                        SIP
                    </button>
                    <button
                        onClick={() => resetFormsAndState('Delivery')}
                        className={`investment-toggle-btn ${investmentType === 'Delivery' ? 'active' : 'inactive'}`}
                    >
                        Stock Delivery
                    </button>
                </div>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}

            {/* Error Messages */}
            {(errors.balance || errors.quantity || errors.watchlist || errors.sipAmount) && (
                <div className="error-container">
                    {errors.balance && <div>{errors.balance}</div>}
                    {errors.quantity && <div>{errors.quantity}</div>}
                    {errors.watchlist && <div>{errors.watchlist}</div>}
                    {errors.sipAmount && <div>{errors.sipAmount}</div>}
                </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons-container">
                {investmentType === 'SIP' ? (
                    <>
                        <button
                            onClick={() => {
                                setShowSIPForm(true);
                                setShowBuyForm(false);
                                setShowSellForm(false);
                                setShowWatchlistForm(false);
                                setSipAmount('');
                                setErrors({});
                                setSuccessMessage('');
                            }}
                            className="action-btn btn-buy"
                        >
                            Invest in SIP
                        </button>
                        <button
                            onClick={() => {
                                setShowWatchlistForm(true);
                                setShowBuyForm(false);
                                setShowSellForm(false);
                                setErrors({});
                            }}
                            className="action-btn btn-watchlist"
                        >
                            Add to Watchlist
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => {
                                setShowBuyForm(true);
                                setShowSellForm(false);
                                setQuantity('');
                                setErrors({});
                                setSuccessMessage('');
                            }}
                            className="action-btn btn-buy"
                        >
                            Buy
                        </button>
                        <button
                            onClick={() => {
                                setShowSellForm(true);
                                setShowBuyForm(false);
                                setQuantity('');
                                setErrors({});
                                setSuccessMessage('');
                            }}
                            className="action-btn btn-sell"
                        >
                            Sell
                        </button>
                        <button
                            onClick={() => {
                                setShowWatchlistForm(true);
                                setShowBuyForm(false);
                                setShowSellForm(false);
                                setErrors({});
                            }}
                            className="action-btn btn-watchlist"
                        >
                            Add to Watchlist
                        </button>
                    </>
                )}
            </div>

            {/* SIP Investment Form */}
            {showSIPForm && investmentType === 'SIP' && (
                <div className="form-container">
                    <h4 className="form-title">SIP Investment for {symbol}</h4>
                    <div className="mb-3">
                        <label className="form-label">
                            Investment Amount * (USD)
                        </label>
                        <input
                            type="number"
                            value={sipAmount}
                            onChange={(e) => setSipAmount(e.target.value)}
                            placeholder="Enter amount to invest (e.g., 1000)"
                            className="form-input"
                        />
                    </div>
                    <div className="form-info">
                        <p><strong>Current Price per share:</strong> ${currentPrice.toFixed(2)}</p>
                        {sipAmount && !isNaN(sipAmount) && parseFloat(sipAmount) > 0 && (
                            <>
                                <p><strong>Maximum shares you can buy:</strong> {Math.floor(parseFloat(sipAmount) / currentPrice)} shares</p>
                                <p><strong>Cost for maximum shares:</strong> ${(Math.floor(parseFloat(sipAmount) / currentPrice) * currentPrice).toFixed(2)}</p>
                                {parseFloat(sipAmount) % currentPrice > 0 && (
                                    <p className="remaining-amount">
                                        <strong>Remaining amount to be returned:</strong> ${(parseFloat(sipAmount) - (Math.floor(parseFloat(sipAmount) / currentPrice) * currentPrice)).toFixed(2)}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                    <div className="form-buttons">
                        <button onClick={handleSIPBuy} className="btn-confirm">
                            Confirm SIP Investment
                        </button>
                        <button onClick={clearForms} className="btn-cancel">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Buy Form for Stock Delivery */}
            {showBuyForm && investmentType === 'Delivery' && (
                <div className="form-container">
                    <h4 className="form-title">Buy {symbol}</h4>
                    <div className="mb-3">
                        <label className="form-label">
                            Quantity *
                        </label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Enter quantity"
                            className="form-input"
                        />
                    </div>
                    <div className="form-info">
                        <p><strong>Price per share:</strong> ${currentPrice.toFixed(2)}</p>
                        {quantity && !isNaN(quantity) && parseFloat(quantity) > 0 && (
                            <p><strong>Total Cost:</strong> ${(parseFloat(quantity) * currentPrice).toFixed(2)}</p>
                        )}
                    </div>
                    <div className="form-buttons">
                        <button onClick={handleBuy} className="btn-confirm">
                            Confirm Buy
                        </button>
                        <button onClick={clearForms} className="btn-cancel">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Sell Form for Stock Delivery */}
            {showSellForm && investmentType === 'Delivery' && (
                <div className="form-container">
                    <h4 className="form-title">Sell {symbol}</h4>
                    <div className="mb-3">
                        <label className="form-label">
                            Quantity
                        </label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Enter quantity to sell"
                            max={userStockMoney}
                            className="form-input"
                        />
                    </div>
                    <div className="form-info">
                        <p><strong>Price per share:</strong> ${currentPrice.toFixed(2)}</p>
                        {quantity && !isNaN(quantity) && parseFloat(quantity) > 0 && (
                            <p><strong>Total Earnings:</strong> ${(parseFloat(quantity) * currentPrice).toFixed(2)}</p>
                        )}
                    </div>
                    <div className="form-buttons">
                        <button onClick={handleSell} className="btn-confirm sell">
                            Confirm Sell
                        </button>
                        <button onClick={clearForms} className="btn-cancel">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Watchlist Selection Form */}
            {showWatchlistForm && (
                <div className="form-container">
                    <h4 className="form-title">Add {symbol} to Watchlists</h4>
                    <div className="mb-3">
                        <label className="form-label">
                            Select one or more watchlists: *
                        </label>
                        <div className="watchlist-container">
                            {availableWatchlists.map((watchlist) => (
                                <div
                                    key={watchlist.id}
                                    className={`watchlist-item ${selectedWatchlists.includes(watchlist.id) ? 'selected' : ''}`}
                                    onClick={() => handleWatchlistToggle(watchlist.id)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedWatchlists.includes(watchlist.id)}
                                        onChange={() => handleWatchlistToggle(watchlist.id)}
                                        className="watchlist-checkbox"
                                    />
                                    <div>
                                        <div className="watchlist-name">
                                            {watchlist.name}
                                        </div>
                                        <div className="watchlist-description">
                                            {watchlist.description}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {selectedWatchlists.length > 0 && (
                            <div className="selected-count">
                                Selected: {selectedWatchlists.length} watchlist{selectedWatchlists.length > 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                    <div className="form-buttons">
                        <button
                            onClick={handleAddToWatchlist}
                            className={`btn-confirm ${selectedWatchlists.length === 0 ? 'btn-disabled' : ''}`}
                        >
                            Add to Selected Watchlists
                        </button>
                        <button onClick={clearForms} className="btn-cancel">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}