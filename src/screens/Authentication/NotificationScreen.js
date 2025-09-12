import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
// Comment out the import if you’re not testing notifications right now
// import * as Notifications from 'expo-notifications';

const NotificationScreen = ({ navigation }) => {
  const requestNotificationPermission = async () => {
    // Skip permission logic if in Expo Go (DEV mode)
    if (__DEV__) {
      navigation.replace('AppTabs');
      return;
    }

    // Uncomment when testing in dev build
    /*
    const { status } = await Notifications.requestPermissionsAsync();

    if (status === 'granted') {
      console.log('Notification permission granted');
      navigation.replace('AppTabs');
    } else {
      Alert.alert('Permission denied', 'You can enable notifications later from settings.');
      navigation.replace('AppTabs');
    }
    */
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/notification.jpg')}
        style={styles.image}
      />
      <Text style={styles.title}>Get updates on your order status</Text>
      <Text style={styles.subtitle}>
        Allow push notifications to get real-time updates on your order status.
      </Text>

      <TouchableOpacity style={styles.primaryButton} onPress={requestNotificationPermission}>
        <Text style={styles.primaryButtonText}>Turn on Notification</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('AppTabs')}>
        <Text style={styles.secondaryText}>Not Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 24 },
  image: { width: 200, height: 200, marginBottom: 20, resizeMode: 'contain' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#000', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30 },
  primaryButton: {
    backgroundColor: '#ffba00',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 12,
  },
  primaryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  secondaryText: { color: '#ffba00', fontWeight: 'bold' },
});

export default NotificationScreen;
