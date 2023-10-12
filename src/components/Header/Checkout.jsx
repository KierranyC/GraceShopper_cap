import React, { useEffect, useState } from "react";
import {
  Elements,
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { useNavigate } from 'react-router-dom';

export const Checkout = ({ cart, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const paymentElementOptions = {
    layout: "tabs"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000",
      },
      payment_method_options: {
        card: {
          billing_details: {
            name: name,
            email: email,
          },
        },
      },
      clientSecret: clientSecret,
      items: cart.map((item) => ({
        id: item.productId,
        quantity: item.quantity,
      })),
    });

    if (error) {
      // Handle payment confirmation error
      setMessage(error.message);
    } else {
      // Payment confirmation was successful
      setMessage("Payment succeeded!");
      // You can add any additional logic here, such as redirecting the user to a success page.
      navigate('/'); // Adjust the URL as needed
    }

    setIsLoading(false);
  };

  return (
    <div>
      <form id="payment-form" onSubmit={handleSubmit}>
        <LinkAuthenticationElement
          id="link-authentication-element"
          onChange={(e) => setName(e.target.value)}
        />
        <LinkAuthenticationElement
          id="link-authentication-element"
          onChange={(e) => setEmail(e.target.value)}
        />
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <button disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text">
            {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
          </span>
        </button>
        {message && <div id="payment-message">{message}</div>}
      </form>
    </div>
  );
};
