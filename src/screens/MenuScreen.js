import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Collapsible from "react-native-collapsible";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../axios/healpers";

const MenuScreen = () => {
  const [menuData, setMenuData] = useState([]);
  const [activeSections, setActiveSections] = useState({});
  const [cartItems, setCartItems] = useState({});
  const navigation = useNavigation();
  const route = useRoute();

  const fetchMenu = async () => {
    try {
      const res = await axiosInstance.get("/menu/getMenu");
      setMenuData(res.data || []);
    } catch (err) {
      Alert.alert("Error", "No Menu Found");
    }
  };

  const convertCartToMap = (itemsArray) => {
    const cartMap = {};
    itemsArray.forEach((item) => {
      cartMap[item.itemId] = { ...item };
    });
    return cartMap;
  };

  const fetchCart = async () => {
    try {
      const raw = await AsyncStorage.getItem("userId");
      const userId = JSON.parse(raw);
      const response = await axiosInstance.get(`/cart/getCart/${userId}`);
      if (response.status === 200) {
        const cartArray = response.data.items || [];
        setCartItems(convertCartToMap(cartArray));
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMenu();
      fetchCart();

      if (route.params?.selectedCategory) {
        setActiveSections((prev) => ({
          ...prev,
          [route.params.selectedCategory]: true,
        }));

        // Optional: reset param
        navigation.setParams({ selectedCategory: null });
      }
    }, [route.params?.selectedCategory])
  );

  const toggleSection = (category) => {
    setActiveSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev[item._id];
      const quantity = existing ? existing.quantity + 1 : 1;
      const updated = {
        ...prev,
        [item._id]: { ...item, quantity },
      };
      updateCart(updated);
      return updated;
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const existing = prev[itemId];
      if (!existing) return prev;
      const quantity = existing.quantity - 1;

      let updated = { ...prev };
      if (quantity <= 0) {
        delete updated[itemId];
      } else {
        updated[itemId] = { ...existing, quantity };
      }

      updateCart(updated);
      return updated;
    });
  };

  const updateCart = async (cart) => {
    const raw = await AsyncStorage.getItem("userId");
    const userId = JSON.parse(raw);
    const formData = { userId, items: cart };

    try {
      await axiosInstance.post("/cart/cart/save", formData);
      fetchCart(); // Refresh cart
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  const getTotalPrice = () => {
    return Object.values(cartItems).reduce(
      (total, item) => total + item.itemCost * item.quantity,
      0
    );
  };

  const renderItem = (item, categoryEnabled, key) => {
    const quantity = cartItems[item._id]?.quantity || 0;
    const isDisabled = !categoryEnabled || !item.isEnabled;

    return (
      <View
        style={[styles.itemContainer, isDisabled && styles.disabledItem]}
        key={key}
      >
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <View style={styles.itemHeader}>
            <View
              style={[
                styles.foodTypeIndicator,
                { borderColor: item.type === "veg" ? "green" : "red" },
              ]}
            >
              <View
                style={[
                  styles.foodTypeDot,
                  { backgroundColor: item.type === "veg" ? "green" : "red" },
                ]}
              />
            </View>
            <Text style={styles.itemName}>{item.itemName}</Text>
          </View>
          <Text style={styles.itemPrice}>₹{item.itemCost}</Text>
          <Text style={styles.itemDesc}>{item.description || ""}</Text>

          {isDisabled ? (
            <Text style={{ color: "gray", marginTop: 6 }}>Not Available</Text>
          ) : quantity === 0 ? (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToCart(item)}
            >
              <Text style={styles.addButtonText}>ADD</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => removeFromCart(item._id)}
              >
                <Text style={styles.addButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => addToCart(item)}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {menuData.map((section, sectionIndex) => (
          <View key={section._id} style={styles.accordionSection}>
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => toggleSection(section.name)}
            >
              <Text style={styles.accordionTitle}>{section.name}</Text>
              <Text style={styles.accordionToggle}>
                {activeSections[section.name] ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>

            <Collapsible collapsed={!activeSections[section.name]}>
              {section.items.map((item, itemIndex) =>
                renderItem(
                  item,
                  section.isEnabled,
                  `${section._id}-${item._id}`
                )
              )}
            </Collapsible>
          </View>
        ))}
      </ScrollView>

      {Object.keys(cartItems).length > 0 && (
        <TouchableOpacity
          style={styles.cartBar}
          onPress={() => navigation.navigate("Cart")}
        >
          <Text style={styles.cartText}>
            {Object.keys(cartItems).length} item(s) | ₹{getTotalPrice()}
          </Text>
          <Text style={styles.viewCartText}>View Cart</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", padding: 10 },
  accordionSection: { marginBottom: 16 },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  accordionTitle: { fontSize: 18, fontWeight: "600" },
  accordionToggle: { fontSize: 14, fontWeight: "600" },

  itemContainer: {
    flexDirection: "row",
    marginTop: 12,
    paddingBottom: 12,
    backgroundColor: "#FFEAC5",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
    justifyContent: "center",
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  foodTypeIndicator: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  foodTypeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    marginVertical: 2,
  },
  itemDesc: {
    fontSize: 12,
    color: "black",
  },
  addButton: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#00b386",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  addButtonText: {
    color: "#00b386",
    fontWeight: "600",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  controlButton: {
    borderWidth: 1,
    borderColor: "#00b386",
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  cartBar: {
    position: "absolute",
    bottom: 20,
    left: "5%",
    width: "90%",
    height: 60,
    backgroundColor: "#ffba00",
    marginBottom: 60,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cartText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  viewCartText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  disabledItem: {
    opacity: 0.4,
  },
});

export default MenuScreen;
