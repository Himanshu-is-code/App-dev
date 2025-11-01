import React, {useState, useEffect, useCallback} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, Alert, Keyboard} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SQLiteDatabase } from 'expo-sqlite';
import {getDBConnection, createTable, getPendingTodos, addTodo, completeTodo, Todo} from '../database';

const TodoListScreen = () => {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [textInput, setTextInput] = useState('');

  const loadData = useCallback(async () => {
    try {
      const dbConnection = getDBConnection();
      await createTable(dbConnection);
      setDb(dbConnection);
      const pendingTodos = await getPendingTodos(dbConnection);
      setTodos(pendingTodos);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // useFocusEffect runs when the screen comes into focus
  // This ensures the list is fresh when you navigate back from the history tab
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleAddTodo = async () => {
    if (!db) return;
    if (textInput.trim().length === 0) {
      Alert.alert('Error', 'Please enter a task.');
      return;
    }
    await addTodo(db, textInput);
    setTextInput('');
    Keyboard.dismiss();
    const updatedTodos = await getPendingTodos(db);
    setTodos(updatedTodos);
  };

  const handleCompleteTodo = async (id: number) => {
    if (!db) return;
    await completeTodo(db, id);
    const updatedTodos = await getPendingTodos(db);
    setTodos(updatedTodos);
    Alert.alert('Success', 'Task moved to history!');
  };

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <Text style={styles.todoText}>{item.task}</Text>
      <TouchableOpacity
        style={styles.completeButton}
        onPress={() => handleCompleteTodo(item.id)}>
        <Text style={styles.completeButtonText}>✓</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My To-Do List</Text>
        <Text style={styles.subtitle}>You have {todos.length} pending tasks</Text>
      </View>
      <FlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyListText}>No pending tasks. Great job!</Text>}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          value={textInput}
          onChangeText={setTextInput}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
// Add the styles object here (copy from the App.tsx in previous response, with minor button changes)
const styles = StyleSheet.create({ /* ... styles from previous example ... */
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#ddd', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 4 },
  listContainer: { padding: 20 },
  todoItem: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 3 },
  todoText: { fontSize: 18, color: '#333', flex: 1 },
  completeButton: { marginLeft: 15, padding: 5, backgroundColor: '#28a745', borderRadius: 5 },
  completeButtonText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  inputContainer: { flexDirection: 'row', padding: 20, borderTopWidth: 1, borderTopColor: '#ddd', backgroundColor: '#fff' },
  input: { flex: 1, height: 50, backgroundColor: '#f0f0f0', borderRadius: 10, paddingHorizontal: 15, fontSize: 16, marginRight: 10 },
  addButton: { backgroundColor: '#007bff', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, height: 50, borderRadius: 10 },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emptyListText: { textAlign: 'center', fontSize: 16, color: '#888', marginTop: 50 },
});

export default TodoListScreen;