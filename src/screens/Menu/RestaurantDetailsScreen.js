import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const dishes = [
  { id: '1', name: 'Butter Chicken', price: '₹250' },
  { id: '2', name: 'Paneer Tikka', price: '₹190' },
];

const RestaurantDetailsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.header}>Spice Villa</Text>
    <Text style={styles.subtext}>North Indian, Biryani • 4.3 ★ (1200+)</Text>
    <FlatList
      data={dishes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.dish}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold' },
  subtext: { color: '#666', marginVertical: 6 },
  dish: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  name: { fontSize: 16 },
  price: { fontSize: 16, fontWeight: 'bold' },
});

export default RestaurantDetailsScreen;
