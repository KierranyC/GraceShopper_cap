import React from "react";
import { Button, ButtonGroup, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

// This is a footer component that displays a form for customers to contact the seller(s). It should have links to the seller's social medias
export const Contacts = () => {
  return (
    <div>
      <Form className="contacts-form">
        <Form.Group>
          {/* <Form.Label>Contact us:</Form.Label>
          <Form.Control type="text" placeholder="send us an email" />
          <Button>Send</Button> */}
          <h3>You can also reach us at our socials</h3>
          <Button className="m-2 p-2 rounded-pill" href="https://facebook.com">
            <FontAwesomeIcon icon={faFacebook} size="3x" />
          </Button>
          <Button className="m-2 p-2 rounded-pill" href="https://instagram.com">
            <FontAwesomeIcon icon={faInstagram} size="3x" />
          </Button>
          <Button className="m-2 p-2 rounded-pill" href="https://twitter.com">
            <FontAwesomeIcon icon={faTwitter} size="3x" />
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};
