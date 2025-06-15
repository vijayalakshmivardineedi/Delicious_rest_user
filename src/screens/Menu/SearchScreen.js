import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList } from 'react-native';

const results = [
  { id: '1', name: 'Dominos Pizza' },
  { id: '2', name: 'Subway Sandwiches' },
];

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search restaurants or dishes"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={results.filter((item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default SearchScreen;
