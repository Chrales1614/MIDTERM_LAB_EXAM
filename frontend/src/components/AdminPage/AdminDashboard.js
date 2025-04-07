import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminProductsTable from "./AdminProductsTable";
import OrdersTable from "./OrdersTable";
import axios from "axios";
import { motion } from "framer-motion";

const AdminDashboard = () => {
    const [view, setView] = useState("products");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", stock: "", image: "" });
    const [loading, setLoading] = useState(false);
    // Add a state to track when products are updated
    const [productsUpdated, setProductsUpdated] = useState(0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleAddProduct = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            await axios.post("http://localhost:8000/api/products", newProduct, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowAddModal(false);
            setNewProduct({ name: "", description: "", price: "", stock: "", image: "" });
            // Increment the counter to trigger a reload of products
            setProductsUpdated(prev => prev + 1);
        } catch (error) {
            console.error("Error adding product:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="d-flex flex-column align-items-center mb-3">
                <div className="btn-group mb-3 d-flex justify-content-center" style={{ width: "100%" }}>
                    <button
                    className={`btn ${view === "products" ? "" : "btn-outline-secondary"}`}
                    onClick={() => setView("products")}
                    style={{
                        flex: 1,
                        backgroundColor: view === "products" ? "rgb(1, 0, 128)" : "transparent",
                        borderColor: "rgb(1, 0, 128)",
                        color: view === "products" ? "white" : "rgb(1, 0, 128)",
                        borderRight: "none",
                    }}
                    >
                    Products
                    </button>
                    <button
                    className={`btn ${view === "orders" ? "btn-secondary" : "btn-outline-secondary"}`}
                    onClick={() => setView("orders")}
                    style={{ flex: 1 }}
                    >
                    Orders
                    </button>
                </div>

                {view === "products" && (
                    <button className="btn btn-success" style={{width: "100%", boxShadow: "rgba(61, 61, 61, 0.35) 0 0 2px 2px"}} onClick={() => setShowAddModal(true)}>
                    Add Product
                    </button>
                )}
                </div>
 
                <div className="card p-3 shadow-lg">
                    {/* Wrap the table in a responsive container */}
                    {view === "products" ? (
                        <div className="table-responsive">
                            {/* Pass the productsUpdated state as a prop to trigger re-renders */}
                            <AdminProductsTable key={productsUpdated} refreshTrigger={productsUpdated} />
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <OrdersTable />
                        </div>
                    )}
                </div>

                {/* Modal for adding a new product */}
                {showAddModal && (
                    <div className="modal show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add Product</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <input type="text" className="form-control mb-2" name="name" value={newProduct.name} onChange={handleInputChange} placeholder="Name" />
                                    <input type="text" className="form-control mb-2" name="description" value={newProduct.description} onChange={handleInputChange} placeholder="Description" />
                                    <input type="number" className="form-control mb-2" name="price" value={newProduct.price} onChange={handleInputChange} placeholder="Price" />
                                    <input type="number" className="form-control mb-2" name="stock" value={newProduct.stock} onChange={handleInputChange} placeholder="Stock" />
                                    <input type="text" className="form-control mb-2" name="image" value={newProduct.image} onChange={handleInputChange} placeholder="Image URL" />
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                    <button className="btn btn-primary" onClick={handleAddProduct} disabled={loading}>
                                        {loading ? "Adding..." : "Add Product"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AdminDashboard;