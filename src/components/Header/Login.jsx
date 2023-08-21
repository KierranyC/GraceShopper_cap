const { useState } = require("react");
const { Alert, Button, Form } = require("react-bootstrap");
import { Link } from "react-router-dom";
// const { Form, Link } = require("react-bootstrap/lib/Navbar");

// This component logs in users
const Login = ({ setToken, username, setUsername, setAndStoreUsername }) => {
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(username);
    console.log(password);
    login(username, password, setToken, setSuccess, setError);
    setAndStoreUsername(username);
    setUsername("");
    setPassword("");
    history.push("/");
  };

  const DB_URL =
    process.env.DATABASE_URL || `http://localhost:5432/grace_shopper_db/api`;

  const login = async (username, password, setToken) => {
    try {
      const response = await fetch(`${DB_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const result = await response.json();
      console.log(result);
      setToken(result.token);
      return result;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            required
            value={username}
            placeholder="Enter your username"
            minLength="8"
            maxLength="20"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            value={password}
            placeholder="Enter your password"
            minLength="8"
            maxLength="20"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Log In
        </Button>
        <Link to="/register">Don't have an account? Sign up for FREE!!</Link>
      </Form>
      {error && <Alert variant="danger">Error: {error}</Alert>}
      {success && <Alert variant="success">Successfully Logged in!</Alert>}
    </div>
  );
};

export default Login;
