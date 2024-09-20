import { createSelector, createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "tempInfo",
    initialState: {},
    reducers:{
        setTempInfo: (tempInfo, action) => {
          tempInfo.id = action.payload.id
          tempInfo.ride = action.payload.ride
          tempInfo.rideRequest = action.payload.rideRequest
        },
        resetTempInfo: () =>{
          return {}
        }
    }
})

export const { setTempInfo , resetTempInfo } = slice.actions;

export default slice.reducer;

export const getTempInfo = () =>
  createSelector(
    state => state.entities.tempInfo,
    tempInfo => tempInfo
  );
