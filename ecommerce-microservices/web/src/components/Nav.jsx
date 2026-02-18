
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Nav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return null;
  }

  const isVendor = user.role === "vendor";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/home">
          <i className="bi bi-shop"></i> E-Commerce
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${pathname === "/home" ? "active" : ""}`} 
                to="/home"
              >
                <i className="bi bi-shop"></i> Shop
              </Link>
            </li>

            {isVendor && (
              <li className="nav-item">
                <Link 
                  className={`nav-link ${pathname === "/products" ? "active" : ""}`} 
                  to="/products"
                >
                  <i className="bi bi-boxes"></i> My Products
                </Link>
              </li>
            )}

            {!isVendor && (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${pathname === "/auto-order" ? "active" : ""}`} 
                    to="/auto-order"
                  >
                    <i className="bi bi-lightning-charge"></i> Auto Orders
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${pathname === "/orders" ? "active" : ""}`} 
                    to="/orders"
                  >
                    <i className="bi bi-bag"></i> Orders
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${pathname === "/profile" ? "active" : ""}`} 
                    to="/profile"
                  >
                    <i className="bi bi-person"></i> Profile
                  </Link>
                </li>
              </>
            )}

            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                id="userDropdown" 
                role="button" 
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-person-circle"></i> {user.name}
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><span className="dropdown-item-text small">{user.email}</span></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
