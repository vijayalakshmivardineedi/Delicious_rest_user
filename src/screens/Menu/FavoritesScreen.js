import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const favorites = [
  { id: '1', name: 'Chicken Biryani', restaurant: 'Paradise Biryani' },
  { id: '2', name: 'Margherita Pizza', restaurant: 'Dominos' },
];

const FavoritesScreen = () => (
  <View style={styles.container}>
    <Text style={styles.header}>Your Favorites ❤️</Text>
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.restaurant}>{item.restaurant}</Text>
        </View>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  item: { marginBottom: 16 },
  name: { fontSize: 16, fontWeight: '600' },
  restaurant: { fontSize: 14, color: '#666' },
});

export default FavoritesScreen;
