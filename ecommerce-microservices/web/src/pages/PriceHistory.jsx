import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PriceHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const product = location.state?.product;

  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "user") {
      navigate("/", { replace: true });
      return;
    }

    if (!product) {
      navigate("/home", { replace: true });
      return;
    }

    loadPriceHistory();
  }, [product, user, navigate]);

  const loadPriceHistory = async () => {
    try {
      const res = await fetch(`/api/getPriceHistory/${product.id}`);
      if (!res.ok) {
        setError("Failed to load price history");
        setPrices([]);
        return;
      }
      const data = await res.json();
      setPrices(data.prices || []);
    } catch (err) {
      console.error("Error loading price history:", err);
      setError("Failed to load price history");
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "user" || !product) {
    return null;
  }

  return (
    <div className="container mt-4 mb-5">
      {/* Page Title */}
      <div className="mb-4">
        <h2 className="mb-3">Price History</h2>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate("/home")}>
          Back to Shop
        </button>
      </div>

      {/* Product Info */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text mb-0">
            <strong>Current Price:</strong> ₹{Number(product.price).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Prices List */}
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h6 className="mb-0">Price History</h6>
        </div>
        <div className="card-body">
          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : prices.length === 0 ? (
            <p className="text-muted">No price history available.</p>
          ) : (
            <div className="list-group">
              {prices.map((price, idx) => (
                <div key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>Price Record {idx + 1}</span>
                  <span className="badge bg-info">₹{Number(price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}