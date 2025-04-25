import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function CartDetails() {
  console.log("cartDeatailasdfl;kasjdflaksjdfladskjf")
  const { userId } = useParams();
  const [basket, setBasket] = useState([]);

  useEffect(() => {
    const fetchDelivery = async () => {
      const response = await fetch(`http://localhost:5001/delivery/cartDetails/${userId}`);
      const data = await response.json();
      console.log(data);
      setBasket(data.cartDetails.basket);
    };

    fetchDelivery();
  }, [userId]);

  return (
    <div>
      <h1>Cart Details</h1>
      <ul>
      {basket.map((item, index) => (
          <li key={index}>
            <img src={item.image} alt={item.title} style={{ width: '100px' }} />
            <h2>{item.title}</h2>
            <p>Price: ${item.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CartDetails;