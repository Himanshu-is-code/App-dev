import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Pressable,
  StatusBar,
} from 'react-native';
// Import useFocusEffect to refresh data when the tab is viewed
import { useFocusEffect } from '@react-navigation/native';
import { openDatabaseSync } from 'expo-sqlite';

// --- Database Setup ---
// This opens or creates the database file named 'calculator-history.db'.
const db = openDatabaseSync('calculator-history.db');

// Define the TypeScript type for a single history item from the database.
type HistoryItem = {
  id: number;
  expression: string;
  result: string;
};

// --- History Screen Component ---
export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // This hook runs every time the screen comes into focus.
  // It's wrapped in useCallback to prevent re-creating the function on every render.
  useFocusEffect(
    useCallback(() => {
      async function setupAndFetch() {
        // Ensure the table exists. This is safe to run multiple times.
        await db.execAsync(
          'CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, expression TEXT, result TEXT);'
        );
        // Fetch the latest history from the database.
        fetchHistory();
      }

      setupAndFetch();

      // Return a cleanup function (optional, not needed here).
      return () => {};
    }, []) // The empty dependency array ensures the setup logic doesn't re-run unnecessarily.
  );

  // Function to get all records from the database and update the component's state.
  const fetchHistory = async () => {
    try {
      const allRows = await db.getAllAsync<HistoryItem>(
        'SELECT * FROM history ORDER BY id DESC;' // Get newest items first
      );
      setHistory(allRows);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  // Function to delete all records from the history table.
  const clearHistory = async () => {
    try {
      await db.runAsync('DELETE FROM history;');
      setHistory([]); // Immediately clear the list in the UI for a responsive feel.
      console.log('History cleared from the database.');
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  // --- Render Method ---
  return (
    <SafeAreaView style={styles.container}>
      {/* This makes the status bar text (time, battery) light-colored on a dark background. */}
      <StatusBar barStyle="light-content" />

      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calculation History</Text>
      </View>

      {/* List of History Items */}
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        // Renders each item in the list.
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.historyExpression} numberOfLines={1} ellipsizeMode="head">
              {item.expression}
            </Text>
            <Text style={styles.historyResult}>= {item.result}</Text>
          </View>
        )}
        // Component to show when the history list is empty.
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No History Found</Text>
            <Text style={styles.emptySubText}>
              Completed calculations from the calculator tab will appear here.
            </Text>
          </View>
        }
      />

      {/* Footer with "Clear History" button. It only appears if there is history. */}
      {history.length > 0 && (
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [styles.clearButton, pressed && styles.clearButtonPressed]}
            onPress={clearHistory}
          >
            <Text style={styles.clearButtonText}>Clear All History</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

// --- Stylesheet for the History Screen ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Dark background for the entire screen
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333', // Subtle separator line
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  historyItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  historyExpression: {
    color: '#aaa', // Gray color for the expression
    fontSize: 18,
    textAlign: 'right',
    marginBottom: 4,
  },
  historyResult: {
    color: '#fff', // White for the result
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100, // Push it down from the header
  },
  emptyText: {
    color: '#777',
    fontSize: 18,
  },
  emptySubText: {
    color: '#555',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    maxWidth: '80%',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  clearButton: {
    backgroundColor: '#555', // A darker, safer clear button color
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearButtonPressed: {
    backgroundColor: '#333', // Darken on press for feedback
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});