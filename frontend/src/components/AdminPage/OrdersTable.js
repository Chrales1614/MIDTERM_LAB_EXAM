import React, { useState, useEffect } from "react";

import axios from "axios";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!startDate || !endDate || dateError) {
      setFilteredOrders(orders);
      return;
    }

    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(23, 59, 59, 999);

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.checkout_date).getTime();
      return orderDate >= start && orderDate <= end;
    });

    setFilteredOrders(filtered);
  }, [startDate, endDate, orders, dateError]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    if (endDate && newStartDate > endDate) {
      setDateError("Start date cannot be later than end date.");
    } else {
      setDateError("");
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);

    if (startDate && newEndDate < startDate) {
      setDateError("End date cannot be earlier than start date.");
    } else {
      setDateError("");
    }
  };

  const handleMarkAsComplete = (order) => {
    setSelectedOrder(order);
    fetchOrderItems(order.id);
    setShowConfirmModal(true);
  };

  const confirmMarkAsComplete = async () => {
    if (!selectedOrder) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/api/orders/${selectedOrder.id}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrders();
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const fetchOrderItems = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/api/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrderItems(response.data.items || []);
    } catch (error) {
      console.error("Error fetching order items:", error);
    }
  };
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    fetchOrderItems(order.id);
    setShowModal(true);
  };

  return (
    <div className="container mt-4 mb-5 p-4 rounded ">
      <h4 className="text-center mb-4">Orders Management</h4>

      <div className="card p-3 mb-4 shadow-sm">
        <h5 className="card-title">Filter Orders</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Start Date:</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">End Date:</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={handleEndDateChange}
              min={startDate}
            />
          </div>
        </div>
        {dateError && <p className="text-danger mt-2">{dateError}</p>}
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading orders...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover shadow-sm">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Total Price</th>
                <th>Checkout Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody style={{ cursor: "pointer", backgroundColor: "#f8f9fa", justifyContent: "center", display: "flex-column" }}>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>₱{parseFloat(order.total_price).toFixed(2)}</td>
                  <td>
                    {order.checkout_date
                      ? new Date(order.checkout_date).toLocaleString("en-PH", {
                          timeZone: "Asia/Manila",
                        })
                      : "N/A"}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        order.status === "completed"
                          ? "bg-success text-light py-3 px-3" 
                          : "bg-warning text-dark py-3 px-4"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleViewDetails(order)}
                    >
                      View Details
                    </button>
                    {order.status !== "completed" && (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleMarkAsComplete(order)}
                      >
                        Mark as Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Items Modal */}
      {showModal && selectedOrder && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Order #{selectedOrder.id} Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body">
                <h5>Order Items</h5>
                {orderItems.length > 0 ? (
                  <>
                    {orderItems.map((item) => (
                      <div key={item.id} className="mb-3">
                        <div>
                          <strong>{item.product?.name || "Unknown Product"}</strong>
                        </div>
                        <div>Qty: {item.quantity}</div>
                        <div>
                          Price: ₱{(item.product?.price * item.quantity).toFixed(2)}
                        </div>
                        <hr />
                      </div>
                    ))}
                    <div className="text-end fw-bold">
                      Total: ₱
                      {orderItems
                        .reduce(
                          (sum, item) =>
                            sum + (item.product?.price || 0) * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </div>
                  </>
                ) : (
                  <p>No items found.</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedOrder && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Order Completion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to mark order #{selectedOrder.id} as
                  complete?
                </p>
                <h5 className="fw-bold">Order Summary</h5>
                {orderItems.length > 0 ? (
                  <>
                    {orderItems.map((item) => (
                      <div key={item.id} className="mb-3">
                        <div>
                          <strong>{item.product?.name || "Unknown Product"}</strong>
                        </div>
                        <div>Qty: {item.quantity}</div>
                        <div>
                          Price: ₱{(item.product?.price * item.quantity).toFixed(2)}
                        </div>
                        <hr />
                      </div>
                    ))}
                    <div className="text-end fw-bold">
                      Total: ₱
                      {orderItems
                        .reduce(
                          (sum, item) =>
                            sum + (item.product?.price || 0) * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </div>
                  </>
                ) : (
                  <p>No items found.</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={confirmMarkAsComplete}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;