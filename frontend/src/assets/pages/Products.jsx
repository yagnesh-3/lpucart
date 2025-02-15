import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { CartContext } from "./context/CartContext"; // Fixed import path
import Navbar from "../Component/Navbar"; // Fixed import path

const Products = () => {
    const navigate = useNavigate();
    const { backendUrl, cart, setCart } = useContext(CartContext);
    const token = localStorage.getItem("token");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Redirect to login if no token
    useEffect(() => {
        if (!token) {
            navigate("/"); // Redirects to login page
        }
    }, [token, navigate]);

    // Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${backendUrl}/verse/products`);
                if (!response.ok) throw new Error("Failed to fetch products.");
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [backendUrl]);

    // Add to Cart Function
    const handleAddToCart = async (product) => {
        if (!token) {
            alert("Please log in to add items to the cart.");
            navigate("/"); // Redirects to login if token is missing
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/verse/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId: product._id, quantity: 1 }),
            });

            const data = await response.json();
            console.log("Cart Response:", data); // Debugging line

            if (response.ok) {
                setCart([...cart, { product, quantity: 1 }]);
                alert("Added to cart successfully!");
            } else {
                alert(data.message || "Failed to add item to cart.");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    return (
        <div style={{ paddingTop: "80px" }}>
            <Navbar /> {/* Navbar stays at the top */}

            {loading && <h2>Loading products...</h2>}
            {error && <h2 style={{ color: "red" }}>{error}</h2>}

            {!loading && !error && (
                <div style={styles.container}>
                    {products.map((product) => (
                        <div key={product._id} style={styles.card}>
                            <img src={product.image} alt={product.name} style={styles.image} />
                            <h3>{product.name}</h3>
                            <p>Category: {product.category}</p>
                            <p>Price: ${product.cost}</p>
                            <p>⭐ {product.rating}</p>
                            <button
                                style={styles.button}
                                onClick={() => handleAddToCart(product)}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// CSS Styles
const styles = {
    container: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        padding: "20px",
    },
    card: {
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        textAlign: "center",
        boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
        transition: "transform 0.2s ease-in-out",
    },
    image: {
        width: "100%",
        height: "150px",
        objectFit: "contain",
        borderRadius: "10px",
        backgroundColor: "#f8f8f8",
    },
    button: {
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        padding: "10px",
        cursor: "pointer",
        borderRadius: "5px",
        marginTop: "10px",
        transition: "background 0.3s",
    },
};

export default Products;
