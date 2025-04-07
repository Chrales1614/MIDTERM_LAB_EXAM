import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CartTable from "./CartTable";
import OrderTable from "../DefaultPage/OrderTable";
import Header from "../DefaultPage/Header";

const Cart = () => {
    const [view, setView] = useState("cart");
    const [showSummary, setShowSummary] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const fetchCartCount = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            
            const response = await axios.get("http://localhost:8000/api/cart-count", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartCount(response.data.count);
        } catch (err) {
            console.error("Failed to fetch cart count:", err);
            // Fallback to counting items locally if API fails
            const fallbackToken = localStorage.getItem("token");
            if (fallbackToken) {
                const response = await axios.get("http://localhost:8000/api/cart", {
                    headers: { Authorization: `Bearer ${fallbackToken}` }
                });
                setCartCount(response.data?.length || 0);
            }
        }
    };

    const handleCartUpdate = () => {
        fetchCartCount();
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
            fetchCartCount();
        } else {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleCheckout = async () => {
        alert("Order placed successfully!");
        setShowSummary(false);
    };

    return (
        <>
            <Header cartCount={cartCount} isAuthenticated={isAuthenticated} />
            
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>My {view === "cart" ? "Cart" : "Orders"}</h3>
                </div>
                <div className="btn-group mb-3 d-flex justify-content-center" role="group" aria-label="Basic example">
                <button
                    className={`btn ${view === "cart" ? "" : "btn-outline-secondary"}`}
                    onClick={() => setView("cart")}
                    style={{
                        backgroundColor: view === "cart" ? "rgb(1, 0, 128)" : "transparent",
                        borderColor: "rgb(1, 0, 128)",
                        color: view === "cart" ? "white" : "rgb(1, 0, 128)"
                    }}
                >
                    Cart
                </button>
                <button
                    className={`btn ${view === "orders" ? "btn-secondary" : "btn-outline-secondary"}`}
                    onClick={() => setView("orders")}
                >
                    Orders
                </button>
                </div>

                <div className="card p-3 rounded-3 shadow-sm">
                    {view === "cart" ? <CartTable onCartUpdate={handleCartUpdate} /> : <OrderTable />}
                </div>

                {showSummary && (
                    <div className="modal show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Order Summary</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowSummary(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <CartTable summaryMode={true} />
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-success" onClick={handleCheckout}>Confirm Order</button>
                                    <button className="btn btn-secondary" onClick={() => setShowSummary(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <button
                onClick={() => navigate(-1)}
                className="mt-4 flex items-center gap-3 px-5 py-3 rounded-xl font-semibold text-[16px] text-gray-700 bg-white border border-gray-300 shadow-md transition-all duration-300 
                            hover:bg-gray-900 hover:text-white hover:border-gray-900 hover:shadow-lg"
                >
                <ArrowLeft size={20} className="stroke-[2.5]" /> Back
                </button>
            </div>
        </>
    );
};

export default Cart;
