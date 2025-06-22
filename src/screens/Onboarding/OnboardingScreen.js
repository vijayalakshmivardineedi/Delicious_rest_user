import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import Swiper from "react-native-swiper";
import { LinearGradient } from "expo-linear-gradient";
import Modal from "react-native-modal";
import { baseURL } from "../../axios/healpers";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const slides = [
    {
      id: 1,
      title: "Discover Restaurants",
      description: "Explore the best cuisines from your favorite restaurants.",
      image: require("../../assets/get1.jpg"),
    },
    {
      id: 2,
      title: "Quick & Easy Ordering",
      description: "Order your favorite dishes in just a few clicks.",
      image: require("../../assets/splash.png"),
    },
    {
      id: 3,
      title: "Fast Delivery",
      description:
        "Get your food delivered hot and fresh, right to your doorstep.",
      image: require("../../assets/splash.png"),
    },
  ];

  const handleGetStarted = () => setModalVisible(true);

  // const handleSendOTP = async () => {
  //   if (!phoneNumber || phoneNumber.length !== 10) {
  //     Alert.alert("Invalid", "Please enter a valid 10-digit phone number");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`${baseURL}/send-otp`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ phone: phoneNumber }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       Alert.alert("Success", "OTP sent successfully");
  //       navigation.replace("OTP Verification", { phoneNumber });
  //     } else {
  //       Alert.alert("Error", data.message || "Failed to send OTP");
  //     }
  //   } catch (error) {
  //     console.error("Error sending OTP:", error);
  //     Alert.alert("Error", "Failed to send OTP. Please try again.");
  //   }
  // };


    const handleSendOTP = async () => {
    await AsyncStorage.setItem("userId", JSON.stringify("4146"));
await AsyncStorage.setItem("token", JSON.stringify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQxNDYiLCJpYXQiOjE3NTAwOTM0MzgsImV4cCI6MTc1MDY5ODIzOH0.rAxyod7PBU5ACslC4RhkWPzPPhaGQ7Hi_acUglfc-MA"));
   navigation.replace("AppTabs"); 
  };

  const handleCreateAccount = () => {
    navigation.replace("RegistrationScreen");
  };

  return (
    <View style={styles.container}>
      <Swiper
        autoplay
        autoplayTimeout={3}
        showsPagination
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
        loop={false}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>
            <ImageBackground
              source={slide.image}
              style={styles.backgroundImage}
            >
              <LinearGradient
                colors={["rgba(226, 225, 207, 0.3)", "rgba(191, 187, 149, 0.5)"]}
                style={styles.overlay}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.description}>{slide.description}</Text>
              </View>
              {index === slides.length - 1 && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleGetStarted}
                >
                  <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
              )}
            </ImageBackground>
          </View>
        ))}
      </Swiper>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.welcomeText}>Welcome to Delicious Biryani's</Text>
          <Text style={styles.loginPrompt}>Login with your phone number</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={10}
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleSendOTP}>
            <Text style={styles.loginButtonText}>Continue</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleCreateAccount}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: { flex: 1 },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },
  overlay: { ...StyleSheet.absoluteFillObject },
  textContainer: {
    position: "absolute",
    bottom: 100,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 5,
  },
  description: {
    fontSize: 20,
    fontWeight: "500",
    color: "#fff",
    lineHeight: 30,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#ffba00",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "90%",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: 40,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  dotStyle: {
    backgroundColor: "#ccc",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDotStyle: {
    backgroundColor: "#ffba00",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  modal: { justifyContent: "flex-end", margin: 0 },
  modalContent: {
    backgroundColor: "#fff",
    padding: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  welcomeText: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  loginPrompt: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#FFEAC5",
    color: "black",
  },
  loginButton: {
    backgroundColor: "#ffba00",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: { color: "#3B271C", fontSize: 16, fontWeight: "700" },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  registerText: { fontSize: 14, color: "#555" },
  registerLink: { fontSize: 14, color: "#ffba00", fontWeight: "bold" },
});

export default OnboardingScreen;
