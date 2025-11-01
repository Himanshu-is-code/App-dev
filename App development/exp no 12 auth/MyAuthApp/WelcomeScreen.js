import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          width: "85%",
          borderRadius: 20,
          padding: 25,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            color: "#fff",
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Welcome !
        </Text>

        <Text
          style={{
            color: "#dcdcdc",
            fontSize: 16,
            textAlign: "center",
            marginBottom: 25,
          }}
        >
          Sign in to explore your profile or create a new account below.
        </Text>

        <View style={{ width: "100%", marginBottom: 10 }}>
          <Button title="Sign In" onPress={() => navigation.navigate("SignIn")} />
        </View>
        <View style={{ width: "100%" }}>
          <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333", // A dark background color
  },
});
