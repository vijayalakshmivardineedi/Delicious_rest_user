import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseURL } from "../axios/healpers";

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const phone = await AsyncStorage.getItem("phone");
        const userData = await AsyncStorage.getItem("userData");
        console.log("userData", userData);
        if (!phone) {
          Alert.alert("Error", "Phone number not found in storage.");
          return;
        }

        const res = await axios.get(`${baseURL}/me`);
        setUser(res.data);
      } catch (err) {
        console.error("Fetch Error:", err.message);
        Alert.alert("Error", "Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    AsyncStorage.clear(); // clear all data
    Alert.alert("Logout", "You have been logged out!");
    navigation.replace("Onboard");
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileHeader}>
        <Ionicons name="person-circle-outline" size={100} color="black" />
        <Text style={styles.name}>Hello, {user?.name || "User"}!</Text>
        <Text style={styles.email}>{user?.email || "user@example.com"}</Text>
        <Text style={styles.userId}>User ID: {user?.userId || "N/A"}</Text>
      </View>

      {/* Menu Options */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("OrderHistory")}
      >
        <Ionicons
          name="receipt-outline"
          size={24}
          color="black"
          style={styles.icon}
        />
        <Text style={styles.menuText}>My Orders</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("Offers")}
      >
        <Ionicons
          name="pricetags-outline"
          size={24}
          color="black"
          style={styles.icon}
        />
        <Text style={styles.menuText}>Offers</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("SavedAddresses")}
      >
        <Ionicons
          name="location-outline"
          size={24}
          color="black"
          style={styles.icon}
        />
        <Text style={styles.menuText}>Saved Addresses</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("Settings")}
      >
        <Ionicons
          name="settings-outline"
          size={24}
          color="black"
          style={styles.icon}
        />
        <Text style={styles.menuText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() =>
          Alert.alert("Help Center", "Email us at help@example.com")
        }
      >
        <Ionicons
          name="help-circle-outline"
          size={24}
          color="black"
          style={styles.icon}
        />
        <Text style={styles.menuText}>Help Center</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuItem, styles.logoutItem]}
        onPress={handleLogout}
      >
        <Ionicons
          name="log-out-outline"
          size={24}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f4f9",
    flexGrow: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    backgroundColor: "#FFEAC5",
    paddingVertical: 40,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginTop: 12,
  },
  email: {
    fontSize: 16,
    color: "black",
    marginTop: 6,
  },
  userId: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#FFEAC5",
    borderRadius: 8,
    marginVertical: 5,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 18,
    color: "black",
    fontWeight: "500",
  },
  logoutItem: {
    backgroundColor: "#ff4f5a",
  },
  logoutText: {
    fontSize: 18,
    color: "white",
    fontWeight: "500",
  },
});

export default ProfileScreen;
