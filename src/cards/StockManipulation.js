import React, { useState, useEffect } from "react";
import bootstrap from "bootstrap/dist/css/bootstrap.min.css";

export default function StockManipulation({ symbol = "AAPL", currentPrice = 150.25 }) {
    const [investmentType, setInvestmentType] = useState('SIP'); // 'SIP' or 'Delivery'
    const [showBuyForm, setShowBuyForm] = useState(false);
    const [showSellForm, setShowSellForm] = useState(false);
    const [quantity, setQuantity] = useState('');
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    
    // Mock user data - in real app, this would come from API/context
    const [userBalance, setUserBalance] = useState(10000); // User's available balance
    const [userHoldings, setUserHoldings] = useState(50); // User's current holdings of this stock

    const clearForms = () => {
        setQuantity('');
        setErrors({});
        setShowBuyForm(false);
        setShowSellForm(false);
        // Don't clear success message here - let it display
    };

    const validateQuantity = (qty, isForSelling = false) => {
        const newErrors = {};
        
        if (!qty || qty.trim() === '') {
            newErrors.quantity = 'Quantity is required';
        } else if (isNaN(qty) || parseFloat(qty) <= 0) {
            newErrors.quantity = 'Quantity must be a positive number';
        } else if (isForSelling && parseFloat(qty) > userHoldings) {
            newErrors.quantity = `Cannot sell more than ${userHoldings} shares you own`;
        }
        
        return newErrors;
    };

    const handleSIPBuy = () => {
        // For SIP, buy 1 share at current price
        const totalCost = currentPrice;
        if (totalCost > userBalance) {
            setErrors({ balance: `Insufficient balance. Required: $${totalCost.toFixed(2)}, Available: $${userBalance.toFixed(2)}` });
            return;
        }
        
        setUserBalance(prev => prev - totalCost);
        setUserHoldings(prev => prev + 1);
        setSuccessMessage(`🎉 Congratulations! You successfully bought 1 share of ${symbol} for $${totalCost.toFixed(2)}!`);
        setTimeout(() => setSuccessMessage(''), 10000);
    };

    const handleBuy = () => {
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
        
        setUserBalance(prev => prev - totalCost);
        setUserHoldings(prev => prev + qty);
        clearForms(); // Clear forms first
        setSuccessMessage(`🎉 Congratulations! You successfully bought ${qty} shares of ${symbol} for $${totalCost.toFixed(2)}!`);
        setTimeout(() => setSuccessMessage(''), 10000);
    };

    const handleSell = () => {
        const validationErrors = validateQuantity(quantity, true);
        const qty = parseFloat(quantity);
        const totalEarnings = qty * currentPrice;
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        setUserBalance(prev => prev + totalEarnings);
        setUserHoldings(prev => prev - qty);
        clearForms(); // Clear forms first
        setSuccessMessage(`🎉 Congratulations! You successfully sold ${qty} shares of ${symbol} for $${totalEarnings.toFixed(2)}!`);
        setTimeout(() => setSuccessMessage(''), 10000);
    };

    const handleAddToWatchlist = () => {
        setSuccessMessage(`✅ Great! ${symbol} has been added to your watchlist successfully!`);
        setTimeout(() => setSuccessMessage(''), 10000);
    };

    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '25px',
            margin: '20px 0',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
        }}>
            <h3 style={{
                margin: '0 0 20px 0',
                color: '#113F67',
                fontSize: '1.4rem',
                fontWeight: '700',
                textAlign: 'center'
            }}>
                Investment Options for {symbol}
            </h3>

            {/* User Info */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '20px',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                fontSize: '0.9rem'
            }}>
                <span><strong>Balance:</strong> ${userBalance.toFixed(2)}</span>
                <span><strong>Holdings:</strong> {userHoldings} shares</span>
                <span><strong>Current Price:</strong> ${currentPrice.toFixed(2)}</span>
            </div>

            {/* Investment Type Toggle */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '25px'
            }}>
                <div style={{
                    display: 'flex',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    padding: '4px'
                }}>
                    <button
                        onClick={() => {
                            setInvestmentType('SIP');
                            setQuantity('');
                            setErrors({});
                            setSuccessMessage('');
                            setShowBuyForm(false);
                            setShowSellForm(false);
                        }}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: investmentType === 'SIP' ? '#113F67' : 'transparent',
                            color: investmentType === 'SIP' ? 'white' : '#6b7280',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        SIP
                    </button>
                    <button
                        onClick={() => {
                            setInvestmentType('Delivery');
                            setQuantity('');
                            setErrors({});
                            setSuccessMessage('');
                            setShowBuyForm(false);
                            setShowSellForm(false);
                        }}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: investmentType === 'Delivery' ? '#113F67' : 'transparent',
                            color: investmentType === 'Delivery' ? 'white' : '#6b7280',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Stock Delivery
                    </button>
                </div>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div style={{
                    padding: '12px',
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    border: '1px solid #c3e6cb',
                    borderRadius: '6px',
                    marginBottom: '20px',
                    textAlign: 'center',
                    fontWeight: '500'
                }}>
                    {successMessage}
                </div>
            )}

            {/* Error Messages */}
            {(errors.balance || errors.quantity) && (
                <div style={{
                    padding: '12px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    border: '1px solid #f5c6cb',
                    borderRadius: '6px',
                    marginBottom: '20px'
                }}>
                    {errors.balance && <div>{errors.balance}</div>}
                    {errors.quantity && <div>{errors.quantity}</div>}
                </div>
            )}

            {/* Action Buttons */}
            <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                {investmentType === 'SIP' ? (
                    <>
                        <button
                            onClick={handleSIPBuy}
                            style={{
                                padding: '12px 25px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                        >
                            Buy (SIP) - ${currentPrice.toFixed(2)}
                        </button>
                        <button
                            onClick={handleAddToWatchlist}
                            style={{
                                padding: '12px 25px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
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
                            style={{
                                padding: '12px 25px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
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
                            style={{
                                padding: '12px 25px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                        >
                            Sell
                        </button>
                        <button
                            onClick={handleAddToWatchlist}
                            style={{
                                padding: '12px 25px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
                        >
                            Add to Watchlist
                        </button>
                    </>
                )}
            </div>

            {/* Buy Form for Stock Delivery */}
            {showBuyForm && investmentType === 'Delivery' && (
                <div style={{
                    marginTop: '25px',
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #dee2e6'
                }}>
                    <h4 style={{ color: '#113F67', marginBottom: '15px' }}>Buy {symbol}</h4>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                            Quantity *
                        </label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Enter quantity"
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <p><strong>Price per share:</strong> ${currentPrice.toFixed(2)}</p>
                        {quantity && !isNaN(quantity) && parseFloat(quantity) > 0 && (
                            <p><strong>Total Cost:</strong> ${(parseFloat(quantity) * currentPrice).toFixed(2)}</p>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={handleBuy}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Confirm Buy
                        </button>
                        <button
                            onClick={clearForms}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Sell Form for Stock Delivery */}
            {showSellForm && investmentType === 'Delivery' && (
                <div style={{
                    marginTop: '25px',
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #dee2e6'
                }}>
                    <h4 style={{ color: '#113F67', marginBottom: '15px' }}>Sell {symbol}</h4>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                            Quantity * (Max: {userHoldings})
                        </label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Enter quantity to sell"
                            max={userHoldings}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <p><strong>Price per share:</strong> ${currentPrice.toFixed(2)}</p>
                        {quantity && !isNaN(quantity) && parseFloat(quantity) > 0 && (
                            <p><strong>Total Earnings:</strong> ${(parseFloat(quantity) * currentPrice).toFixed(2)}</p>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={handleSell}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Confirm Sell
                        </button>
                        <button
                            onClick={clearForms}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}