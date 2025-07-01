import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import axiosInstance from "../../axios/healpers";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TrackOrderScreen = ({ navigation }) => {
  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const raw = await AsyncStorage.getItem("userId");
        const userId = JSON.parse(raw);
        const token = await AsyncStorage.getItem("token");

        const res = await axiosInstance.get(`/order/getOrderByUserId/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const orders = res.data;
        if (!orders || orders.length === 0) {
          Alert.alert("No orders", "You haven't placed any orders yet.");
          return;
        }

        const latest = orders[orders.length - 1]; // Assuming last is latest
        setLatestOrder(latest);
      } catch (error) {
        console.error("Fetch order error:", error?.response?.data || error.message);
        Alert.alert("Error", "Failed to fetch order.");
      }
    };

    fetchLatestOrder();
  }, []);

  const itemsText = latestOrder?.items
    ?.map((item) => `${item.quantity}x ${item.name}`)
    .join("\n");

  return (
    <View style={styles.container}>
      <View style={styles.topBanner}>
        <View style={styles.bannerContent}>
          <Text style={styles.statusText}>Your order is on the way!</Text>
          <Text style={styles.estimate}>Estimated delivery time: 25 mins</Text>
        </View>
      </View>

      {/* 🖼️ Replaced Map with Image */}
      <View style={styles.imageWrapper}>
        <Image
          source={require("../../assets/notification.jpg")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Order ID</Text>
        <Text style={styles.value}>
          #{latestOrder?.orderId || "Fetching..."}
        </Text>

        <Text style={styles.label}>Items</Text>
        <Text style={styles.value}>{itemsText || "Loading items..."}</Text>

        <Text style={styles.label}>Delivery Partner</Text>
        <Text style={styles.value}>Rajesh (2.1 km away)</Text>

        <Text style={styles.label}>Restaurant</Text>
        <Text style={styles.value}>Spice Villa, Main Street</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AppTabs")}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBanner: {
    backgroundColor: "#0c3b2e",
    height: 150,
    width: "100%",
    padding: 20,
  },
  bannerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  estimate: {
    fontSize: 16,
    color: "#e2e1cf",
    marginTop: 16,
    marginBottom: 20,
  },
  imageWrapper: {
    width: "100%",
    height: 250,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  infoCard: {
    backgroundColor: "#FFF4E0",
    width: "90%",
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: "#ffba00",
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  button: {
    backgroundColor: "#ffba00",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 40,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default TrackOrderScreen;
