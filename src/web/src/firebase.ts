import { initializeApp } from "firebase/app";
import { getToken, getMessaging } from "firebase/messaging";
import { getDatabase } from "firebase/database";
import { firebaseConfig } from "./config/config";

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);
export const database = getDatabase(app, import.meta.env.VITE_FIREBASE_DATABASE_URL);

export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const fcmToken = await getToken(messaging, {
        vapidKey: "BIN4iftJUbZPUSVg4H8TVaAY6EB2lM20zr6kKk_nzVWbyDXAZYmcxyb92yLjNhrq24VGPMMRcyOpO-ryOre9wDY"
      });
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
