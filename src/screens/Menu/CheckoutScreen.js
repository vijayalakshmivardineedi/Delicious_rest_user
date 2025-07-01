import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../axios/healpers";

const CheckoutScreen = ({ route, navigation }) => {
  const {
    selectedAddress,
    cookingRequest,
    appliedCoupon,
    totalAmount,
    cartItems,
  } = route.params;

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const name = await AsyncStorage.getItem("userName");
      const phone = await AsyncStorage.getItem("userPhone");
      setUserName(name || "Guest");
      setUserPhone(phone || "N/A");
    };
    fetchUserDetails();
  }, []);

  const deliveryFee = 30;
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.itemCost * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.05);
  const discount = appliedCoupon?.discountAmount || 0;
  const total = subtotal + deliveryFee + tax - discount;
  const location = selectedAddress || "Not Selected";

  const handlePlaceOrder = async () => {
    try {
      const raw = await AsyncStorage.getItem("userId");
      const userId = JSON.parse(raw);
      const token = await AsyncStorage.getItem("token");

      const payload = {
        userId,
        items: cartItems.map((item) => ({
          name: item.itemName,
          cost: item.itemCost,
          quantity: item.quantity,
        })),
        deliveryLocation: location,
        subtotal,
        deliveryFee,
        taxes: tax,
        discount,
        total,
        paymentMethod,
        status: "Ordered",
        cookingInstructions: cookingRequest,
        coupon: appliedCoupon?._id || null,
      };

      await axiosInstance.post("/order/create", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("Success", "Order placed successfully!");
      navigation.replace("OrderSuccess");
    } catch (error) {
      console.error("Order error:", error?.response?.data || error.message);
      Alert.alert("Error", "Failed to place order");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }} // Add bottom padding
    >
      <Text style={styles.title}>🧾 Bill Summary</Text>

      {/* 🧾 Bill */}
      <View style={styles.billBox}>
        <Text style={styles.userInfoText}>👤 {userName}</Text>
        <Text style={styles.userInfoText}>📞 {userPhone}</Text>
        {cartItems.map((item) => (
          <View key={item._id} style={styles.row}>
            <Text style={styles.itemText}>
              {item.itemName} ×{item.quantity}
            </Text>
            <Text style={styles.itemText}>
              ₹ {item.itemCost * item.quantity}
            </Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.label}>₹ {subtotal}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Delivery Fee</Text>
          <Text style={styles.label}>₹ {deliveryFee}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Taxes</Text>
          <Text style={styles.label}>₹ {tax}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Discount</Text>
          <Text style={[styles.label, { color: "green" }]}>- ₹ {discount}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalLabel}>₹ {total}</Text>
        </View>
      </View>

      {/* 📦 Delivery Details */}
      <View style={styles.detailBox}>
        <Text style={styles.subTitle}>📍 Delivery Address</Text>
        <View style={styles.infoBox}>
          <Text style={styles.value}>{location}</Text>
        </View>

        <Text style={styles.subTitle}>📝 Cooking Instructions</Text>
        <View style={styles.infoBox}>
          <Text style={styles.value}>
            {cookingRequest || "No special instructions"}
          </Text>
        </View>

        {appliedCoupon && (
          <>
            <Text style={styles.subTitle}>🏷️ Coupon Applied</Text>
            <View style={styles.infoBox}>
              <Text style={styles.value}>
                {appliedCoupon.code} - ₹{appliedCoupon.discountAmount}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* 💳 Payment Method */}
      <View style={styles.paymentBox}>
        <Text style={styles.subTitle}>💳 Payment Method</Text>
        <View style={styles.paymentOptions}>
          {["Cash", "Online"].map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.methodButton,
                paymentMethod === method && styles.selectedMethod,
              ]}
              onPress={() => setPaymentMethod(method)}
            >
              <Text
                style={[
                  styles.methodText,
                  paymentMethod === method && styles.selectedText,
                ]}
              >
                {method}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ✅ Final Pay Button */}
      <TouchableOpacity style={styles.payButton} onPress={handlePlaceOrder}>
        <Text style={styles.payText}>Pay ₹ {total}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  userInfoBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
  },
  userInfoText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  billBox: {
    padding: 16,
    borderRadius: 10,
    borderColor: "#eee",
    borderWidth: 1,
    backgroundColor: "#FFF4E0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  itemText: { fontSize: 15, color: "#333" },
  label: { fontSize: 14, color: "#ffba00" },
  totalLabel: { fontSize: 16, fontWeight: "700", color: "#000" },
  divider: { height: 1, backgroundColor: "black", marginVertical: 10 },
  detailBox: {
    backgroundColor: "#FFF4E0",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  paymentBox: {
    backgroundColor: "#FFF4E0",
    padding: 16,
    borderRadius: 10,
    marginBottom: 30,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#444",
  },
  value: {
    fontSize: 14,
    color: "#333",
  },
  infoBox: {
    backgroundColor: "#fff",
    padding: 10,
    marginTop: 6,
    borderRadius: 8,
  },
  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  methodButton: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  selectedMethod: {
    borderColor: "#ffba00",
    backgroundColor: "#fff7e6",
  },
  methodText: {
    color: "#444",
    fontWeight: "600",
  },
  selectedText: {
    color: "#ff9900",
  },
  payButton: {
    backgroundColor: "#ffba00",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20, // ✅ fixed: removed "px", added number
  },
  payText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default CheckoutScreen;
