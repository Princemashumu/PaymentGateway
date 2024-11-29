import React, { useEffect } from 'react';

const PaystackPayment = () => {
  useEffect(() => {
    // Load Paystack inline.js script when the component mounts
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => console.log('Paystack script loaded');
    document.body.appendChild(script);

    // Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const payWithPaystack = () => {
    const handler = PaystackPop.setup({
      key: 'pk_test_3bbc961d61b61ca3b68bd516ed9b7ff276ee0e78', // Replace with your Paystack public key
      email: 'customer@example.com', // The email address of the user
      amount: 5000, // Amount in kobo (e.g., 5000 kobo = 50.00 units of the currency)
      currency: 'ZAR',
      ref: 'txn_ref_' + Math.floor((Math.random() * 1000000) + 1), // Unique reference number for the transaction
      callback: (response) => {
        // Handle payment success
        alert('Payment was successful. Payment reference: ' + response.reference);
        // Optionally, send the reference to your server to verify and complete the payment.
        verifyPayment(response.reference);
      },
      onClose: () => {
        alert('Transaction was not completed.');
      },
    });

    handler.openIframe();
  };

  // Function to verify the payment on the server side
  const verifyPayment = (reference) => {
    // Example: Make an AJAX request to your server to verify the payment
    fetch('https://your-server.com/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reference: reference }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          alert('Payment successfully verified on the server');
        } else {
          alert('Payment verification failed');
        }
      })
      .catch((error) => {
        console.error('Error verifying payment:', error);
        alert('There was an error verifying your payment');
      });
  };

  return (
    <div>
      <button onClick={payWithPaystack}>Pay with Paystack</button>
    </div>
  );
};

export default PaystackPayment;
