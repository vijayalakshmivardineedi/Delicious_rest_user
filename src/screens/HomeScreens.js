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
  useColorScheme,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axiosInstance from "../axios/healpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import Swiper from "react-native-swiper";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const [isVeg, setIsVeg] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [originalMenu, setOriginalMenu] = useState([]);
  const [menu, setMenu] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(true);

  const scheme = useColorScheme(); // Detect dark or light mode

  const isDark = scheme === "dark";

  const fetchMenu = async () => {
    try {
      const res = await axiosInstance.get(`/menu/getMenu`);
      const allMenu = res?.data || [];
      setOriginalMenu(allMenu);

      const formattedCategories = allMenu.map((cat) => ({
        name: cat.name,
        image: cat.cateimage,
        isEnabled: cat.isEnabled,
      }));

      setCategoriesList(formattedCategories);

      const items = allMenu.flatMap((cat) =>
        (cat.items || []).map((item) => ({
          ...item,
          itemCategory: cat.name,
          itemType: cat.categoryType,
          catEnabled: cat.isEnabled,
        }))
      );

      setOriginalMenu(items);
    } catch (err) {
      Alert.alert("Error", "No Categories Found");
      console.error("Menu Fetch Error:", err);
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
      const userId = raw ? parseInt(JSON.parse(raw), 10) : null;
      if (!userId || Number.isNaN(userId)) {
        return;
      }
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

  useEffect(() => {
    if (!loading && originalMenu.length > 0) {
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

  const banners = [
    require("../assets/BANNER2.png"),
    require("../assets/BANNER1.png"),
    require("../assets/BANNER2.png"),
  ];

  const themeColors = {
    background: isDark ? "#121212" : "#FFFFFF",
    card: isDark ? "#1E1E1E" : "#FCF5EE",
    text: isDark ? "#FFFFFF" : "#000000",
    accent: "#D3671B",
    secondary: isDark ? "#cfb153" : "#cfb153",
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: themeColors.background }]}
    >
      <StatusBar
        backgroundColor={isDark ? "#000" : "#fbcf67"}
        barStyle={isDark ? "light-content" : "dark-content"}
      />

      <ScrollView
        style={[styles.container, { backgroundColor: themeColors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={
            isDark
              ? ["#2C2C2C", "#1E1E1E"]
              : ["#fbcf67", "#FCF5EE"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topSection}
        >
          {/* Swiper Banner */}
          <View style={styles.bannerContainer}>
            <Swiper
              autoplay
              autoplayTimeout={3}
              loop
              dotStyle={styles.dot}
              activeDotStyle={styles.activeDot}
              paginationStyle={styles.pagination}
            >
              {banners.map((img, index) => (
                <View key={index} style={styles.slide}>
                  <Image source={img} style={styles.bannerImage} />
                </View>
              ))}
            </Swiper>
          </View>

          <View style={styles.filterContainer}>
            <Text style={[styles.filterText, { color: themeColors.text }]}>
              Veg Only
            </Text>
            <Switch
              value={isVeg}
              onValueChange={setIsVeg}
              thumbColor={isVeg ? "#D3671B" : "#ccc"}
              trackColor={{ true: "#fbcf67", false: "#ddd" }}
            />
          </View>
        </LinearGradient>

        {/* Category Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Categories
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categoriesList.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryWrapper}
                onPress={() =>
                  navigation.navigate("Menu", {
                    selectedCategory: category.name,
                  })
                }
              >
                <View
                  style={[
                    styles.categoryCircle,
                    { backgroundColor: themeColors.secondary },
                  ]}
                >
                  <Image
                    source={{ uri: category.image }}
                    style={styles.categoryImageRound}
                  />
                </View>
                <Text style={[styles.categoryLabel, { color: themeColors.text }]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Best Sellers Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Best Sellers
          </Text>
          <View style={styles.itemsContainer}>
            {menu
              .filter((item) => (isVeg ? item.itemType === "Veg" : true))
              .map((item) => (
                <View
                  key={item._id}
                  style={[
                    styles.itemCard,
                    { backgroundColor: themeColors.card },
                  ]}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemDetails}>
                    <Text
                      style={[styles.itemName, { color: themeColors.text }]}
                    >
                      {item.itemName}
                    </Text>
                    <Text
                      style={[styles.itemPrice, { color: themeColors.text }]}
                    >
                      ₹{item.itemCost}
                    </Text>
                    <Text
                      style={[
                        styles.itemType,
                        { color: item.itemType === "Veg" ? "green" : "red" },
                      ]}
                    >
                      {item.itemType}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {item.quantity > 0 && (
                      <>
                        <TouchableOpacity
                          onPress={() => removeFromCart(item)}
                          disabled={!item.catEnabled || !item.isEnabled}
                        >
                          <Ionicons
                            name="remove-circle"
                            size={28}
                            color={
                              item.catEnabled && item.isEnabled
                                ? "red"
                                : "#ccc"
                            }
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginHorizontal: 8,
                            color: themeColors.text,
                          }}
                        >
                          {item.quantity}
                        </Text>
                      </>
                    )}
                    <TouchableOpacity
                      onPress={() =>
                        item.catEnabled && item.isEnabled && addToCart(item)
                      }
                      disabled={!item.catEnabled || !item.isEnabled}
                    >
                      <Ionicons
                        name="add-circle"
                        size={28}
                        color={
                          item.catEnabled && item.isEnabled
                            ? themeColors.accent
                            : "#ccc"
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>

      {Object.keys(cartItems).length > 0 && (
        <TouchableOpacity
          style={[styles.bottomBar, { backgroundColor: themeColors.accent }]}
          onPress={() => navigation.navigate("Cart")}
        >
          <Text style={styles.bottomBarText}>
            {Object.keys(cartItems).length} items | ₹{getTotalPrice()}
          </Text>
          <Text style={styles.addToCartText}>View Cart</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  topSection: { paddingBottom: 15, paddingTop: 15 },
  bannerContainer: {
    height: width * 0.45,
    borderRadius: 12,
    overflow: "hidden",
    alignSelf: "center",
  },
  slide: { flex: 1, justifyContent: "center", alignItems: "center" },
  bannerImage: {
    width: width * 0.92,
    height: width * 0.45,
    borderRadius: 12,
  },
  pagination: { bottom: -20 },
  dot: {
    backgroundColor: "rgba(255,255,255,0.4)",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#D3671B",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "flex-end",
  },
  filterText: { fontSize: 16, fontWeight: "bold", marginRight: 10 },
  section: { marginHorizontal: 20, marginVertical: 15 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  categoryWrapper: { alignItems: "center", marginRight: 15 },
  categoryCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  categoryImageRound: { width: 70, height: 70, borderRadius: 35 },
  categoryLabel: { marginTop: 8, fontSize: 14, fontWeight: "600" },
  itemsContainer: { flexDirection: "column" },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 4,
    shadowColor: "#000",
  },
  itemImage: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: 10,
    marginRight: 10,
  },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "bold" },
  itemPrice: { fontSize: 14 },
  itemType: { fontSize: 12 },
  bottomBar: {
  height: 60,
  width: "90%",
  position: "absolute",
  bottom: 75, // this already gives a small gap above the edge
  alignSelf: "center",
  borderRadius: 50,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 20,
  elevation: 8,
  backgroundColor: "#D3671B",
},
  bottomBarText: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  addToCartText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default HomeScreen;
