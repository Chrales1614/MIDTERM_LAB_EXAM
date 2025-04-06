//CustomerDashboard.js
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Spinner } from "react-bootstrap";
import ProductCatalog from "./ProductCatalog";
import Carousel from 'react-bootstrap/Carousel';

const CustomerDashboard = ({ isAuthenticated }) => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check for search parameter in URL
        const params = new URLSearchParams(location.search);
        const searchParam = params.get('search');
        if (searchParam) {
            setSearchTerm(searchParam);
        }
        
        fetchProducts();
    }, [location.search]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8000/api/products");
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="container mt-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="mb-4">
                    {!isAuthenticated && (
                        <div className="alert alert-info mt-3" role="alert">
                            <strong>Welcome to ElectroZone!</strong> You can browse our products, but you'll need to log in to add items to your cart.
                        </div>
                    )}
                    <Carousel>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="https://www.ecommercetimes.com/wp-content/uploads/sites/5/2022/02/ecommerce-arrow.jpg"
                                alt="Premium Watches Collection"
                            />
                            <Carousel.Caption>
                                <h3>Premium Watches Collection</h3>
                                <p>Discover our exclusive selection of luxury timepieces</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="https://builtin.com/sites/www.builtin.com/files/styles/og/public/2022-09/ecommerce.png"
                                alt="Special Offers"
                            />
                            <Carousel.Caption>
                                <h3>Special Offers</h3>
                                <p>Limited time discounts on selected products</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="https://www.ecommercetimes.com/wp-content/uploads/sites/5/2022/03/online-shopping-cart.jpg"
                                alt="New Arrivals"
                            />
                            <Carousel.Caption>
                                <h3>New Arrivals</h3>
                                <p>Check out our latest products</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </div>

                <div className="card p-4 shadow-lg">
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center">
                            <Spinner animation="border" variant="primary" />
                            <span className="ms-2">Loading products...</span>
                        </div>
                    ) : (
                        <ProductCatalog products={filteredProducts} />
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default CustomerDashboard;