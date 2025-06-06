import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminProductsTable = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "", price: "", stock: "", image: "" });
    const [deleteId, setDeleteId] = useState(null);
    const [deleteError, setDeleteError] = useState("");
    
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get("http://localhost:8000/api/products", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setFormData(product);
        setShowEditModal(true);
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setDeleteError("");
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`http://localhost:8000/api/products/${deleteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(products.filter((product) => product.id !== deleteId));
            setShowDeleteModal(false);
        } catch (error) {
            setDeleteError("Error: This product is linked to an order and cannot be deleted.");
            console.error("Error deleting product:", error);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(`http://localhost:8000/api/products/${selectedProduct.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(products.map((product) => (product.id === selectedProduct.id ? { ...product, ...formData } : product)));
            setShowEditModal(false);
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    return (
        <div>
            <h3>Products</h3>
            {loading ? (
                <p>Loading products...</p>
            ) : (
                <table
                    className="table table-bordered"
                    style={{
                        tableLayout: "auto",
                        minWidth: "900px",
                        maxWidth: "100%",
                    }}
                    >
                    <thead>
                        <tr>
                        <th style={{ minWidth: "120px" }}>Name</th>
                        <th style={{ minWidth: "200px" }}>Description</th>
                        <th style={{ minWidth: "80px" }}>Price</th>
                        <th style={{ minWidth: "80px" }}>Stock</th>
                        <th style={{ minWidth: "150px" }}>Image URL</th>
                        <th style={{ minWidth: "140px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>₱{parseFloat(product.price).toFixed(2)}</td>
                            <td>{product.stock}</td>
                            <td>{product.image}</td>
                            <td>
                            <div className="d-flex gap-2">
                                <button
                                className="btn btn-warning btn-sm"
                                onClick={() => handleEdit(product)}
                                >
                                Edit
                                </button>
                                <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(product.id)}
                                >
                                Delete
                                </button>
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                )}
            {/* Error Message */}
            {deleteError && <div className="alert alert-danger mt-2">{deleteError}</div>}
            {/* Edit Modal */}
            {showEditModal && (
            <div className="modal show d-block" tabIndex="-1" style={{backdropFilter: "blur(1px)"}}>
                <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title">Edit Product</h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowEditModal(false)}
                    ></button>
                    </div>
                    <div className="modal-body">
                    <div className="mb-3">
                        <label className="form-label fw-bold">Name</label>
                        <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter product name"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Description</label>
                        <input
                        type="text"
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter description"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Price (₱)</label>
                        <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Enter price"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Stock</label>
                        <input
                        type="number"
                        className="form-control"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        placeholder="Enter stock"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Image URL</label>
                        <input
                        type="text"
                        className="form-control"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="Enter image URL"
                        />
                    </div>
                    </div>
                    <div className="modal-footer">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowEditModal(false)}
                    >
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        Save
                    </button>
                    </div>
                </div>
                </div>
            </div>
            )}
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal show d-block" tabIndex="-1" style={{backdropFilter: "blur(1px)"}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this product?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductsTable;
