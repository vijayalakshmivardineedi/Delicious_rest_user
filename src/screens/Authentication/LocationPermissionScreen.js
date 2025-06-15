import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking, Platform } from "react-native";


const LocationPermissionScreen = ({ navigation, route }) => {
  const { userId: routeUserId, token: routeToken } = route.params || {};

  const handleLocationAccess = async () => {s
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please allow location access to continue."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      // Optional: Reverse geocode to get address
      const [place] = await Location.reverseGeocodeAsync(location.coords);
      const formattedAddress = `${place.name || ""}, ${place.city || ""}`;

      // Get userId and token from route or AsyncStorage
      const userId =  routeUserId  || await AsyncStorage.getItem("userId");;
      const token = routeToken || await AsyncStorage.getItem("token");

      if (!userId || !token) {
        Alert.alert(
          "Error",
          "User ID or token not found. Please register again."
        );
        navigation.navigate("RegistrationScreen");
        return;
      }

      // Navigate to ManualLocationScreen with all info
      navigation.navigate("ManualLocationScreen", {
        userId,
        token,
        userLocation: formattedAddress,
        coords: location.coords,
      });
    } catch (error) {
      console.error("Location Error:", error);
      Alert.alert("Error", "Could not fetch location.");
    }
  };

  const handleManualLocation = async () => {
const userId =  routeUserId  || await AsyncStorage.getItem("userId");
      const token = routeToken || await AsyncStorage.getItem("token");
    if (!userId || !token) {
      Alert.alert(
        "Error",
        "User ID or token not found. Please register again."
      );
      navigation.navigate("RegistrationScreen");
      return;
    }

    navigation.navigate("ManualLocationScreen", { userId, token });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/location.jpg")}
        style={styles.image}
      />
      <Text style={styles.title}>What's your location?</Text>
      <Text style={styles.subtitle}>
        We need your location to show available restaurants & products
      </Text>

<TouchableOpacity
  style={styles.primaryButton}
  onPress={() => {
    Alert.alert(
      "Location Access",
      "This app needs your location to show nearby restaurants and products. Do you want to allow location access?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Open Settings",
          onPress: async () => {
            // Try to request permission again first
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status === "granted") {
              handleLocationAccess();
            } else {
              // If still not granted, open settings
              Linking.openSettings(); // Opens app settings
            }
          },
        },
      ]
    );
  }}
>
  <Text style={styles.primaryButtonText}>Allow location access</Text>
</TouchableOpacity>



      <TouchableOpacity onPress={handleManualLocation}>
        <Text style={styles.secondaryText}>Enter location manually</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: "#ffba00",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryText: {
    color: "#ffba00",
    fontWeight: "bold",
  },
});

export default LocationPermissionScreen;
