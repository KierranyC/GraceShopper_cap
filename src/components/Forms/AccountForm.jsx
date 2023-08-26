import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { editUser, fetchUser } from "../../api";
import { useNavigate } from "react-router-dom";

// This component is a form for account information. This component should render a form for customers to modify their username, password, customer name (if thats something we want to include), and optionally profile pic. Not sure yet if I want to include payment information directly onto this form, or have it be somewhere else.

// This component COULD become a Modal but not sure how to get them working yet :(
export const AccountForm = ({ username, setUsername, setAndStoreUsername }) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = fetchUser(username);
    setUserId(user.id);
    editUser(username, password, email, userId, token);
    setAndStoreUsername(username);
    setPassword("");
    setPassConfirm("");
    setEmail("");
    setUserId("");
    navigate("/account");
  };

  return (
    <div>
      <h1>Account Form</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Edit Username:</Form.Label>
          <Form.Control
            type="text"
            required
            value={username}
            placeholder="Enter a new username"
            minLength={3}
            maxLength={20}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>New Email Address:</Form.Label>
          <Form.Control
            type="email"
            value={email}
            placeholder="Enter a new email address"
            minLength={10}
            maxLength={255}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Edit Password:</Form.Label>
          <Form.Control
            type="password"
            required
            value={password}
            placeholder="Enter a new password"
            minLength={8}
            maxLength={20}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Confirm New Password:</Form.Label>
          <Form.Control
            type="password"
            required
            value={passConfirm}
            placeholder="Re-enter your new password"
            minLength={8}
            maxLength={20}
            onChange={(event) => {
              setPassConfirm(event.target.value);
            }}
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Update Account
        </Button>
        {password !== passConfirm ? <p>Passwords do not match</p> : null}
      </Form>
      {error && <Alert variant="danger">Error: {error}</Alert>}
      {success && <Alert variant="success">Account Updated.</Alert>}
    </div>
  );
};
