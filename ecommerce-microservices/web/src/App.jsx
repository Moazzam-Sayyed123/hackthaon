
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Products from "./pages/Products.jsx";
import AutoOrder from "./pages/AutoOrder.jsx";

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<Products />} />
        <Route path="/auto-order" element={<AutoOrder />} />
      </Routes>
    </div>
  );
}
