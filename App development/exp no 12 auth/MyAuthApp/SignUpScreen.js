import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebaseconfig";

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!name || !email || password.length < 6) {
      Alert.alert("Error", "Please enter your name, valid email, and password (6+ chars)");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      // The onAuthStateChanged listener in App.js will handle navigation
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          Alert.alert("Error", "Email is already registered");
          break;
        case "auth/invalid-email":
          Alert.alert("Error", "Invalid email format");
          break;
        case "auth/weak-password":
          Alert.alert("Error", "Weak password (6+ chars)");
          break;
        default:
          Alert.alert("Error", error.message);
      }
    }
  };

  return (
    <View style={{flex:1, padding: 20, justifyContent: "center"}}>
      <Text style={{fontSize: 24, marginBottom: 20}}>Sign Up</Text>
      <TextInput
        placeholder="Name"
        style={{borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5}}
        value={name}
        onChangeText={setName}
      />
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
      <Button title="Sign Up" onPress={handleSignUp} />
      <Text style={{marginTop: 15}}>
        Already have an account?{" "}
        <Text style={{color: "blue"}} onPress={() => navigation.navigate("SignIn")}>Sign In</Text>
      </Text>
    </View>
  );
}
