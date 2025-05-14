import { initializeApp } from "firebase/app";
import { getToken, MessagePayload, onMessage } from "firebase/messaging";
import { getMessaging } from "firebase/messaging/sw";
import { getDatabase } from "firebase/database";
import { firebaseConfig } from "./config/config";

// const firebaseConfig = {
//   apiKey: "AIzaSyAJEn_1n-RJkkL8BKjc4U8pnn35IBGWavY",
//   authDomain: "eco-route-d0e49.firebaseapp.com",
//   databaseURL: "https://eco-route-d0e49-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "eco-route-d0e49",
//   storageBucket: "eco-route-d0e49.firebasestorage.app",
//   messagingSenderId: "1075840110609",
//   appId: "1:1075840110609:web:1a3b73eb310ddd30cde1b0",
//   measurementId: "G-TX8S3WC53B"
// };

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);
export const database = getDatabase(app);

export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const fcmToken = await getToken(messaging, { vapidKey: "BIN4iftJUbZPUSVg4H8TVaAY6EB2lM20zr6kKk_nzVWbyDXAZYmcxyb92yLjNhrq24VGPMMRcyOpO-ryOre9wDY" });
      if (fcmToken) {
        console.log("Fcm token:", fcmToken);
        return fcmToken;
      } else {
        console.log("No fcm token available");
      }
    } else {
      console.log("Notification permission not granted");
    }
  } catch (error) {
    console.log("An error occurred while retrieving fcm token: ", error);
  }
};

