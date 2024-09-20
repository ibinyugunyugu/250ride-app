import { createSelector, createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "carInfo",
    initialState: {},
    reducers:{
        setRideInfo: (rideInfo, action) => {
          rideInfo.id = action.payload.id
          rideInfo.pickupStreetNo = action.payload.pickupStreetNo
          rideInfo.pickupStreet = action.payload.pickupStreet
          rideInfo.pickupDistrict = action.payload.pickupDistrict
          rideInfo.pickupPostalCode = action.payload.pickupPostalCode
          rideInfo.pickupCity = action.payload.pickupCity
          rideInfo.pickupRegion = action.payload.pickupRegion
          rideInfo.pickupCountry = action.payload.pickupCountry
          rideInfo.pickupAddress = action.payload.pickupAddress
          rideInfo.pickupLat = action.payload.pickupLat
          rideInfo.pickupLng = action.payload.pickupLng
          rideInfo.destinationStreetNo = action.payload.destinationStreetNo
          rideInfo.destinationStreet = action.payload.destinationStreet
          rideInfo.destinationDistrict = action.payload.destinationDistrict
          rideInfo.destinationPostalCode = action.payload.destinationPostalCode
          rideInfo.destinationCity = action.payload.destinationCity
          rideInfo.destinationRegion = action.payload.destinationRegion
          rideInfo.destinationCountry = action.payload.destinationCountry
          rideInfo.destinationAddress = action.payload.destinationAddress
          rideInfo.destinationLat = action.payload.destinationLat
          rideInfo.destinationLng = action.payload.destinationLng
          rideInfo.datetime = action.payload.datetime
          rideInfo.endtime = action.payload.endtime
          rideInfo.distanceText = action.payload.distanceText
          rideInfo.durationText = action.payload.durationText
          rideInfo.seats = action.payload.seats
          rideInfo.remainingSeats = action.payload.remainingSeats
          rideInfo.price = action.payload.price
          rideInfo.car_id = action.payload.car_id
          rideInfo.driver_id = action.payload.driver_id
          rideInfo.car = action.payload.car
          rideInfo.ride_requests = action.payload.ride_requests
          rideInfo.driver = action.payload.driver
          rideInfo.status = action.payload.status
          rideInfo.views = action.payload.views
          rideInfo.bookStatus = action.payload.bookStatus
          rideInfo.bookedSeats = action.payload.bookedSeats
          rideInfo.ratings = action.payload.ratings
          rideInfo.reqId = action.payload.reqId         
        },
        resetRideInfo: () =>{
          return {}
        }
    }
})

export const { setRideInfo , resetRideInfo } = slice.actions;

export default slice.reducer;

export const getRideInfo = () =>
  createSelector(
    state => state.entities.rideInfo,
    rideInfo => rideInfo
  );
