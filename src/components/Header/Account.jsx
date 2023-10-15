import { useEffect, useState } from "react";
import { fetchUserOrders, fetchUserData } from "../../apiCalls";
import { useNavigate } from "react-router-dom";
const { Button } = require("react-bootstrap");

// This component renders all relevant information to a specific user. This should display their username, password(hidden) with the ability to change their password, past orders, wishlist(s), and their cart. I am unsure if I want payment methods to be on account or something else more secure
export const Account = ({ username, setToken, token, userId, setUserId, userOrders }) => {
  // UseStates for Account
  // const [userOrders, setUserOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // A function for navigating a user to the User Edit form
  const handleEdit = () => {
    navigate("/User/Edit");
  };

  // // Gets a users information once on startup
  // useEffect(() => {
  //   async function getUserInfo() {
  //     const token = localStorage.getItem("token");
  //     const user = await fetchUserData(token);
  //     setUserId(user.id);
  //     const orders = await fetchUserOrders(user.username, token);
  //     setUserOrders(orders);
  //     console.log("my orders:", orders);
  //   }
  //   getUserInfo();
  // }, []);

  return (
    <div>
      <h1>Welcome {username}</h1>
      <h2>Order History</h2>
      {userOrders.length > 0 ? (
        userOrders.map((order) => (
          <Card key={order.id} className="mb-3">
            <Card.Body>
              <Card.Text>Order Summary:</Card.Text>
              <ul>
                <li>order items here</li>
              </ul>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>You currently have no orders.</p>
      )}
      <h3>Account Settings</h3>
      <Button onClick={handleEdit}>Edit Account Information</Button>
    </div>
  );
};
