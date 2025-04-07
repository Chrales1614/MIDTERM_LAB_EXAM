//Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = ({ inModal = false, onSuccess = null }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login", formData);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.user.name);
            localStorage.setItem("role", response.data.user.role);
            
            if (onSuccess && inModal) {
                onSuccess();
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    const inputStyle = {
        backgroundColor: "#ffffff",
        border: "1px solid rgb(72, 79, 121)",
        color: "#212529",
        padding: "10px",
        borderRadius: "8px"
    };

    const buttonStyle = {
        backgroundColor: "rgb(72, 79, 121)",
        color: "#ffffff",
        fontWeight: "bold",
        padding: "12px",
        borderRadius: "8px",
        transition: "background-color 0.3s ease"
    };

    const buttonHoverStyle = {
        backgroundColor: "rgb(90, 97, 139)"
    };

    const cardStyle = {
        maxWidth: "420px",
        backgroundColor: "rgb(33, 41, 65)",
        borderRadius: "12px",
        border: "1px solid rgb(72, 79, 121)",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        color: "#ffffff"
    };

    const fontStyle = {
        fontFamily: "'Playfair Display', serif",
        color: "#ffffff"
    };

    const linkStyle = {
        color: "rgb(140, 146, 185)",
        textDecoration: "underline"
    };

    const [hover, setHover] = useState(false);

    const combinedButtonStyle = {
        ...buttonStyle,
        ...(hover ? buttonHoverStyle : {})
    };

    // If inside a modal
    if (inModal) {
        return (
            <div>
                {error && <p className="alert alert-danger">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            className="form-control"
                            style={inputStyle}
                        />
                    </div>
                    <div className="mb-3">
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            className="form-control" 
                            style={inputStyle}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn w-100" 
                        style={combinedButtonStyle}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    >
                        Login
                    </button>
                </form>
            </div>
        );
    }

    // Full page version
    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "rgb(28, 34, 52)", fontFamily: "'Playfair Display', serif" }}>
            <div className="card p-5 shadow-lg" style={cardStyle}>
                <h2 className="text-center mb-4" style={{ ...fontStyle, fontWeight: "bold" }}>ElectroZone Login</h2>
                {error && <p className="alert alert-danger">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            className="form-control"
                            style={inputStyle}
                        />
                    </div>
                    <div className="mb-3">
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            className="form-control"
                            style={inputStyle}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn w-100" 
                        style={combinedButtonStyle}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    >
                        Login
                    </button>
                </form>
                <p className="text-center mt-3" style={fontStyle}>
                    Don't have an account? <Link to="/register" style={linkStyle}>Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
