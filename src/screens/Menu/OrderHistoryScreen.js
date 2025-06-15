import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const orders = [
  {
    id: '1',
    items: 'Veg Burger, Coke',
    dateTime: 'Apr 20 • 7:30 PM',
    status: 'Delivered',
  },
  {
    id: '2',
    items: 'Zinger Burger, Fries',
    dateTime: 'Apr 17 • 6:15 PM',
    status: 'Out for delivery',
  },
  {
    id: '3',
    items: 'Veg Burger, Coke',
    dateTime: 'Apr 20 • 7:30 PM',
    status: 'Delivered',
  },
  {
    id: '4',
    items: 'Zinger Burger, Fries',
    dateTime: 'Apr 17 • 6:15 PM',
    status: 'Out for delivery',
  },
  {
    id: '5',
    items: 'Veg Burger, Coke',
    dateTime: 'Apr 20 • 7:30 PM',
    status: 'Delivered',
  },
  {
    id: '6',
    items: 'Zinger Burger, Fries',
    dateTime: 'Apr 17 • 6:15 PM',
    status: 'Out for delivery',
  },
];

const OrderHistoryScreen = () => (
  <View style={styles.container}>
    <Text style={styles.header}>Order History</Text>
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.orderCard}>
          <View style={styles.cardTop}>
            <Text style={styles.items}>{item.items}</Text>
            <Text style={styles.dateTime}>{item.dateTime}</Text>
          </View>
          <Text style={styles.status}>{item.status}</Text>
        </View>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  orderCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#6d9773',
    borderRadius: 8,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  items: { fontSize: 16, fontWeight: '600', flex: 1 },
  dateTime: { fontSize: 14, color: 'white', textAlign: 'right' },
  status: { fontSize: 14, color: '#ffba00', fontWeight: '700', },
});

export default OrderHistoryScreen;
