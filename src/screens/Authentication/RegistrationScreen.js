import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseURL } from "../../axios/healpers";

const BASE_URL = `${baseURL}`;

const RegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  // Normalize phone (remove all non-digits, add +91 if needed)
  const formatPhone = (rawPhone) => {
    const digits = rawPhone.replace(/\D/g, "");
    return digits.startsWith("91") ? `+${digits}` : `+91${digits}`;
  };

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      Alert.alert("Error", "Please enter your phone number.");
      return;
    }

    const formattedPhone = formatPhone(phone);

    try {
      const response = await fetch(`${BASE_URL}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: formattedPhone }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "OTP sent to " + formattedPhone);
      } else {
        
        Alert.alert("Error", data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Send OTP Error:", error);
      console.error("Send OTP Error:", error);
      Alert.alert("Error", `${BASE_URL}/send-otp`);
    }
  };

  const handleContinue = async () => {
    if (!name.trim() || !phone.trim() || !otp.trim()) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    const formattedPhone = formatPhone(phone);

    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone: formattedPhone,
          otp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
       await AsyncStorage.setItem("userId", JSON.stringify(data.userId));
await AsyncStorage.setItem("token", JSON.stringify(data.token));

      
        Alert.alert("Success", "Registration successful!");
        // Pass userId to LocationPermissionScreen
        navigation.replace("LocationPermissionScreen", { userId: data.userId, token: data.token });
      } else {
        Alert.alert("Error", data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Register Error:", error);
      Alert.alert("Error", "Network error during registration.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Complete Your Registration</Text>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="black"
          />

          <Text style={styles.label}>Email (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="black"
          />

          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              placeholder="Enter phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="black"
            />
            <TouchableOpacity style={styles.otpButton} onPress={handleSendOtp}>
              <Text style={styles.otpButtonText}>Send OTP</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>OTP</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            placeholderTextColor="black"
          />
        </ScrollView>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    height: 48,
    backgroundColor: "#FFEAC5",
    color: "black",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  otpButton: {
    backgroundColor: "#ffba00",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    justifyContent: "center",
  },
  otpButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  buttonWrapper: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#ffba00",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default RegistrationScreen;