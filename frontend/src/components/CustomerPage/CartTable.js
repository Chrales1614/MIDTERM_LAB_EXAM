import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner, Button } from "react-bootstrap";

const CartTable = ({ summaryMode, onCartUpdate }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [contact, setContact] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [address, setAddress] = useState("");

  const primaryColor = "rgb(63, 82, 138)";
  const lightText = "#ffffff";

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated.");
        return;
      }

      const response = await axios.delete(
        `http://localhost:8000/api/cart/${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        alert("Item removed from cart.");
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemId)
        );
        onCartUpdate && onCartUpdate();
      } else {
        alert("Failed to remove item.");
      }
    } catch (err) {
      alert("Failed to remove item.");
    }
  };

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:8000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems(response.data || []);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setError("Failed to load cart items.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    console.log(`Updating quantity for item ${itemId} to ${newQuantity}`);
    
    // Don't allow quantities less than 1
    if (newQuantity < 1) {
      console.log("Quantity must be at least 1");
      return;
    }
    
    // Store original item for potential revert
    const originalItem = cartItems.find(item => item.id === itemId);
    if (!originalItem) {
      console.error("Item not found in cart");
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No authentication token found");
        alert("Please login to update your cart.");
        return;
      }
      
      // Create a temporary copy of the cart items
      const updatedItems = cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      
      // Update UI immediately for better user experience
      setCartItems(updatedItems);
      onCartUpdate && onCartUpdate();
      
      // Send request to server
      const response = await axios.put(
        `http://localhost:8000/api/cart/${itemId}`,
        { quantity: newQuantity },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log("Server response:", response);
      
      // Accept any 2xx status code as success
      if (response.status < 200 || response.status >= 300) {
        console.log("Server returned error status");
        // Revert the UI change
        setCartItems(prev => prev.map(item => 
          item.id === itemId ? { ...originalItem } : item
        ));
        alert(response.data?.message || "Failed to update quantity. Please try again.");
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      // Revert the UI change
      setCartItems(prev => prev.map(item => 
        item.id === itemId ? { ...originalItem } : item
      ));
      
      // Provide more specific error message
      const errorMsg = err.response?.data?.message || 
                      err.response?.statusText || 
                      "Network error updating quantity";
      alert(`Failed to update quantity: ${errorMsg}`);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalQuantity = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!address.trim()) {
      alert("Please enter your address.");
      return;
    }
    if (!contact.trim()) {
      alert("Please enter your contact number.");
      return;
    }
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated.");
        return;
      }

      const selectedCartItems = cartItems.filter((item) =>
        selectedItems.includes(item.id)
      );

      const response = await axios.post(
        "http://localhost:8000/api/checkout",
        { address, contact, paymentMethod, items: selectedCartItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Checkout successful! Order ID: " + response.data.order_id);

        const remainingItems = cartItems.filter(
          (item) => !selectedItems.includes(item.id)
        );
        setCartItems(remainingItems);
        onCartUpdate && onCartUpdate();

        setSelectedItems([]);
        setShowSummary(false);
        setCheckoutStep(1);
        setAddress("");
        setContact("");
        setPaymentMethod("");
      } else {
        alert(response.data.message || "Failed to checkout.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred during checkout.");
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-4">
        <Spinner animation="border" style={{ color: primaryColor }} />
        <span className="ms-3 text-muted">Loading...</span>
      </div>
    );

  if (error)
    return <p className="text-danger text-center fw-bold">{error}</p>;

  // If in summary mode, show only selected items
  const displayItems = summaryMode 
    ? cartItems.filter(item => selectedItems.includes(item.id)) 
    : cartItems;

  return (
    <div>
      {!summaryMode && <h5>Total Items in Cart: {totalItems}</h5>}
      <div className="table-responsive mt-3 rounded-3 flex flex-column">
        <table className="table table-bordered shadow-sm">
          <thead
            className="text-center"
            style={{ backgroundColor: primaryColor, color: lightText }}
          >
            <tr>
              {!summaryMode && <th></th>}
              <th className="text-white">Product</th>
              <th className="text-white">Price</th>
              <th className="text-white">Quantity</th>
              <th className="text-white">Total</th>
              {!summaryMode && <th className="text-white , text-center">Action</th>}
            </tr>
          </thead>
          <tbody>
            {displayItems.length > 0 ? (
              displayItems.map((item) => (
                <tr key={item.id}>
                  {!summaryMode && (
                    <td className="text-center">
                      <input className="form-check-input" style={{ cursor: "pointer" , width: "20px", height: "20px" }}
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </td>
                  )}
                  <td>{item.name}</td>
                  <td>₱{item.price}</td>
                  <td>
                    {!summaryMode ? (
                      <div className="input-group">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          type="button"
                          onClick={() => handleQuantityChange(item.id, parseInt(item.quantity) - 1)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="form-control form-control-sm text-center"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val && val > 0) {
                              handleQuantityChange(item.id, val);
                            }
                          }}
                          style={{ width: "60px" }}
                        />
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          type="button"
                          onClick={() => handleQuantityChange(item.id, parseInt(item.quantity) + 1)}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      item.quantity
                    )}
                  </td>
                  <td>₱{item.price * item.quantity}</td>
                  {!summaryMode && (
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={summaryMode ? "4" : "6"} className="text-center text-muted fw-bold py-3">
                  {summaryMode ? "No items selected." : "Your cart is empty."}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {cartItems.length > 0 && !summaryMode && (
          <div className="checkout-button-container d-flex justify-content-end">
          <Button
            variant="background-color: rgb(63, 83, 136), font-color: white"
            className="rounded px-5 py-2 mt-3 flex justify-content-center"
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "rgb(1, 0, 128)";  // Navy Blue
              e.target.style.borderColor = "rgb(1, 0, 128)";      // Navy Blue
              e.target.style.color = "white";                     // White text
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "rgb(66, 83, 136)"; // Original background color
              e.target.style.borderColor = "rgb(66, 83, 136)";     // Original border color
              e.target.style.color = "white";                     // White text
            }}
            onClick={() => setShowSummary(true)}
            disabled={selectedItems.length === 0}
          >
            Checkout Selected
          </Button>
        </div>
        
        )}

      </div>

      {showSummary && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ backgroundColor: primaryColor, color: lightText }}
              >
                <h5 className="modal-title">Order Summary</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSummary(false)}
                ></button>
              </div>
              <div className="modal-body">
                {checkoutStep === 1 ? (
                  <>
                    <p>Total Quantity: {totalQuantity}</p>
                    <p>Total Price: ₱{totalPrice}</p>
                  </>
                ) : (
                  <>
                    <label>Enter Address:</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your address"
                      required
                    />
                    <label>Contact Number:</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="Enter your contact number"
                      required
                    />
                    <label>Payment Method:</label>
                    <select
                      className="form-control mb-2"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select a payment method</option>
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="Gcash">Gcash</option>
                      <option value="Maya">Maya</option>
                      <option value="Credit/Debit Card">Credit/Debit Card</option>
                    </select>
                  </>
                )}
              </div>
              <div className="modal-footer">
                {checkoutStep === 1 ? (
                  <Button
                    style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                    onClick={() => setCheckoutStep(2)}
                    disabled={selectedItems.length === 0}
                  >
                    Next
                  </Button>
                ) : (
                  <Button variant="success" onClick={handleCheckout}>
                    Checkout
                  </Button>
                )}
                <Button variant="secondary" onClick={() => {
                  setShowSummary(false);
                  setCheckoutStep(1);
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartTable;