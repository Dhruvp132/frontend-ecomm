import React, { useState, useEffect } from "react";
import "./Home.css";
import Product from "./Product";
import axios from "axios";
import { useLocation } from "react-router-dom";


function Home() {
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation();

  // Extract search keyword from query parameters
  const searchKeyword = new URLSearchParams(location.search).get("search") || "";

  // Fetch products from the API
  useEffect(() => {
    const addProducts = async () => {
      const product = { id : 0, title: 'Samsung LC49RG90SSUXEN 49 Curved LED Gaming Monitor', price: 199.99, description: 'Super Ultra Wide Dual WQHD 5120 x 1440', category: "electronics", image: "https://images-na.ssl-images-amazon.com/images/I/71Swqqe7XAL._AC_SX466_.jpg" };
      axios.post('https://fakestoreapi.com/products', product)
        .then(response => console.log(response.data));
    }

    const fetchProducts = async () => {
      try {
        const [localResponse, apiResponse] = await Promise.all([
          axios.get("http://localhost:5001/admin/products"),
          axios.get("https://fakestoreapi.com/products")
        ]);
  
        const localProducts = localResponse.data.products || [];
        const apiProducts = apiResponse.data || [];
  
        // Combine both product arrays
        const combinedProducts = [...localProducts, ...apiProducts];
        setFetchedProducts(combinedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    addProducts(); 
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchKeyword) {
      const filtered = fetchedProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          (product.description &&
            product.description.toLowerCase().includes(searchKeyword.toLowerCase()))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(fetchedProducts);
    }
  }, [searchKeyword, fetchedProducts]);

  return (
    <div className="home">
      <div className="home__container">
        <img
          className="home__image"
          src="https://images-eu.ssl-images-amazon.com/images/G/02/digital/video/merch2016/Hero/Covid19/Generic/GWBleedingHero_ENG_COVIDUPDATE__XSite_1500x600_PV_en-GB._CB428684220_.jpg"
          alt=""
        />

        {/* Hardcoded products */}
        {!searchKeyword && (
          <div>
          <div className="home__row">
          <Product
            id="12321341"
            title="The Lean Startup: How Constant Innovation Creates Radically Successful Businesses Paperback"
            price={11.96}
            rating={5}
            image="https://images-na.ssl-images-amazon.com/images/I/51Zymoq7UnL._SX325_BO1,204,203,200_.jpg"
          />
          <Product
            id="49538094"
            title="Kenwood kMix Stand Mixer for Baking, Stylish Kitchen Mixer with K-beater, Dough Hook and Whisk, 5 Litre Glass Bowl"
            price={239.0}
            rating={4}
            image="https://images-na.ssl-images-amazon.com/images/I/81O%2BGNdkzKL._AC_SX450_.jpg"
          />
        </div>

        <div className="home__row">
          <Product
            id="4903850"
            title="Samsung LC49RG90SSUXEN 49' Curved LED Gaming Monitor"
            price={199.99}
            rating={3}
            image="https://images-na.ssl-images-amazon.com/images/I/71Swqqe7XAL._AC_SX466_.jpg"
          />
          <Product
            id="23445930"
            title="Amazon Echo (3rd generation) | Smart speaker with Alexa, Charcoal Fabric"
            price={98.99}
            rating={5}
            image="https://media.very.co.uk/i/very/P6LTG_SQ1_0000000071_CHARCOAL_SLf?$300x400_retinamobilex2$"
          />
          <Product
            id="3254354345"
            title="New Apple iPad Pro (12.9-inch, Wi-Fi, 128GB) - Silver (4th Generation)"
            price={598.99}
            rating={4}
            image="https://images-na.ssl-images-amazon.com/images/I/816ctt5WV5L._AC_SX385_.jpg"
          />
        </div>
        <div className="home__row">
          <Product
            id="90829332"
            title="Samsung LC49RG90SSUXEN 49' Curved LED Gaming Monitor - Super Ultra Wide Dual WQHD 5120 x 1440"
            price={1094.98}
            rating={4}
            image="https://images-na.ssl-images-amazon.com/images/I/6125mFrzr6L._AC_SX355_.jpg"
          />
        </div>
        </div>
        )}

        {/* Fetched products in a scrollable section */}
        <div className="home__fetchedProducts">
        <h2>Browse More Products</h2>
        <div className="home__row_more">
          {filteredProducts.map((product) => (
            <Product
              key={product.id} 
              id={product.id}
              title={product.title}
              price={product.price}
              rating={product.rating || 4} 
              image={product.image}
            />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

export default Home;
