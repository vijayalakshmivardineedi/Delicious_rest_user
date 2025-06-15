import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Collapsible from "react-native-collapsible";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { baseURL } from "../axios/healpers";

const MenuScreen = () => {
  const [menuData, setMenuData] = useState([]);
  const [activeSections, setActiveSections] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${baseURL}/menu/getMenu`);
        setMenuData(res.data);
      } catch (err) {
        console.error("Error fetching menu:", err);
      }
    };
    fetchMenu();
  }, []);

  const toggleSection = (category) => {
    setActiveSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.itemCost, 0);
  };

  const renderItem = (item, key) => (
    <View style={styles.itemContainer} key={key}>
      <Image
        source={{ uri: `${baseURL}/uploads/${item.image}` }}
        style={styles.itemImage}
      />
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
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addToCart(item)}
        >
          <Text style={styles.addButtonText}>ADD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {menuData.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.accordionSection}>
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
                renderItem(item, `${sectionIndex}-${itemIndex}`)
              )}
            </Collapsible>
          </View>
        ))}
      </ScrollView>

      {cartItems.length > 0 && (
        <TouchableOpacity
          style={styles.cartBar}
          onPress={() => navigation.navigate("Cart")}
        >
          <Text style={styles.cartText}>
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} | ₹
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
  accordionSection: {
    marginBottom: 16,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  accordionToggle: {
    fontSize: 14,
    fontWeight: "600",
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
});

export default MenuScreen;
