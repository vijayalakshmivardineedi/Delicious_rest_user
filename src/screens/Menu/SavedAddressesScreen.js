import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axiosInstance, { baseURL } from "../../axios/healpers";

const SavedAddressScreen = () => {
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
  const fetchAddress = async () => {
    try {
      const raw = await AsyncStorage.getItem("userId");

      if (!raw) {
        Alert.alert("Session Expired", "Please log in again.");
        navigation.replace("Onboard");
        return;
      }

      let userIdString = null;
      try {
        userIdString = JSON.parse(raw);
      } catch (e) {
        console.warn("Invalid stored userId:", e);
        Alert.alert("Session Expired", "Please log in again.");
        navigation.replace("Onboard");
        return;
      }

      const userId = parseInt(userIdString, 10);
      if (!userId || Number.isNaN(userId)) {
        Alert.alert("Session Expired", "Please log in again.");
        navigation.replace("Onboard");
        return;
      }

      const response = await axiosInstance.get(`/location/${userId}`);

      if (response.status === 200) {
        setLocationData(response.data.location);
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
      Alert.alert("Error", "Failed to fetch address");
    } finally {
      setLoading(false);
    }
  };

  fetchAddress();
}, []);


  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ffba00" />
      </View>
    );
  }

  if (!locationData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noData}>No address found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Saved Address</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>User ID: </Text>
          <Text style={styles.value}>{locationData.userId}</Text>
        </View>
      </View>
      <View style={styles.card}>
        {locationData?.address?.map((addr, index) => (
          <View key={addr._id || index} style={styles.addressBlock}>
            <Text style={styles.label}>Address {index + 1}</Text>

            <Text style={styles.label}>Address Line 1:</Text>
            <Text style={styles.value}>{addr.address1}</Text>

            <Text style={styles.label}>Address Line 2:</Text>
            <Text style={styles.value}>{addr.address2}</Text>

            <Text style={styles.label}>City:</Text>
            <Text style={styles.value}>{addr.city}</Text>

            <Text style={styles.label}>Postal Code:</Text>
            <Text style={styles.value}>{addr.postalCode}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff4db",
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    margin: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#444",
    marginTop: 4,
  },
  noData: {
    fontSize: 18,
    color: "#999",
  },
});

export default SavedAddressScreen;
