import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseconfig";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please provide both email and password");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          Alert.alert("Error", "No user found with this email");
          break;
        case "auth/wrong-password":
          Alert.alert("Error", "Incorrect password");
          break;
        case "auth/invalid-email":
          Alert.alert("Error", "Invalid email format");
          break;
        default:
          Alert.alert("Error", error.message);
      }
    }
  };

  return (
    <View style={{flex:1, padding: 20, justifyContent: "center"}}>
      <Text style={{fontSize: 24, marginBottom: 20}}>Sign In</Text>
      <TextInput
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Email"
        style={{borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5}}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        secureTextEntry
        placeholder="Password"
        style={{borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5}}
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text style={{marginTop: 15}}>
        Don't have an account?{" "}
        <Text style={{color: "blue"}} onPress={() => navigation.navigate("SignUp")}>Sign Up</Text>
      </Text>
    </View>
  );
}
