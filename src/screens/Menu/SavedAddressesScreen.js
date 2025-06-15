import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { baseURL } from '../../axios/healpers';

const BASE_URL = `${baseURL}/location`;

const SavedAddressScreen = () => {
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');

        if (!userId || !token) {
          Alert.alert('Session Expired', 'Please log in again.');
          navigation.replace('OtpScreen');
          return;
        }

        const response = await axios.get(`${BASE_URL}/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLocationData(response.data.location);
      } catch (error) {
        console.error('Fetch error:', error.message);
        Alert.alert('Error', 'Failed to fetch address');
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ffba00" />
      </View>
    );
  }

  if (!locationData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noData}>No address found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Saved Address</Text>
      <View style={styles.card}>
        <Text style={styles.label}>User ID:</Text>
        <Text style={styles.value}>{locationData.userId}</Text>

        <Text style={styles.label}>Address Line 1:</Text>
        <Text style={styles.value}>{locationData.address1}</Text>

        <Text style={styles.label}>Address Line 2:</Text>
        <Text style={styles.value}>{locationData.address2}</Text>

        <Text style={styles.label}>City:</Text>
        <Text style={styles.value}>{locationData.city}</Text>

        <Text style={styles.label}>Postal Code:</Text>
        <Text style={styles.value}>{locationData.postalCode}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff4db',
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#444',
    marginTop: 4,
  },
  noData: {
    fontSize: 18,
    color: '#999',
  },
});

export default SavedAddressScreen;
