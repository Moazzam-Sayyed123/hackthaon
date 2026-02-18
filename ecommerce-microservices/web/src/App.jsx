
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Nav from "./components/Nav.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import EditProduct from "./pages/EditProduct.jsx";
import AutoOrder from "./pages/AutoOrder.jsx";
import PriceHistory from "./pages/PriceHistory.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import Orders from "./pages/Orders.jsx";

function AppContent() {
  const { user, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <Nav />
      <Routes future={{ v7_startTransition: true }}>
        <Route path="/" element={!user ? <Login /> : <Navigate to="/home" />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
        <Route path="/products" element={user && user.role === "vendor" ? <Products /> : <Navigate to="/" />} />
        <Route path="/products/:id/edit" element={user && user.role === "vendor" ? <EditProduct /> : <Navigate to="/" />} />
        <Route path="/auto-order" element={user && user.role === "user" ? <AutoOrder /> : <Navigate to="/" />} />
        <Route path="/price-history" element={user && user.role === "user" ? <PriceHistory /> : <Navigate to="/" />} />
        <Route path="/profile" element={user && user.role === "user" ? <UserProfile /> : <Navigate to="/" />} />
        <Route path="/orders" element={user && user.role === "user" ? <Orders /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
