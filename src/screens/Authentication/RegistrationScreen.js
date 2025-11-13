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
  useColorScheme,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseURL } from "../../axios/healpers";

const BASE_URL = `${baseURL}`;

const RegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  // Detect system theme (dark or light)
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  // Normalize phone
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
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: formattedPhone, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("userId", JSON.stringify(data.userId));
        await AsyncStorage.setItem("token", JSON.stringify(data.token));

        Alert.alert("Success", "Registration successful!");
        navigation.replace("LocationPermissionScreen", {
          userId: data.userId,
          token: data.token,
        });
      } else {
        Alert.alert("Error", data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Register Error:", error);
      Alert.alert("Error", "Network error during registration.");
    }
  };

  // Dynamic styles based on theme
  const themedStyles = styles(isDark);

  return (
    <KeyboardAvoidingView
      style={themedStyles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <View style={themedStyles.container}>
        <Text style={themedStyles.heading}>Complete Your Registration</Text>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <Text style={themedStyles.label}>Full Name</Text>
          <TextInput
            style={themedStyles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            placeholderTextColor={isDark ? "#aaa" : "gray"}
          />

          <Text style={themedStyles.label}>Email (optional)</Text>
          <TextInput
            style={themedStyles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor={isDark ? "#aaa" : "gray"}
          />

          <Text style={themedStyles.label}>Phone Number</Text>
          <View style={themedStyles.phoneRow}>
            <TextInput
              style={[themedStyles.input, { flex: 1, marginRight: 8 }]}
              placeholder="Enter phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor={isDark ? "#aaa" : "gray"}
            />
            <TouchableOpacity style={themedStyles.otpButton} onPress={handleSendOtp}>
              <Text style={themedStyles.otpButtonText}>Send OTP</Text>
            </TouchableOpacity>
          </View>

          <Text style={themedStyles.label}>OTP</Text>
          <TextInput
            style={themedStyles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            placeholderTextColor={isDark ? "#aaa" : "gray"}
          />
        </ScrollView>
      </View>

      <View style={themedStyles.buttonWrapper}>
        <TouchableOpacity style={themedStyles.button} onPress={handleContinue}>
          <Text style={themedStyles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// ✅ Dynamic Themed Styles
const styles = (isDark) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: isDark ? "#121212" : "#fff",
    },
    container: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 60,
    },
    heading: {
      fontSize: 22,
      fontWeight: "700",
      color: isDark ? "#fff" : "#000",
      marginBottom: 30,
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
      color: isDark ? "#ddd" : "#000",
      marginBottom: 4,
      marginTop: 12,
    },
    input: {
      height: 48,
      backgroundColor: isDark ? "#1E1E1E" : "#FCF5EE",
      color: isDark ? "#fff" : "#000",
      borderRadius: 10,
      paddingHorizontal: 14,
      fontSize: 16,
    },
    phoneRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    otpButton: {
      backgroundColor: "#D3671B",
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
      backgroundColor: isDark ? "#121212" : "#fff",
    },
    button: {
      backgroundColor: "#D3671B",
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
