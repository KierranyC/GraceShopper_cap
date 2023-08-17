import React from "react";
import { Button, ButtonGroup, Form } from "react-bootstrap";

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
