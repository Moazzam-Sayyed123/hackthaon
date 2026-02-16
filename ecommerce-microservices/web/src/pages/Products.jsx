
import React, { useEffect, useState } from "react";

export default function Products() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ sku: "", title: "", price: "" });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch("/api/seller/products");
    setList(await res.json());
  };
  useEffect(() => { load(); }, []);

  const addProduct = async e => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/seller/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price) })
    });
    setForm({ sku: "", title: "", price: "" });
    setLoading(false);
    load();
  };

  return (
    <div>
      <h2>Products (Seller Service)</h2>
      <form onSubmit={addProduct} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input placeholder="SKU" required value={form.sku}
               onChange={e => setForm({ ...form, sku: e.target.value })} />
        <input placeholder="Title" required value={form.title}
               onChange={e => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Price" type="number" step="0.01" required value={form.price}
               onChange={e => setForm({ ...form, price: e.target.value })} />
        <button disabled={loading}>{loading ? "Adding..." : "Add"}</button>
      </form>

      <table border="1" cellPadding="6">
        <thead><tr><th>ID</th><th>SKU</th><th>Title</th><th>Price (₹)</th></tr></thead>
        <tbody>
          {list.map(p => (
            <tr key={p.id}><td>{p.id}</td><td>{p.sku}</td><td>{p.title}</td><td>{p.price}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
