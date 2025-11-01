import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Pressable,
  StatusBar,
  Alert,
} from 'react-native';
// STEP 1: Import firestore. Remove useFocusEffect and expo-sqlite.
import firestore from '@react-native-firebase/firestore';

// STEP 2: Update the HistoryItem type for Firestore
type HistoryItem = {
  id: string; // Firestore document IDs are strings
  expression: string;
  result: string;
  createdAt: any; // This will be a Firestore Timestamp
};

// --- History Screen Component ---
export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  // STEP 3: Replace useFocusEffect with a real-time listener
  // This useEffect runs once and listens for any changes in the cloud.
  useEffect(() => {
    const historyCollection = firestore()
      .collection('history') // The same collection name you save to
      .orderBy('createdAt', 'desc'); // Order by newness

    // onSnapshot creates the real-time listener
    const unsubscribe = historyCollection.onSnapshot(
      (querySnapshot) => {
        const historyData: HistoryItem[] = [];
        querySnapshot.forEach((doc) => {
          // Get data and add the document ID
          historyData.push({
            id: doc.id,
            ...doc.data(),
          } as HistoryItem);
        });
        setHistory(historyData); // Update the state with new data
        if (loading) {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error fetching history: ", error);
        setLoading(false);
      }
    );

    // This cleanup function unsubscribes when the component is unmounted
    return () => unsubscribe();
  }, []); // The empty [] means this runs only once on mount.

  // STEP 4: Rewrite clearHistory for Firestore
  const clearHistory = async () => {
    // Add a confirmation dialog
    Alert.alert(
      "Clear History",
      "Are you sure you want to delete all history from Firestore?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Clear It",
          style: "destructive",
          onPress: async () => {
            console.log("Clearing Firestore history...");
            const snapshot = await firestore().collection('history').get();

            if (snapshot.empty) return;

            // Use a batch write to delete all documents efficiently
            const batch = firestore().batch();
            snapshot.docs.forEach((doc) => {
              batch.delete(doc.ref);
            });

            await batch.commit();
            console.log("Firestore history cleared.");
          },
        },
      ]
    );
  };

  // --- Render Method ---
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calculation History</Text>
      </View>

      {/* Show a loading indicator on first load */}
      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading History...</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id} // Use the string ID from Firestore
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.historyExpression} numberOfLines={1} ellipsizeMode="head">
                {item.expression}
              </Text>
              <Text style={styles.historyResult}>= {item.result}</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No History Found</Text>
              <Text style={styles.emptySubText}>
                {/* Updated text */}
                Calculations will appear here in real-time.
              </Text>
            </View>
          }
        />
      )}

      {/* Only show clear button if there is history and it's not loading */}
      {history.length > 0 && !loading && (
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

// --- Stylesheet (No changes needed) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
    color: '#aaa',
    fontSize: 18,
    textAlign: 'right',
    marginBottom: 4,
  },
  historyResult: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
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
    backgroundColor: '#555',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearButtonPressed: {
    backgroundColor: '#333',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});