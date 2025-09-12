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
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [cookingRequest, setCookingRequest] = useState("");
  const [couponModalVisible, setCouponModalVisible] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [locationData, setLocationData] = useState(null);
  const navigation = useNavigation();

  const myCart = async () => {
    try {
      const raw = await AsyncStorage.getItem("userId");
      const userId = raw ? parseInt(JSON.parse(raw), 10) : null;
      if (!userId || Number.isNaN(userId)) {
        return;
      }
      const response = await axiosInstance.get(`/cart/getCart/${userId}`);

      const cartData = response.data;

      if (
        !cartData ||
        !Array.isArray(cartData.items) ||
        cartData.items.length === 0
      ) {
        setCartItems([]); // Set empty
        return;
      }

      setCartItems(cartData.items);
    } catch (error) {
      setCartItems([]); // Ensure fallback to empty array
    }
  };

  const fetchLocationData = async () => {
    try {
      const rawUserId = await AsyncStorage.getItem("userId");
      const userId = parseInt(JSON.parse(rawUserId), 10);
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axiosInstance.get(`/location/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setLocationData(response.data.location);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch address");
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await axiosInstance.get("/coupon");
      const coupons = res.data || [];

      // Filter out expired coupons
      const now = new Date();
      const validCoupons = coupons.filter((coupon) => {
        const expiryDate = new Date(coupon.expiryDate);
        return expiryDate > now;
      });

      setAvailableCoupons(validCoupons);
    } catch (error) {
      console.error(
        "Failed to fetch coupons:",
        error?.response?.data || error.message
      );
    }
  };

  const checkCouponAvailability = async (coupon) => {
    try {
      const totalAmount = getTotal();

      // Step 1: Check minimum order amount
      if (totalAmount < coupon.minOrderAmount) {
        Alert.alert(
          "Coupon Not Applicable",
          `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`
        );
        return false;
      }

      // Step 2: Fetch userId from AsyncStorage
      const raw = await AsyncStorage.getItem("userId");
      const userId = raw ? parseInt(JSON.parse(raw), 10) : null;
      if (!userId || Number.isNaN(userId)) {
        return;
      }

      // Step 3: Make API call
      const response = await axiosInstance.get(
        `/coupon/checkCouponAvailability/${userId}/${coupon._id}`
      );

      // Step 4: Check backend response status
      if (
        response.status === 200 &&
        response.data.message === "Coupon is available"
      ) {
        return true;
      } else {
        Alert.alert(
          "Coupon Not Available",
          response.data.message || "This coupon is not available for your order"
        );
        return false;
      }
    } catch (error) {
      console.error("Coupon check failed:", error);

      // If backend sent a response with message
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        Alert.alert("Coupon Not Available", error.response.data.message);
      } else {
        Alert.alert("Error", "Failed to check coupon availability");
      }

      return false;
    }
  };

  useFocusEffect(
    useCallback(() => {
      myCart();
      fetchLocationData();
      fetchCoupons();
    }, [])
  );

  const increaseQty = (item) => {
    setCartItems((prev) => {
      const updatedItem = { ...item, quantity: item.quantity + 1 };
      const updatedCart = prev.map((i) =>
        i._id === item._id ? updatedItem : i
      );
      updateCartItem(updatedItem);
      return updatedCart;
    });
  };

  const decreaseQty = (item) => {
    setCartItems((prev) => {
      if (item.quantity === 1) {
        const updatedCart = prev.filter((i) => i._id !== item._id);
        deleteCartItem(item);
        return updatedCart;
      }
      const updatedItem = { ...item, quantity: item.quantity - 1 };
      const updatedCart = prev.map((i) =>
        i._id === item._id ? updatedItem : i
      );
      updateCartItem(updatedItem);
      return updatedCart;
    });
  };

  const updateCartItem = async (item) => {
    try {
      const raw = await AsyncStorage.getItem("userId");
      const userId = JSON.parse(raw);
      await axiosInstance.put(`/cart/updateCart`, {
        userId,
        items: {
          [item.itemId]: {
            ...item,
            itemId: item.itemId,
            quantity: item.quantity,
          },
        },
        cookingInstructions: cookingRequest,
      });
    } catch (error) {
      console.error("Update failed:", error?.response?.data || error.message);
    }
  };

  const deleteCartItem = async (item) => {
    try {
      const raw = await AsyncStorage.getItem("userId");
      const userId = JSON.parse(raw);
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
        cookingInstructions: cookingRequest,
      });
    } catch (error) {
      console.error("Delete failed:", error?.response?.data || error.message);
    }
  };

  const getTotal = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.itemCost * item.quantity,
      0
    );
    const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
    return Math.max(0, subtotal - discount);
  };

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
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => decreaseQty(item)}
          >
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyCount}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => increaseQty(item)}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.itemTotal}>₹{item.itemCost * item.quantity}</Text>
    </View>
  );

  const handleCouponApply = async (coupon) => {
    const isAvailable = await checkCouponAvailability(coupon);
    if (isAvailable) {
      setAppliedCoupon(coupon);
      setCouponModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.section}>
          {cartItems.length > 0 ? (
            <FlatList
              data={cartItems}
              renderItem={renderCartItem}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
            />
          ) : (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#999" }}>
                Your cart is empty.
              </Text>
              <Text style={{ fontSize: 14, color: "#aaa", marginTop: 8 }}>
                Please add items to your cart.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Cooking requests</Text>
          <TextInput
            style={styles.addressInput}
            placeholder="E.g., less spicy, no onions"
            value={cookingRequest}
            onChangeText={(text) => setCookingRequest(text)}
          />
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>
            Delivery Location {selectedAddress ? ` • ${selectedAddress}` : ""}
          </Text>
          <TouchableOpacity onPress={() => setLocationModalVisible(true)}>
            <Text style={styles.blueText}>Get Your Location</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>
            Apply Coupon {appliedCoupon ? ` • ${appliedCoupon.couponId}` : ""}
          </Text>
          <TouchableOpacity onPress={() => setCouponModalVisible(true)}>
            <Text style={styles.blueText}>View All</Text>
          </TouchableOpacity>
        </View>

        {appliedCoupon && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Coupon Applied</Text>
            <View style={styles.couponAppliedCard}>
              <Text style={styles.couponCode}>{appliedCoupon.couponId}</Text>
              <Text style={styles.couponDiscount}>
                -₹{appliedCoupon.discountAmount}
              </Text>
              <TouchableOpacity
                onPress={() => setAppliedCoupon(null)}
                style={styles.removeCouponBtn}
              >
                <Text style={styles.removeCouponText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Type</Text>
          <Text style={styles.subText}>🚚 Standard • 35–40 mins</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tip</Text>
          <Text style={styles.subText}>
            Show appreciation to your delivery partner
          </Text>
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
            {availableCoupons.length > 0 ? (
              <ScrollView>
                {availableCoupons.map((coupon) => (
                  <TouchableOpacity
                    key={coupon._id}
                    style={styles.couponCard}
                    onPress={() => handleCouponApply(coupon)}
                  >
                    <Text style={styles.couponCode}>{coupon.couponId}</Text>
                    <Text style={styles.couponDesc}>{coupon.description}</Text>
                    <Text style={styles.couponDesc}>
                      Discount: ₹{coupon.discountAmount} off on Min Order: ₹
                      {coupon.minOrderAmount}
                    </Text>
                    {coupon.nthOrder && (
                      <Text style={styles.couponDesc}>
                        Applicable on {coupon.nthOrder}th Order
                      </Text>
                    )}
                    <Text style={styles.couponDesc}>
                      Expiry: {new Date(coupon.expiryDate).toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text style={{ textAlign: "center", marginVertical: 10 }}>
                No coupons available.
              </Text>
            )}
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
            {locationData?.address?.length > 0 ? (
              <View style={styles.card}>
                {locationData.address.map((addr, index) => (
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
            ) : (
              <Text style={{ textAlign: "center", color: "#999" }}>
                No saved addresses found.
              </Text>
            )}
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
        <View style={styles.totalContainer}>
          {appliedCoupon && (
            <View style={styles.discountRow}>
              <Text style={styles.discountLabel}>Discount:</Text>
              <Text style={styles.discountAmount}>
                -₹{appliedCoupon.discountAmount}
              </Text>
            </View>
          )}
          <Text style={styles.totalAmount}>₹{getTotal()}</Text>
        </View>
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => {
            if (!selectedAddress) {
              Alert.alert(
                "Delivery Location",
                "Please select a delivery location."
              );
              return;
            }
            navigation.navigate("CheckoutScreen", {
              cartItems,
              totalAmount: getTotal(),
              cookingRequest,
              selectedAddress,
              appliedCoupon,
            });
          }}
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
  sectionRow: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  blueText: {
    color: "#ffba00",
    fontSize: 14,
    fontWeight: "500",
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
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
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  totalContainer: {
    flexDirection: "column",
  },
  discountRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  discountLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 5,
  },
  discountAmount: {
    fontSize: 14,
    color: "green",
    fontWeight: "600",
  },
  totalAmount: { fontSize: 18, fontWeight: "600" },
  label: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  value: { fontSize: 16, color: "#444", marginTop: 4 },
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
    maxHeight: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  card: {
    backgroundColor: "#fff4db",
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    margin: 2,
  },
  couponCard: {
    backgroundColor: "#f8f8f8",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  couponAppliedCard: {
    backgroundColor: "#f0fff0",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffba00",
  },
  couponDiscount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },
  couponDesc: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  removeCouponBtn: {
    padding: 6,
    borderRadius: 4,
    backgroundColor: "#ffeaea",
  },
  removeCouponText: {
    color: "#ff4444",
    fontSize: 12,
    fontWeight: "600",
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
