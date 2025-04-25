import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useStateValue } from '../StateProvider';
import CheckoutProduct from '../CheckoutProduct';

function CollabCart() {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [{ basket, user }, dispatch] = useStateValue();
    const [, setBasket] = useState([]);
    const [collabCart, setCollabCart] = useState([]);
    const [previewCart, setPreviewCart] = useState(null); // State for previewed cart

    useEffect(() => {
        // Fetch all users
        axios.get('http://localhost:5001/admin/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching users:', error));

        // Fetch current user's basket
        setBasket(JSON.parse(localStorage.getItem('basket')) || []);
    }, []);

    const handleAddToCollabCart = () => {
        const cartId = `collab-cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`; // Generate a unique cart ID

        axios.post('http://localhost:5001/api/collabCart', {
            cartId,
            userEmail: [user?.email, ...selectedUsers], // Spread the selectedUsers array
            products: basket,
        })
            .then(response => setCollabCart(response.data.collabCart))
            .catch(error => console.error('Error updating collab cart:', error));
    };

    const handlePreviewCollabCart = () => {
        if (!selectedUsers.length) {
            alert("Please select a user to preview their collab cart.");
            return;
        }
    
        const selectedUser = selectedUsers[selectedUsers.length - 1]; // Get the last selected user
        const currentUser = user?.email; // Current user's email
    
        if (!currentUser) {
            alert("Current user is not logged in.");
            return;
        }
    
        axios
            .get(`http://localhost:5001/api/collabCart/shared/${currentUser}/${selectedUser}`)
            .then(response => {
                if (response.data.length > 0) {
                    setPreviewCart(response.data); // Assuming you want to preview the first shared cart
                } else {
                    alert("No shared collab carts found.");
                }
            })
            .catch(error => console.error('Error fetching shared collab cart:', error));
    };

    return (
        <div>
            <h1>Collab Cart</h1>
            <div>
                <label>Select Users:</label>
                <select onChange={(e) => setSelectedUsers([...selectedUsers, e.target.value])}>
                    <option value="">Select a user</option>
                    {users.map(user => (
                        <option key={user.email} value={user.email}>{user.email}</option>
                    ))}
                </select>
            </div>
            <button onClick={handleAddToCollabCart}>Add Current Cart</button>
            <button onClick={handlePreviewCollabCart}>Preview</button> {/* New Preview Button */}
            {basket.map(item => (
                <CheckoutProduct
                    id={item.id}
                    title={item.title}
                    image={item.image}
                    price={item.price}
                    rating={item.rating}
                />
            ))}
            <h2>Collab Cart Preview</h2>
            <ul>
                {collabCart.products?.map((product, index) => (
                    <li key={index}>
                        <img src={product.image} alt={product.title} style={{ width: '100px' }} />
                        <h2>{product.title}</h2>
                        <p>Price: ${product.price}</p>
                        <p>Added by: {product.addedBy}</p>
                    </li>
                ))}
            </ul>

            {previewCart && (
            <div>
                <h2>Previewed Collab Carts</h2>
                {previewCart.map((cart, cartIndex) => (
                    <div key={cartIndex}>
                        <ul>
                            {cart.products?.map((product, index) => (
                                <li key={index}>
                                    <img src={product.image} alt={product.title} style={{ width: '100px' }} />
                                    <h2>{product.title}</h2>
                                    <p>Price: ${product.price}</p>
                                    <p>Added by: {product.addedBy}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        )}
        </div>
    );
}

export default CollabCart;