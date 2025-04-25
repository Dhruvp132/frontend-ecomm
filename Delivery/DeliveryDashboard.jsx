import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './DeliveryDashboard.css';

function DeliveryDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [updatedDeliveries, setUpdatedDeliveries] = useState({});
  const history = useHistory();

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get('http://localhost:5001/delivery');
        setDeliveries(response.data.deliveries);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };

    fetchDeliveries();
  }, []);

  const handleChange = (id, field, value) => {
    setUpdatedDeliveries((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleUpdate = async (id) => {
    const deliveryData = updatedDeliveries[id];
    if (deliveryData) {
      try {
        await axios.put('http://localhost:5001/delivery/update', {
          deliveryId: id,
          ...deliveryData,
        });
        setUpdatedDeliveries((prev) => ({ ...prev, [id]: undefined }));
        // Optionally, refresh the deliveries list
        // fetchDeliveries();
      } catch (error) {
        console.error('Error updating delivery:', error);
      }
    }
  };

  const handleDetails = (id) => {
    history.push(`/delivery/cartDetails/${id}`);
  };

  return (
    <div>
      <h1>Delivery Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User ID/Email</th>
            <th>Order Status</th>
            <th>Payment Status</th>
            <th>Delivery ID</th>
            <th>Delivery Agent ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => (
            <tr key={delivery._id}>
              <td>{delivery.orderId}</td>
              <td>{delivery.userId}</td>
              <td>
                <select
                  defaultValue={delivery.orderStatus}
                  onChange={(e) => handleChange(delivery._id, 'orderStatus', e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </td>
              <td>
                <select
                  defaultValue={delivery.paymentStatus}
                  onChange={(e) => handleChange(delivery._id, 'paymentStatus', e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </td>
              <td>{delivery.deliveryId}</td>
              <td>
                <input
                  type="text"
                  defaultValue={delivery.deliveryAgentId}
                  onChange={(e) => handleChange(delivery._id, 'deliveryAgentId', e.target.value)}
                />
              </td>
              <td>
                {updatedDeliveries[delivery._id] && (
                  <button onClick={() => handleUpdate(delivery._id)}>Update</button>
                )}
                <button onClick={() => handleDetails(delivery._id)}>Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DeliveryDashboard;