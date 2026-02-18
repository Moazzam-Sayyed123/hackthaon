import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user || user.role === "vendor") {
      navigate("/");
    } else {
      // Simulate fetching orders
      const mockOrders = [
        {
          id: "ORD001",
          date: "2026-02-15",
          items: [{ name: "Laptop", price: 45000, qty: 1 }],
          total: 45000,
          status: "Delivered"
        },
        {
          id: "ORD002",
          date: "2026-02-14",
          items: [{ name: "Mouse", price: 500, qty: 2 }],
          total: 1000,
          status: "Shipped"
        }
      ];
      setOrders(mockOrders);
    }
  }, [user]);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h3 className="mb-4">My Orders</h3>

          {orders.length === 0 ? (
            <div className="alert alert-info">You haven't placed any orders yet.</div>
          ) : (
            <div className="row">
              {orders.map((order) => (
                <div key={order.id} className="col-md-6 mb-4">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="card-title mb-1">{order.id}</h5>
                          <p className="text-muted small">{order.date}</p>
                        </div>
                        <span className={`badge bg-${order.status === "Delivered" ? "success" : "warning"}`}>
                          {order.status}
                        </span>
                      </div>

                      <hr />

                      <h6 className="mb-2">Items:</h6>
                      {order.items.map((item, idx) => (
                        <p key={idx} className="small mb-2">
                          {item.name} × {item.qty} = <strong>₹{item.price * item.qty}</strong>
                        </p>
                      ))}

                      <hr />

                      <p className="mb-0">
                        <strong>Total: ₹{order.total.toFixed(2)}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
