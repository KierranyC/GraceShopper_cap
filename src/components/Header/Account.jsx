import { useEffect, useState } from "react";
import { fetchOrders } from "../../api";
import { useNavigate } from "react-router-dom";
const { Button } = require("react-bootstrap");

// This component renders all relevant information to a specific user. This should display their username, password(hidden) with the ability to change their password, past orders, wishlist(s), and their cart. I am unsure if I want payment methods to be on account or something else more secure
export const Account = ({ username, setUsername, token }) => {
  const [orders, setOrders] = useState("");
  const [products, setProducts] = useState("");
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate("/User/Edit");
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    setOrders(fetchOrders(username, token));
    console.log("my orders:", orders);
  }, [username]);

  return (
    <div>
      <h1>Welcome {username}</h1>
      <h2>Order History</h2>
      {/* {orders.map((order) => (
        <Card key={order.id} className="mb-3">
          <Card.Body>
            <Card.Text>Order Summary:</Card.Text>
            <ul>
              <li>order items here</li>
            </ul>
          </Card.Body>
        </Card>
      ))} */}
      <h3>Account Settings</h3>
      <Button onClick={handleEdit}>Edit Account Information</Button>
    </div>
  );
};
