import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const validateInputs = () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Phone number is required.");
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number.");
      return false;
    }
    return true;
  };

  const handleSendOtp = () => {
    if (!validateInputs()) return;
    navigation.navigate("OTP Verification", { phoneNumber });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to</Text>
      <Text style={styles.welcomeText1}>Delicious Biryani's</Text>
      <Text style={styles.loginPrompt}>Login with your phone number</Text>

      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        placeholder="Enter phone number"
        placeholderTextColor="#aaa"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        maxLength={10}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleSendOtp}>
        <Text style={styles.loginButtonText}>Continue</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("RegistrationScreen")}
        >
          <Text style={styles.registerLink}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0c3b2e",
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFEAC5",
  },
  welcomeText1: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#FFEAC5",
  },
  loginPrompt: {
    fontSize: 16,
    marginBottom: 20,
    color: "white",
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    backgroundColor: "#FFEAC5",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#ffba00",
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  registerText: {
    fontSize: 14,
    color: "white",
  },
  registerLink: {
    fontSize: 14,
    color: "#ffba00",
    fontWeight: "bold",
  },
});

export default LoginScreen;
