
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Products() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ title: "", price: "", quantity: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const load = async () => {
    const res = await fetch("/api/seller/products");
    setList(await res.json());
  };
  useEffect(() => { load(); }, []);

  const addProduct = async e => {
    e.preventDefault();
    setLoading(true);
    
    const url = editingId ? `/api/seller/products/${editingId}` : "/api/seller/products";
    const method = editingId ? "PUT" : "POST";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price), quantity: Number(form.quantity) })
    });
    
    setForm({ title: "", price: "", quantity: "" });
    setEditingId(null);
    setShowModal(false);
    setLoading(false);
    load();
  };

  const openEditModal = (product) => {
    setForm({ title: product.title, price: product.price, quantity: product.quantity || "" });
    setEditingId(product.id);
    setShowModal(true);
  };

  const deleteProduct = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await fetch(`/api/seller/products/${id}`, { method: "DELETE" });
      load();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ title: "", price: "", quantity: "" });
  };

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col-md-12">
          <h1 className="mb-4"><i className="bi bi-shop"></i> Manage Products</h1>
          <p className="text-muted">Add new products to your catalog (Seller Service)</p>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-8">
          <button 
            className="btn btn-success mb-3" 
            onClick={() => {
              setForm({ sku: "", title: "", price: "" });
              setEditingId(null);
              setShowModal(true);
            }}
          >
            <i className="bi bi-plus-circle"></i> Add New Product
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <h5 className="mb-3">Product Catalog ({list.length})</h5>
          {list.length === 0 ? (
            <div className="alert alert-info">No products yet. Add one above!</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Price (₹)</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(p => (
                    <tr key={p.id}>
                      <td><span className="badge bg-secondary">{p.id}</span></td>
                      <td><strong>{p.title}</strong></td>
                      <td><span className="text-success">₹{p.price.toFixed(2)}</span></td>
                      <td><span className="badge bg-info">{p.quantity || 0}</span></td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary me-2" 
                          onClick={() => openEditModal(p)}
                        >
                          <i className="bi bi-pencil"></i> Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          onClick={() => deleteProduct(p.id)}
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

      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingId ? "Edit Product" : "Add New Product"}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={addProduct}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input 
                      type="text"
                      className="form-control" 
                      required 
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price (₹)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="form-control" 
                      required 
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Stock Quantity</label>
                    <input 
                      type="number" 
                      min="0"
                      className="form-control" 
                      required 
                      value={form.quantity}
                      onChange={e => setForm({ ...form, quantity: e.target.value })}
                    />
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={loading}
                    >
                      {loading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
