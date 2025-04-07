//OrderTable.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null); // To track selected row

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("User not authenticated.");

                const response = await axios.get("http://localhost:8000/api/my-orders", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setOrders(response.data || []);
            } catch (err) {
                setError("Failed to load orders. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleRowClick = (orderId) => {
        setSelectedOrder(orderId === selectedOrder ? null : orderId); // Toggle row selection
    };

    if (loading)
        return (
            <div className="d-flex justify-content-center mt-4">
                <Spinner animation="border" variant="warning" />
                <span className="ms-3 text-muted">Loading your orders...</span>
            </div>
        );

    if (error) return <p className="text-danger text-center fw-bold">{error}</p>;

    return (
        <div className="table-responsive">
            <Table striped bordered hover className="shadow-lg table-custom">
                <thead className="table-header text-center">
                    <tr>
                        <th className = "text-white">Order ID</th>
                        <th className = "text-white">Product</th>
                        <th className = "text-white">Quantity</th>
                        <th className = "text-white">Total Price</th>
                        <th className = "text-white">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order) =>
                            order.items.map((item) => (
                                <tr
                                    key={item.id}
                                    className={selectedOrder === order.id ? "selected" : ""}
                                    onClick={() => handleRowClick(order.id)}
                                >
                                    <td className="fw-semibold text-center">{order.id}</td>
                                    <td className="text-center">{item.product?.name || <span className="text-muted">Unknown Product</span>}</td>
                                    <td className="text-center">{item.quantity}</td>
                                    <td className="fw-bold text-center text-success">
                                        ₱{(item.product?.price * item.quantity).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="text-center">
                                        <Badge bg={getStatusVariant(order.status)}>{order.status}</Badge>
                                    </td>
                                </tr>
                            ))
                        )
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center text-muted fw-bold py-3">No orders found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
        case "pending":
            return "warning";
        case "completed":
            return "success";
        case "canceled":
            return "danger";
        default:
            return "secondary";
    }
};

export default OrderTable;
