import { initializeApp } from "firebase/app";
import { getToken, MessagePayload, onMessage } from "firebase/messaging";
import { getMessaging } from "firebase/messaging/sw";
import { getDatabase } from "firebase/database";
import { firebaseConfig } from "./config/config";

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);
export const database = getDatabase(app, "https://eco-route-d0e49-default-rtdb.asia-southeast1.firebasedatabase.app");

export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const fcmToken = await getToken(messaging);
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

