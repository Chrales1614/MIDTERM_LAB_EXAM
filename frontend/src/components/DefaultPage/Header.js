//Header.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import Login from "./Login";
import Register from "./Register";

const Header = ({ cartCount = 0, isAuthenticated = false }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [username, setUsername] = useState("Guest");
    const [role, setRole] = useState("User");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            const storedUsername = localStorage.getItem("username");
            const storedRole = localStorage.getItem("role");
            
            if (storedUsername && storedRole) {
                setUsername(storedUsername);
                setRole(storedRole);
            }
        }
    }, [isAuthenticated]);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/dashboard?search=${encodeURIComponent(searchTerm)}`);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        navigate("/dashboard");
        window.location.reload(); // Refresh to update auth state
    };

    return (
        <>
            <Navbar 
                expand="lg" 
                className="shadow-lg p-3 mb-3 border-0" 
                style={{ 
                    background: "linear-gradient(135deg,rgb(33, 41, 65),rgb(72, 79, 121))", 
                    color: "#FFF", 
                    boxSizing: "border-box", 
                    width: "100%"
                }}
            >
                <Container fluid>
                    <Navbar.Brand 
                        onClick={() => navigate("/customerdashboard")}
                        className="text-light fw-bold fs-4 d-flex align-items-center cursor-pointer" 
                        style={{ letterSpacing: "2px", fontFamily: "'Poppins', sans-serif", cursor: "pointer" }}
                    >
                        <Zap 
                            size={24} 
                            className="me-2" 
                            style={{ 
                                color: "#FFD700",
                                filter: "drop-shadow(0 0 3px rgba(255, 215, 0, 0.5))"
                            }}
                        />
                        ElectroZone
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" className="bg-light" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto d-flex align-items-center">
                            {/* Show search bar for everyone except admins */}
                            {(!isAuthenticated || role !== "admin") && (
                                <Form className="d-flex mx-2" onSubmit={handleSearch}>
                                    <Form.Control
                                        type="search"
                                        placeholder="Search products..."
                                        className="me-2 rounded-pill"
                                        aria-label="Search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ minWidth: "700px" }}
                                    />
                                    <Button variant="light" className="rounded-pill d-flex align-items-center" type="submit">
                                        <Search size={18} />
                                    </Button>
                                </Form>
                            )}
                        </Nav>
                        
                        <Nav className="align-items-center">
                            {isAuthenticated ? (
                                <>
                                    {role === "customer" && (
                                        <Button 
                                            variant="outline-light" 
                                            className="me-3 rounded-pill border-0"
                                            onClick={() => navigate("/customerdashboard")}
                                        >
                                            <Home size={20} className="me-1" />
                                            Home
                                        </Button>
                                    )}

                                    {role === "customer" && (
                                        <Button 
                                            variant="outline-light" 
                                            className="d-flex align-items-center me-3 rounded-pill px-3 py-2 border-0 shadow-sm" 
                                            onClick={() => navigate("/cart")}
                                        > 
                                            <ShoppingCart size={20} className="me-1" />
                                            <Badge bg="danger" className="rounded-pill" style={{ fontSize: "0.8rem", padding: "5px 8px" }}>
                                                {cartCount}
                                            </Badge>
                                        </Button>
                                    )}

                                    {/* Profile Dropdown */}
                                    <Dropdown align="end">
                                        <Dropdown.Toggle 
                                            variant="outline-light" 
                                            className="d-flex align-items-center rounded-pill px-3 py-2 border-0 shadow-sm"
                                        >
                                            <User size={20} className="me-2" />
                                            <span className="fw-semibold">{username}</span>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="shadow border-0">
                                            <Dropdown.Item onClick={() => console.log("Profile settings (not functional)")}>
                                                Profile Settings
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => console.log("Name edit (not functional)")}>
                                                Edit Name
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={handleLogout} className="text-danger">
                                                Logout
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                            ) : (
                                <>
                                    <Button 
                                        variant="outline-light" 
                                        className="me-2 rounded-pill"
                                        onClick={() => setShowLoginModal(true)}
                                    >
                                        Login
                                    </Button>
                                    <Button 
                                        variant="light" 
                                        className="rounded-pill"
                                        onClick={() => setShowRegisterModal(true)}
                                    >
                                        Register
                                    </Button>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Login Modal */}
            <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Login inModal={true} onSuccess={() => {
                        setShowLoginModal(false);
                        window.location.reload(); // Refresh to update auth state
                    }} />
                </Modal.Body>
            </Modal>

            {/* Register Modal */}
            <Modal show={showRegisterModal} onHide={() => setShowRegisterModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Register inModal={true} onSuccess={() => {
                        setShowRegisterModal(false);
                        window.location.reload(); // Refresh to update auth state
                    }} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Header;