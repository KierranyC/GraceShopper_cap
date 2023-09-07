import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
const stripePromise = loadStripe('pk_test_51NioUWB9h1tasC0ykIAyg7SJbGfRNzDb559q33iMjua0tFBflE1PxXUskslPBws3LAq6f91Ft28FbWV6ngJJszvF004IsSpnXR')
import { Button, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

const PaymentForm = ({ setCart, cart, token }) => {
  const [paymentError, setPaymentError] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const [cardholderName, setCardholderName] = useState('')
  const navigate = useNavigate()
  const handlePayment = async () => {

    if (!stripe || !elements) {
      return;
    }

    const { paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        name: cardholderName,
      },
    });


    try {
      const response = await fetch('http://localhost:4000/api/cart/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ cart, paymentMethod }),
      });
      if (response.ok) {
        const responseData = await response.json();

        const { clientSecret } = responseData;
        const { paymentIntent, error: confirmationError } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });

        if (confirmationError) {
          console.error(confirmationError);
          alert('Payment confirmation failed. Please try again.');
        } else {
          navigate('/')
          alert('Payment confirmed successfully:');
          setCart([])
        }
      } else {
        console.error('Payment failed');
        const responseData = await response.json();
        console.error(responseData.error);
        setPaymentError('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error sending payment to server:', error);
      setPaymentError('Payment failed. Please try again.');
    }

  };


  return (
    <div>
      <div>
        <h3>Payment Information</h3>
        <CardElement />
      </div>
      <Form.Group controlId="cardholderName">
        <Form.Control
          type="text"
          placeholder="Cardholder Name"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
        />
      </Form.Group>
      {paymentError && <p className="error">{paymentError}</p>}
      <Button onClick={handlePayment}>Pay Now</Button>
    </div>
  );
};


export const Checkout = ({ setCart, cart, token }) => {


  return (
    <div>
      <h2>Checkout</h2>
      <Elements stripe={stripePromise}>
        <PaymentForm setCart={setCart} token={token} cart={cart} />
      </Elements>
    </div>
  );
};

