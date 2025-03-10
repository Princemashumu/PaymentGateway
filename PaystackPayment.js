import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { WebView } from 'react-native-webview';

const PaystackPayment = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    amount: '380.00',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/[^0-9]/g, ''))) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPaystackHtml = () => {
    const amountInCents = Math.round(parseFloat(formData.amount) * 100);
    const reference = `txn_ref_${Math.floor(Math.random() * 1000000 + 1)}_${Date.now()}`;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://js.paystack.co/v1/inline.js"></script>
          <script>
            function payWithPaystack() {
              var handler = PaystackPop.setup({
                key: 'pk_test_3bbc961d61b61ca3b68bd516ed9b7ff276ee0e78',
                email: '${formData.email}',
                amount: ${amountInCents},
                currency: 'ZAR',
                ref: '${reference}',
                metadata: {
                  custom_fields: [
                    { display_name: "First Name", variable_name: "first_name", value: '${formData.firstName}' },
                    { display_name: "Last Name", variable_name: "last_name", value: '${formData.lastName}' },
                    { display_name: "Phone Number", variable_name: "phone_number", value: '${formData.phoneNumber}' }
                  ]
                },
                callback: function(response) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    status: 'success',
                    reference: response.reference
                  }));
                },
                onClose: function() {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'cancelled' }));
                }
              });
              handler.openIframe();
            }
          </script>
        </head>
        <body onload="payWithPaystack()">
          <p style="text-align:center;">Processing Payment...</p>
        </body>
      </html>
    `;
  };

  const handlePaystackResponse = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.status === 'success') {
        setShowPayment(false);
        setLoading(false);
        Alert.alert('Payment Successful', `Reference: ${data.reference}`);
        verifyPayment(data.reference);
      } else if (data.status === 'cancelled') {
        setShowPayment(false);
        setLoading(false);
        Alert.alert('Transaction Cancelled', 'Transaction was not completed.');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      setShowPayment(false);
      setLoading(false);
      Alert.alert('Error', 'An error occurred during payment.');
    }
  };

  const verifyPayment = async (reference) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer sk_test_8dcc2ce210e27f464390096d8bdee4d8a5f62404`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.status && data.data.status === "success") {
        Alert.alert("Payment Verified", "Your payment was successful!");
      } else {
        Alert.alert("Verification Failed", "Payment verification failed.");
      }
    } catch (error) {
      Alert.alert("Error", "There was an error verifying your payment.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowPayment(true);
    } else {
      Alert.alert("Error", "Please fill out the form correctly.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.formTitle}>Payment Details</Text>
            <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={formData.email} onChangeText={(text) => setFormData({ ...formData, email: text })} />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            <TextInput style={styles.input} placeholder="First Name" value={formData.firstName} onChangeText={(text) => setFormData({ ...formData, firstName: text })} />
            {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
            <TextInput style={styles.input} placeholder="Last Name" value={formData.lastName} onChangeText={(text) => setFormData({ ...formData, lastName: text })} />
            {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
            <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={formData.phoneNumber} onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })} />
            {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}

            <TouchableOpacity style={styles.payButton} onPress={handleSubmit}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.payButtonText}>Proceed to Payment</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showPayment} animationType="slide" onRequestClose={() => setShowPayment(false)}>
        <WebView source={{ html: getPaystackHtml() }} onMessage={handlePaystackResponse} />
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginBottom: 10,
  },
  payButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
  },
});


export default PaystackPayment;