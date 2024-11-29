import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PaystackPayment from './PaystackPayment'; // Import the PaystackPayment component

function HomeScreen({ navigation }) {
  const [selectedWeight, setSelectedWeight] = useState('250g');

  const renderRadioButton = (value) => (
    <TouchableOpacity
      style={styles.radioButton}
      onPress={() => value === '250g' && setSelectedWeight(value)}
      disabled={value !== '250g'}
    >
      <View style={selectedWeight === value ? styles.radioSelected : styles.radioUnselected} />
      <Text style={styles.radioText}>{value}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.heading}>Products</Text>
        <View style={styles.productsContainer}>
        <View style={styles.productCard}>
          <Image
            source={require('./assets/7891000315606.webp')}
            style={styles.productImage}
          />
          <Text style={styles.productTitle}>Nescafé Classic</Text>
          <Text style={styles.productDescription}>
            Smooth and rich instant coffee for your perfect cup, any time.
          </Text>

          <View style={styles.radioContainer}>
            {renderRadioButton('50g')}
            {renderRadioButton('150g')}
            {renderRadioButton('250g')}
          </View>

          {/* Proceed to Checkout Button */}
        </View>
        <View style={styles.productCard}>
          <Image
            source={require('./assets/coffee M.jpg')}
            style={styles.productImage}
          />
          <Text style={styles.productTitle}>Rich Roast</Text>
          <Text style={styles.productDescription}>
            Smooth and rich instant coffee for your perfect cup, any time.
          </Text>

          <View style={styles.radioContainer}>
            {renderRadioButton('50g')}
            {renderRadioButton('150g')}
            {renderRadioButton('250g')}
          </View>

          {/* Proceed to Checkout Button */}
        </View>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('PaystackPayment')}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Order' }} />
        <Stack.Screen name="PaystackPayment" component={PaystackPayment} options={{ title: 'Checkout' }} />
      </Stack.Navigator>
    </NavigationContainer>
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
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  productsContainer:{
gap:30

  },
  productImage: {
    width: 140,
    height: 160,
    borderRadius: 8,
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
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
  checkoutButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
