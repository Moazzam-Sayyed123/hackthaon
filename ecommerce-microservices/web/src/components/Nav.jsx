
import React from "react";
import { Link, useLocation } from "react-router-dom";

const linkStyle = isActive => ({
  marginRight: 12, textDecoration: "none", color: isActive ? "#0b5" : "#06c", fontWeight: isActive ? 700 : 500
});

export default function Nav() {
  const { pathname } = useLocation();
  return (
    <div style={{ marginBottom: 12 }}>
      <Link style={linkStyle(pathname === "/products")} to="/products">Products</Link>
      <Link style={linkStyle(pathname === "/auto-order")} to="/auto-order">Auto Order</Link>
    </div>
  );
}
