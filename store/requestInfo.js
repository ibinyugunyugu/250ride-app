import { createSelector, createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "requestInfo",
    initialState: {},
    reducers:{
        setRequestInfo: (requestInfo, action) => {
          requestInfo.id = action.payload.id
          requestInfo.pickupStreetNo = action.payload.pickupStreetNo
          requestInfo.pickupStreet = action.payload.pickupStreet
          requestInfo.pickupDistrict = action.payload.pickupDistrict
          requestInfo.pickupPostalCode = action.payload.pickupPostalCode
          requestInfo.pickupCity = action.payload.pickupCity
          requestInfo.pickupRegion = action.payload.pickupRegion
          requestInfo.pickupCountry = action.payload.pickupCountry
          requestInfo.pickupAddress = action.payload.pickupAddress
          requestInfo.pickupLat = action.payload.pickupLat
          requestInfo.pickupLng = action.payload.pickupLng
          requestInfo.destinationStreetNo = action.payload.destinationStreetNo
          requestInfo.destinationStreet = action.payload.destinationStreet
          requestInfo.destinationDistrict = action.payload.destinationDistrict
          requestInfo.destinationPostalCode = action.payload.destinationPostalCode
          requestInfo.destinationCity = action.payload.destinationCity
          requestInfo.destinationRegion = action.payload.destinationRegion
          requestInfo.destinationCountry = action.payload.destinationCountry
          requestInfo.destinationAddress = action.payload.destinationAddress
          requestInfo.destinationLat = action.payload.destinationLat
          requestInfo.destinationLng = action.payload.destinationLng
          requestInfo.date = action.payload.date
          requestInfo.seats = action.payload.seats
          requestInfo.ride_id = action.payload.ride_id
          requestInfo.ride = action.payload.ride

          requestInfo.bookStatus = action.payload.bookStatus
        },
        resetRequestInfo: () =>{
          return {}
        }
    }
})

export const { setRequestInfo , resetRequestInfo } = slice.actions;

export default slice.reducer;

export const getRequestInfo = () =>
  createSelector(
    state => state.entities.requestInfo,
    requestInfo => requestInfo
  );
