import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define an interface for our text item structure
interface TextItem {
  id: string;
  text: string;
}

export default function Index() {
  // State for the text input and the list of saved texts with proper typing
  const [inputText, setInputText] = useState<string>('');
  const [savedTexts, setSavedTexts] = useState<TextItem[]>([]);

  // Load saved texts from AsyncStorage when the component mounts
  useEffect(() => {
    loadSavedTexts();
  }, []);

  // Function to load saved texts from AsyncStorage
  const loadSavedTexts = async () => {
    try {
      const storedTexts = await AsyncStorage.getItem('savedTexts');
      if (storedTexts !== null) {
        setSavedTexts(JSON.parse(storedTexts));
      }
    } catch (error) {
      console.error('Error loading saved texts:', error);
    }
  };

  // Function to save a new text
  const saveText = async () => {
    if (inputText.trim()) {
      // Create a new text object with an ID and the input text
      const newText: TextItem = {
        id: Date.now().toString(),
        text: inputText
      };
      
      // Update the state with the new text
      const updatedTexts = [...savedTexts, newText];
      setSavedTexts(updatedTexts);
      
      // Save to AsyncStorage
      try {
        await AsyncStorage.setItem('savedTexts', JSON.stringify(updatedTexts));
      } catch (error) {
        console.error('Error saving text:', error);
      }
      
      // Clear the input field
      setInputText('');
    }
  };

  // Function to render each item in the list with proper typing
  const renderItem = ({ item }: { item: TextItem }) => (
    <View style={styles.item}>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Escribe algo aquí..."
        />
        <Button title="Guardar" onPress={saveText} />
      </View>
      
      <Text style={styles.listHeader}>Textos guardados:</Text>
      <FlatList
        data={savedTexts}
        renderItem={renderItem}
        keyExtractor={(item: TextItem) => item.id}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});