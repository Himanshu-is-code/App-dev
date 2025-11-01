// src/Dashboard.js
import React from "react";
import { auth } from "./firebaseconfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user.displayName || user.email || user.phoneNumber}</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
