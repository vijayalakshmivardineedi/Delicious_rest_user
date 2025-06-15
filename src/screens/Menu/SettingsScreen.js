import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const SettingsScreen = () => {
  const handleSupport = () => {
    Alert.alert("Help Center", "Contact support at support@example.com");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.item} onPress={handleSupport}>
        <Text style={styles.SettingsText}>Contact Support</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Text style={styles.SettingsText}>FAQs</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Text style={styles.SettingsText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  item: {
    paddingVertical: 16,
    backgroundColor: "#6d9773",
    marginBottom: 20,
    borderRadius: 10,
  },
  SettingsText: {
    paddingLeft: 20,
    fontSize: 16,
    fontWeight: '500',
    color: "white"
  }
});

export default SettingsScreen;
