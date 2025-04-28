import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const API_BASE = "http://localhost:5001/"; // Change if your backend runs elsewhere

const DeliveryAuth = () => {
    const [isSignIn, setIsSignIn] = useState(true);
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        const endpoint = isSignIn ? "delivery/deliverysignin" : "delivery/deliverysignup";
        try {
            const res = await fetch(`${API_BASE}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.status === 200) {
                history.replace('/delivery/dashboard');
                setMessage(data.msg);
            }  else {
                setMessage(data.msg || "Something went wrong");
            }
        } catch (err) {
            console.error(err);
            setMessage("Network error");
        }
    };

    return (
        <div style={{ maxWidth: 350, margin: "40px auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                <button
                    style={{ flex: 1, background: isSignIn ? "#232f3e" : "#fff", color: isSignIn ? "#fff" : "#232f3e", border: "1px solid #232f3e", padding: 8, cursor: "pointer" }}
                    onClick={() => setIsSignIn(true)}
                >
                    Sign In
                </button>
                <button
                    style={{ flex: 1, background: !isSignIn ? "#232f3e" : "#fff", color: !isSignIn ? "#fff" : "#232f3e", border: "1px solid #232f3e", padding: 8, cursor: "pointer" }}
                    onClick={() => setIsSignIn(false)}
                >
                    Sign Up
                </button>
            </div>
            <h2 style={{ textAlign: "center" }}>{isSignIn ? "Delivery User Sign In" : "Delivery User Sign Up"}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 12 }}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                </div>
                <button type="submit" style={{ width: "100%", padding: 10, background: "#232f3e", color: "#fff", border: "none", borderRadius: 4 }}>
                    {isSignIn ? "Sign In" : "Sign Up"}
                </button>
            </form>
            {message && (
                <div style={{ marginTop: 16, color: message.includes("success") ? "green" : "red", textAlign: "center" }}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default DeliveryAuth;