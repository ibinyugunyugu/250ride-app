import { useEffect } from 'react';
import * as Location from 'expo-location';
import { useDispatch, useSelector } from 'react-redux';
import { getLocationData, setLocation } from "../store/location";
import userApi from "../api/users";
import useAuth from "../auth/useAuth";
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const useLocation = () => {
  const auth = useAuth();
  const { user } = auth;
  const dispatch = useDispatch();
  const location = useSelector(getLocationData());

  useEffect(() => {
    let subscriber;
    let isMounted = true;
    (async () => {
      // if (Platform.OS === 'android' && !Device.isDevice) {
      //   console.log(
      //     'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
      //   );
      //   return;
      // }
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let locationServiceEnabled = await Location.hasServicesEnabledAsync();
      if(!locationServiceEnabled){
        console.log('Location Service Disabled');
        return;
      }
      if (status !== 'granted') {
        console.log('Foreground Permission to access location was denied');
        return;
      }

        subscriber = await Location.watchPositionAsync(
          {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 5000,
          distanceInterval: 0
          },
          async (loc) => {
            if(!isMounted || loc.coords.accuracy > 500) return;
            let latitude = loc.coords.latitude;
            let longitude = loc.coords.longitude;
            if(user && user.phoneVerified){
              userApi.saveLocation({location:latitude+','+longitude});
            }
            if(location.latitude == latitude && location.longitude == longitude) return;
            dispatch(setLocation({latitude,longitude}));           
          }
        );
      // }
    } catch (error) {
      console.log(error)
    }
    })();
    if (subscriber) {
      subscriber.remove();
    }
    return () => { isMounted = false };
  }, [user]);

}

export default useLocation;