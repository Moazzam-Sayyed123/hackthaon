
import React, { useEffect, useState } from "react";

export default function AutoOrder() {
  const [products, setProducts] = useState([]);
  const [rules, setRules] = useState([]);
  const [form, setForm] = useState({ productId: "", priceMin: "", priceMax: "", qty: 1, cap: "" });

  const loadProducts = async () => {
    const res = await fetch("/api/seller/products");
    setProducts(await res.json());
  };
  const loadRules = async () => {
    const res = await fetch("/api/buyer/auto-orders");
    setRules(await res.json());
  };
  useEffect(() => { loadProducts(); loadRules(); }, []);

  const createRule = async e => {
    e.preventDefault();
    await fetch("/api/buyer/auto-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        productId: Number(form.productId),
        priceMin: Number(form.priceMin),
        priceMax: Number(form.priceMax),
        qty: Number(form.qty),
        cap: Number(form.cap)
      })
    });
    setForm({ productId: "", priceMin: "", priceMax: "", qty: 1, cap: "" });
    loadRules();
  };

  const trigger = async id => {
    const res = await fetch(`/api/buyer/auto-orders/${id}/trigger`, { method: "POST" });
    const out = await res.json();
    alert(JSON.stringify(out, null, 2));
  };

  return (
    <div>
      <h2>Auto Order (Buyer Service)</h2>

      <form onSubmit={createRule} style={{ display: "grid", gap: 8, maxWidth: 500 }}>
        <select required value={form.productId}
                onChange={e => setForm({ ...form, productId: e.target.value })}>
          <option value="">-- Select Product --</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.title} (₹{p.price})</option>)}
        </select>

        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="Min Price" type="number" step="0.01" required
                 value={form.priceMin} onChange={e => setForm({ ...form, priceMin: e.target.value })} />
          <input placeholder="Max Price" type="number" step="0.01" required
                 value={form.priceMax} onChange={e => setForm({ ...form, priceMax: e.target.value })} />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="Qty" type="number" min="1" required
                 value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} />
          <input placeholder="Cap (₹)" type="number" step="0.01" required
                 value={form.cap} onChange={e => setForm({ ...form, cap: e.target.value })} />
        </div>

        <button>Create Auto-Order Rule</button>
      </form>

      <h3 style={{ marginTop: 16 }}>My Auto-Order Rules</h3>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Rule ID</th><th>Product</th><th>Range (₹)</th><th>Qty</th><th>Cap (₹)</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rules.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.productId}</td>
              <td>{r.priceMin} – {r.priceMax}</td>
              <td>{r.qty}</td>
              <td>{r.cap}</td>
              <td><button onClick={() => trigger(r.id)}>Simulate Trigger</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
