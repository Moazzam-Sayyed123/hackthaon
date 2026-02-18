import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PriceHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const product = location.state?.product;

  const [priceHistory, setPriceHistory] = useState([]);
  const [stats, setStats] = useState(null);

  if (!user || user.role !== "user") {
    navigate("/");
    return null;
  }

  if (!product) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Product not found. Please select a product first.</div>
        <button className="btn btn-primary" onClick={() => navigate("/home")}>
          Back to Shop
        </button>
      </div>
    );
  }

  useEffect(() => {
    loadPriceHistory();
  }, [product.id]);

  const loadPriceHistory = async () => {
    try {
      const res = await fetch(`/api/price-history/product/${product.id}`);
      if (res.ok) {
        const data = await res.json();
        
        if (data && data.length > 0) {
          // Use actual database records
          const sortedData = data.sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt));
          setPriceHistory(sortedData);
          
          // Calculate statistics
          const prices = sortedData.map(h => Number(h.price));
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
          const currentPrice = Number(product.price);
          
          setStats({
            minPrice,
            maxPrice,
            avgPrice,
            currentPrice,
            lowestPossible: Math.round(minPrice * 0.95 * 100) / 100,
            recommendedMin: Math.round(avgPrice * 0.9 * 100) / 100,
            recommendedMax: Math.round(avgPrice * 1.1 * 100) / 100,
          });
          return;
        }
      }
    } catch (err) {
      console.error("Failed to load price history:", err);
    }

    // Fallback to mock data if no database records
    generateMockPriceHistory();
  };

  const generateMockPriceHistory = () => {
    const historyData = [];
    const today = new Date();
    const currentPrice = Number(product.price);
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simulate price variations (±15% around current price)
      const variation = (Math.random() - 0.5) * 0.3; // -15% to +15%
      const historicalPrice = currentPrice * (1 + variation);
      
      historyData.push({
        recordedAt: date.toISOString(),
        price: historicalPrice,
        change: ((historicalPrice - currentPrice) / currentPrice * 100).toFixed(2)
      });
    }
    
    setPriceHistory(historyData);
    
    // Calculate statistics
    const prices = historyData.map(h => h.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    
    setStats({
      minPrice,
      maxPrice,
      avgPrice,
      currentPrice,
      lowestPossible: Math.round(minPrice * 0.95 * 100) / 100,
      recommendedMin: Math.round(avgPrice * 0.9 * 100) / 100,
      recommendedMax: Math.round(avgPrice * 1.1 * 100) / 100,
    });
  };

  const handleSetAutoOrder = () => {
    navigate("/auto-order", {
      state: {
        selectedProductId: product.id,
        selectedProductTitle: product.title,
        suggestedMin: stats.recommendedMin,
        suggestedMax: stats.recommendedMax,
      },
    });
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row mb-4">
        <div className="col-md-12">
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate("/home")}
          >
            <i className="bi bi-arrow-left"></i> Back to Shop
          </button>
          <h1 className="mb-2">
            <i className="bi bi-graph-up"></i> Price History
          </h1>
          <p className="text-muted">
            Historical price data for <strong>{product.title}</strong>
          </p>
        </div>
      </div>

      {stats && (
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card bg-light shadow-sm">
              <div className="card-body">
                <h6 className="card-title text-muted">Current Price</h6>
                <h3 className="text-primary">
                  ₹{stats.currentPrice.toFixed(2)}
                </h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-light shadow-sm">
              <div className="card-body">
                <h6 className="card-title text-muted">Lowest Price (30 days)</h6>
                <h3 className="text-success">
                  ₹{stats.minPrice.toFixed(2)}
                </h3>
                <small className="text-muted">
                  {((stats.currentPrice - stats.minPrice) / stats.currentPrice * 100).toFixed(1)}% above lowest
                </small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-light shadow-sm">
              <div className="card-body">
                <h6 className="card-title text-muted">Highest Price (30 days)</h6>
                <h3 className="text-danger">
                  ₹{stats.maxPrice.toFixed(2)}
                </h3>
                <small className="text-muted">
                  {((stats.maxPrice - stats.currentPrice) / stats.currentPrice * 100).toFixed(1)}% above current
                </small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-light shadow-sm">
              <div className="card-body">
                <h6 className="card-title text-muted">Average Price (30 days)</h6>
                <h3 className="text-warning">
                  ₹{stats.avgPrice.toFixed(2)}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-lightbulb"></i> Recommended Auto-Order Price Range
              </h5>
            </div>
            <div className="card-body">
              {stats && (
                <div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <h6>Recommended Minimum Price: <span className="text-success fw-bold">₹{stats.recommendedMin.toFixed(2)}</span></h6>
                      <small className="text-muted">
                        10% below the 30-day average. Orders will trigger below this price.
                      </small>
                    </div>
                    <div className="col-md-6">
                      <h6>Recommended Maximum Price: <span className="text-danger fw-bold">₹{stats.recommendedMax.toFixed(2)}</span></h6>
                      <small className="text-muted">
                        10% above the 30-day average. Orders will not exceed this price.
                      </small>
                    </div>
                  </div>
                  <button
                    className="btn btn-success w-100"
                    onClick={handleSetAutoOrder}
                  >
                    <i className="bi bi-lightning-charge"></i> Create Auto-Order with Suggested Range
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">
                <i className="bi bi-calendar3"></i> Price History (Last 30 Days)
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-sm">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Price</th>
                      <th>Change from Current</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceHistory.map((entry, idx) => {
                      const entryPrice = Number(entry.price);
                      const currentPrice = stats?.currentPrice || entryPrice;
                      const change = ((entryPrice - currentPrice) / currentPrice * 100).toFixed(2);
                      const displayDate = entry.recordedAt ? new Date(entry.recordedAt).toLocaleDateString("en-IN") : entry.date;
                      
                      return (
                        <tr key={idx} className={Number(change) < 0 ? "table-success" : "table-danger"}>
                          <td className="fw-bold">{displayDate}</td>
                          <td>₹{entryPrice.toFixed(2)}</td>
                          <td>
                            {Number(change) < 0 ? (
                              <span className="text-success">
                                <i className="bi bi-arrow-down"></i> {change}%
                              </span>
                            ) : (
                              <span className="text-danger">
                                <i className="bi bi-arrow-up"></i> +{change}%
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
