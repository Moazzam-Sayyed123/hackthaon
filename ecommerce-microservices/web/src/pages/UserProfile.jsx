import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    address: user?.address || "",
    city: user?.city || "",
    postalCode: user?.postalCode || ""
  });

  useEffect(() => {
    if (user && user.role === "user") {
      loadWallet();
    }
  }, [user]);

  const loadWallet = async () => {
    try {
      const userId = user.email || user.id || "default-user";
      const res = await fetch(`/api/wallet/${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        setWalletBalance(data.balance);
      }
    } catch (err) {
      console.error("Failed to load wallet:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role === "vendor") {
    navigate("/");
    return null;
  }

  const handleSave = () => {
    updateUser({
      address: form.address,
      city: form.city,
      postalCode: form.postalCode
    });
    setEditMode(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4">My Profile</h3>

              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6 className="text-muted">Account Information</h6>
                      <p className="mb-1"><strong>Name:</strong> {user.name}</p>
                      <p className="mb-0"><strong>Email:</strong> {user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card bg-success bg-opacity-10">
                    <div className="card-body">
                      <h6 className="text-muted">Wallet Balance</h6>
                      {loading ? (
                        <p className="text-muted">Loading...</p>
                      ) : (
                        <div className="d-flex align-items-center gap-3">
                          <h3 className="text-success mb-0">₹{Number(walletBalance).toFixed(2)}</h3>
                          <button className="btn btn-sm btn-outline-success" onClick={async () => {
                            const amt = prompt('Enter amount to add to wallet (₹)');
                            if (!amt) return;
                            const a = Number(amt);
                            if (Number.isNaN(a) || a <= 0) { alert('Invalid amount'); return; }
                            try {
                              const userId = user.email || user.id || 'default-user';
                              const res = await fetch(`/api/wallet/${encodeURIComponent(userId)}/add`, {
                                method: 'POST', headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ amount: a })
                              });
                              if (!res.ok) throw new Error('Failed to add balance');
                              const data = await res.json();
                              setWalletBalance(data.balance);
                              alert('Balance updated');
                            } catch (err) { alert('Error: ' + err.message); }
                          }}>Add Balance</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              <h5 className="mb-3">Shipping Address</h5>

              {editMode ? (
                <form>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Street address"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="City"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.postalCode}
                      onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                      placeholder="Postal code"
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <p>
                    <strong>Address:</strong> {user.address || "Not set"}<br />
                    <strong>City:</strong> {user.city || "Not set"}<br />
                    <strong>Postal Code:</strong> {user.postalCode || "Not set"}
                  </p>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setEditMode(true)}
                  >
                    <i className="bi bi-pencil"></i> Edit Address
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
