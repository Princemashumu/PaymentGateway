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
    amount: '380.00', // Default amount
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

  const generateRef = () => `txn_ref_${Math.floor(Math.random() * 1000000 + 1)}_${Date.now()}`;

  const getPaystackHtml = () => {
    const amountInCents = Math.round(parseFloat(formData.amount) * 100);
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://js.paystack.co/v1/inline.js"></script>
          <style>
            body {
              background-color: #f8f8f8;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .payment-container {
              background-color: white;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              width: 100%;
              max-width: 400px;
            }
            .payment-header {
              text-align: center;
              margin-bottom: 20px;
            }
            .payment-amount {
              font-size: 24px;
              font-weight: bold;
              color: #333;
            }
          </style>
        </head>
        <body>
          <div class="payment-container">
            <div class="payment-header">
              <div class="payment-amount">R${formData.amount}</div>
            </div>
          </div>
          <script type="text/javascript">
            window.onload = function() {
              PaystackPop.setup({
                key: 'pk_test_3bbc961d61b61ca3b68bd516ed9b7ff276ee0e78', // Replace with your public key
                email: '${formData.email}',
                amount: ${amountInCents},
                currency: 'ZAR',
                ref: '${generateRef()}',
                metadata: {
                  custom_fields: [
                    {
                      display_name: "First Name",
                      variable_name: "first_name",
                      value: '${formData.firstName}'
                    },
                    {
                      display_name: "Last Name",
                      variable_name: "last_name",
                      value: '${formData.lastName}'
                    },
                    {
                      display_name: "Phone Number",
                      variable_name: "phone_number",
                      value: '${formData.phoneNumber}'
                    }
                  ]
                },
                callback: function(response) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    status: 'success',
                    reference: response.reference,
                    transaction: response.transaction
                  }));
                },
                onClose: function() {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    status: 'cancelled'
                  }));
                }
              });
            }
          </script>
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
    console.log("Verifying payment with reference:", reference);
  
    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: "GET",
        headers: {
          Authorization: `sk_test_8dcc2ce210e27f464390096d8bdee4d8a5f62404`,  // Replace with your Paystack secret key
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
      console.log("Verification Response:", data);
  
      if (data.status && data.data.status === "success") {
        Alert.alert("Payment Verified", "Your payment was successful!");
      } else {
        Alert.alert("Verification Failed", "Payment verification failed.");
      }
    } catch (error) {
      console.error("Verification Error:", error);
      Alert.alert("Error", "There was an error verifying your payment.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      setShowPayment(true);
      
      // Show a success alert after validation
      Alert.alert("Success", "Your payment is being processed!");
    } else {
      // Optionally, you can show an alert for form validation failure
      Alert.alert("Error", "Please fill out the form correctly.");
    }
  };

  const renderField = (label, field, placeholder, keyboardType = 'default') => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[field] && styles.inputError]}
        value={formData[field]}
        onChangeText={(text) => setFormData(prev => ({ ...prev, [field]: text }))}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={field === 'email' ? 'none' : 'words'}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <View style={styles.orderSummary}>
              <Text style={styles.orderTitle}>Order Summary</Text>
              <View style={styles.orderDetails}>
                <View style={styles.orderRow}>
                  <Text>Order Amount:</Text>
                  <Text>R300.00</Text>
                </View>
                <View style={styles.orderRow}>
                  <Text>Tax:</Text>
                  <Text>R30.00</Text>
                </View>
                <View style={styles.orderRow}>
                  <Text>Delivery Fee:</Text>
                  <Text>R50.00</Text>
                </View>
                <View style={[styles.orderRow, styles.totalRow]}>
                  <Text style={styles.totalText}>Total:</Text>
                  <Text style={styles.totalAmount}>R380.00</Text>
                </View>
              </View>
            </View>

            <View style={styles.form}>
              <Text style={styles.formTitle}>Payment Details</Text>
              {renderField('Email', 'email', 'Enter your email', 'email-address')}
              {renderField('First Name', 'firstName', 'Enter your first name')}
              {renderField('Last Name', 'lastName', 'Enter your last name')}
              {renderField('Phone Number', 'phoneNumber', 'Enter your phone number', 'phone-pad')}
            </View>

            <TouchableOpacity
              style={styles.payButton}
              onPress={handleSubmit}
              // disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.payButtonText}>Proceed to Payment</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showPayment}
        animationType="slide"
        onRequestClose={() => setShowPayment(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Complete Payment</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPayment(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <WebView
            source={{ html: getPaystackHtml() }}
            onMessage={handlePaystackResponse}
            style={styles.webView}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
              setShowPayment(false);
              Alert.alert('Error', 'Failed to load payment interface.');
            }}
          />
        </SafeAreaView>
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
  orderSummary: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  orderDetails: {
    gap: 10,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 10,
    paddingTop: 10,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#007bff',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 5,
  },
  payButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  webView: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default PaystackPayment;