import { combineReducers } from "@reduxjs/toolkit";
import myRideReducer from './myRides';
import languageReducer from './language';
import homeReducer from './home';
import locationReducer from './location';
import pickupReducer from './pickup';
import destinationReducer from './destination';
import rideInfoReducer from './rideInfo';
import tempInfoReducer from './tempInfo';
import requestInfoReducer from './requestInfo';
import carInfoReducer from './carInfo';
import driverInfoReducer from './driverInfo';
import notificationsReducer from './notifications';


export default combineReducers({
    myRide: myRideReducer,
    languages: languageReducer,
    homeData: homeReducer,
    location: locationReducer,
    pickup: pickupReducer,
    destination: destinationReducer,
    rideInfo: rideInfoReducer,
    requestInfo: requestInfoReducer,
    carInfo: carInfoReducer,
    driverInfo: driverInfoReducer,
    notifications: notificationsReducer,
    tempInfo: tempInfoReducer
})