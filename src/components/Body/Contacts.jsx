import React from "react";
import { Button, ButtonGroup, Form } from "react-bootstrap";

// This component is a footer component that displays a form for customers to contact the seller(s). It should have an email submission form, as well as links to the sellers social medias
const Contacts = () => {
  return (
    <div>
      <Form>
        <Form.Group>
          <Form.Label>Contact us:</Form.Label>
          <Form.Control type="text" placeholder="send us an email" />
          <Button>Send</Button>
          <h3>You can also reach us at our socials</h3>
          <ButtonGroup>
            <Button>Facebook</Button>
            <Button>Instagram</Button>
            <Button>Twitter</Button>
          </ButtonGroup>
        </Form.Group>
      </Form>
    </div>
  );
};

export default Contacts;
