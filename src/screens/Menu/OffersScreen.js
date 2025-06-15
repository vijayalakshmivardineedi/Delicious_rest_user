import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { baseURL } from '../../axios/healpers';

const OffersScreen = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch(`${baseURL}/coupon/`);
        const data = await response.json();
        setOffers(data);
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Offers</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#6d9773" />
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.code}>{item.code}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.detail}>Min Order: ₹{item.minOrderAmount}</Text>
              <Text style={styles.detail}>Discount: ₹{item.discountAmount}</Text>
              <Text style={styles.detail}>Expires: {new Date(item.expiryDate).toLocaleDateString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FFEAC5',
    marginBottom: 10,
  },
  code: { fontWeight: 'bold', fontSize: 18, color: "#6d9773", marginBottom: 4 },
  detail: { fontSize: 14, color: "black" },
  description: {fontWeight: "bold"},
});

export default OffersScreen;
