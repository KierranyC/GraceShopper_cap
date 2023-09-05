import React, { useState } from 'react';
import { Button } from "react-bootstrap";
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
const stripePromise = loadStripe('pk_test_51NioUWB9h1tasC0ykIAyg7SJbGfRNzDb559q33iMjua0tFBflE1PxXUskslPBws3LAq6f91Ft28FbWV6ngJJszvF004IsSpnXR')

export const PaymentForm = ({ cart }) => {
  const [paymentError, setPaymentError] = React.useState(null);
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async () => {

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet, or Elements is not ready.
      return;
    }

    // Create a payment method using CardElement
    const { paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });


    try {
      const response = await fetch('http://localhost:4000/api/cart/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart, paymentMethod }),
      });

      if (response.ok) {
        // Payment was successful, navigate to a success page
        // You can also handle other success actions here
        const responseData = await response.json();

        // Confirm the payment with the clientSecret
        const { clientSecret } = responseData;
        const { paymentIntent, error: confirmationError } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });

        if (confirmationError) {
          console.error(confirmationError);
          setPaymentError('Payment confirmation failed. Please try again.');
        } else {
          console.log('Payment confirmed successfully:', paymentIntent);
          // Handle success, e.g., show a success message or navigate to a success page
        }
      } else {
        // Payment failed, handle the error
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
      <h2>Checkout</h2>
      <Elements stripe={stripePromise}>
        <div>
          <h3>Payment Information</h3>
          <CardElement />
        </div>
      </Elements>
      {paymentError && <p className="error">{paymentError}</p>}
      <Button onClick={handlePayment}>Pay Now</Button>
    </div>
  );
};

