import { useAuthContext } from "@/hooks/useAuthContext";
import { Role } from "@/types/types";
import { Redirect, useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import messaging from '@react-native-firebase/messaging';
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Index() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { role, isAuthenticated, isLoading, setFcmToken } = useAuthContext();

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log("Authorization status: ", authStatus);
    }
    return enabled;
  };

  useEffect(() => {
    const checkPermissionAndGetToken = async () => {
      const permissionGranted = await requestUserPermission();
      if (permissionGranted) {
        const fcm = await messaging().getToken();
        setFcmToken(fcm);
        console.log("FCM token: ", fcm);
      } else {
        console.log("Permission not granted");
      }
    };

    checkPermissionAndGetToken();

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('App opened from a background notification', remoteMessage.notification);
      }
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background: ', remoteMessage.notification);
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background message handler', remoteMessage);
    });

    messaging().onMessage(async remoteMessage => {
      // showToast(remoteMessage.notification?.body as string, "success");
      queryClient.invalidateQueries(); // no args = invalidating all
      console.log('Notification received in foreground:', remoteMessage);
    });

  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href={role === Role.CUSTOMER ? "/(tabs-customer)/orders" : "/(tabs-driver)/vehicle"} />;
  }

  // return <Redirect href={`/login?fcmToken=${encodeURIComponent(fcmToken || "")}`} />
  return <Redirect href={"/login"} />

}
