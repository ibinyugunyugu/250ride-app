import { createSelector, createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "destination",
    initialState: {},
    reducers:{
        setDestination: (destination, action) => {
          destination.address = action.payload.address
          destination.streetNo = action.payload.streetNo
          destination.street = action.payload.street
          destination.district = action.payload.district
          destination.postalCode = action.payload.postalCode
          destination.city = action.payload.city
          destination.region = action.payload.region
          destination.country = action.payload.country
          destination.lat = action.payload.latitude
          destination.lng = action.payload.longitude
        },
        resetDestination: () =>{
          return {}
        }
    }
})

export const { setDestination, resetDestination } = slice.actions;

export default slice.reducer;

export const getDestinationData = () =>
  createSelector(
    state => state.entities.destination,
    destination => destination
  );
