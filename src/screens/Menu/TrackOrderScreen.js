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

const STATUS_TEXTS = {
  Ordered: "Waiting for order confirmation by restaurant",
  Approved: "Your order is approved by restaurant",
  Preparing: "Your order is being prepared",
  Ready: "Your order is ready to pick up",
  PickedUp: "Your order is on the way",
  Delivered: "Your order is successfully delivered",
  Rejected: "Your order is rejected by restaurant",
};

const STATUS_IMAGES = {
  Ordered: require("../../assets/notification.jpg"),
  Approved: require("../../assets/approved.jpg"),
  Preparing: require("../../assets/preparing.jpg"),
  Ready: require("../../assets/ready.jpg"),
  PickedUp: require("../../assets/ontheway.jpg"),
  Delivered: require("../../assets/delivered.jpg"),
  Rejected: require("../../assets/rejected.jpg"),
};

const TrackOrderScreen = ({ navigation }) => {
  const [latestOrder, setLatestOrder] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [timeLeft, setTimeLeft] = useState(25);

  useEffect(() => {
    let interval = null; // Declare outside to clear it properly

    const fetchLatestOrder = async () => {
      try {
        const raw = await AsyncStorage.getItem("userId");
        const parsedUserId = JSON.parse(raw);
        const authToken = await AsyncStorage.getItem("token");

        setUserId(parsedUserId);
        setToken(authToken);

        const res = await axiosInstance.get(
          `/order/getOrderByUserId/${parsedUserId}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        const orders = res.data;
        if (!orders || orders.length === 0) {
          Alert.alert("No orders", "You haven't placed any orders yet.");
          return;
        }

        const latest = orders[orders.length - 1];
        setLatestOrder(latest);

        if (latest?.status !== "Rejected" && latest?.status !== "Delivered") {
          const orderTime = new Date(latest.createdAt);
          const expectedTime = new Date(orderTime.getTime() + 25 * 60000);

          interval = setInterval(() => {
            const now = new Date();
            const diff = Math.max(0, Math.floor((expectedTime - now) / 60000));
            setTimeLeft(diff);
          }, 60000); // every 1 min
        }
      } catch (error) {
        console.error("Fetch order error:", {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
        });
        Alert.alert("Error", "Failed to fetch order.");
      }
    };

    fetchLatestOrder();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const handleCancelOrder = async () => {
    try {
      if (!userId || !latestOrder?.orderId) return;

      await axiosInstance.post(
        `/order/cancleByUser/${userId}/${latestOrder.orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Order Cancelled", "Your order has been cancelled.");
      navigation.navigate("AppTabs");
    } catch (error) {
      console.error("Cancel error:", error?.response?.data || error.message);
      Alert.alert("Failed to Cancel", "Something went wrong");
    }
  };

  const status = latestOrder?.status;
  const statusText = STATUS_TEXTS[status] || "Tracking order...";
  const statusImage =
    STATUS_IMAGES[status] || require("../../assets/notification.jpg");

  const itemsText = latestOrder?.items
    ?.map((item) => `${item.quantity}x ${item.name}`)
    .join("\n");

  return (
    <View style={styles.container}>
      <View style={styles.topBanner}>
        <View style={styles.bannerContent}>
          <Text style={styles.statusText}>{statusText}</Text>
          {status !== "Rejected" && status !== "Delivered" && (
            <Text style={styles.estimate}>
              Estimated delivery time: {timeLeft} min(s)
            </Text>
          )}
        </View>
      </View>

      <View style={styles.imageWrapper}>
        <Image source={statusImage} style={styles.image} resizeMode="cover" />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Order ID</Text>
        <Text style={styles.value}>
          #{latestOrder?.orderId || "Fetching..."}
        </Text>

        <Text style={styles.label}>Items</Text>
        <Text style={styles.value}>{itemsText || "Loading items..."}</Text>

        <Text style={styles.label}>Restaurant</Text>
        <Text style={styles.value}>Bhimavaram Delicious Biryanis</Text>
      </View>

      {status === "Ordered" && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#d11a2a", marginTop: 20 }]}
          onPress={handleCancelOrder}
        >
          <Text style={styles.buttonText}>Cancel Order</Text>
        </TouchableOpacity>
      )}

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
  container: { flex: 1, backgroundColor: "#fff" },
  topBanner: { backgroundColor: "#0c3b2e", height: 150, padding: 20 },
  bannerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  statusText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  estimate: { fontSize: 14, color: "#e2e1cf", marginTop: 12 },
  imageWrapper: { width: "100%", height: 250 },
  image: { width: "100%", height: "100%", borderRadius: 10 },
  infoCard: {
    backgroundColor: "#FFF4E0",
    width: "90%",
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
    alignSelf: "center",
    elevation: 3,
  },
  label: { fontSize: 14, color: "#ffba00", marginTop: 12 },
  value: { fontSize: 16, fontWeight: "600", color: "#222" },
  button: {
    backgroundColor: "#ffba00",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default TrackOrderScreen;
