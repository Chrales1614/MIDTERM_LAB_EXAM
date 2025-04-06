import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import axios from "axios";
import Login from "../DefaultPage/Login"; // Import Login component

const ProductCatalog = ({ products: initialProducts }) => {
    const [showModal, setShowModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hoveredButton, setHoveredButton] = useState(null); // Track which button is hovered
    const [sortOption, setSortOption] = useState("default"); // Default sorting option
    const [products, setProducts] = useState(initialProducts); // Local state for sorted products

    // Apply sorting whenever sort option or products change
    useEffect(() => {
        sortProducts(sortOption);
    }, [sortOption, initialProducts]);

    // Sorting function
    const sortProducts = (option) => {
        let sortedProducts = [...initialProducts];
        
        switch (option) {
            case "price-asc":
                sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case "price-desc":
                sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case "name-asc":
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "default":
            default:
                // Keep original order
                break;
        }
        
        setProducts(sortedProducts);
    };

    const handleShowModal = (product) => {
        const token = localStorage.getItem("token");

        if (!token) {
            setSelectedProduct(product);
            setShowLoginModal(true);
        } else {
            setSelectedProduct(product);
            setQuantity(1);
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setError(null);
    };

    const handleCloseLoginModal = () => {
        setShowLoginModal(false);
    };

    const handleLoginSuccess = () => {
        setShowLoginModal(false);
        setQuantity(1);
        setShowModal(true);
    };

    const handleAddToCart = async () => {
        if (!selectedProduct) return;
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("You need to be logged in to add to cart.");
                setLoading(false);
                return;
            }

            const response = await axios.post(
                "http://localhost:8000/api/cart",
                {
                    product_id: selectedProduct.id,
                    quantity: quantity,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log("Added to cart:", response.data);
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="row">
            <div className="col-12 mb-4 d-flex justify-content-between align-items-center">
                <h3 className="text-dark mb-2">Featured Product:</h3>
                <div className="sort-container">
                    <Dropdown>
                        <Dropdown.Toggle 
                            variant="light" 
                            id="dropdown-sort"
                            style={{
                                backgroundColor: "rgb(245, 245, 245)",
                                borderColor: "#ddd",
                                color: "#333",
                                fontWeight: "bold",
                                padding: "10px",
                                borderRadius: "8px",
                                transition: "background 0.3s, color 0.3s",
                                cursor: "pointer",
                                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                                marginLeft: "10px",
                                fontSize: "16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                                padding: "10px 20px",
                                height: "50px",
                                lineHeight: "1.5",
                                fontSize: "16px",
                                fontWeight: "bold",
                                textAlign: "center",
                                textDecoration: "none",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                borderRadius: "5px",
                                transition: "background 0.3s, color 0.3s"
                            }}
                        >
                            {sortOption === "default" ? "Sort By" : 
                             sortOption === "price-asc" ? "Price: Low to High" :
                             sortOption === "price-desc" ? "Price: High to Low" :
                             sortOption === "name-asc" ? "Name: A to Z" :
                             "Name: Z to A"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setSortOption("default")}>Default</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSortOption("price-asc")}>Price: Low to High</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSortOption("price-desc")}>Price: High to Low</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSortOption("name-asc")}>Name: A to Z</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSortOption("name-desc")}>Name: Z to A</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            <div className="col-12">
                <hr className="mb-4" />
            </div>

            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                products.map((product) => (
                    <div key={product.id} className="col-md-4 mb-4">
                        <div
                            className="card h-100"
                            style={{
                                transition: "transform 0.3s, box-shadow 0.3s",
                                cursor: "pointer",
                                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-5px)";
                                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
                            }}
                        >
                            <div style={{ height: "400px", overflow: "hidden" }}>
                                <img
                                    src={product.image}
                                    className="card-img-top"
                                    alt={product.name}
                                    style={{ objectFit: "cover", height: "100%", width: "100%" }}
                                />
                            </div>
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text flex-grow-1">{product.description}</p>
                                <div className="mt-auto">
                                    <p className="card-text"><strong>₱{product.price}</strong></p>
                                    <button
                                        className="btn w-100"
                                        onClick={() => handleShowModal(product)}
                                        style={{
                                            background: hoveredButton === product.id
                                                ? "rgb(72, 79, 121)"
                                                : "rgb(33, 41, 65)",
                                            color: "#fff",
                                            border: "none",
                                            transition: "background 0.3s"
                                        }}
                                        onMouseEnter={() => setHoveredButton(product.id)}
                                        onMouseLeave={() => setHoveredButton(null)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {/* Modal for adding to cart */}
            {selectedProduct && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedProduct.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <img src={selectedProduct.image} className="img-fluid mb-3" alt={selectedProduct.name} />
                        <p>{selectedProduct.description}</p>
                        <p><strong>Price:</strong> ₱{selectedProduct.price}</p>
                        <p><strong>Stock:</strong> {selectedProduct.stock}</p>
                        {error && <p className="text-danger">{error}</p>}
                        <Form>
                            <Form.Group controlId="quantity">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button
                            style={{
                                backgroundColor: "rgb(33, 41, 65)",
                                border: "none"
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = "rgb(72, 79, 121)"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "rgb(33, 41, 65)"}
                            onClick={handleAddToCart}
                            disabled={loading}
                        >
                            {loading ? "Adding..." : "Add to Cart"}
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Login Modal */}
            <Modal show={showLoginModal} onHide={handleCloseLoginModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Login Required</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-3">Please login to add products to your cart.</p>
                    <Login inModal={true} onSuccess={handleLoginSuccess} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseLoginModal}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductCatalog;