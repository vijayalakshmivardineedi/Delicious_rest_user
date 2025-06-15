import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";

const TrackOrderScreen = ({ navigation }) => {
  const deliveryLocation = {
    latitude: 17.385044, // Example: Hyderabad
    longitude: 78.486671,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBanner}>
        <View style={styles.bannerContent}>
          <Text style={styles.statusText}>Your order is on the way!</Text>
          <Text style={styles.estimate}>Estimated delivery time: 25 mins</Text>
        </View>
      </View>

      {/* Map View Integration */}
      <View style={styles.mapWrapper}>
        <MapView style={styles.map} initialRegion={deliveryLocation}>
          <Marker
            coordinate={deliveryLocation}
            title="Delivery Partner"
            description="2.1 km away"
          />
        </MapView>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Order ID</Text>
        <Text style={styles.value}>#ORD123456</Text>

        <Text style={styles.label}>Items</Text>
        <Text style={styles.value}>
          1x Chicken Biryani{"\n"}2x Butter Naan{"\n"}1x Paneer Tikka
        </Text>

        <Text style={styles.label}>Delivery Partner</Text>
        <Text style={styles.value}>Rajesh (2.1 km away)</Text>

        <Text style={styles.label}>Restaurant</Text>
        <Text style={styles.value}>Spice Villa, Main Street</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AppTabs")}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBanner: {
    backgroundColor: "#0c3b2e",
    height: 150,
    width: "100%",
    padding: 20,
  },
  bannerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  estimate: {
    fontSize: 16,
    color: "#e2e1cf",
    marginTop: 16,
    marginBottom: 20,
  },
  mapWrapper: {
    width: "100%",
    height: 250,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  infoCard: {
    backgroundColor: "#FFEAC5",
    width: "90%",
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: "#ffba00",
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  button: {
    backgroundColor: "#ffba00",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 40,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default TrackOrderScreen;
