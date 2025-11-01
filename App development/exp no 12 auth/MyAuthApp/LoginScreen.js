// screens/LoginScreen.js
import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseconfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          Alert.alert("Error", "No user found with this email!");
          break;
        case "auth/wrong-password":
          Alert.alert("Error", "Incorrect password!");
          break;
        case "auth/invalid-email":
          Alert.alert("Error", "Invalid email format!");
          break;
        default:
          Alert.alert("Error", error.message);
      }
    }
  };

  return (
    <View style={{ flex:1, justifyContent:"center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth:1, marginBottom:15, padding:10, borderRadius:5 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth:1, marginBottom:20, padding:10, borderRadius:5 }}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text style={{ marginTop: 15 }}>
        Don't have an account?{" "}
        <Text style={{ color: "blue" }} onPress={() => navigation.navigate("SignUp")}>
          Sign Up
        </Text>
      </Text>
    </View>
  );
}
