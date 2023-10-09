import React, { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements, EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
const stripePromise = loadStripe('pk_test_51NyLPaIBy4kJpJhvTFk3beqwAfOzv0uvXxdY5KjRMvrvY7wwJg79L2gtznLpEwFRn6DvlwozwjklbSMKzUNDJ6IX00aNA7MIO1', {
  betas: ['embedded_checkout_beta_1']
});
import { Button, Form } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';

export const Checkout = () => {
  const [clientSecret, setClientSecret] = useState('');
  const { cart } = useLocation().state;

  // useEffect(() => {
  //   // Create a Checkout Session as soon as the page loads
  //   fetch("http://localhost:4000/api/cart/create-checkout-session", {
  //     method: "POST",
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setClientSecret(data.clientSecret));
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Create a Checkout Session as soon as the page loads
        const response = await fetch("http://localhost:4000/api/cart/create-checkout-session", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cart }), // Send the 'cart' data in the request body
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating checkout session:', error);
        // Handle the error here, e.g., show an error message to the user
      }
    };

    fetchData();
  }, [cart]); // Add 'cart' as a dependency to re-fetch when it changes

  return (
    <div id="checkout">
      {clientSecret && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  )
}













// const PaymentForm = ({ setCart, cart, token }) => {
//   const [paymentError, setPaymentError] = useState(null);
//   const stripe = useStripe();
//   const elements = useElements();
//   const [cardholderName, setCardholderName] = useState('')
//   const navigate = useNavigate()
//   const handlePayment = async () => {

//     if (!stripe || !elements) {
//       return;
//     }

//     const { paymentMethod } = await stripe.createPaymentMethod({
//       type: 'card',
//       card: elements.getElement(CardElement),
//       billing_details: {
//         name: cardholderName,
//       },
//     });


//     try {
//       const response = await fetch('http://localhost:4000/api/cart/checkout', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({ cart, paymentMethod }),
//       });
//       if (response.ok) {
//         const responseData = await response.json();

//         const { clientSecret } = responseData;
//         const { paymentIntent, error: confirmationError } = await stripe.confirmCardPayment(clientSecret, {
//           payment_method: paymentMethod.id,
//         });

//         if (confirmationError) {
//           console.error(confirmationError);
//           alert('Payment confirmation failed. Please try again.');
//         } else {
//           navigate('/')
//           alert('Payment confirmed successfully:');
//           setCart([])
//         }
//       } else {
//         console.error('Payment failed');
//         const responseData = await response.json();
//         console.error(responseData.error);
//         setPaymentError('Payment failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error sending payment to server:', error);
//       setPaymentError('Payment failed. Please try again.');
//     }

//   };


//   return (
//     <div>
//       <div>
//         <h3>Payment Information</h3>
//         <CardElement />
//       </div>
//       <Form.Group controlId="cardholderName">
//         <Form.Control
//           type="text"
//           placeholder="Cardholder Name"
//           value={cardholderName}
//           onChange={(e) => setCardholderName(e.target.value)}
//         />
//       </Form.Group>
//       {paymentError && <p className="error">{paymentError}</p>}
//       <Button onClick={handlePayment}>Pay Now</Button>
//     </div>
//   );
// };


// export const Checkout = ({ setCart, cart, token }) => {


//   return (
//     <div>
//       <h2>Checkout</h2>
//       <Elements stripe={stripePromise}>
//         <PaymentForm setCart={setCart} token={token} cart={cart} />
//       </Elements>
//     </div>
//   );
// };

