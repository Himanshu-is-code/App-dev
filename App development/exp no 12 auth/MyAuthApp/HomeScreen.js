import React from "react";
import { View, Text, Button } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseconfig";

export default function HomeScreen({ navigation, user }) {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={{flex:1, justifyContent: "center", alignItems:"center"}}>
      <Text style={{fontSize: 24, marginBottom: 20}}>Welcome, {user?.displayName || "User"}!</Text>
      <Text>Email: {user?.email}</Text>
      <Button title="Profile" onPress={() => navigation.navigate("Profile")} />
      <View style={{height: 10}} />
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}
