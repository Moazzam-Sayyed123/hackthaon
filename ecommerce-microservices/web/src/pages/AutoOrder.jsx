import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
// If you use Bootstrap Icons, ensure the CSS is imported somewhere globally:
// import "bootstrap-icons/font/bootstrap-icons.css";

export default function AutoOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [rules, setRules] = useState([]);

  const [form, setForm] = useState({
    productId: location.state?.selectedProductId || "",
    priceMin: "",
    priceMax: "",
    qty: 1,
    cap: 999999, // High default cap for backend
  });

  const [selectedProductTitle, setSelectedProductTitle] = useState(
    location.state?.selectedProductTitle || ""
  );
  const [resultModal, setResultModal] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "user") {
      navigate("/");
      return;
    }
    // Load only when user passes the check
    loadProducts();
    loadRules();
    // include navigate in deps to satisfy eslint react-hooks/exhaustive-deps
  }, [user, navigate]);

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/seller/products");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  const loadRules = async () => {
    try {
      const res = await fetch("/api/buyer/auto-orders");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load rules:", err);
    }
  };

  const createRule = async (e) => {
    e.preventDefault();

    // Basic client validation
    const priceMinNum = Number(form.priceMin);
    const priceMaxNum = Number(form.priceMax);
    const qtyNum = Number(form.qty);

    if (Number.isNaN(priceMinNum) || Number.isNaN(priceMaxNum) || Number.isNaN(qtyNum)) {
      alert("Please enter valid numeric values.");
      return;
    }
    if (priceMinNum > priceMaxNum) {
      alert("Minimum price cannot be greater than maximum price.");
      return;
    }
    if (!form.productId) {
      alert("Please select a product.");
      return;
    }

    try {
      const res = await fetch("/api/buyer/auto-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          productId: Number(form.productId),
          productTitle: selectedProductTitle,
          priceMin: priceMinNum,
          priceMax: priceMaxNum,
          qty: qtyNum,
          cap: 999999, // High default cap
        }),
      });

      if (!res.ok) {
        const msg = await safeReadText(res);
        throw new Error(msg || `HTTP ${res.status}`);
      }

      setForm({ productId: "", priceMin: "", priceMax: "", qty: 1, cap: 999999 });
      setSelectedProductTitle("");
      await loadRules();
      alert("Auto-order rule created successfully!");
    } catch (err) {
      alert("Error creating rule: " + err.message);
    }
  };

  const trigger = async (id) => {
    try {
      const res = await fetch(`/api/buyer/auto-orders/${id}/trigger`, {
        method: "POST",
      });
      if (!res.ok) {
        const msg = await safeReadText(res);
        throw new Error(msg || `HTTP ${res.status}`);
      }
      const out = await res.json();
      setResultModal(out);
    } catch (err) {
      alert("Error triggering order: " + err.message);
    }
  };

  const deleteRule = async (id) => {
    if (window.confirm("Delete this auto-order rule?")) {
      try {
        const res = await fetch(`/api/buyer/auto-orders/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          await loadRules();
          alert("Rule deleted successfully!");
        } else {
          alert("Failed to delete rule");
        }
      } catch (err) {
        alert("Error: " + err.message);
      }
    }
  };

  // Helper to read text safely from a non-JSON error response
  const safeReadText = async (res) => {
    try {
      return await res.text();
    } catch {
      return "";
    }
  };

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col-md-12">
          <h1 className="mb-2">
            <i className="bi bi-lightning-charge"></i> Auto-Order Rules
          </h1>
          <p className="text-muted">
            Create rules to automatically order products when prices match (Buyer Service)
          </p>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Create New Auto-Order Rule</h5>
              <form onSubmit={createRule}>
                <div className="mb-3">
                  <label className="form-label">Select Product</label>
                  <select
                    className="form-select"
                    required
                    value={form.productId}
                    onChange={(e) => {
                      const selected = products.find((p) => String(p.id) === e.target.value);
                      setForm({ ...form, productId: e.target.value });
                      setSelectedProductTitle(selected ? selected.title : "");
                    }}
                  >
                    <option value="">-- Choose a Product --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (₹{Number(p.price).toFixed?.(2) ?? p.price})
                      </option>
                    ))}
                  </select>
                  {selectedProductTitle && (
                    <small className="text-muted">Selected: {selectedProductTitle}</small>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Minimum Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      required
                      value={form.priceMin}
                      onChange={(e) => setForm({ ...form, priceMin: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Maximum Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      required
                      value={form.priceMax}
                      onChange={(e) => setForm({ ...form, priceMax: e.target.value })}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      required
                      value={form.qty}
                      onChange={(e) => setForm({ ...form, qty: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-success w-100">
                  <i className="bi bi-check-circle"></i> Create Rule
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <h5 className="mb-3">Your Auto-Order Rules ({rules.length})</h5>
          {rules.length === 0 ? (
            <div className="alert alert-info">No rules created yet. Create one above!</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Rule ID</th>
                    <th>Product Title</th>
                    <th>Price Range</th>
                    <th>Qty</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <span className="badge bg-info">{r.id}</span>
                      </td>
                      <td><strong>{r.productTitle || "N/A"}</strong></td>
                      <td>
                        ₹{Number(r.priceMin).toFixed(2)} – ₹{Number(r.priceMax).toFixed(2)}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">{r.qty}</span>
                      </td>
                      <td>
                        <span className={`badge ${r.status === "active" ? "bg-success" : "bg-secondary"}`}>
                          {r.status || "active"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => trigger(r.id)}
                        >
                          <i className="bi bi-play-circle"></i> Initiate
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteRule(r.id)}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {resultModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Trigger Result</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setResultModal(null)}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div
                  className={`alert ${
                    resultModal.status === "ordered" ? "alert-success" : "alert-warning"
                  }`}
                >
                  <strong>
                    {resultModal.status === "ordered" ? "✓ Order Placed" : "⚠ Order Blocked"}
                  </strong>
                </div>
                {resultModal.reason && (
                  <p>
                    <strong>Reason:</strong> {resultModal.reason}
                  </p>
                )}
                {"unitPrice" in resultModal && (
                  <p>
                    <strong>Unit Price:</strong> ₹{Number(resultModal.unitPrice).toFixed(2)}
                  </p>
                )}
                {"total" in resultModal && (
                  <p>
                    <strong>Total:</strong> ₹{Number(resultModal.total).toFixed(2)}
                  </p>
                )}
                {resultModal.orderId && (
                  <p>
                    <strong>Order ID:</strong> {resultModal.orderId}
                  </p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => setResultModal(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
