import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axiosInstance, { baseURL } from "../axios/healpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
  const [isVeg, setIsVeg] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [originalMenu, setOriginalMenu] = useState([]); // holds raw menu
  const [menu, setMenu] = useState([]); // holds menu with quantities
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchMenu = async () => {
    try {
      const res = await axiosInstance.get(`/menu/getAllMenu`);
      const allMenu = res?.data?.menu || [];
      setOriginalMenu(allMenu); // Save raw menu

      const uniqueCategories = [
        ...new Set(
          allMenu
            .filter((item) => item.isEnabled !== false)
            .map((item) => item.itemCategory)
        ),
      ];

      const formattedCategories = uniqueCategories.map((cat) => ({ name: cat }));
      setCategoriesList(formattedCategories);
    } catch (err) {
      Alert.alert("Error", "No Categories Found");
    }
  };

const convertCartToMap = (itemsArray) => {
  const cartMap = {};
  itemsArray.forEach((item) => {
    cartMap[item.itemId] = { ...item };
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

  const updateCart = async (cart) => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return;
    const formData = { userId, items: Object.values(cart) };
    try {
      await axiosInstance.post(`/cart/cart/save`, formData);
      myMenu();
    } catch (error) {
      console.error("Cart update error:", error.message);
    }
  };

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev[item._id];
      const quantity = existing ? existing.quantity + 1 : 1;
      const updated = {
        ...prev,
        [item._id]: {
          ...item,
          itemId: item._id,
          quantity,
        },
      };
      updateCart(updated);
      return updated;
    });
  };

  const removeFromCart = (item) => {
    setCartItems((prev) => {
      const existing = prev[item._id];
      if (!existing) return prev;
      const quantity = existing.quantity - 1;
      let updated;
      if (quantity <= 0) {
        updated = { ...prev };
        delete updated[item._id];
      } else {
        updated = {
          ...prev,
          [item._id]: { ...existing, quantity },
        };
      }
      updateCart(updated);
      return updated;
    });
  };

  const getTotalPrice = () => {
    return Object.values(cartItems).reduce(
      (total, item) => total + item.itemCost * item.quantity,
      0
    );
  };

  // Merge quantity into menu items when cart or original menu changes
  // useEffect(() => {
  //   if (!loading && originalMenu.length > 0) {
  //     const withQuantities = originalMenu.map((item) => ({
  //       ...item,
  //       quantity: cartItems[item._id]?.quantity || 0,
  //       quantity: cartItems[item._id]?.quantity || 0,

  //     }));
  //     setMenu(withQuantities);
  //   }
  // }, [cartItems, loading, originalMenu]);

  useEffect(() => {
  if (!loading && originalMenu.length > 0) {
    console.log("Merging quantities...");
    console.log("cartItems", cartItems);
    console.log("originalMenu", originalMenu);

    const withQuantities = originalMenu.map((item) => ({
      ...item,
      quantity: cartItems[item._id]?.quantity || 0,
    }));

    setMenu(withQuantities);
  }
}, [cartItems, loading, originalMenu]);


  useFocusEffect(
  useCallback(() => {
    fetchMenu();
    myMenu();
  }, [])
);


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="black" barStyle="dark-content" />
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={["#6d9773", "#e2e1cf"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topSection}
        >
          <View style={styles.bannerContainer}>
            <Image
              source={require("../assets/BANNER1.png")}
              style={styles.bannerImage}
            />
          </View>
          <View style={styles.filterContainer}>
            <Text style={styles.filterText}>Veg Only</Text>
            <Switch value={isVeg} onValueChange={setIsVeg} />
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categoriesList.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryButton}>
                <Image
                  source={{
                    uri: "https://img.freepik.com/free-psd/top-view-delicious-pizza_23-2151868956.jpg",
                  }}
                  style={styles.categoryImage}
                />
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Best Sales</Text>
          <View style={styles.itemsContainer}>
            {menu
              .filter((item) => (isVeg ? item.itemType === "Veg" : true))
              .map((item, index) => (
                <View key={index} style={styles.itemCard}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.itemName}</Text>
                    <Text style={styles.itemPrice}>₹{item.itemCost}</Text>
                    <Text style={styles.itemType}>{item.itemType}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {item.quantity > 0 && (
                      <>
                        <TouchableOpacity onPress={() => removeFromCart(item)}>
                          <Ionicons name="remove-circle" size={30} color="red" />
                        </TouchableOpacity>
                        <Text style={{ marginHorizontal: 8 }}>{item.quantity}</Text>
                      </>
                    )}
                    <TouchableOpacity onPress={() => addToCart(item)}>
                      <Ionicons name="add-circle" size={30} color="#ffba00" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>

      {Object.keys(cartItems).length > 0 && (
        <TouchableOpacity
          style={styles.bottomBar}
          onPress={() => navigation.navigate("Cart")}
        >
          <Text style={styles.bottomBarText}>
            {Object.keys(cartItems).length} items | ₹{getTotalPrice()}
          </Text>
          <View style={styles.addToCartButton}>
            <Text style={styles.addToCartText}>View Cart</Text>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFA500",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topSection: {
    paddingBottom: 15,
    paddingTop: 15,
  },
  bannerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  bannerImage: {
    width: "90%",
    height: 180,
    borderRadius: 8,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "flex-end",
  },
  filterText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: "#ffba00",
    alignItems: "center",
    marginRight: 15,
    padding: 10,
    borderRadius: 12,
    width: 120,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: "600",
    textAlign: "center",
  },
  itemsContainer: {
    flexDirection: "column",
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEAC5",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 3,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
  },
  itemType: {
    fontSize: 12,
    color: "green",
  },
  bottomBar: {
    backgroundColor: "#ffba00",
    height: 60,
    width: "90%",
    position: "absolute",
    bottom: 15,
    alignSelf: "center",
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    elevation: 5,
    marginBottom: 60,
  },
  bottomBarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  addToCartText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 30,
  },
});

export default HomeScreen;
