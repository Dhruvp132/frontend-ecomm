import React, { useState, useEffect } from "react";
import axios from "axios";
import { db } from "../firebase"; // Import Firestore from firebase.js
import "./AdminDashboard.css"; // Importing CSS for styling and animations

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ title: "", price: "", image: "" });
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  // Fetch products and users on mount
  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5001/admin/products");
      setProducts(data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5001/admin/users");
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      // Remove from Firestore
      await db.collection("users").doc(userId).delete();
      alert("User deleted from Firestore");

      // ❌ Firebase v8 does NOT allow client-side user deletion from Firebase Auth
      // ❗ User deletion from Firebase Auth must be done on the backend with Firebase Admin SDK

      fetchUsers(); // Refresh user list
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Prevent negative prices
    if (name === "price" && (value === "-" || parseInt(value) < 0)) {
      return;
    }

    setForm({ ...form, [name]: value });
  };

  // Handle product submission (add or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`http://localhost:5001/admin/updateProduct/${editProductId}`, form);
        alert("Product updated successfully");
      } else {
        await axios.post("http://localhost:5001/admin/addproduct", form);
        alert("Product added successfully");
      }
      fetchProducts();
      setForm({ title: "", price: "", image: "" });
      setEditMode(false);
      setEditProductId(null);
    } catch (err) {
      console.error("Error submitting product:", err);
    }
  };

  // Handle edit button click
  const handleEdit = (product) => {
    setEditMode(true);
    setEditProductId(product._id);
    setForm({ title: product.title, price: product.price, image: product.image });
  };

  // Handle delete button click
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:5001/admin/delete/${productId}`);
      alert("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Form for adding/editing product */}
      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          name="title"
          value={form.title}
          placeholder="Product Title"
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          placeholder="Product Price"
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="image"
          value={form.image}
          placeholder="Product Image URL"
          onChange={handleInputChange}
          required
        />
        <button type="submit">{editMode ? "Update Product" : "Add Product"}</button>
      </form>

      {/* Product List */}
      <div className="product-list">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img src={product.image} alt={product.title} className="product-image" />
            <h3>{product.title}</h3>
            <p>${product.price}</p>
            <div className="product-buttons">
              <button onClick={() => handleEdit(product)} className="edit-btn">
                Edit
              </button>
              <button onClick={() => handleDelete(product._id)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* User list */}
      <h2>Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>UID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.uid}</td>
              <td>
                <button onClick={() => handleDeleteUser(user.id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
