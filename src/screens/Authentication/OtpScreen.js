import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { baseURL } from "../../axios/healpers";
import axiosInstance from "../../axios/healpers";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OtpScreen = ({ route, navigation }) => {
  const { confirmation, phoneNumber } = route.params;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      alert("Please enter the full 6-digit OTP.");
      return;
    }

    const formData = { phone: phoneNumber, otp: enteredOtp };
    try {
      const response = await axiosInstance.post(`/login`, formData);

      const data = await response?.data;

      if (response.status === 200) {
        await AsyncStorage.setItem("userId", JSON.stringify(data.userId?.userId));
        await AsyncStorage.setItem("token", JSON.stringify(data.token));
        await AsyncStorage.setItem("name", JSON.stringify(data.userId?.name));
        await AsyncStorage.setItem("phone", JSON.stringify(data.userId?.phone));
        navigation.replace("AppTabs");
      } else {
        if (data.message === "User not found, please register first") {
          setShowBottomSheet(true);
        } else {
          Alert.alert("OTP Error", data.message || "Verification failed");
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      Alert.alert("Network Error", "Please try again later.");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (value, index) => {
    const newOtp = [...otp];
    if (value.length <= 1) {
      newOtp[index] = value;

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      if (!value && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }

      setOtp(newOtp);
    }
  };

  const handleCreateAccount = () => {
    setShowBottomSheet(false);
    navigation.replace("RegistrationScreen", { phoneNumber });
  };
  const handleResendOtp = () => {
    navigation.replace("Onboard");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: null })}
    >
      <Text style={styles.heading}>Verify with OTP sent to</Text>
      <Text style={styles.phone}>{phoneNumber}</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={[styles.otpInput, digit !== "" ? styles.otpFilled : null]}
            value={digit}
            onChangeText={(value) => handleInputChange(value, index)}
            keyboardType="number-pad"
            maxLength={1}
            ref={(input) => (inputRefs.current[index] = input)}
          />
        ))}
      </View>

      <Text style={styles.statusText}>
        OTP found • Retry in 0:{timer < 10 ? "0" + timer : timer}
      </Text>

      <TouchableOpacity style={styles.continueBtn} onPress={handleVerifyOtp}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>

      <Text style={styles.resendText}>
        Didn't receive it?{" "}
        <Text onPress={handleResendOtp} style={styles.resendLink}>
          Retry
        </Text>
      </Text>

      {/* Bottom Sheet Modal */}
      <Modal
        isVisible={showBottomSheet}
        onBackdropPress={() => setShowBottomSheet(false)}
        style={styles.modal}
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>OTP Verified ✅</Text>
          <Text style={styles.sheetSubtitle}>
            But we couldn't find your account.
          </Text>
          <Text style={styles.sheetSubtitle}>
            Do you want to create a new one?
          </Text>

          <TouchableOpacity
            style={styles.createBtn}
            onPress={handleCreateAccount}
          >
            <Text style={styles.createBtnText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    justifyContent: "flex-start",
    paddingTop: 60,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  heading: {
    fontSize: 26,
    fontWeight: "600",
    color: "#000",
    marginLeft: 12,
    marginBottom: 6,
    marginTop: 15,
  },
  phone: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 30,
    marginLeft: 12,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginBottom: 25,
  },
  otpInput: {
    width: 50,
    height: 55,
    borderRadius: 10,
    backgroundColor: "#FFEAC5",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  otpFilled: {
    borderColor: "green",
  },
  statusText: {
    marginLeft: 12,
    color: "green",
    fontSize: 14,
    marginBottom: 20,
    fontWeight: "500",
  },
  continueBtn: {
    backgroundColor: "#ffba00",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 10,
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resendText: {
    marginTop: 16,
    marginLeft: 12,
    fontSize: 14,
    color: "#666",
  },
  resendLink: {
    color: "#ffba00",
    fontWeight: "bold",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  sheetContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sheetSubtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#666",
    marginBottom: 10,
  },
  createBtn: {
    backgroundColor: "#fc8019",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  createBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default OtpScreen;
