import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log(error)
    return;
  }
  if (data) {
    const { locations } = data;
    // do something with the locations captured in the background
    console.log(locations)
  }
});const requestPermissions = async () => {
 const {status} = await Location.requestBackgroundPermissionsAsync();
  if (status === 'granted') {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
     accuracy:Location.Accuracy.High,
       timeInterval: 10000,
       distanceInterval: 80,
    });
  }
};

const PermissionsButton = () => (
  <TouchableOpacity onPress={requestPermissions}>
    <Text>Enable background location</Text>
  </TouchableOpacity>
);


export default PermissionsButton;