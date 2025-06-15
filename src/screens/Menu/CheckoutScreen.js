import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const CheckoutScreen = ({ navigation }) => {
  const cartItems = [
    { id: 1, name: 'Chicken Biryani', quantity: 1, price: 250 },
    { id: 2, name: 'Butter Naan', quantity: 2, price: 40 },
    { id: 3, name: 'Coke', quantity: 1, price: 50 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 30;
  const tax = Math.round(subtotal * 0.05);
  const discount = 40;
  const total = subtotal + deliveryFee + tax - discount;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧾 Bill Summary</Text>

      {/* Itemized Bill */}
      <View style={styles.billBox}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.row}>
            <Text style={styles.itemText}>
              {item.name} ×{item.quantity}
            </Text>
            <Text style={styles.itemText}>₹ {item.price * item.quantity}</Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.label}>₹ {subtotal}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Delivery Fee</Text>
          <Text style={styles.label}>₹ {deliveryFee}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Taxes & Charges</Text>
          <Text style={styles.label}>₹ {tax}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Discount</Text>
          <Text style={[styles.label, { color: 'green' }]}>- ₹ {discount}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalLabel}>₹ {total}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.payButton} onPress={() => navigation.replace('OrderSuccess')}>
        <Text style={styles.payText}>Pay ₹ {total}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  billBox: {
    padding: 16,
    borderRadius: 10,
    borderColor: '#eee',
    borderWidth: 1,
    backgroundColor: '#FFEAC5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  itemText: {
    fontSize: 15,
    color: '#333',
  },
  label: {
    fontSize: 14,
    color: '#ffba00',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  payButton: {
    marginTop: 30,
    backgroundColor: '#ffba00',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  payText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
