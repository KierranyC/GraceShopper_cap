import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { fetchUserCart, signUp } from "../../apiCalls";
import { useNavigate } from "react-router-dom";
import { updateCart } from "../../apiCalls";

// This component registers new users and adds them to the database.
export const Register = ({
  token,
  setToken,
  username,
  setUsername,
  setAndStoreUsername,
  cart,
  setCart,
  storedGuestSessionId,
  guestCart,
  setIsLoggedIn,
  setIsAdmin,
  setUserId
}) => {
  // UseStates for Register
  const [password, setPassword] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  // console.log('CURRENT GUEST ID AND GUEST CART:', storedGuestSessionId, guestCart)
  // A function that submits data entered into the fields and empties the fields
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (username.length < 8) {
      alert('Username must be at least 8 characters!')
    } else if (password.length < 8) {
      alert('Password must be at least 8 characters!')
    } else {

      const fetchAndUpdateUserCart = async (userToken) => {
        try {
          const userCart = await fetchUserCart(userToken)
          setCart(userCart)
          localStorage.setItem("cart", JSON.stringify(userCart))
        } catch (error) {
          console.error(error)
        }
      }

      const registerUser = async () => {
        try {
          const result = await signUp(email, username, password);
          console.log("NEW USER:", result);
          setToken(result.token);
          setIsLoggedIn(true)
          setAndStoreUsername(username);
          setUserId(result.id)
          // setUsername("");
          setEmail("");
          setPassword("");
          setPassConfirm("");
          if (guestCart.length > 0) {
            await updateCart(result.token, storedGuestSessionId)
            fetchAndUpdateUserCart(result.token)
            setIsLoggedIn(true)
          }
          if (result.token) {
            navigate("/");
          }



        } catch (error) {
          console.log(error);
        }
      };
      registerUser();
    }
  };

  return (
    <div className="text-center form">
      <h1 className="form-header">Create an Account</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            required
            value={username}
            placeholder="Enter a username"
            minLength={8}
            maxLength={20}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            value={email}
            placeholder="Enter a Email Adress"
            minLength={10}
            maxLength={255}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            value={password}
            placeholder="Enter a password"
            minLength={8}
            maxLength={20}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            required
            value={passConfirm}
            placeholder="Re-enter your password"
            minLength={8}
            maxLength={20}
            onChange={(e) => setPassConfirm(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Create Account
        </Button>
        {password !== passConfirm ? <p>Passwords do not match</p> : null}
      </Form>
      {error && <Alert variant="danger">Error: {error}</Alert>}
      {success && <Alert variant="success">Account Created</Alert>}
    </div>
  );
};
