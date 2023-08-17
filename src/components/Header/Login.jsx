const { useState } = require("react");
const { Alert } = require("react-bootstrap");
const { Form, Link } = require("react-bootstrap/lib/Navbar");
const { Container } = require("react-bootstrap/lib/Tab");

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  return (
    <Container>
      <h1>Login</h1>
      <Form>
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
    </Container>
  );
};

export default Login;
