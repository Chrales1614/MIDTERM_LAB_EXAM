import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import AdminDashboard from '../AdminPage/AdminDashboard';
import CustomerDashboard from '../CustomerPage/CustomerDashboard';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: "", role: "" });
    const [cartCount, setCartCount] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        
        const token = localStorage.getItem("token");
        const storedUsername = localStorage.getItem("username") || "";
        const storedRole = localStorage.getItem("role") || "";

        // Check if user is authenticated
        setIsAuthenticated(!!token);
        setUser({ username: storedUsername, role: storedRole });

        if (token && storedRole === "customer") {
            // In a real app, you would fetch the actual cart count here
            fetchCartCount(token);
        }
    }, [navigate]);

    const fetchCartCount = async (token) => {
        try {
            if (!token) return;
            
            const response = await axios.get("http://localhost:8000/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const totalItems = response.data.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(totalItems);
        } catch (err) {
            console.error("Failed to fetch cart count:", err);
        }
    };

    return (
        <div className="dashboard-container">
            {/* Pass isAuthenticated to Header */}
            <Header cartCount={user.role === "customer" ? cartCount : null} isAuthenticated={isAuthenticated} />

            <main className="main-content">
                {isAuthenticated && user.role === "admin" ? (
                    <AdminDashboard />
                ) : (
                    // Show CustomerDashboard to both authenticated customers and non-authenticated users
                    <CustomerDashboard isAuthenticated={isAuthenticated} />
                )}
            </main>
        </div>
    );
};

export default Dashboard;