import React, { useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Home from "./Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Checkout from "./Checkout";
import Login from "./Login";
import Payment from "./Payment";
import Orders from "./Orders";
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import AdminDashboard from "./Admin/AdminDashboard";
import DeliveryDashboard from "./Delivery/DeliveryDashboard";
import PaymentSuccess from "./PaymentSuccess";
import { Redirect } from "react-router-dom/cjs/react-router-dom";
import CartDetails from "./components/CartDetails";
import CollabCart from "./Collab/CollabCart";
import AdminAuth from "./Admin/AdminAuth";
import DeliveryAuth from "./Delivery/DeliveryAuth";

const promise = loadStripe(
  "pk_test_51R1R5HJlvCjqT1EtEInaYXkY3L2n7M2zXbE8FiO2EUZwMOqT7k3fJM0LOag5r7OIaX1XI7dQ4zsYd7lT4LRqenoA00q51mtuvJ"
);

function App() {
  const [{}, dispatch] = useStateValue();
  console.log("first")
  useEffect(() => {
    // will only run once when the app component loads...

    auth.onAuthStateChanged((authUser) => {
      console.log("THE USER IS >>> ", authUser);

      if (authUser) {
        // the user just logged in / the user was logged in

        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        // the user is logged out
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);

  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/orders">
            <Header />
            <Orders />
          </Route>
          {/* <Route path="/admin/dashbboard">
            <AdminDashboard />
          </Route> */}

      <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin">
            <AdminAuth></AdminAuth>
          </Route>
          
          {/* not gonna hit if i put that donw  */}
          <Route path="/delivery/dashboard">
            <DeliveryDashboard />
          </Route>
          <Route path="/delivery" component={DeliveryAuth} />
          <Route path="/delivery/cartDetails/:userId" component={CartDetails} />
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/payment-success" render={(props) => (
            props.location.state && props.location.state.paymentSuccess ? (
              <PaymentSuccess />
            ) : (
              <Redirect to="/" />
            )
          )} />
          <Route path="/checkout">
            <Header />
            <Checkout />
          </Route>
          <Route path="/payment">
            <Header />
            <Elements stripe={promise}>
              <Payment />
            </Elements>
          </Route>
          <Route path="/collab">
          <Header />
          <CollabCart></CollabCart>
          </Route>
          <Route path="/">
            <Header />
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
