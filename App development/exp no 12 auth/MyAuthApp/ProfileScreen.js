import React from "react";
import { View, Text, Button } from "react-native";
import { auth } from "./firebaseconfig";

export default function ProfileScreen({ navigation, user }) {
  return (
    <View style={{flex:1, justifyContent:"center", padding:20}}>
      <Text style={{fontSize: 28, marginBottom: 20}}>Profile</Text>
      <Text style={{fontSize: 18}}>Name: {user?.displayName || "Not set"}</Text>
      <Text style={{fontSize: 18}}>Email: {user?.email}</Text>
      <View style={{height: 20}}/>
      <Button title="Back to Home" onPress={() => navigation.goBack()} />
    </View>
  );
}
