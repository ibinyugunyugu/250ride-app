import { createSelector, createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "homeData",
    initialState: {},
    reducers:{
        setData: (homeData, action) => {
          homeData.pickupAddress = action.payload.pickupAddress
          homeData.destinationAddress = action.payload.destinationAddress
          homeData.selectedTabIndex = action.payload.selectedTabIndex
          homeData.selectedDateAndTime = action.payload.selectedDateAndTime
          homeData.selectedSeat = action.payload.selectedSeat
          homeData.selectedId = action.payload.selectedId
          homeData.selected = action.payload.selected
        },
        setSearched:(homeData, action) => {
          homeData.searched = true
        },
        resetSearched:(homeData, action) => {
          homeData.searched = false
        },
        setScheduled:(homeData) => {
          homeData.scheduled = true;
        },
        resetScheduled:(homeData) => {
          homeData.scheduled = false;
        },
        setOpenPop:(homeData) => {
          homeData.openPop = true;
        },
        resetOpenPop:(homeData) => {
          homeData.openPop = false;
        },
        setScreen:(homeData,action) => {
          homeData.screen = action.payload.screen;
        },
        resetScreen:(homeData) => {
          homeData.screen = null;
        },
        setRideId:(homeData,action) => {
          homeData.ride_id = action.payload.ride_id;
        },
        resetRideId:(homeData) => {
          homeData.ride_id = null;
        },
        setRequestId:(homeData,action) => {
          homeData.ride_request_id = action.payload.ride_request_id;
        },
        resetRequestId:(homeData) => {
          homeData.ride_request_id = null;
        },
        resetData: () =>{
          return {}
        }
    }
})

export const { 
  setData, 
  resetData, 
  setSearched, 
  resetSearched, 
  setScheduled, 
  resetScheduled, 
  setOpenPop, 
  resetOpenPop, 
  setScreen,
  resetScreen,
  setRideId,
  resetRideId,
  setRequestId,
  resetRequestId
} = slice.actions;

export default slice.reducer;

export const getUserData = () =>
  createSelector(
    state => state.entities.homeData,
    homeData => homeData
  );

export const getIsSearched = () =>
  createSelector(
    state => state.entities.homeData,
    homeData => homeData.searched
  );

export const getPopUp = () =>
createSelector(
  state => state.entities.homeData,
  homeData => homeData.openPop
);

export const getRideId = () =>
createSelector(
  state => state.entities.homeData,
  homeData => homeData.ride_id
);

export const getRequestId = () =>
createSelector(
  state => state.entities.homeData,
  homeData => homeData.ride_request_id
);

export const getScreen = () =>
createSelector(
  state => state.entities.homeData,
  homeData => homeData.screen
);