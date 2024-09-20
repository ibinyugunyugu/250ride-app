import { createSelector, createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "location",
    initialState: {},
    reducers:{
        setLocation: (location, action) => {
          location.latitude = action.payload.latitude
          location.longitude = action.payload.longitude
        },
        resetLocation: () =>{}
    }
})

export const { setLocation , resetLocation } = slice.actions;

export default slice.reducer;

export const getLocationData = () =>
  createSelector(
    state => state.entities.location,
    location => location
  );
