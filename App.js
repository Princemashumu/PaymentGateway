import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const webViewRef = useRef(null);

  const handleWebViewMessage = (event) => {
    const data = event.nativeEvent.data;
    if (data === 'ready') {
      console.log('WebView Ready for Payments');
    } else {
      const result = JSON.parse(data);
      if (result.token) {
        setPaymentStatus('Payment Successful');
        Alert.alert('Success', 'Your payment was processed successfully!');
      } else {
        setPaymentStatus('Payment Failed');
        Alert.alert('Error', 'Payment failed. Please try again.');
      }
    }
  };

  const initiatePayment = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`handlePayment();`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Square Payment Integration</Text>

      <TouchableOpacity style={styles.paymentButton} onPress={initiatePayment}>
        <Text style={styles.buttonText}>Pay $1.00</Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        {Platform.OS === 'web' ? (
          <Text>WebView is not supported on the web platform</Text>
        ) : (
          <WebView
            ref={webViewRef}
            source={require('./assets/payment.html')}
            onMessage={handleWebViewMessage}
            style={{ display: 'none' }} // Hide the WebView
          />
        )}
      </View>

      {paymentStatus && <Text style={styles.statusText}>{paymentStatus}</Text>}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    marginBottom: 20,
  },
  paymentButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
});
