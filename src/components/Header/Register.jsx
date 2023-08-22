import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { signUp } from "../../api";

// This component registers new users and adds them to the database.
const Register = ({ setToken, username, setUsername, setAndStoreUsername }) => {
  const [password, setPassword] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");



  // const DB_URL =
  //   process.env.DATABASE_URL || `http://localhost:5432/grace_shopper_db/api`;

  // const registerUser = async (username, password, setToken) => {
  //   try {
  //     const response = await fetch(`${DB_URL}/users/register`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         username,
  //         password,
  //       }),
  //     });
  //     const result = await response.json();
  //     console.log(result);
  //     return result;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(username);
    // registerUser(username, password, setToken, setSuccess, setError);
    signUp(email, username, password);
    setAndStoreUsername(username);
    setUsername("");
    setPassword("");
    setPassConfirm("");
    console.log(password);
  };

  return (
    <div>
      <h1>Create an Account</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            required
            value={username}
            placeholder="Enter a username"
            minLength="8"
            maxLength="20"
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
            minLength="10"
            maxLength="255"
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
            minLength="8"
            maxLength="20"
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
            minLength="8"
            maxLength="20"
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

export default Register;
