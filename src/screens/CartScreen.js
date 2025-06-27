import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axiosInstance from "../axios/healpers";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [couponModalVisible, setCouponModalVisible] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [locationData, setLocationData] = useState(null);
  const navigation = useNavigation();

  const myCart = async () => {
    try {
      const raw = await AsyncStorage.getItem("userId");
      const userId = parseInt(JSON.parse(raw), 10);
      const response = await axiosInstance.get(`/cart/getCart/${userId}`);
      setCartItems(response.data.items);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const fetchLocationData = async () => {
  try {
    const rawUserId = await AsyncStorage.getItem("userId");
    const userId = parseInt(JSON.parse(rawUserId), 10);

    const token = await AsyncStorage.getItem("token"); // get the token
    if (!token) throw new Error("No token found");

    const response = await axiosInstance.get(`/location/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      setLocationData(response.data); // or .data.location based on backend
    }
  } catch (error) {
    console.log("Error fetching location:", error?.response?.data || error.message);
    Alert.alert("Error", "Failed to fetch address");
  }
};



  useFocusEffect(
    useCallback(() => {
      myCart();
      fetchLocationData();
    }, [])
  );

  const availableCoupons = [
    { id: "c1", code: "SAVE50", desc: "Flat ₹50 off on orders above ₹199", discount: 50 },
    { id: "c2", code: "NEWUSER75", desc: "₹75 off for new users", discount: 75 },
  ];

  const increaseQty = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      const updatedItem = { ...existing, quantity: existing.quantity + 1 };
      const updatedCart = prev.map((i) => (i._id === item._id ? updatedItem : i));
      updateCartItem(updatedItem);
      return updatedCart;
    });
  };

  const decreaseQty = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (!existing) return prev;

      if (existing.quantity === 1) {
        const updatedCart = prev.filter((i) => i._id !== item._id);
        deleteCartItem(item);
        return updatedCart;
      }

      const updatedItem = { ...existing, quantity: existing.quantity - 1 };
      const updatedCart = prev.map((i) => (i._id === item._id ? updatedItem : i));
      updateCartItem(updatedItem);
      return updatedCart;
    });
  };

  const updateCartItem = async (item) => {
    const raw = await AsyncStorage.getItem("userId");
    const userId = JSON.parse(raw);
    try {
      await axiosInstance.put(`/cart/updateCart`, {
        userId,
        items: {
          [item.itemId]: {
            ...item,
            itemId: item.itemId,
            quantity: item.quantity,
          },
        },
      });
    } catch (error) {
      console.error("Update failed:", error?.response?.data || error.message);
    }
  };

  const deleteCartItem = async (item) => {
    const raw = await AsyncStorage.getItem("userId");
    const userId = JSON.parse(raw);
    try {
      const updatedItems = cartItems
        .filter((i) => i.itemId !== item.itemId)
        .reduce((acc, curr) => {
          acc[curr.itemId] = {
            ...curr,
            itemId: curr.itemId,
            quantity: curr.quantity,
          };
          return acc;
        }, {});
      await axiosInstance.put(`/cart/updateCart`, {
        userId,
        items: updatedItems,
      });
    } catch (error) {
      console.error("Delete failed:", error?.response?.data || error.message);
    }
  };

  const getTotal = () =>
    cartItems.reduce((total, item) => total + item.itemCost * item.quantity, 0);

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <View
            style={[
              styles.vegNonVeg,
              { borderColor: item.type === "veg" ? "green" : "red" },
            ]}
          >
            <View
              style={[
                styles.vegDot,
                { backgroundColor: item.type === "veg" ? "green" : "red" },
              ]}
            />
          </View>
          <Text style={styles.itemName}>{item.itemName}</Text>
        </View>
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => decreaseQty(item)}>
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyCount}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => increaseQty(item)}>
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.itemTotal}>₹{item.itemCost * item.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.section}>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.cookingRequest}>
          <Text style={styles.note}>📝 Cooking requests</Text>
          <TextInput style={styles.addressInput} placeholder="E.g., less spicy, no onions" />
        </View>

        <TouchableOpacity style={styles.section} onPress={() => setLocationModalVisible(true)}>
          <Text style={styles.sectionTitle}>
            Delivery Location {selectedAddress ? `• ${selectedAddress}` : ""}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.section} onPress={() => setCouponModalVisible(true)}>
          <Text style={styles.sectionTitle}>
            Apply Coupon {appliedCoupon ? `• ${appliedCoupon.code}` : ""}
          </Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Type</Text>
          <Text style={styles.subText}>🚚 Standard • 35–40 mins</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tip</Text>
          <Text style={styles.subText}>Show appreciation to your delivery partner</Text>
        </View>
      </ScrollView>

      {/* Coupon Modal */}
      <Modal
        visible={couponModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCouponModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Available Coupons</Text>
            {availableCoupons.map((coupon) => (
              <TouchableOpacity
                key={coupon.id}
                style={styles.couponCard}
                onPress={() => {
                  setAppliedCoupon(coupon);
                  setCouponModalVisible(false);
                }}
              >
                <Text style={styles.couponCode}>{coupon.code}</Text>
                <Text style={styles.couponDesc}>{coupon.desc}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setCouponModalVisible(false)}>
              <Text style={styles.modalClose}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Location Modal */}
      <Modal
        visible={locationModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLocationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Delivery Address</Text>

            {locationData && (
              <View style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.label}>User ID: </Text>
                  <Text style={styles.value}>{locationData.userId}</Text>
                </View>
              </View>
            )}

            <View style={styles.card}>
              {locationData?.address?.map((addr, index) => (
                <TouchableOpacity
                  key={addr._id || index}
                  style={styles.addressBlock}
                  onPress={() => {
                    setSelectedAddress(
                      `${addr.address1}, ${addr.city} - ${addr.postalCode}`
                    );
                    setLocationModalVisible(false);
                  }}
                >
                  <Text style={styles.label}>Address {index + 1}</Text>
                  <Text style={styles.label}>Address Line 1:</Text>
                  <Text style={styles.value}>{addr.address1}</Text>
                  <Text style={styles.label}>Address Line 2:</Text>
                  <Text style={styles.value}>{addr.address2}</Text>
                  <Text style={styles.label}>City:</Text>
                  <Text style={styles.value}>{addr.city}</Text>
                  <Text style={styles.label}>Postal Code:</Text>
                  <Text style={styles.value}>{addr.postalCode}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setLocationModalVisible(false)}
              style={{ marginTop: 10 }}
            >
              <Text style={styles.modalClose}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.footer}>
        <Text style={styles.totalAmount}>₹{getTotal()}</Text>
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => navigation.replace("CheckoutScreen")}
        >
          <Text style={styles.payText}>Pay ₹{getTotal()}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { flex: 1 },
  section: { padding: 16, borderBottomWidth: 1, borderColor: "#f0f0f0" },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  subText: { color: "#666", fontSize: 14 },
  addressInput: {
    backgroundColor: "#FFEAC5",
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  itemImage: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
  itemInfo: { flex: 1 },
  itemHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  itemName: { fontSize: 16, fontWeight: "600" },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEAC5",
    borderRadius: 4,
    width: 100,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qtyBtn: { paddingHorizontal: 6 },
  qtyText: { fontSize: 18, fontWeight: "600" },
  qtyCount: { fontSize: 16 },
  itemTotal: { fontSize: 16, fontWeight: "600", color: "#444" },
  vegNonVeg: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  vegDot: { width: 8, height: 8, borderRadius: 4 },
  cookingRequest: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  note: { fontSize: 14, marginBottom: 8 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  totalAmount: { fontSize: 18, fontWeight: "600" },
  payButton: {
    backgroundColor: "#ffba00",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  payText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  couponCard: {
    backgroundColor: "#f8f8f8",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffba00",
  },
  couponDesc: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  modalClose: {
    textAlign: "center",
    color: "#ffba00",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
  },
});

export default CartScreen;
