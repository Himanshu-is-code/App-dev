import React, { useState, useCallback } from 'react';
import {SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity, Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import { SQLiteDatabase } from 'expo-sqlite';
import {getDBConnection, getCompletedTodos, clearHistory, Todo} from '../database';

const HistoryScreen = () => {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

  const loadData = useCallback(async () => {
    try {
      const dbConnection = getDBConnection();
      setDb(dbConnection);
      const history = await getCompletedTodos(dbConnection);
      setCompletedTodos(history);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleClearHistory = () => {
    if (!db) return;
    Alert.alert('Confirm', 'Are you sure you want to clear all history?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Clear',
        onPress: async () => {
          await clearHistory(db);
          // Refresh the list
          setCompletedTodos([]);
        },
        style: 'destructive',
      },
    ]);
  };

  const renderHistoryItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <Text style={styles.completedText}>{item.task}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Task History</Text>
        <Text style={styles.subtitle}>{completedTodos.length} tasks completed</Text>
      </View>

      {completedTodos.length > 0 && (
         <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
            <Text style={styles.clearButtonText}>Clear History</Text>
         </TouchableOpacity>
      )}

      <FlatList
        data={completedTodos}
        renderItem={renderHistoryItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyListText}>No completed tasks yet.</Text>}
      />
    </SafeAreaView>
  );
};
// Add styles, many are reusable from the other screen
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#ddd', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 4 },
  listContainer: { paddingHorizontal: 20, paddingTop: 10 },
  todoItem: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  completedText: { fontSize: 18, color: '#aaa', textDecorationLine: 'line-through' },
  emptyListText: { textAlign: 'center', fontSize: 16, color: '#888', marginTop: 50 },
  clearButton: { backgroundColor: '#dc3545', padding: 15, borderRadius: 10, margin: 20, alignItems: 'center' },
  clearButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default HistoryScreen;