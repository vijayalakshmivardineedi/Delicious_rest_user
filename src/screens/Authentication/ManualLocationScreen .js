import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseURL } from "../../axios/healpers";
import axiosInstance from "../../axios/healpers";


const ManualLocationScreen = ({ navigation, route }) => {
  const { userId, userLocation, coords } = route.params || {};
  const [marker, setMarker] = useState(
    coords || { latitude: 37.78825, longitude: -122.4324 }
  );
  const [address1, setAddress1] = useState(userLocation || "");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [noLocationFound, setNoLocationFound] = useState(false);
  const [region, setRegion] = useState({});

 const updateMapFromAddress = async () => {
  try {
    const geoResults = await Location.geocodeAsync(postalCode);
    if (geoResults.length > 0) {
      const { latitude, longitude } = geoResults[0];
      
      // Set marker
      setMarker({ latitude, longitude });
      
      // Optionally, update the map region
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,  // Controls zoom level
        longitudeDelta: 0.01, // Controls zoom level
      });
    } else {
      Alert.alert("Error", "Please check the Pincode.");
    }
  } catch (err) {
    console.error("Geocode error:", err.message);
    Alert.alert("Error", "Failed to update location on the map.");
  }
};



const handleSubmit = async () => {
  if (!address1 || !city || !postalCode) {
    return Alert.alert("Missing Fields", "Please fill all required fields");
  }

  try {
    const storedUserId = userId || (await AsyncStorage.getItem("userId"));
    if (!storedUserId) {
      Alert.alert("Error", "User ID not found. Please register again.");
      navigation.navigate("RegistrationScreen");
      return;
    }

    const formData = {
      userId: storedUserId,
      address1,
      address2,
      city,
      postalCode,
      latitude: region?.latitude,
      longitude: region?.longitude,
    };

    const response = await axiosInstance.post(`/location/save`, formData);

    if (response.status === 200) {
      Alert.alert("Success", "Location saved successfully.");
      navigation.navigate("NotificationScreen", { userId: storedUserId });
    } else {
    }

  } catch (error) {
    console.error("Error saving location:", error);
    console.error("Error response:", error.response?.data);
    Alert.alert("Error", error.response?.data?.message || error.message || "Unknown error");
  }
};



  const handleMarkerDrag = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });

    const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (place) {
      setAddress1(place.name || "");
      setAddress2(place.street || "");
      setCity(place.city || place.subregion || "");
      setPostalCode(place.postalCode || "");
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {noLocationFound && (
        <Text style={styles.noLocationText}>
          No saved location found. Please enter your location.
        </Text>
      )}
      <MapView
        style={styles.map}
        region={{
          latitude: marker.latitude,
          longitude: marker.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={marker} draggable onDragEnd={handleMarkerDrag} />
      </MapView>

      <ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={styles.label}>Address Line 1 *</Text>
        <TextInput
          style={styles.input}
          placeholder="Flat / Building / Street"
          value={address1}
          onChangeText={setAddress1}
        />

        <Text style={styles.label}>Address Line 2</Text>
        <TextInput
          style={styles.input}
          placeholder="Landmark (optional)"
          value={address2}
          onChangeText={setAddress2}
        />

        <Text style={styles.label}>City *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter City"
          value={city}
          onChangeText={setCity}
        />

        <Text style={styles.label}>Postal Code *</Text>
      
        <TextInput
  style={styles.input}
  placeholder="Enter Postal Code"
  value={postalCode}
  onChangeText={(text) => {
    setPostalCode(text);
  }}
  onBlur={updateMapFromAddress} // 👈 calls when user finishes input
  keyboardType="numeric"
/>


        <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
          <Text style={styles.primaryButtonText}>Pin Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, styles.continueButton]}
          onPress={async () => {
            const storedUserId = userId || (await AsyncStorage.getItem("userId"));
            if (!storedUserId) {
              Alert.alert("Error", "User ID not found. Please register again.");
              navigation.navigate("RegistrationScreen");
              return;
            }
            navigation.navigate("NotificationScreen", { userId: storedUserId });
          }}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  map: { height: height * 0.4, width: "100%" },
  form: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  label: { fontSize: 14, color: "#555", marginBottom: 4, fontWeight: "500" },
  input: {
    backgroundColor: "#fff4db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: "#0c3b2e",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  continueButton: { backgroundColor: "#ffba00" },
  primaryButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  noLocationText: {
    fontSize: 16,
    color: "#ffba00",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default ManualLocationScreen;
