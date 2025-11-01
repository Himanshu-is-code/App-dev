// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth, // This is needed for compatibility
  browserLocalPersistence, // Use this for Expo
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXDrkX51Lp15280GPHniBIVRX_opU5C6k",
  authDomain: "my-authapp-454e6.firebaseapp.com",
  projectId: "my-authapp-454e6",
  storageBucket: "my-authapp-454e6.appspot.com",
  messagingSenderId: "26013620017",
  appId: "1:26013620017:web:a54fcedb3ed29aac018210"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
export const auth = getAuth(app);
// For Expo, you don't need to manually set persistence with AsyncStorage here.
// Firebase handles it correctly with the default (browserLocalPersistence).