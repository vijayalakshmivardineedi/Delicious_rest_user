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
  useColorScheme,
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

  // 👇 Detect system theme
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  // Theme colors
  const theme = {
    background: isDarkMode ? "#121212" : "#FFFFFF",
    text: isDarkMode ? "#FFFFFF" : "#000000",
    overlay: "rgba(0, 0, 0, 0.4)",
    accent: "#D3671B",
    inputBg: isDarkMode ? "#1E1E1E" : "#FCF5EE",
    placeholder: isDarkMode ? "#BBBBBB" : "#555555",
  };

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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SwiperFlatList
        autoplay
        autoplayDelay={3}
        showPagination
        paginationStyle={styles.pagination}
        paginationStyleItem={styles.dotStyle}
        paginationActiveColor={theme.accent}
        paginationDefaultColor="#ccc"
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>
            <ImageBackground
              source={slide.image}
              style={styles.backgroundImage}
            >
              <View
                style={[StyleSheet.absoluteFill, { backgroundColor: theme.overlay }]}
              />

              <View style={styles.contentContainer}>
                <View style={styles.textContainer}>
                  <Text style={[styles.title, { color: "#fff" }]}>
                    {slide.title}
                  </Text>
                  <Text style={[styles.description, { color: "#fff" }]}>
                    {slide.description}
                  </Text>
                </View>

                {index === slides.length - 1 && (
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.accent }]}
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
            <View
              style={[
                styles.modalContent,
                { backgroundColor: theme.background },
              ]}
            >
              <Text
                style={[
                  styles.welcomeText,
                  { color: theme.text },
                ]}
              >
                Welcome to Bhimavaram Delicious Biryani's
              </Text>
              <Text style={[styles.loginPrompt, { color: theme.accent }]}>
                Login with your phone number
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBg,
                    color: theme.text,
                  },
                ]}
                keyboardType="number-pad"
                placeholder="Enter phone number"
                placeholderTextColor={theme.placeholder}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                maxLength={10}
              />

              <TouchableOpacity
                style={[styles.loginButton, { backgroundColor: theme.accent }]}
                onPress={handleSendOTP}
              >
                <Text style={styles.loginButtonText}>Continue</Text>
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={[styles.registerText, { color: theme.text }]}>
                  Don't have an account?{" "}
                </Text>
                <TouchableOpacity onPress={handleCreateAccount}>
                  <Text style={[styles.registerLink, { color: theme.accent }]}>
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: { width, height },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 60,
    padding: 20,
  },
  textContainer: { marginBottom: 20 },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  pagination: { position: "absolute", bottom: 10 },
  dotStyle: { marginHorizontal: 5, width: 8, height: 8, borderRadius: 4 },
  modal: { justifyContent: "flex-end", margin: 0 },
  modalScroll: { flexGrow: 1, justifyContent: "flex-end" },
  modalContent: {
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
    marginBottom: 20,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  loginButton: {
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
  registerText: { fontSize: 14 },
  registerLink: { fontSize: 14, fontWeight: "bold" },
});

export default OnboardingScreen;
