import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const PaystackPayment = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => console.log('Paystack script loaded');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const payWithPaystack = () => {
    const handler = PaystackPop.setup({
      key: 'pk_test_3bbc961d61b61ca3b68bd516ed9b7ff276ee0e78',
      email: 'customer@example.com',
      amount: 38000,
      currency: 'ZAR',
      ref: 'txn_ref_' + Math.floor(Math.random() * 1000000 + 1),
      callback: (response) => {
        Alert.alert('Payment Successful', `Reference: ${response.reference}`);
        verifyPayment(response.reference);
      },
      onClose: () => {
        Alert.alert('Transaction Cancelled', 'Transaction was not completed.');
      },
    });

    handler.openIframe();
  };

  const verifyPayment = (reference) => {
    fetch('https://your-server.com/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reference }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          Alert.alert('Payment Verified', 'Payment successfully verified on the server.');
        } else {
          Alert.alert('Verification Failed', 'Payment verification failed.');
        }
      })
      .catch((error) => {
        console.error('Verification Error:', error);
        Alert.alert('Error', 'There was an error verifying your payment.');
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Order: R300.00</Text>
        <Text style={styles.summaryText}>Taxes: R30.00</Text>
        <Text style={styles.summaryText}>Delivery Fees: R50.00</Text>
        <Text style={styles.totalText}>Total: R380.00</Text>
      </View>

      <TouchableOpacity style={styles.payButton} onPress={payWithPaystack}>
        <Text style={styles.payButtonText}>Pay with Paystack</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  summaryText: {
    fontSize: 16,
    marginVertical: 5,
    color: '#555',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000',
  },
  payButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaystackPayment;
