import { useEffect, useState } from "react";
import { fetchUserOrders, fetchUserData } from "../../apiCalls";
import { useNavigate } from "react-router-dom";
// const { Button } = require("react-bootstrap");
import { Button, Card } from 'react-bootstrap';

// This component renders all relevant information to a specific user. 
// This should display their username, password(hidden) with the ability 
// to change their password, past orders, wishlist(s), and their cart.
// I am unsure if I want payment methods to be on account or something else 
// more secure
export const Account = ({ username, setToken, token, userId, setUserId, userOrders }) => {
  const navigate = useNavigate();

  // A function for navigating a user to the User Edit form
  const handleEdit = () => {
    navigate("/User/Edit");
  };

  return (
    <div>
      <h1>Welcome {username}</h1>
      <h2>Order History</h2>
      {userOrders.length > 0 ? (
        userOrders.map((order) => (
          <Card key={order.id} className="mb-3">
            <Card.Body>
              <Card.Text>Order Summary:</Card.Text>
              {order.items.map((item) =>
                <div key={item.id} >
                  <Card.Text> {item.productInfo.title} </Card.Text>
                  <Card.Text> {item.quantity} </Card.Text>
                  <Card.Text> ${item.productInfo.price} </Card.Text>
                </div>
              )}
              <p>Order Total: {order.totalAmount}</p>
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
