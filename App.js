import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform, Image, SafeAreaView, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import PaystackPayment from './PaystackPayment';

export default function App() {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState('250g'); // Default selection
  const [isModalVisible, setIsModalVisible] = useState(false); // For managing modal visibility
  const webViewRef = useRef(null);

  const handleWebViewMessage = (event) => {
    console.log('Message from WebView:', event.nativeEvent.data);
    const data = event.nativeEvent.data;
    try {
      const result = JSON.parse(data);
      if (result.error) {
        Alert.alert('Error', result.details || 'Payment failed.');
      } else if (result.token) {
        Alert.alert('Success', 'Payment was successful!');
        setPaymentStatus('Payment Successful');
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  const renderRadioButton = (value) => (
    <TouchableOpacity
      style={styles.radioButton}
      onPress={() => value === '250g' && setSelectedWeight(value)}
      disabled={value !== '250g'} // Disable selection for other options
    >
      <View
        style={selectedWeight === value ? styles.radioSelected : styles.radioUnselected}
      />
      <Text style={styles.radioText}>{value}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Order Summary Section */}
        <Text style={styles.heading}>Order Summary</Text>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>Order: R300.00</Text>
          <Text style={styles.summaryText}>Taxes: R30.00</Text>
          <Text style={styles.summaryText}>Delivery Fees: R50.00</Text>
          <Text style={styles.totalText}>Total: R380.00</Text>
          <Text style={styles.estimatedText}>Estimated Delivery Time: 60 mins</Text>
        </View>

        {/* Product Section */}
        <Text style={styles.heading}>Product</Text>
        <View style={styles.productContainer}>
          <Image
            source={require('./assets/7891000315606.webp')}
            style={styles.productImage}
          />
          <Text style={styles.productDescription}>Nescafé Classic</Text>
          <Text style={styles.productDescription}>
            Smooth and rich instant coffee for your perfect cup, any time.
          </Text>

          {/* Radiobox Section */}
          <View style={styles.radioContainer}>
            {renderRadioButton('50g')}
            {renderRadioButton('150g')}
            {renderRadioButton('250g')}
          </View>
        </View>

        <View style={{ flex: 1 }}>
          {Platform.OS === 'web' ? (
            <Text>WebView is not supported on the web platform</Text>
          ) : (
            <WebView
              ref={webViewRef}
              source={require('./payment.html')}
              onMessage={handleWebViewMessage}
              style={styles.webView}
              onError={(error) => {
                console.error('WebView error:', error);
              }}
            />
          )}
        </View>

        {paymentStatus && <Text style={styles.statusText}>{paymentStatus}</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryContainer: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    marginVertical: 5,
    color: '#333',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000',
  },
  estimatedText: {
    fontSize: 16,
    marginTop: 10,
    color: '#555',
  },
  productContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  productImage: {
    width: 150,
    height: 200,
    borderWidth: 1,
    borderColor: 'black',
  },
  productDescription: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  radioContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#999',
    marginRight: 8,
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    marginRight: 8,
  },
  radioText: {
    fontSize: 14,
    color: '#333',
  },
  statusText: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
});
