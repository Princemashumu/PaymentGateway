# Payment Gateway🛒

This is a React Native component that allows users to view an order summary, select a product weight, and proceed to a payment process using **Paystack**. The component integrates a `WebView` to handle the payment flow and displays a modal with the Paystack payment option.

## Features ✨

- **Order Summary**: Displays order details, including total amount, taxes, and delivery fees.
- **Product Selection**: Users can choose the product weight (50g, 150g, 250g) via radio buttons.
- **Payment Integration**: The component integrates a WebView to handle the payment process.
- **Paystack Payment Modal**: Users can initiate the payment through a modal that includes a Paystack payment button.
- **Success/Error Feedback**: Alerts are shown based on the payment status (success or failure).
- **Platform Compatibility**: Supports React Native for mobile platforms (iOS/Android). WebView is not supported on the web platform.

## Installation 💻

To use the `PaymentPage` component, make sure to install the necessary dependencies:

```bash
npm install react-native-webview expo-status-bar
```
# Dependencies 📦

- react-native-webview: Used for embedding the web-based payment page.
- expo-status-bar: Provides the status bar functionality.

# Usage 📑

- Import the PaymentPage Component
- Import the PaymentPage component into your application:


javascript
```
import PaymentPage from './PaymentPage';
```
## Example Usage in Your App
Use the PaymentPage component within your app's screen:

javascript
```
export default function App() {
  return (
    <PaymentPage />
  );
}
```
# Component Structure 🏗️
Order Summary
## The order summary displays:

- Order: The base price of the product.
- Taxes: Taxes on the product.
- Delivery Fees: Delivery charges.
- Total: The final price for the order.
- Estimated Delivery Time: The time it will take for the order to be delivered.
- Product Selection
- Allows users to select the weight of the product using radio buttons.
- Available options: 50g, 150g, 250g.
- WebView Payment Flow
- The payment process is handled via a WebView component that loads an external payment page (payment.html). The handleWebViewMessage function listens for messages from the WebView to determine if the payment was successful or not.


# Paystack Payment Modal
### When the user clicks on the Checkout button:

- A modal will open containing the Paystack payment button.
- The user can proceed to make the payment through Paystack.

# Error Handling 🚨

- If the WebView encounters any issues during the payment process, an error message will be shown.
- Payment success or failure is captured and shown through an alert.
- Modal
- The modal is used to show the Paystack payment option when the user clicks Checkout.
- The modal can be closed by pressing the Close button.

# Configuration ⚙️
The component relies on the following:

- Paystack Integration: A separate component (PaystackPayment) should handle the actual integration with Paystack.
- WebView: The payment page (payment.html) should be properly set up and accessible. This is where the WebView will load the payment form.
- WebView and Payment HTML
- Ensure the payment.html file is available in your project, and it contains the necessary HTML, JavaScript, and Paystack configuration for handling the payment.

html
```
<!-- payment.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Payment</title>
</head>
<body>
  <!-- Payment form and logic goes here -->
</body>
</html>
```
### Paystack Payment Component
The PaystackPayment component should handle the initialization and management of the Paystack payment process.

# Styling 🎨
The component uses styles defined in StyleSheet:

- safeArea: Provides padding and margin to ensure the layout doesn't get blocked by device status bars.
- container: Main wrapper of the component.
- heading: Text style for headings.
- summaryContainer: Container for the order summary details.
- productContainer: Container for displaying product details (image, description, weight selection).
- footerContainer: Contains the Checkout button.
- modalBackground & modalContainer: Styles for the modal background and content.
- You can customize the styles in the styles object to suit your design requirements.


# Contributing 🤝
Feel free to contribute to this project! You can:

### Fork the repository.
Create a new branch for your feature or bug fix.
Submit a pull request.
# License 📜
This project is licensed under the MIT License - see the [LICENSE](https://github.com/Princemashumu/PaymentGateway/issues/LICENSE) file for details.

### Explanation:

- **Features**: Added emojis to indicate key functionalities.
- **Installation**: Added 💻 emoji to highlight installation step.
- **Dependencies**: Included 📦 emoji for dependencies.
- **Usage**: Added 📑 emoji for usage section.
- **Component Structure**: Used 🏗️ to represent the structure of the component.
- **Error Handling**: Included 🚨 to highlight error handling.
- **Modal**: Added 🔧 emoji for configuration section.
- **Styling**: Included 🎨 emoji for design and styling.
- **Contributing**: Added 🤝 emoji for collaboration section.
- **License**: Included 📜 for license information.

This makes the `README` more visually engaging while providing clear, structured information

