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
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance, { baseURL } from "../axios/healpers";
import { useFocusEffect } from "@react-navigation/native";

const MenuScreen = ({ navigation }) => {
  const [menuData, setMenuData] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [selectedType, setSelectedType] = useState("Veg");
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(true);

  
    const fetchMenu = async () => {
      try {
        const res = await axiosInstance.get(`/menu/getAllMenu`);
        const allMenu = res?.data?.menu || [];
        setMenuData(allMenu);
      } catch (err) {
        Alert.alert("Error", "No Menu Found");
      } finally {
        setLoading(false);
      }
    };

    const convertCartToMap = (itemsArray) => {
  const cartMap = {};
  itemsArray.forEach((item) => {
    cartMap[item.itemId] = { ...item }; // key = itemId
  });
  return cartMap;
};



     const myMenu = async () => {
        try {
          const raw = await AsyncStorage.getItem("userId");
          const userId = parseInt(JSON.parse(raw), 10);
          const response = await axiosInstance.get(`/cart/getCart/${userId}`);
         
            if (response.status === 200) {
        const cartArray = response.data.items || [];
        setCartItems(convertCartToMap(cartArray));
      }
          
        } catch (error) {
          console.error("Error fetching cart:", error);
        } finally {
          setLoading(false);
        }
      };

useEffect(() => {
  const updatedMenu = menuData.map(item => ({
    ...item,
    quantity: cartItems[item._id]?.quantity || 0,
  }));
  setFilteredMenu(updatedMenu.filter(i => i.itemType === selectedType));
}, [cartItems, menuData, selectedType]);



  useFocusEffect(
  useCallback(() => {
    fetchMenu();
    myMenu();
  }, [])
);


  useEffect(() => {
    const filtered = menuData.filter(item => item.itemType === selectedType);
    setFilteredMenu(filtered);
  }, [menuData, selectedType]);

const addToCart = (item) => {
  console.log("itemtype", item)
  setCartItems((prev) => {
    const existingItem = prev[item._id];
    const quantity = existingItem ? existingItem.quantity + 1 : 1;

    const updatedCart = {
      ...prev,
      [item._id]: { ...item, quantity },
    };

    updateCart(updatedCart);

    return updatedCart;
  });
};


const removeFromCart = (itemId) => {
  setCartItems((prev) => {
    const existingItem = prev[itemId];
    if (!existingItem) return prev;

    let updatedCart;

    const newQuantity = existingItem.quantity - 1;
    if (newQuantity <= 0) {
      updatedCart = { ...prev };
      delete updatedCart[itemId];
    } else {
      updatedCart = {
        ...prev,
        [itemId]: { ...existingItem, quantity: newQuantity },
      };
    }
    updateCart(updatedCart);

    return updatedCart;
  });
};

const updateCart = async (cart) => {
  console.log("hitting");

  const userId = await AsyncStorage.getItem("userId");
  console.log("userId:", userId);

  if (!userId) {
    console.warn("No userId found in AsyncStorage");
    return;
  }

  console.log("cartItems", cart);
  const formData = {
    userId,
    items: cart,
  };

  try {
    const response = await axiosInstance.post(`/cart/cart/save`, formData);
    console.log("Cart saved successfully:", response.data);
    myMenu();
  } catch (error) {
    if (error.response) {
      console.log("Server responded with error:", error.response.data);
    } else if (error.request) {
      console.log("Request made but no response:", error.request);
    } else {
      console.log("Axios config error:", error.message);
    }
  }
};

  const getTotalPrice = () => {
    return Object.values(cartItems).reduce(
      (total, item) => total + item.itemCost * item.quantity,
      0
    );
  };

  const renderItem = (item, key) => {
    const quantity = cartItems[item._id]?.quantity || 0;

    return (
      <View style={styles.itemContainer} key={key}>
        <Image
         source={{ uri: item.image }}
          style={styles.itemImage}
        />
        <View style={styles.itemInfo}>
          <View style={styles.itemHeader}>
            <View
              style={[
                styles.foodTypeIndicator,
                { borderColor: item.itemType === "Veg" ? "green" : "red" },
              ]}
            >
              <View
                style={[
                  styles.foodTypeDot,
                  { backgroundColor: item.itemType === "Veg" ? "green" : "red" },
                ]}
              />
            </View>
            <Text style={styles.itemName}>{item.itemName}</Text>
          </View>
          <Text style={styles.itemPrice}>₹{item.itemCost}</Text>
          <Text style={styles.itemDesc}>{item.description || ""}</Text>

          {quantity === 0 ? (
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
      {/* Toggle Veg / Non-Veg Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "center", margin: 10 }}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            selectedType === "Veg" && styles.activeTypeButton,
          ]}
          onPress={() => setSelectedType("Veg")}
        >
          <Text style={styles.typeButtonText}>Veg</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeNonVegButton,
            selectedType === "Non-Veg" && styles.activeTypeNonVegButton,
          ]}
          onPress={() => setSelectedType("Non-Veg")}
        >
          <Text style={styles.typeButtonText}>Non-Veg</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items List */}
      <ScrollView style={styles.container}>
        {filteredMenu.map((item, index) => renderItem(item, index))}
      </ScrollView>

      {/* Cart Summary Bar */}
      {Object.keys(cartItems).length > 0 && (
        <TouchableOpacity
          style={styles.cartBar}
          onPress={() => navigation.navigate("Cart")}
        >
          <Text style={styles.cartText}>
            {Object.keys(cartItems).length}{" "}
            {Object.keys(cartItems).length === 1 ? "item" : "items"} | ₹
            {getTotalPrice()}
          </Text>
          <Text style={styles.viewCartText}>View Cart</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
  },
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
  typeButton: {
    borderWidth: 1,
    borderColor: "#00b386",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  typeNonVegButton: {
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  activeTypeButton: {
    backgroundColor: "#00b386",
  },
  activeTypeNonVegButton: {
    backgroundColor: "red",
  },
  typeButtonText: {
    color: "#000",
    fontWeight: "600",
  },
});

export default MenuScreen;
