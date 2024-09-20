import { useEffect, useRef } from "react";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import expoPushTokensApi from "../api/expoPushTokens";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const useNotifications = (notificationListener) => {
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync()

    if(notificationListener){
      responseListener.current = Notifications.addNotificationResponseReceivedListener(notificationListener);

      return () => {
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
  }, []);


  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      expoPushTokensApi.register(token)
    } else {
      console.log('Must use physical device for Push Notifications');
    }
    
    return token;
  }
}

export default useNotifications;