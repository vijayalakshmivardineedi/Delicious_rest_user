import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";

const OrderSuccessScreen = ({ navigation }) => (
  <View style={styles.container}>
    <LottieView
      source={require("../../assets/Animation - 1747039577987.json")}
      autoPlay
      loop={false}
      style={styles.animation}
    />
    <Text style={styles.title}>🎉 Order Placed Successfully!</Text>
    <Text style={styles.subtitle}>Sit tight! We’re preparing your order.</Text>

    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate("AppTabs")}
    >
      <Text style={styles.buttonText}>Go to Home</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.button, styles.trackButton]}
      onPress={() => navigation.navigate("TrackOrder")}
    >
      <Text style={styles.buttonText}>Track Order</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  animation: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#ffba00",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  trackButton: {
    backgroundColor: "#000", // corrected color
  },
});

export default OrderSuccessScreen;
