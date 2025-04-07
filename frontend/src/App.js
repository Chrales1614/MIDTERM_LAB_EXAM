import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/DefaultPage/Login";
import Register from "./components/DefaultPage/Register";
import Dashboard from "./components/DefaultPage/Dashboard";
import Cart from "./components/CustomerPage/Cart";

const isAuthenticated = () => !!localStorage.getItem("token");

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Dashboard is always accessible, but will show login/register modals if not authenticated */}
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Protected Route for Cart */}
                <Route
                    path="/cart"
                    element={isAuthenticated() ? <Cart /> : <Navigate to="/dashboard" />}
                />

                {/* Redirect unknown routes to dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
}

export default App;