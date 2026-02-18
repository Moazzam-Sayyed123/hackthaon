import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
// If you use Bootstrap Icons, ensure this is imported once in your app entry:
// import "bootstrap-icons/font/bootstrap-icons.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      loadProducts();
    }
    // include navigate in deps
  }, [user, navigate]);

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/seller/products");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        const res = await fetch(`/api/seller/products/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await loadProducts();
      } catch (err) {
        alert("Failed to delete product: " + err.message);
      }
    }
  };

  const handleAutoOrder = (product) => {
    navigate("/auto-order", {
      state: {
        selectedProductId: product.id,
        selectedProductTitle: product.title,
      },
    });
  };

  const isVendor = user?.role === "vendor";

  return (
    <div
      className="container-fluid"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", paddingTop: 20 }}
    >
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="mb-2">
            <i className="bi bi-shop"></i> Shop
          </h1>
          <p className="text-muted">
            {isVendor ? "Manage your products" : "Browse and purchase products"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="alert alert-info">No products available.</div>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div
                className="card h-100 shadow-sm hover-shadow"
                style={{ cursor: "pointer", transition: "all 0.3s" }}
              >
                <div
                  style={{
                    height: 200,
                    backgroundColor: "#e9ecef",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                    fontSize: "14px",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <i
                      className="bi bi-box"
                      style={{ fontSize: "3em", display: "block", marginBottom: "8px" }}
                    ></i>
                    <small>Product Image</small>
                  </div>
                </div>

                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="text-muted small mb-2">
                    Stock: <span className="badge bg-info">{product.quantity || 0} units</span>
                  </p>
                  <p className="card-text text-success fw-bold" style={{ fontSize: "1.5em" }}>
                    ₹{Number(product.price).toFixed(2)}
                  </p>
                </div>

                <div className="card-footer bg-white border-top">
                  {isVendor ? (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary flex-grow-1"
                        onClick={() =>
                          navigate(`/products/${product.id}/edit`, { state: { product } })
                        }
                      >
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteProduct(product.id)}
                      >
                        <i className="bi bi-trash">Delete</i>
                      </button>
                    </div>
                  ) : (
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => {
                          alert(`Added ₹${Number(product.price).toFixed(2)} to cart`);
                        }}
                      >
                        <i className="bi bi-bag-check"></i> Buy Now
                      </button>
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => navigate("/price-history", { state: { product } })}
                        title="View price history"
                      >
                        <i className="bi bi-graph-up"></i> Price History
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleAutoOrder(product)}
                        title="Auto-order"
                      >
                        <i className="bi bi-lightning-charge"></i> Auto Order
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
