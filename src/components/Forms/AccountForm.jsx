import React, { useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { editUser, fetchUserData } from "../../api";
import { useNavigate } from "react-router-dom";

// This component is a form for account information. 
// This component should render a form for customers to modify 
// their username, password, customer name(if thats something we 
// want to include), and optionally profile pic.Not sure yet if I 
// want to include payment information directly onto this form, or 
// have it be somewhere else.

// This component COULD become a Modal but not sure how to get them working yet :(
export const AccountForm = ({
  setUsername,
  username,
  token,
  setAndStoreUsername,
  id,
  setId,
}) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const newUserInfo = await editUser(username, password, email, id, token);
  //   console.log("NEW USER INFO:", newUserInfo);
  //   setAndStoreUsername(newUserInfo.username);
  //   setUsername(newUserInfo.username);
  //   setPassword("");
  //   setPassConfirm("");
  //   setEmail("");
  //   navigate('/account')
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create an object to hold the new user information
    const updatedUserInfo = {};

    if (username.length !== 0) {
      updatedUserInfo.username = username;
    }
    if (email.length !== 0) {
      updatedUserInfo.email = email;
    }
    if (password.length !== 0 && password === passConfirm) {
      updatedUserInfo.password = password;
    } else if (password !== passConfirm) {
      setError("Passwords do not match");
      return;
    }

    // Check if any fields are being updated
    if (Object.keys(updatedUserInfo).length === 0) {
      setError("No changes were made");
      return;
    }

    setError("");

    try {
      const userInfo = await fetchUserData(token)
      console.log(userInfo)
      const newUserInfo = await editUser(
        username, password, email, userInfo.id, token
      );
      setAndStoreUsername(newUserInfo.username);
      // Update the relevant state values
      if (updatedUserInfo.username) {
        setAndStoreUsername(newUserInfo.username);
        setUsername(newUserInfo.username);
      }
      if (updatedUserInfo.email) {
        setEmail("");
      }
      if (updatedUserInfo.password) {
        setPassword("");
        setPassConfirm("");
      }

      setSuccess(true);
      navigate("/account")
    } catch (error) {
      setError("Error updating account: " + error.message);
    }
  };

  return (
    <div>
      <h1>Account Form</h1>
      <Form onSubmit={event => handleSubmit(event)}>
        <Form.Group className="mb-3">
          <Form.Label>Edit Username:</Form.Label>
          <Form.Control
            type="text"
            // required
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
            // required
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
            // required
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
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Account Updated.</Alert>}
    </div>
  );
};

