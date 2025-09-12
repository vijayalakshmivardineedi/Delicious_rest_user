import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../axios/healpers";

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const parsedUserId = userId?.trim(); // ✅ Fixed

      if (!parsedUserId) {
        throw new Error("User ID not found");
      }

      const response = await axiosInstance.get(
        `/order/getOrderByUserId/${parsedUserId}`
      );

      if (response.status === 200 && Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]); // fallback to empty
      }
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error?.response?.data || error.message
      );
      setOrders([]);
      Alert.alert("Error", "Failed to fetch order history.");
    }
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 30000); // refresh every 30 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate} • ${formattedTime}`;
  };

  const renderItems = (items = []) => (
    <View style={{ marginTop: 4 }}>
      {items.map((item, index) => (
        <Text key={index} style={styles.itemLine}>
          • {item.name} x{item.quantity}
        </Text>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Order History</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.cardTop}>
              <View style={{ flex: 1 }}>{renderItems(item.items)}</View>
              <Text style={styles.dateTime}>
                {formatDateTime(item.createdAt)}
              </Text>
            </View>
            <Text style={styles.status}>{item.status}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, fontSize: 16 }}>
            No orders found.
          </Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  orderCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#FFF4E0",
    borderRadius: 8,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemLine: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  dateTime: {
    fontSize: 14,
    color: "#333",
    textAlign: "right",
    marginLeft: 10,
    maxWidth: 100,
  },
  status: {
    fontSize: 14,
    color: "#ffba00",
    fontWeight: "700",
    marginTop: 6,
  },
});

export default OrderHistoryScreen;
