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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import SwiperFlatList from "react-native-swiper-flatlist";
import Modal from "react-native-modal";
import { baseURL } from "../../axios/healpers";
import get1 from "../../assets/get1.jpg";
import splash from "../../assets/splash.png";
import delivery from "../../assets/delivery.png";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const slides = [
    {
      id: 1,
      title: "Discover Restaurants",
      description: "Explore the best cuisines from your favorite restaurants.",
      image: get1,
    },
    {
      id: 2,
      title: "Quick & Easy Ordering",
      description: "Order your favorite dishes in just a few clicks.",
      image: splash,
    },
    {
      id: 3,
      title: "Fast Delivery",
      description:
        "Get your food delivered hot and fresh, right to your doorstep.",
      image: delivery,
    },
  ];

  const handleGetStarted = () => setModalVisible(true);

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      Alert.alert("Invalid", "Please enter a valid 10-digit phone number");
      return;
    }

    try {
      const response = await fetch(`${baseURL}/sendLoginOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "OTP sent successfully");
        navigation.replace("OTP Verification", { phoneNumber });
      } else {
        Alert.alert("Error", data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    }
  };

  const handleCreateAccount = () => {
    navigation.replace("RegistrationScreen");
  };

  return (
    <View style={styles.container}>
      <SwiperFlatList
        autoplay
        autoplayDelay={3}
        showPagination
        paginationStyle={styles.pagination}
        paginationStyleItem={styles.dotStyle}
        paginationActiveColor="#ffba00"
        paginationDefaultColor="#ccc"
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>
            <ImageBackground
              source={slide.image}
              style={styles.backgroundImage}
            >
              <View style={styles.blackOverlay} />

              <View style={styles.contentContainer}>
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
              </View>
            </ImageBackground>
          </View>
        ))}
      </SwiperFlatList>

      {/* Login Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.modalScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modalContent}>
              <Text style={styles.welcomeText}>
                Welcome to Bhimavaram Delicious Biryani's
              </Text>
              <Text style={styles.loginPrompt}>
                Login with your phone number
              </Text>

              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                maxLength={10}
              />

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleSendOTP}
              >
                <Text style={styles.loginButtonText}>Continue</Text>
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleCreateAccount}>
                  <Text style={styles.registerLink}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: { width, height },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  blackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  /** Auto layout content */
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 60,
    padding: 20,
  },
  textContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  description: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    lineHeight: 22,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  button: {
    backgroundColor: "#ffba00",
    paddingVertical: 14,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  pagination: { position: "absolute", bottom: 10 },
  dotStyle: { marginHorizontal: 5, width: 8, height: 8, borderRadius: 4 },

  /** Modal Styles */
  modal: { justifyContent: "flex-end", margin: 0 },
  modalScroll: { flexGrow: 1, justifyContent: "flex-end" },
  modalContent: {
    backgroundColor: "#fff",
    padding: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
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
    marginBottom: 40,
    alignItems: "center",
  },
  loginButtonText: { color: "white", fontSize: 16, fontWeight: "700" },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    flexWrap: "wrap",
  },
  registerText: { fontSize: 14, color: "#555" },
  registerLink: { fontSize: 14, color: "#ffba00", fontWeight: "bold" },
});

export default OnboardingScreen;