import { createSelector, createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "pickup",
    initialState: {},
    reducers:{
        setPickUp: (pickup, action) => {
          pickup.address = action.payload.address
          pickup.streetNo = action.payload.streetNo
          pickup.street = action.payload.street
          pickup.district = action.payload.district
          pickup.postalCode = action.payload.postalCode
          pickup.city = action.payload.city
          pickup.region = action.payload.region
          pickup.country = action.payload.country
          pickup.lat = action.payload.latitude
          pickup.lng = action.payload.longitude
        },
        resetPickUp: () =>{
          return {}
        }
    }
})

export const { setPickUp, resetPickUp } = slice.actions;

export default slice.reducer;

export const getPickUpData = () =>
  createSelector(
    state => state.entities.pickup,
    pickup => pickup
  );
