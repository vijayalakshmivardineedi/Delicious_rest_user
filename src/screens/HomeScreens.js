import React, { useEffect, useState } from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { baseURL } from "../axios/healpers";

const HomeScreen = ({ navigation }) => {
  const [isVeg, setIsVeg] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/menu/getMenu`
      );
      const enabledCategories = res.data.filter(
        (cat) => cat.isEnabled !== false
      );
      setCategories(enabledCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const items = [
    { name: "Margherita Pizza", price: 12, type: "Veg" },
    { name: "Burger", price: 12, type: "Non-Veg" },
    { name: "Pasta", price: 12, type: "Veg" },
    { name: "Fries", price: 12, type: "Veg" },
  ];

  const handleAddItem = (item) => {
    setSelectedItem(item);
  };

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
              source={{
                uri: "https://cdn.dribbble.com/userupload/32848511/file/original-1dfd007285c80201ac71ee4d0070a0bf.jpg?resize=1024x768&vertical=center",
              }}
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
            {categories.map((category, index) => (
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
          <Text style={styles.sectionTitle}>Bestsellers</Text>
          <View style={styles.itemsContainer}>
            {items
              .filter((item) => (isVeg ? item.type === "Veg" : true))
              .map((item, index) => (
                <View key={index} style={styles.itemCard}>
                  <Image
                    source={{
                      uri: "https://img.freepik.com/free-photo/top-view-pepperoni-pizza-with-mushroom-sausages-bell-pepper-olive-corn-black-wooden_141793-2158.jpg",
                    }}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>${item.price}</Text>
                    <Text style={styles.itemType}>{item.type}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddItem(item)}
                  >
                    <Ionicons name="add-circle" size={30} color="#ffba00" />
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>

      {selectedItem && (
        <TouchableOpacity
          style={styles.bottomBar}
          onPress={() => navigation.navigate("Cart")}
        >
          <Text style={styles.bottomBarText}>
            1 item | ${selectedItem.price}
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
    height: 150,
    borderRadius: 15,
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
  textAlign: "center",        // ✅ center text inside its container
},

  itemsContainer: {
    flexDirection: "column",
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
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
  addButton: {
    padding: 5,
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
  // addToCartButton: {
  //   backgroundColor: "#0c3b2e",
  //   paddingVertical: 6,
  //   paddingHorizontal: 14,
  //   borderRadius: 6,
  // },
  addToCartText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 30,
  },
});

export default HomeScreen;
